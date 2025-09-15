import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import { DataViewModule } from 'primeng/dataview';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { PaginatorModule } from 'primeng/paginator';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { TableModule } from 'primeng/table';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { InputIconModule } from 'primeng/inputicon';
import { IconFieldModule } from 'primeng/iconfield';
import { InputTextModule } from 'primeng/inputtext';
import { Tag } from 'primeng/tag';
import { SelectModule } from 'primeng/select';
import { ToastModule } from 'primeng/toast';
import { ButtonGroupModule } from 'primeng/buttongroup';
import { finalize } from 'rxjs';

import { showLoading, formatBRLMoney } from '../utils';
import { AccessoryService } from '../../services/accessories.service';
import { UserService } from '../../services/user.service';
import { AccStatus } from '../../../pages/products/accessories/accessories';


interface Column {
    field: string;
    header: string;
    customExportHeader?: string;
}

interface ExportColumn {
    title: string;
    dataKey: string;
}

@Component({
    selector: 'list-accessories',
    imports: [DialogModule, ButtonGroupModule, ConfirmDialogModule, TableModule, SelectModule, ToastModule, InputIconModule, InputTextModule, IconFieldModule, DataViewModule, RippleModule, ButtonModule, CommonModule, Tag, FormsModule, ReactiveFormsModule, PaginatorModule],
    providers: [ConfirmationService, MessageService],
    styleUrls: [],
    standalone: true,

    template: `
    <p-toast></p-toast>
    <p-table [value]="accessories()"  [columns]="cols" csvSeparator=";" [exportHeader]="'customExportHeader'" stripedRows selectionMode="multiple" [(selection)]="selectedUsers" dataKey="id" [tableStyle]="{ 'min-width': '50rem', 'margin-top':'10px' }"
        #dt
        [rows]="10"
        [globalFilterFields]="['title']"
        [rowHover]="true"
        dataKey="id"
    >
    <ng-template #caption>
        <div class="flex items-center justify-between mb-4">
            <span class="text-xl font-bold">Acessórios</span>
        </div>

        <div class="flex flex-wrap items-center justify-end gap-2">

            <p-iconfield>
                <p-inputicon styleClass="pi pi-search" />
                <input [(ngModel)]="modelSearch" pInputText type="text" (input)="onGlobalFilter($event)" placeholder="Modelo..." />
            </p-iconfield>

            <p-iconfield>
                <p-select [options]="accStates" [(ngModel)]="selectedAccState" optionLabel="name" (onChange)="onGlobalFilter($event)" class="w-full md:w-56" />
            </p-iconfield>
        </div>
        
        <div class="text-end pb-4 mt-2">
            <p-button icon="pi pi-external-link" label="Exportar CSV" (click)="dt.exportCSV()" />
        </div>

    </ng-template>

    <ng-template #header>
        <tr>
            <th pSortableColumn="Model">
                Modelo
                <p-sortIcon field="Model" />
            </th>
            <th>Preço Compra</th>
            <th>Preço Venda</th>

            <th>Tipo</th>

            <th>Detalhes</th>

            <th pSortableColumn="active">
                Ativo
                <p-sortIcon field="active" />
            </th>

            <th></th>
        </tr>
    </ng-template>
    <ng-template #body let-acc>
        <tr [pSelectableRow]="acc">
            <td>
                {{ acc.model }}
            </td>

            <td>
                {{ this._formatBRLMoney(acc.price_buy)  }}
            </td>

            <td>
                {{ this._formatBRLMoney(acc.price_sell) }}
            </td>

            <td>
                {{ acc.AccessoryType }}
            </td>

            <td>
                {{ acc.details }}
            </td>

            <td>
                <p-tag
                    [value]="getActiveState(acc)"
                    [severity]="getSeverity(acc)"
                    styleClass="dark:!bg-surface-900"
                />
            </td>

            <td>
                <p-buttongroup>
                    <p-button icon="pi pi-pencil" severity="contrast" rounded/>
                    <p-button (click)="deactivate(acc.id, acc.model)" icon="pi pi-trash" severity="contrast" rounded/>
                </p-buttongroup>
            </td>
        </tr>
    </ng-template>
    </p-table>

    <p-paginator (onPageChange)="onPageChange($event)"
        [first]="first"
        [showCurrentPageReport]="true"
        currentPageReportTemplate="Total: {totalRecords} | Mostrando {first} de {last}"
        [rows]="limitPerPage"
        [totalRecords]="totalRecords"
    />

    <p-confirmdialog
        [rejectLabel]="rejectLabel"
        [acceptLabel]="confirmLabel"
        [acceptAriaLabel]="confirmLabel"
        [rejectAriaLabel]="rejectLabel"
        [style]="{ width: '550px' }"
    />
    `,
})
export class ListAccessoriesComponent {
    constructor(
        private router: Router,
        private messageService: MessageService,
        private userService: UserService,
        private accessoryService: AccessoryService,
        private confirmationService: ConfirmationService
    ) { }

    @Input() accessories: any
    @Input() totalRecords: any
    @Input() limitPerPage: any

    isLoading: boolean = false
    typingTimeout: any
    curPage = 1
    first = 1

    selectedUsers!: any[] // does nothing for now

    selectedAccState: AccStatus | undefined = { name: "Indiferente", code: "" }
    accStates: AccStatus[] | undefined
    autoFilteredValue: any[] = []

    modelSearch: string = ""

    cols!: Column[];
    exportColumns!: ExportColumn[];

    confirmLabel = "Confirmar"
    rejectLabel = "Cancelar"

    onPageChange(e: any) {
        this.loadAccessories(e.page)
        this.curPage = e.page
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }


    _formatBRLMoney(amount: string) { // alias
        return formatBRLMoney(amount)
    }

    ngOnInit() {
        this.accStates = [
            { name: "Indiferente", code: "" },
            { name: "Ativo", code: "Y" },
            { name: "Não ativo", code: "N" },
        ]

        this.cols = [
            { field: 'model', header: 'Modelo' },
            { field: 'Preço de compra', header: 'price_buy' },
            { field: 'Preço de venda', header: 'price_sell' },
            { field: 'Detalhes', header: 'details' },
            { field: 'active', header: 'Ativo' }
        ];

        this.exportColumns = this.cols.map((col) => ({ title: col.header, dataKey: col.field }));
    }

    loadAccessories(page: number, isDelete = false) {
        if (!isDelete) page++
        const rmLoading = showLoading()

        this.accessoryService.getAccessories(page, this.limitPerPage, this.modelSearch, this.selectedAccState?.code as string).pipe(finalize(() => { rmLoading() })).subscribe({
            next: (res: any) => {
                this.accessories.set(res.data ?? [])
                this.totalRecords = res.totalRecords
                this.first = 1

            },
            error: (err) => {
                if (err.status) {
                    this.messageService.add({ severity: 'error', summary: "Erro", detail: 'Ocorreu um erro ao tentar buscar acessórios' });
                }
                this.isLoading = false
            },
        })
    }

    deactivate(id: string, model: string) {
        this.confirmationService.confirm({
            message: 'Confirma desativar o acessório ' + `<mark>${model}</mark>` + ' ?',
            header: 'Confirmação',
            icon: 'pi pi-exclamation-triangle',
            closeOnEscape: true,
            rejectButtonProps: {
                label: 'Cancelar',
                severity: 'secondary',
                outlined: true,
            },
            acceptButtonProps: {
                label: 'Confirmar',
                severity: 'danger',
                outlined: true,
            },
            accept: () => {
                const rmLoading = showLoading()

                this.accessoryService.deactivateAccessory(id).pipe(finalize(() => { rmLoading() })).subscribe({
                    next: (res: any) => {
                        this.loadAccessories(this.curPage, true)
                        this.messageService.add({ severity: 'success', summary: "Sucesso", detail: 'Acessório desativado com sucesso' });
                    },
                    error: (err) => {
                        this.messageService.add({ severity: 'error', summary: "Erro", detail: "Ocorreu um erro ao tentar desativar o acessório." });
                    },
                })
            }
        });
    }

    onGlobalFilter(event: any) {
        if (this.typingTimeout) {
            clearTimeout(this.typingTimeout)
        }

        this.typingTimeout = setTimeout(() => {
            this.first = 0;
            this.curPage = 1;
            this.loadAccessories(0)
        }, 500)
    }

    getSeverity(_user: any) {
        if (_user.active == `Y`) {
            return "success"
        } else {
            return "danger"
        }
    }

    getActiveState(_user: any) {
        if (_user.active == `Y`) {
            return "Ativo"
        } else {
            return "Inativo"
        }
    }

}

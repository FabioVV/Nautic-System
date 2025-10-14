import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
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
import { AutoCompleteModule } from 'primeng/autocomplete';
import { ToastModule } from 'primeng/toast';
import { ButtonGroupModule } from 'primeng/buttongroup';
import { finalize } from 'rxjs';

import { BoatModal } from './frame.boat';
import { formatBRLMoney, SelectItem, showLoading } from '../utils';
import { UserService } from '../../services/user.service';
import { BoatService } from '../../services/boats.service';


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
    selector: 'list-boats',
    imports: [DialogModule, BoatModal, ButtonGroupModule, ConfirmDialogModule, TableModule, SelectModule, ToastModule, InputIconModule, InputTextModule, IconFieldModule, DataViewModule, RippleModule, ButtonModule, CommonModule, Tag, FormsModule, ReactiveFormsModule, PaginatorModule],
    providers: [ConfirmationService, MessageService],
    styleUrls: [],
    standalone: true,

    template: `
    <p-toast></p-toast>
    <p-table [value]="boats()"  [columns]="cols" csvSeparator=";" [exportHeader]="'customExportHeader'" stripedRows selectionMode="multiple" [(selection)]="selectedUsers" dataKey="id" [tableStyle]="{ 'min-width': '50rem', 'margin-top':'10px' }"
        #dt
        [rows]="10"
        [globalFilterFields]="['model']"
        [rowHover]="true"
        dataKey="id"
    >
    <ng-template #caption>
        <div class="flex items-center justify-between mb-4">
            <span class="text-xl font-bold">Cascos</span>
        </div>

        <div class="flex flex-wrap items-center justify-end gap-2">
        
            <p-iconfield>
                <p-inputicon styleClass="pi pi-search" />
                <input [(ngModel)]="idSearch" pInputText type="text" (input)="onGlobalFilter($event)" placeholder="Código..." />
            </p-iconfield>


            <p-iconfield>
                <p-inputicon styleClass="pi pi-search" />
                <input [(ngModel)]="modelSearch" pInputText type="text" (input)="onGlobalFilter($event)" placeholder="Modelo..." />
            </p-iconfield>

            <p-iconfield>
                <p-inputicon styleClass="pi pi-search" />
                <input [(ngModel)]="priceSearch" pInputText type="text" (input)="onGlobalFilter($event)" placeholder="Preço aproximado..." />
            </p-iconfield>

            <p-iconfield>
                <p-select [options]="boatStates" [(ngModel)]="selectedBoatState" optionLabel="name" (onChange)="onGlobalFilter($event)" class="w-full md:w-56" />
            </p-iconfield>
        </div>
        <div class="text-end pb-4 mt-2">
        <p-button icon="pi pi-external-link" label="Exportar CSV" (click)="dt.exportCSV()" />
        </div>

    </ng-template>

    <ng-template #header>
        <tr>
            <th>Cód. casco</th>

            <th pSortableColumn="model">
                Modelo
                <p-sortIcon field="model" />
            </th>

            <th pSortableColumn="new_used">
                Novo/Usado
                <p-sortIcon field="new_used" />
            </th>
            <th pSortableColumn="year">
                Ano
                <p-sortIcon field="year" />
            </th>
            <th pSortableColumn="hours">
                Horas
                <p-sortIcon field="hours" />

            </th>
            <th pSortableColumn="selling_price">
                Valor
                <p-sortIcon field="selling_price" />
            </th>

            <th pSortableColumn="active">
                Ativo
                <p-sortIcon field="active" />
            </th>

            <th></th>
        </tr>
    </ng-template>
    <ng-template #body let-boat>
        <tr [pSelectableRow]="boat">
            <td>
                {{ boat.id }}
            </td>

            <td>
                {{ boat.model }}
            </td>

            <td>
                {{ boat.new_used == 'N' ? "Novo" : "Usado" }}
            </td>

            <td>
                {{ boat.year }}
            </td>

            <td>
                {{ boat.hours }}
            </td>

            <td>
                {{ this._formatBRLMoney(boat.selling_price) }}
            </td>


            <td>
                <p-tag
                [value]="getActiveState(boat)"
                [severity]="getSeverity(boat)"
                styleClass="dark:!bg-surface-900"
                />
            </td>

            <td>
                <p-buttongroup>
                    <p-button (click)="openBoatModal(boat.id)" icon="pi pi-pencil" severity="contrast" rounded/>
                    <p-button (click)="deactivateBoat(boat.id, boat.model)" icon="pi pi-trash" severity="contrast" rounded/>
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
    [style]="{ width: '450px' }"
    />

    <open-boat #boatModal />
    `,
})
export class ListBoatsComponent {
    constructor(
        private router: Router,
        private messageService: MessageService,
        private userService: UserService,
        private confirmationService: ConfirmationService,
        private boatsService: BoatService,
    ) { }

    @Input() boats: any
    @Input() totalRecords: any
    @Input() limitPerPage: any
    @ViewChild('boatModal') boatModal!: BoatModal

    isLoading: boolean = false
    typingTimeout: any
    curPage = 1
    first = 1

    selectedUsers!: any[] // does nothing for now

    selectedBoatState: SelectItem | undefined = { name: "Indiferente", code: "" }
    boatStates: SelectItem[] | undefined
    autoFilteredValue: any[] = []

    modelSearch: string = ""
    priceSearch: string = ""
    statusSearch: string = ""
    idSearch: string= ""

    cols!: Column[]
    exportColumns!: ExportColumn[]

    confirmLabel = "Confirmar"
    rejectLabel = "Cancelar"

    onPageChange(e: any) {
        this.loadBoats(e.page)
        this.curPage = e.page
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    ngOnInit() {
        this.boatStates = [
            { name: "Indiferente", code: "" },
            { name: "Ativo", code: "Y" },
            { name: "Não ativo", code: "N" },
        ]

        this.cols = [
            { field: 'id', header: 'Cód. Casco' },
            { field: 'model', header: 'E-mail' },
            { field: 'new_used', header: 'Novo/Usado' },
            { field: 'year', header: 'Ano' },
            { field: 'hours', header: 'Horas usado' },
            { field: 'selling_price', header: 'Preço' },
            { field: 'active', header: 'Ativo' },
        ]

        this.exportColumns = this.cols.map((col) => ({ title: col.header, dataKey: col.field }))
    }

    loadBoats(page: number, isDelete = false) {
        if (!isDelete) page++
        //const rmLoading = showLoading()

        this.boatsService.getBoats(page, this.limitPerPage, this.modelSearch, this.priceSearch, this.idSearch, this.selectedBoatState?.code as string).pipe(finalize(() => { })).subscribe({
            next: (res: any) => {
                this.boats.set(res.data ?? [])
                this.totalRecords = res.totalRecords
                this.first = 1

            },
            error: (err) => {
                if (err.status) {
                    this.messageService.add({ severity: 'error', summary: "Erro", detail: 'Ocorreu um erro ao buscar cascos.' });
                }
                this.isLoading = false
            },
        })
    }

    deactivateBoat(id: string, model: string) {
        this.confirmationService.confirm({
            message: 'Confirma desativar o casco ' + `<mark>${model}</mark>` + ' ?',
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

                this.userService.deactivateUser(id).pipe(finalize(() => { rmLoading() })).subscribe({
                    next: (res: any) => {
                        this.loadBoats(this.curPage, true)
                        this.messageService.add({ severity: 'success', summary: "Sucesso", detail: 'Usuário desativado com sucesso' });
                    },
                    error: (err) => {
                        this.messageService.add({ severity: 'error', summary: "Erro", detail: "Ocorreu um erro ao tentar desativar o usuário." });
                    },
                })
            }
        });
    }

    openBoatModal(id: number){
        this.boatModal.showBoat(id.toString())
    } 

    _formatBRLMoney(amount: string) { // alias
        return formatBRLMoney(amount)
    }

    onGlobalFilter(event: any) {
        if (this.typingTimeout) {
            clearTimeout(this.typingTimeout)
        }

        this.typingTimeout = setTimeout(() => {
            this.first = 0;
            this.curPage = 1;
            this.loadBoats(0)
        }, 500)
    }

    getSeverity(_boat: any) {
        if (_boat.active == `Y`) {
            return "success"
        } else {
            return "danger"
        }
    }

    getActiveState(_boat: any) {
        if (_boat.active == `Y`) {
            return "Ativo"
        } else {
            return "Inativo"
        }
    }

}

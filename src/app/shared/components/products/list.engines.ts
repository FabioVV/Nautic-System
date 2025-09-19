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

import { showLoading } from '../utils';
import { UserStatus } from '../../../pages/users/users';
import { UserService } from '../../services/user.service';
import { EngineService } from '../../services/engine.service';


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
    selector: 'list-engines',
    imports: [DialogModule, ButtonGroupModule, ConfirmDialogModule, TableModule, SelectModule, ToastModule, InputIconModule, InputTextModule, IconFieldModule, DataViewModule, RippleModule, ButtonModule, CommonModule, Tag, FormsModule, ReactiveFormsModule, PaginatorModule],
    providers: [ConfirmationService, MessageService],
    styleUrls: [],
    standalone: true,

    template: `
    <p-toast></p-toast>
    <p-table [value]="engines()"  [columns]="cols" csvSeparator=";" [exportHeader]="'customExportHeader'" stripedRows selectionMode="multiple" [(selection)]="selectedUsers" dataKey="id" [tableStyle]="{ 'min-width': '50rem', 'margin-top':'10px' }"
        #dt
        [rows]="10"
        [globalFilterFields]="['model']"
        [rowHover]="true"
        dataKey="id"
    >
    <ng-template #caption>
    <div class="flex items-center justify-between mb-4">
        <span class="text-xl font-bold">Motores</span>
    </div>

    <div class="flex flex-wrap items-center justify-end gap-2">

    <p-iconfield>
        <p-inputicon styleClass="pi pi-search" />
        <input [(ngModel)]="nameSearch" pInputText type="text" (input)="onGlobalFilter($event)" placeholder="Modelo..." />
    </p-iconfield>


    <p-iconfield>
    <p-select [options]="userStates" [(ngModel)]="selectedUserState" optionLabel="name" (onChange)="onGlobalFilter($event)" class="w-full md:w-56" />
    </p-iconfield>
    </div>
    <div class="text-end pb-4 mt-2">
    <p-button icon="pi pi-external-link" label="Exportar CSV" (click)="dt.exportCSV()" />
    </div>

    </ng-template>

    <ng-template #header>
        <tr>
            <th pSortableColumn="model">
                Modelo
                <p-sortIcon field="model" />
            </th>
            <th>Tipo</th>
            <th>Potência</th>
            <th pSortableColumn="active">
                Ativo
                <p-sortIcon field="active" />
            </th>
            <th></th>
        </tr>
    </ng-template>
    <ng-template #body let-eng>
    <tr [pSelectableRow]="eng">
        <td>
            {{ eng.model }}
        </td>

        <td>
            {{ eng.type == 'P' ? 'Popa' : 'Centro' }}
        </td>

        <td>
            {{ eng.power }}
        </td>

        <td>
            <p-tag
            [value]="getActiveState(eng)"
            [severity]="getSeverity(eng)"
            styleClass="dark:!bg-surface-900"
            />
        </td>

        <td>
            <p-buttongroup>
                <p-button icon="pi pi-pencil" severity="contrast" rounded/>
                <p-button (click)="deactivateUser(eng.id, eng.model)" icon="pi pi-trash" severity="contrast" rounded/>
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
    `,
})
export class ListEnginesComponent {
    constructor(
        private router: Router,
        private messageService: MessageService,
        private userService: UserService,
        private engineService: EngineService,
        private confirmationService: ConfirmationService
    ) { }

    @Input() engines: any
    @Input() totalRecords: any
    @Input() limitPerPage: any

    isLoading: boolean = false
    typingTimeout: any
    curPage = 1
    first = 1

    selectedUsers!: any[] // does nothing for now

    selectedUserState: UserStatus | undefined = { name: "Indiferente", code: "" }
    userStates: UserStatus[] | undefined
    autoFilteredValue: any[] = []

    nameSearch: string = ""
    statusSearch: string = ""

    cols!: Column[];
    exportColumns!: ExportColumn[];

    confirmLabel = "Confirmar"
    rejectLabel = "Cancelar"

    onPageChange(e: any) {
        this.loadEngines(e.page)
        this.curPage = e.page
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    ngOnInit() {
        this.userStates = [
            { name: "Indiferente", code: "" },
            { name: "Ativo", code: "Y" },
            { name: "Não ativo", code: "N" },
        ]

        this.cols = [
            { field: 'name', header: 'Nome' },
            { field: 'email', header: 'E-mail' },
            { field: 'phone', header: 'Telefone' },
            { field: 'active', header: 'Ativo' }
        ];

        this.exportColumns = this.cols.map((col) => ({ title: col.header, dataKey: col.field }));
    }

    loadEngines(page: number, isDelete = false) {
        if (!isDelete) page++

        this.engineService.getEngines(page, this.limitPerPage, this.nameSearch, this.selectedUserState?.code as string).pipe(finalize(() => { })).subscribe({
            next: (res: any) => {
                this.engines.set(res.data ?? [])
                this.totalRecords = res.totalRecords
                this.first = 1

            },
            error: (err) => {
                if (err.status) {
                    this.messageService.add({ severity: 'error', summary: "Erro", detail: 'Ocorreu um erro ao buscar motores.' });
                }
                this.isLoading = false
            },
        })
    }

    deactivateUser(id: string, model: string) {
        this.confirmationService.confirm({
            message: 'Confirma desativar o motor ' + `<mark>${model}</mark>` + ' ?',
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

                this.engineService.deactivateEngine(id).pipe(finalize(() => { rmLoading() })).subscribe({
                    next: (res: any) => {
                        this.loadEngines(this.curPage, true)
                        this.messageService.add({ severity: 'success', summary: "Sucesso", detail: 'Motor desativado com sucesso' });
                    },
                    error: (err) => {
                        this.messageService.add({ severity: 'error', summary: "Erro", detail: "Ocorreu um erro ao tentar desativar o motor." });
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
            this.first = 
            this.curPage = 1
            this.loadEngines(0)
        }, 500)
    }

    getSeverity(_engine: any) {
        if (_engine.active == `Y`) {
            return "success"
        } else {
            return "danger"
        }
    }

    getActiveState(_engine: any) {
        if (_engine.active == `Y`) {
            return "Ativo"
        } else {
            return "Inativo"
        }
    }

}

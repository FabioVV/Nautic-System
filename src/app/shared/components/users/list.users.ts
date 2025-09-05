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
import { AutoCompleteModule } from 'primeng/autocomplete';
import { ToastModule } from 'primeng/toast';
import { finalize } from 'rxjs';

import { showLoading } from '../utils';
import { UserStatus } from '../../../pages/users/users';
import { UserService } from '../../services/user.service';


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
    selector: 'list-users',
    imports: [DialogModule, ConfirmDialogModule, TableModule, SelectModule, ToastModule, InputIconModule, InputTextModule, IconFieldModule, DataViewModule, RippleModule, ButtonModule, CommonModule, Tag, FormsModule, ReactiveFormsModule, PaginatorModule],
    providers: [ConfirmationService, MessageService],
    styleUrls: [],
    standalone: true,

    template: `
    <p-toast></p-toast>
    <p-table [value]="users()"  [columns]="cols" csvSeparator=";" [exportHeader]="'customExportHeader'" stripedRows selectionMode="multiple" [(selection)]="selectedUsers" dataKey="id" [tableStyle]="{ 'min-width': '50rem', 'margin-top':'10px' }"
        #dt
        [rows]="10"
        [globalFilterFields]="['title']"
        [rowHover]="true"
        dataKey="id"
    >
        <ng-template #caption>
            <div class="flex items-center justify-between mb-4">
                <span class="text-xl font-bold">Usuários</span>
            </div>

            <div class="flex flex-wrap items-center justify-end gap-2">

                <p-iconfield>
                    <p-inputicon styleClass="pi pi-search" />
                    <input [(ngModel)]="nameSearch" pInputText type="text" (input)="onGlobalFilter($event)" placeholder="Nome do usuário..." />
                </p-iconfield>

                <p-iconfield>
                    <p-inputicon styleClass="pi pi-search" />
                    <input [(ngModel)]="emailSearch" pInputText type="text" (input)="onGlobalFilter($event)" placeholder="Email do usuário..." />
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
                <th pSortableColumn="name">
                    Nome
                    <p-sortIcon field="name" />
                </th>
                <th>Email</th>
                <th>Telefone</th>
                <th pSortableColumn="active">
                    Ativo
                    <p-sortIcon field="active" />
                </th>
            </tr>
        </ng-template>
        <ng-template #body let-user>
            <tr [pSelectableRow]="user">
                <td>
                    {{ user.name }}
                </td>

                <td>
                    {{ user.email }}
                </td>

                <td>
                    {{ user.phone != "" ? user.phone : "-" }}
                </td>

                <td>
                    <p-tag
                        [value]="getUserActiveState(user)"
                        [severity]="getSeverity(user)"
                        styleClass="dark:!bg-surface-900"
                    />
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
export class ListUsersComponent {

    constructor(
        private router: Router,
        private messageService: MessageService,
        private userService: UserService,
        private confirmationService: ConfirmationService
    ) { }

    @Input() users: any
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

    emailSearch: string = ""
    nameSearch: string = ""
    statusSearch: string = ""

    cols!: Column[];
    exportColumns!: ExportColumn[];

    confirmLabel = "Confirmar"
    rejectLabel = "Cancelar"

    onPageChange(e: any) {
        this.loadUsers(e.page)
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

    loadUsers(page: number) {

        page++
        const rmLoading = showLoading()
        this.userService.getUsers(page, this.limitPerPage, this.nameSearch, this.emailSearch, this.selectedUserState?.code as string).pipe(finalize(() => { rmLoading() })).subscribe({
            next: (res: any) => {
                this.users.set(res.data ?? [])
                this.totalRecords = res.totalRecords
                this.first = 1

            },
            error: (err) => {
                if (err.status) {
                    this.messageService.add({ severity: 'error', summary: "Erro", detail: 'Ocorreu um erro ao buscar usuários.' });
                }
                this.isLoading = false
            },
        })
    }

    onGlobalFilter(event: any) {
        if (this.typingTimeout) {
            clearTimeout(this.typingTimeout)
        }

        this.typingTimeout = setTimeout(() => {
            this.first = 0;
            this.curPage = 1;
            this.loadUsers(0)
        }, 500)
    }

    getSeverity(_user: any) {
        if (_user.active == `Y`) {
            return "success"
        } else {
            return "danger"
        }
    }

    getUserActiveState(_user: any) {
        if (_user.active == `Y`) {
            return "Ativo"
        } else {
            return "Inativo"
        }
    }

    goToClass(classId: string) {
        this.router.navigate([`/classes`, classId])
    }
}

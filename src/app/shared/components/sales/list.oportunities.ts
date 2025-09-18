import { CommonModule } from '@angular/common';
import { Component, Input, signal } from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import { DataViewModule } from 'primeng/dataview';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { PaginatorModule } from 'primeng/paginator';
import { FormsModule, ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { TableModule } from 'primeng/table';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { InputIconModule } from 'primeng/inputicon';
import { IconFieldModule } from 'primeng/iconfield';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { ToastModule } from 'primeng/toast';
import { ButtonGroupModule } from 'primeng/buttongroup';
import { MessageModule } from 'primeng/message';
import { finalize } from 'rxjs';
import { ConfirmationService } from 'primeng/api';
import { showLoading } from '../utils';
import { UserService } from '../../services/user.service';
import { SalesCustomer, SalesService } from '../../services/sales.service';
import { Boat, BoatService } from '../../services/boats.service';

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
    selector: 'list-oportunities',
    imports: [DialogModule, MessageModule, ButtonGroupModule, ConfirmDialogModule, TableModule, SelectModule, ToastModule, InputIconModule, InputTextModule, IconFieldModule, DataViewModule, RippleModule, ButtonModule, CommonModule, FormsModule, ReactiveFormsModule, PaginatorModule],
    providers: [MessageService, ConfirmationService],
    styleUrls: [],
    standalone: true,

    template: `
    <p-toast></p-toast>
    <p-table [value]="customers()"  [columns]="cols" csvSeparator=";" [exportHeader]="'customExportHeader'" stripedRows selectionMode="multiple" [(selection)]="selectedUsers" dataKey="id" [tableStyle]="{ 'min-width': '50rem', 'margin-top':'10px' }"
        #dt
        [rows]="10"
        [globalFilterFields]="['name']"
        [rowHover]="true"
        dataKey="id"
    >
        <ng-template #caption>
            <div class="flex items-center justify-between mb-4">
                <span class="text-xl font-bold">Oportunidades por embarcação</span>
            </div>

            <div class="flex flex-wrap items-center justify-center gap-2">

                <p-iconfield>
                        <p-select [options]="boats" optionLabel="name" placeholder="Selecione a embarcação" class="w-full mb-2" />

                </p-iconfield>


            </div>

            <div class="text-end pb-4 mt-2">
                <p-button icon="pi pi-external-link" label="Exportar CSV" (click)="dt.exportCSV()" />
            </div>

        </ng-template>

        <ng-template #header>
            <tr>
                <th pSortableColumn="customer_name">
                    Nome
                    <p-sortIcon field="name" />
                </th>

                <th pSortableColumn="customer_email">
                    E-mail
                    <p-sortIcon field="name" />
                </th>

                <th>
                    Telefone
                </th>

                <th>
                    Vendedor
                </th>


                <th></th>
            </tr>
        </ng-template>

        <ng-template #body let-user>
            <tr [pSelectableRow]="user">
                <td>
                    {{ user.customer_name }}
                </td>

                <td>
                    {{ user.customer_email }}
                </td>

                <td>
                    {{ user.customer_phone }}
                </td>

                <td>
                    {{ user.seller_name }}
                </td>

                <td>
                    <p-buttongroup>
                        <p-button icon="pi pi-pencil" severity="contrast" rounded/>
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
export class ListOportunitiesComponent {
    constructor(
        public formBuilder: FormBuilder,
        private messageService: MessageService,
        private userService: UserService,
        private salesService: SalesService,
        private boatService: BoatService,
    ) { }

    totalRecords = 0
    limitPerPage = 20
    
    customers = signal<SalesCustomer[]>([])
    boats: Boat[] = []

    id: string = ""
    _name: string = ""

    selectedUsers!: any[] 
    isLoading: boolean = false
    typingTimeout: any
    curPage = 1
    first = 1

    autoFilteredValue: any[] = []

    nameSearch: string = ""
    emailSearch: string = ""
    phoneSearch: string = ""

    cols!: Column[];
    exportColumns!: ExportColumn[]

    confirmLabel = "Confirmar"
    rejectLabel = "Cancelar"

    onPageChange(e: any) {
        this.loadSalesCustomers(e.page)
        this.curPage = e.page
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    ngOnInit() {
        this.cols = [
            { field: 'type', header: 'Tipo' },
            { field: 'active', header: 'Ativo' }
        ];

        this.exportColumns = this.cols.map((col) => ({ title: col.header, dataKey: col.field }));
    }

    loadSalesCustomers(page: number, isDelete = false) {
        if (!isDelete) page++
        // const rmLoading = showLoading()

        this.salesService.getCustomers(page, this.limitPerPage, this.nameSearch, this.emailSearch, this.phoneSearch).pipe(finalize(() => { })).subscribe({
            next: (res: any) => {
                this.customers.set(res.data ?? [])

                this.totalRecords = res.totalRecords
                this.first = 1

            },
            error: (err) => {
                if (err.status) {
                    this.messageService.add({ severity: 'error', summary: "Erro", detail: 'Ocorreu um erro ao buscar clientes.' });
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
            this.loadSalesCustomers(0)
        }, 500)
    }

    getSeverity(_data: any) {
        if (_data.active == `Y`) {
            return "success"
        } else {
            return "danger"
        }
    }

    getActiveState(_data: any) {
        if (_data.active == `Y`) {
            return "Ativo"
        } else {
            return "Inativo"
        }
    }

}

import { CommonModule } from '@angular/common';
import { Component, computed, Input, signal, ViewChild } from '@angular/core';
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
import { UserService } from '../../shared/services/user.service';
import { SalesReportsService } from '../../shared/services/sales.reports.service';
import { SalesOrderModal } from '../../shared/components/sales/orders/sales.order';
import { DatePickerModule } from 'primeng/datepicker';

import { formatBRLDate, formatBRLMoney, firstDayOfMonth, lastDayOfMonth } from '../../shared/components/utils';

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
    selector: 'list-report-sales-orders',
    imports: [DialogModule, DatePickerModule, ButtonGroupModule, SalesOrderModal, ConfirmDialogModule, TableModule, SelectModule, ToastModule, InputIconModule, InputTextModule, IconFieldModule, DataViewModule, RippleModule, ButtonModule, CommonModule, Tag, FormsModule, ReactiveFormsModule, PaginatorModule],
    providers: [ConfirmationService, MessageService],
    styleUrls: [],
    standalone: true,

    template: `
    <p-toast></p-toast>

    <p-table [value]="list()" [columns]="cols" csvSeparator=";" [exportHeader]="'customExportHeader'" stripedRows selectionMode="multiple" [(selection)]="selectedUsers" dataKey="id" [tableStyle]="{ 'min-width': '50rem', 'margin-top':'10px' }"
        #dt
        [rows]="10"
        [globalFilterFields]="['model']"
        [rowHover]="true"
        dataKey="id"
    >
    <ng-template #caption>
        <div style='display:flex; flex-direction:column; flex-wrap:wrap;'>
            <div>
                <div class="flex items-center justify-between mb-4">
                    <span class="text-xl font-bold">Relatório de orçamentos e pedidos</span>

                </div>

                <div class="flex flex-wrap items-center justify-end gap-2">
                
                    <p-iconfield>
                        <p-inputicon styleClass="pi pi-search" />
                        <input [(ngModel)]="nameSearch" pInputText type="text" (input)="onGlobalFilter($event)" placeholder="Nome cliente..." />
                    </p-iconfield>


                    <p-iconfield>
                        <p-inputicon styleClass="pi pi-search" />
                        <input [(ngModel)]="sellerSearch" pInputText type="text" (input)="onGlobalFilter($event)" placeholder="Nome do vendedor..." />
                    </p-iconfield>

                    <p-iconfield>
                        <p-datepicker (input)="onGlobalFilter($event)" [(ngModel)]="dateIni" dateFormat="dd/mm/yy" required fluid />
                    </p-iconfield>

                    <p-iconfield>
                    Até
                    </p-iconfield>

                    <p-iconfield>
                        <p-datepicker (input)="onGlobalFilter($event)" [(ngModel)]="dateEnd" dateFormat="dd/mm/yy" required fluid />
                    </p-iconfield>


                </div>
                <div class="text-end pb-4 mt-2">
                    <p-button icon="pi pi-external-link" label="Exportar CSV" (click)="dt.exportCSV()" />
                </div>
            </div>

            <div>
                <div class='results-report'>
                    <div>
                        <h4>Total dos pedidos</h4>
                        
                        <h4 style='color: var(--p-tag-success-color);'>
                            {{  _formatBRLMoney(TotalValueFromListedOrders()) }}
                        </h4>
                    </div>
                </div>
            </div>

        </div>
    </ng-template>
    
    <ng-template #header>
        <tr>
            <th>Cód. Orçamento/pedido</th>

            <th pSortableColumn="total_value">
                Valor pedido
                <p-sortIcon field="total_value" />
            </th>

            <th pSortableColumn="created_at">
                Data de emissão
                <p-sortIcon field="created_at" />
            </th>

            <th pSortableColumn="customer_name">
                Cliente
                <p-sortIcon field="customer_name" />
            </th>

            <th pSortableColumn="seller_name">
                Vendedor
                <p-sortIcon field="seller_name" />
            </th>

            <th pSortableColumn="status">
                Status
                <p-sortIcon field="status" />
            </th>

            <th></th>
        </tr>
    </ng-template>
    
    <ng-template #body let-report>

        <tr [pSelectableRow]="report">
            <td>
                {{ report.id }}
            </td>

            <td>
                <span>{{ this._formatBRLMoney(report.total_value) }}</span>
            </td>

            <td>
                {{ this.getDate(report.created_at) }}
            </td>

            <td>
                {{ report.customer_name }}
            </td>

            <td>
                {{ report.seller_name }}
            </td>

            <td>
                <p-tag
                    [value]="getStatus(report.status)"
                    [severity]="getSeverityStatus(report.status)"
                    styleClass="dark:!bg-surface-900"
                />
            </td>

            <td>
                <p-buttongroup>
                    <p-button (click)="openSalesOrder(report.id)" icon="pi pi-pencil" severity="contrast" rounded/>
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

    <open-sales-order #salesOrder />
    `,
})
export class ListReportSalesOrdersComponent {
    constructor(
        private router: Router,
        private messageService: MessageService,
        private userService: UserService,
        private confirmationService: ConfirmationService,
        private reportsService: SalesReportsService
    ) { }

    @ViewChild('salesOrder') salesOrder!: SalesOrderModal
    @ViewChild('body') trBody!: any


    TotalValueFromListedOrders = computed(() => this.list()?.filter(n => n.total_value).reduce((sum, v) => sum + v.total_value, 0))
    list = signal<any[]>([])   
    totalRecords = 0
    limitPerPage = 20

    isLoading: boolean = false
    typingTimeout: any
    curPage = 1
    first = 1

    selectedUsers!: any[] // does nothing for now
    autoFilteredValue: any[] = []

    sellerSearch: string = ""
    nameSearch: string = ""
    dateIni: Date | null = firstDayOfMonth()
    dateEnd: Date | null = lastDayOfMonth()

    cols!: Column[]
    exportColumns!: ExportColumn[]

    confirmLabel = "Confirmar"
    rejectLabel = "Cancelar"

    onPageChange(e: any) {
        this.loadReportNegotiations(e.page)
        this.curPage = e.page
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    ngOnInit() {
        this.cols = [

        ]

        this.exportColumns = this.cols.map((col) => ({ title: col.header, dataKey: col.field }))

        this.loadReportNegotiations(1)
        console.log(this.trBody)
    }

    loadReportNegotiations(page: number) {
        // const rmLoading = showLoading()

        this.reportsService.getSalesOrdersReport(page, this.limitPerPage, this.nameSearch, this.sellerSearch, this.dateIni, this.dateEnd).pipe(finalize(() => { })).subscribe({
            next: (res: any) => {
                this.list.set(res.data ?? [])

                this.totalRecords = res.totalRecords
                this.first = 1

            },
            error: (err) => {
                if (err.status) {
                    this.messageService.add({ severity: 'error', summary: "Erro", detail: 'Ocorreu um erro ao buscar dados.' });
                }
                this.isLoading = false
            },
        })
    }

    openSalesOrder(id: number){
        this.salesOrder.showSalesOrder(id.toString(), `Pedido/Orçamento Cód. ${id}`)
    } 

    onGlobalFilter(event: any) {
        if (this.typingTimeout) {
            clearTimeout(this.typingTimeout)
        }

        this.typingTimeout = setTimeout(() => {
            this.first = 0;
            this.curPage = 1;
            this.loadReportNegotiations(1)
        }, 500)
    }

    _formatBRLMoney(amount: string){ // alias
        if(!amount){
            return "Sem valor"
        }
        return formatBRLMoney(amount)
    }

    getSeverityStatus(status: string) {
        if(status == "NQ"){ // new quote
            return "info"
        } else if(status == "NO"){ // new order
            return "info"
        } else if(status == "QC"){ // quote canceled
            return "warn"
        } else if(status == "OC"){ // order canceled
            return "warn"
        } else if(status == "OD"){ // order done
            return "success"
        } else {
            return "danger"
        }
    }

    getStatus(status: string) {
        if(status == "NQ"){ // new quote
            return "Novo orçamento"
        } else if(status == "NO"){ // new order
            return "Novo pedido"
        } else if(status == "QC"){ // quote canceled
            return "Orçamento cancelado"
        } else if(status == "OC"){ // order canceled
            return "Pedido cancelado"
        } else if(status == "OD"){ // order done
            return "Pedido concluído"
        } else {
            return "Não reconhecido"
        }
    }

    getDate(date: Date){
        return formatBRLDate(date)
    }
}

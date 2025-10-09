import { CommonModule } from '@angular/common';
import { Component, Input, signal, ViewChild } from '@angular/core';
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
import { DatePickerModule } from 'primeng/datepicker';

import { formatBRLDate, firstDayOfMonth, lastDayOfMonth } from '../../shared/components/utils';

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
    selector: 'list-report-negotiations',
    imports: [DialogModule, DatePickerModule, ButtonGroupModule, ConfirmDialogModule, TableModule, SelectModule, ToastModule, InputIconModule, InputTextModule, IconFieldModule, DataViewModule, RippleModule, ButtonModule, CommonModule, Tag, FormsModule, ReactiveFormsModule, PaginatorModule],
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
        <div class="flex items-center justify-between mb-4">
            <span class="text-xl font-bold">Relatório de negociações</span>
        </div>

        <div class="flex flex-wrap items-center justify-end gap-2">
        
            <p-iconfield>
                <p-inputicon styleClass="pi pi-search" />
                <input [(ngModel)]="nameSearch" pInputText type="text" (input)="onGlobalFilter($event)" placeholder="Nome cliente..." />
            </p-iconfield>


            <p-iconfield>
                <p-inputicon styleClass="pi pi-search" />
                <input [(ngModel)]="modelSearch" pInputText type="text" (input)="onGlobalFilter($event)" placeholder="Modelo barco..." />
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

    </ng-template>

    <ng-template #header>
        <tr>
            <th>Cód. negociação</th>

            <th pSortableColumn="com_name">
                Meio de contato
                <p-sortIcon field="com_name" />
            </th>

            <th pSortableColumn="customer_name">
                Cliente
                <p-sortIcon field="customer_name" />
            </th>

            <th pSortableColumn="customer_email">
                E-mail cliente
                <p-sortIcon field="customer_email" />
            </th>

            <th pSortableColumn="customer_phone">
                Telefone cliente
                <p-sortIcon field="customer_phone" />
            </th>

            <th pSortableColumn="days_since_stage_change">
                Dias desde a última mudança de estágio do funil
                <p-sortIcon field="days_since_stage_change" />
            </th>

            <th pSortableColumn="days_since_last_history">
                Dias desde o último acompanhamento
                <p-sortIcon field="days_since_last_history" />
            </th>
            
            <th pSortableColumn="last_history_at">
                Dada do último acompanhamento
                <p-sortIcon field="last_history_at" />
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
                {{ report.customer_name }}
            </td>

            <td>
                {{ report.customer_email }}
            </td>

            <td>
                {{ report.customer_phone }}
            </td>

            <td>
                {{ report.com_name }}
            </td>

            <td>
                <p-tag
                    [value]="report.days_since_stage_change"
                    [severity]="getSeverity(report.days_since_stage_change)"
                    styleClass="dark:!bg-surface-900"
                />
            </td>

            <td>
                <p-tag
                    [value]="report.days_since_last_history == null ? 'Sem acompanhamento' : report.days_since_last_history"
                    [severity]="getSeverity(report.days_since_last_history)"
                    styleClass="dark:!bg-surface-900"
                />
            </td>

            <td>
                <p-tag
                    [value]="getDate(report.last_history_at)"
                    [severity]="getSeverityDate(report.last_history_at)"
                    styleClass="dark:!bg-surface-900"
                />
            </td>

            <td></td>
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
export class ListReportNegotiationsComponent {
    constructor(
        private router: Router,
        private messageService: MessageService,
        private userService: UserService,
        private confirmationService: ConfirmationService,
        private reportsService: SalesReportsService
    ) { }


    
    list = signal<any[]>([])   
    totalRecords = 0
    limitPerPage = 20

    isLoading: boolean = false
    typingTimeout: any
    curPage = 1
    first = 1

    selectedUsers!: any[] // does nothing for now
    autoFilteredValue: any[] = []

    modelSearch: string = ""
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
    }

    loadReportNegotiations(page: number) {
        // const rmLoading = showLoading()

        this.reportsService.getNegotiationsReport(page, this.limitPerPage, this.nameSearch, this.modelSearch, this.dateIni, this.dateEnd).pipe(finalize(() => { })).subscribe({
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

    getSeverity(days: string) {
        if(!days){
            return "danger"
        }
        const _days = parseInt(days)

        if (_days <= 7) {
            return "success"
        } else if (_days > 7 && _days <= 15) {
            return "warn"
        } else {  
            return "danger"
        }
    }

    getSeverityDate(date: Date) {
        if(!date){
            return "danger"
        }

        return "info"
    }

    getDate(date: Date){
        if(!date){
            return "Sem acompanhamento"
        }
        return formatBRLDate(date)
    }
}

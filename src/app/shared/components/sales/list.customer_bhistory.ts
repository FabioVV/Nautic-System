import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, signal } from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import { DataViewModule } from 'primeng/dataview';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { PaginatorModule } from 'primeng/paginator';
import { FormsModule, ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
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
import { MessageModule } from 'primeng/message';
import { finalize } from 'rxjs';

import { showLoading } from '../utils';
import { UserService } from '../../services/user.service';
import { AccStatus } from '../../../pages/products/accessories/accessories';
import { NegotiationHistory, SalesService } from '../../services/sales.service';
import { formatBRLDate } from '../utils';


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
    selector: 'list-negotiation-customer-history',
    imports: [DialogModule, MessageModule, ButtonGroupModule, ConfirmDialogModule, TableModule, SelectModule, ToastModule, InputIconModule, InputTextModule, IconFieldModule, DataViewModule, RippleModule, ButtonModule, CommonModule, Tag, FormsModule, ReactiveFormsModule, PaginatorModule],
    providers: [ConfirmationService, MessageService],
    styleUrls: [],
    standalone: true,

    template: `
    <p-toast></p-toast>

    <div class="card" style='padding:0.1rem; padding-left:0px !important; background-color: var(--p-sky-500); margin-top:1rem;'>
        <p-dataview #dv [value]="negotiationsHistories()">
            <ng-template #list let-items>
                <div class="grid grid-cols-12 gap-4 grid-nogutter">
                    <div class="col-span-12" *ngFor="let item of items; let first = first">
                        <div
                            class="flex flex-col sm:flex-row sm:items-center p-6 gap-4"
                            [ngClass]="{ 'border-t border-surface-200 dark:border-surface-700': !first }"
                        >
                            <!-- 
                                <div class="md:w-40 relative">
                                    <img
                                        class="block xl:block mx-auto rounded-border w-full"
                                        [src]="'https://primefaces.org/cdn/primeng/images/demo/product/' + item.image"
                                        [alt]="item.name"
                                    />
                                    <p-tag
                                        [value]="item.inventoryStatus"
                                        [severity]="getSeverity(item)"
                                        class="absolute dark:!bg-surface-900"
                                        [style.left.px]="4"
                                        [style.top.px]="4"
                                    />
                                </div>
                             -->
                            <div class="flex flex-col md:flex-row justify-between md:items-center flex-1 gap-6">
                                <div class="flex flex-row md:flex-col justify-between items-start gap-2">
                                    <div>
                                        <span class="font-medium text-secondary " style='color:var(--p-emerald-500);'>Via {{ item.com_name }} as {{ _formatBRLDate(item.created_at) }}</span>
                                        <div class="text-lg font-medium text-surface-900 dark:text-surface-0 mt-2">
                                            {{ item.description }}
                                        </div>
                                    </div>
                                </div>

                                <div class="flex flex-col md:items-end gap-8">

                                    <div class="flex flex-row-reverse md:flex-row gap-2">

                                        <p-button [style]="{ color: 'var(--p-emerald-900)' }"
                                            icon="pi pi-dollar"
                                            class="flex-auto md:flex-initial whitespace-nowrap"
                                            label="Gerar orçamento"
                                        ></p-button>

                                    </div>

                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            </ng-template>
        </p-dataview>
    </div>

    `,
})
export class ListCustomerNegotiationHistoryComponent {
    constructor(
        private router: Router,
        public formBuilder: FormBuilder,
        private messageService: MessageService,
        private userService: UserService,
        private salesService: SalesService,
        private confirmationService: ConfirmationService
    ) { }

    negotiationsHistories = signal<NegotiationHistory[]>([])

    id: string = ""
    _name: string = ""

    submitted: boolean = false
    accDialog: boolean = false
    isLoading: boolean = false

    form = this.formBuilder.group({
        Name: ['', [Validators.required]],
    })

    selectedUsers!: any[] // does nothing for now

    autoFilteredValue: any[] = []

    nameSearch: string = ""

    cols!: Column[];
    exportColumns!: ExportColumn[];

    confirmLabel = "Confirmar"
    rejectLabel = "Cancelar"

    onPageChange(e: any) {
        this.loadNegotiationHistory(e.page)
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    ngOnInit() {

    }

    _formatBRLDate(date: any){
        return formatBRLDate(date)
    }

    loadNegotiationHistory(id: string) {
        //const rmLoading = showLoading()

        this.salesService.GetNegotiationHistory(id).pipe(finalize(() => {  })).subscribe({
            next: (res: any) => {
                this.negotiationsHistories.set(res.data ?? [])

            },
            error: (err) => {
                if (err.status) {
                    this.messageService.add({ severity: 'error', summary: "Erro", detail: 'Ocorreu um erro ao buscar histórico de negociação.' });
                }
                this.isLoading = false
            },
        })
    }

    hideDialog() {
        this.accDialog = false;
        this.submitted = false;
    }

    onSubmit() {
        this.submitted = true

        if (this.form.valid) {
            this.isLoading = true

            
        }
    }

    submit() {
        document.getElementById(`btn_submit`)?.click()
    }

    hasBeenSubmited(controlName: string): boolean {
        const control = this.form.get(controlName)
        return Boolean(control?.invalid)
            && (this.submitted || Boolean(control?.touched))
        //|| Boolean(control?.dirty
    }

}

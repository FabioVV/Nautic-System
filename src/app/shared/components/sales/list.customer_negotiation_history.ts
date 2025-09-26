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
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { AutoCompleteCompleteEvent, AutoCompleteModule } from 'primeng/autocomplete';
import { InputMaskModule } from 'primeng/inputmask';
import { TooltipModule } from 'primeng/tooltip';
import { TextareaModule } from 'primeng/textarea';


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
    imports: [DialogModule, TextareaModule, MessageModule, TooltipModule, AutoCompleteModule, InputMaskModule, InputGroupAddonModule, InputGroupModule, ButtonGroupModule, ConfirmDialogModule, TableModule, SelectModule, ToastModule, InputIconModule, InputTextModule, IconFieldModule, DataViewModule, RippleModule, ButtonModule, CommonModule, Tag, FormsModule, ReactiveFormsModule, PaginatorModule],
    providers: [ConfirmationService, MessageService],
    styleUrls: [],
    standalone: true,

    template: `
    <p-toast></p-toast>

    <form [formGroup]="acoForm" (ngSubmit)="onSubmitUpdateAco()" >
        <button id="btn_submit_acom" style='display:none;' type="submit"></button>

        <div class='row'>
            <div class='col-md-12'>
                <label for="Description" class="block font-bold mb-3">Acompanhamento</label>
                <textarea rows="5" cols="30" pTextarea formControlName="Description" fluid></textarea>

                <div class="error-feedback" *ngIf="hasBeenSubmited('Description')">
                    <p-message styleClass="mb-2" *ngIf="acoForm.controls.Description.hasError('required')" severity="error" variant="simple" size="small">Por favor, digite o acompanhamento</p-message>
                </div>
            </div>

        </div>

        <div class='row'>
            <div class='col-md-6'>
                <label for="ComMeanName" class="block font-bold mb-3">Meio de comunicação do acompanhamento</label>

                <p-inputgroup>
                    <p-inputgroup-addon pTooltip="Digite na caixa ao lado para pesquisar um meio e selecione na lista" tooltipPosition="top" [style]="{ cursor:'help' }">
                        <i class="pi pi-filter"></i>
                    </p-inputgroup-addon>

                    <p-autocomplete class="w-full mb-2" formControlName="ComMeanName" placeholder="Procure o tipo" [suggestions]="autoFilteredValue" optionLabel="name" (completeMethod)="filterClassAutocomplete($event)" (onSelect)="setComMeanChoosenAcom($event)" />
                </p-inputgroup>

                <div class="error-feedback" *ngIf="hasBeenSubmited('ComMeanName')">
                    <p-message styleClass="mb-2" *ngIf="acoForm.controls.ComMeanName.hasError('required')" severity="error" variant="simple" size="small">Por favor, digitar o nome do cliente</p-message>
                </div>
            </div>
        </div>

        <p-button [style]="{margin:'5px'}" [disabled]="isLoading" (click)="submit()" type="submit" label="Salvar" icon="pi pi-check" />

    </form>

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

                                        <span [ngStyle]="{ color: item.id_business == null ? 'var(--p-amber-500)' : 'var(--p-sky-500)' }" class="font-medium text-secondary "> {{ item.id_business == null ? 'Acompanhamento não vinculado a uma negociação.' : '(Cód. Negociação #' + item.id_business + ')' }}</span>

                                        <div class="text-lg font-medium text-surface-900 dark:text-surface-0 mt-2">
                                            {{ item.description }}
                                        </div>
                                    </div>
                                </div>

                                <div class="flex flex-col md:items-end gap-8">

                                    <div class="flex flex-row-reverse md:flex-row gap-2">

                                        <p-button
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
    ComMeans: any[] = []

    submitted: boolean = false
    accDialog: boolean = false
    isLoading: boolean = false

    acoForm = this.formBuilder.group({
        Description: ['', [Validators.required]],
        ComMeanName: ['', [Validators.required]],
        ComMeanId: ['', [Validators.required]],
        UserId: ['', []],
        CustomerId: ['', []],
        Stage: [0, []]
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
        this.salesService.getComs(1, 1000, "", "Y").subscribe({
            next: (res: any) => {
                this.ComMeans = res.data
            }, 
            error: (err: any) => {
                this.messageService.add({ severity: 'error', summary: "Erro", detail: 'Ocorreu um erro ao buscar os meios.' });
            },
        })
    }

    _formatBRLDate(date: any){
        return formatBRLDate(date)
    }

    loadNegotiationHistory(id: string) {
        //const rmLoading = showLoading()
        this.id = id
        this.salesService.GetCustomerNegotiationHistory(id).pipe(finalize(() => {  })).subscribe({
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

    onSubmitUpdateAco(){
        this.submitted = true
        console.log(this.acoForm.value)

        if (this.acoForm.valid) {
            this.isLoading = true

            // @ts-ignore
            this.acoForm.get("UserId")?.setValue(this.userService?.getUserData()?.id)
            // @ts-ignore
            this.acoForm.get("CustomerId")?.setValue(parseInt(this.id))


            delete this.acoForm.value.ComMeanName

            this.salesService.createNegotiationHistory('0', this.acoForm.value).subscribe({
                next: (res: any) => {
                    this.messageService.add({ severity: 'success', summary: "Sucesso", detail: 'Negociação de cliente atualizada com sucesso' });
                    
                    this.submitted = false
                    this.isLoading = false
                    this.acoForm.reset()

                    this.loadNegotiationHistory(this.id)
                },
                error: (err) => {
                    if (err?.status == 400 && err?.error?.errors?.type == "TODO") {
                    } else {
                        this.messageService.add({ severity: 'error', summary: "Erro", detail: 'Ocorreu um erro com sua requisição.' });
                    }
                    this.isLoading = false
                },

            })
        }
    }

    filterClassAutocomplete(event: AutoCompleteCompleteEvent){
        const filtered: any[] = []
        const query = event.query   

        for (let i = 0; i < this.ComMeans.length; i++) {
            const mc = this.ComMeans[i]
            if (mc.name.toLowerCase().indexOf(query.toLowerCase()) == 0) {
                filtered.push(mc)
            }
        }

        this.autoFilteredValue = filtered
    }

    setComMeanChoosenAcom(e: any){
        //@ts-ignore
        this.acoForm.get("ComMeanName")?.setValue(e.value.name)
        //@ts-ignore
        this.acoForm.get("ComMeanId")?.setValue(e.value.id)
    }

    submit() {
        document.getElementById(`btn_submit_acom`)?.click()
    }

    hasBeenSubmited(controlName: string): boolean {
        const control = this.acoForm.get(controlName)
        return Boolean(control?.invalid)
            && (this.submitted || Boolean(control?.touched))
        //|| Boolean(control?.dirty
    }

}

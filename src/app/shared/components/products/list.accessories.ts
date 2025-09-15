import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import { DataViewModule } from 'primeng/dataview';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { PaginatorModule } from 'primeng/paginator';
import { FormsModule, ReactiveFormsModule, Validators, FormBuilder } from '@angular/forms';
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
import { MessageModule } from 'primeng/message';
import { AutoCompleteModule, AutoCompleteCompleteEvent } from 'primeng/autocomplete';
import { TextareaModule } from 'primeng/textarea';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { TooltipModule } from 'primeng/tooltip';
import { InputNumberModule } from 'primeng/inputnumber';

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
    imports: [DialogModule, InputNumberModule, TooltipModule, InputGroupAddonModule, InputGroupModule, TextareaModule, AutoCompleteModule, MessageModule, ButtonGroupModule, ConfirmDialogModule, TableModule, SelectModule, ToastModule, InputIconModule, InputTextModule, IconFieldModule, DataViewModule, RippleModule, ButtonModule, CommonModule, Tag, FormsModule, ReactiveFormsModule, PaginatorModule],
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
                    <p-button (click)="openNew(acc.id)"icon="pi pi-pencil" severity="contrast" rounded/>
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


    <p-dialog [style]="{ width: '800px' }" [(visible)]="accDialog" header="Atualizar acessório" [modal]="true">
        <ng-template #content>

            <form [formGroup]="form" (ngSubmit)="onSubmit()" style='margin-bottom: 4rem;'>
                <button id="btn_submit" style='display:none;' type="submit"></button>
                
                <div class='row'>
                    <div class='col-md-8'>
                        <label for="Model" class="block font-bold mb-3">Modelo</label>
                        <input formControlName="Model" class="w-full md:w-[30rem] mb-2" type="text" pInputText id="Type" required autofocus fluid />
                       
                        <div class="error-feedback" *ngIf="hasBeenSubmited('Model')">
                            <p-message styleClass="mb-2" *ngIf="form.controls.Model.hasError('required')" severity="error" variant="simple" size="small">Por favor, digitar o modelo do acessório</p-message>
                        </div>
                    </div>

                    <div class='col-md-4'>
                        <label for="AccessoryTypeModel" class="block font-bold mb-3">Tipo de acessório</label>

                        <p-inputgroup>
                            <p-inputgroup-addon pTooltip="Digite na caixa ao lado para pesquisar um novo tipo e selecione na lista" tooltipPosition="top" [style]="{ cursor:'help' }">
                                <i class="pi pi-filter"></i>
                            </p-inputgroup-addon>

                            <p-autocomplete class="w-full mb-2" formControlName="AccessoryTypeModel" placeholder="Procure o tipo" [suggestions]="autoFilteredValue" optionLabel="type" (completeMethod)="filterClassAutocomplete($event)" (onSelect)="setAccessoryTypeChoosen($event)" />
                        </p-inputgroup>

                        
                        <div class="error-feedback" *ngIf="hasBeenSubmited('AccessoryTypeModel')">
                            <p-message styleClass="mb-2" *ngIf="form.controls.AccessoryTypeModel.hasError('required')" severity="error" variant="simple" size="small">Por favor, escolher um tipo</p-message>
                        </div>
                    </div>
                </div>

                <div class='row'>
                    <div class='col-md-6'>
                        <label for="PriceBuy" class="block font-bold mb-3">Preço de compra</label>
                        <p-inputnumber formControlName="PriceBuy" class="w-full mb-2" mode="currency" currency="BRL" locale="pt-BR" />

                        <div class="error-feedback" *ngIf="hasBeenSubmited('PriceBuy')">
                            <p-message styleClass="mb-2" *ngIf="form.controls.PriceBuy.hasError('required')" severity="error" variant="simple" size="small">Por favor, digitar o preço de compra</p-message>
                        </div>
                    </div>

                    <div class='col-md-6'>
                        <label for="PriceSell" class="block font-bold mb-3">Preço de venda</label>

                        <p-inputnumber formControlName="PriceSell" class="w-full mb-2" mode="currency" currency="BRL" locale="pt-BR" />


                        <div class="error-feedback" *ngIf="hasBeenSubmited('PriceSell')">
                            <p-message styleClass="mb-2" *ngIf="form.controls.PriceSell.hasError('required')" severity="error" variant="simple" size="small">Por favor, digitar o preço de venda</p-message>
                        </div>
                    </div>
                </div>

                <div class='row'>
                    <div class='col-md-12'>
                        <label for="Details" class="block font-bold mb-3">Detalhes</label>
                        <textarea  class="w-full mb-2" rows="5" cols="30" pTextarea formControlName="Details"></textarea>
                        <div class="error-feedback" *ngIf="hasBeenSubmited('Details')">
                            <p-message styleClass="mb-2" *ngIf="form.controls.Details.hasError('required')" severity="error" variant="simple" size="small">Por favor, digitar o modelo do acessório</p-message>
                        </div>
                    </div>
                </div>

            </form>


            <ng-template #footer>
                <p-button label="Cancelar" icon="pi pi-times" text (click)="hideDialog()" />
                <p-button [disabled]="isLoading" (click)="submit()" type="submit" label="Salvar" icon="pi pi-check" />
            </ng-template>

        </ng-template>
    </p-dialog>
    `,
})
export class ListAccessoriesComponent {
    constructor(
        public formBuilder: FormBuilder,
        private router: Router,
        private messageService: MessageService,
        private userService: UserService,
        private accessoryService: AccessoryService,
        private confirmationService: ConfirmationService
    ) { }

    @Input() accessories: any
    @Input() totalRecords: any
    @Input() limitPerPage: any

    _id: string = ""
    submitted: boolean = false
    accDialog: boolean = false
    isLoading: boolean = false
    typingTimeout: any
    curPage = 1
    first = 1

    selectedUsers!: any[] // does nothing for now
    accessoriesTypes: any[] = []
    autoFilteredValue: any[] = []

    selectedAccState: AccStatus | undefined = { name: "Indiferente", code: "" }
    accStates: AccStatus[] | undefined

    modelSearch: string = ""

    cols!: Column[];
    exportColumns!: ExportColumn[];

    confirmLabel = "Confirmar"
    rejectLabel = "Cancelar"

    form = this.formBuilder.group({
        Model: ['', [Validators.required]],
        Details: ['', [Validators.required]],
        PriceBuy: [0, []],
        PriceSell: [0, []],
        AccessoryTypeModel: ['', [Validators.required]],
        AccessoryTypeId: ['', [Validators.required]],
    })

    
    submit() {
        document.getElementById(`btn_submit`)?.click()
    }

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

        this.exportColumns = this.cols.map((col) => ({ title: col.header, dataKey: col.field }))

        this.accessoryService.getAccessoriesTypes(1, 1000, "", "Y").subscribe({
            next: (res: any) => {
                this.accessoriesTypes = res.data
            }, 
            error: (err) => {
                this.messageService.add({ severity: 'error', summary: "Erro", detail: 'Ocorreu um erro ao buscar os tipos de acessórios.' });
            },
        })
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

    hideDialog() {
        this.accDialog = false
        this.submitted = false
    }

    openNew(id: string) {
        this.submitted = false
        this.accDialog = true

        this.accessoryService.getAccessory(id).subscribe({
            next: (res: any) => {                
                //@ts-ignore
                this.form.get("Model")?.setValue(res.data['model'])
                this.form.get("Details")?.setValue(res.data['details'])
                this.form.get("PriceBuy")?.setValue(res.data['price_buy'])
                this.form.get("PriceSell")?.setValue(res.data['price_sell'])
                this.form.get("AccessoryTypeModel")?.setValue(res.data['AccessoryType'])
                this.form.get("AccessoryTypeId")?.setValue(res.data['AccessoryTypeId'])
                this._id = id
            }, 
            error: (err) => {
                this.messageService.add({ severity: 'error', summary: "Erro", detail: 'Ocorreu um erro ao buscar o acessório .' });
            },
        })


    }

    onSubmit(){
        this.submitted = true

        if (this.form.valid) { 
            this.isLoading = true
            delete this.form.value.AccessoryTypeModel

            this.accessoryService.updateAccessory(this._id, this.form.value).subscribe({
                next: (res: any) => {
                    this.messageService.add({ severity: 'success', summary: "Sucesso", detail: 'Acessório atualizado com sucesso' });
                    this.loadAccessories(this.curPage, true)
                    this.submitted = false
                    this.isLoading = false
                    this.hideDialog()
                    this.form.reset()
                },
                error: (err) => {
                    if(err?.error?.errors?.accessory == 'Accessory must bet active to update it'){
                        this.messageService.add({ severity: 'error', summary: "Erro", detail: 'Acessório precisa estar ativo para ser editado.' });
                    } else {
                        this.messageService.add({ severity: 'error', summary: "Erro", detail: 'Ocorreu um erro com sua requisição.' });
                    }
                    this.isLoading = false
                },
            
            })
        }
    }

    setAccessoryTypeChoosen(e: any){
        //@ts-ignore
        this.form.get("className")?.setValue(e.value.name)
        //@ts-ignore
        this.form.get("AccessoryTypeId")?.setValue(e.value.id)
    }

    filterClassAutocomplete(event: AutoCompleteCompleteEvent){
        const filtered: any[] = []
        const query = event.query   

        for (let i = 0; i < this.accessoriesTypes.length; i++) {
            const accT = this.accessoriesTypes[i]
            console.log(this.accessoriesTypes)
            if (accT.type.toLowerCase().indexOf(query.toLowerCase()) == 0) {
                filtered.push(accT)
            }
        }

        this.autoFilteredValue = filtered
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

    hasBeenSubmited(controlName: string): boolean {
        const control = this.form.get(controlName)
        return Boolean(control?.invalid)
            && (this.submitted || Boolean(control?.touched))
        //|| Boolean(control?.dirty
    }

}

import { Component, OnInit, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators, ValidatorFn, AbstractControl } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { RatingModule } from 'primeng/rating';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { DialogModule } from 'primeng/dialog';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { MessageModule } from 'primeng/message';
import { PasswordModule } from 'primeng/password';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { SelectModule } from 'primeng/select';
import { TextareaModule } from 'primeng/textarea';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { AutoCompleteModule, AutoCompleteCompleteEvent } from 'primeng/autocomplete';

import { AccessoryService, Accessory } from '../../../shared/services/accessories.service';
import { ListAccessoriesComponent } from '../../../shared/components/products/list.accessories';
import { showLoading } from '../../../shared/components/utils';

export interface AccStatus {
    name: string
    code: string
}

@Component({
    selector: 'app-accessory',
    standalone: true,
    imports: [
        RouterModule,
        CommonModule,
        TableModule,
        FormsModule,
        ButtonModule,
        RippleModule,
        ToolbarModule,
        RatingModule,
        InputTextModule,
        InputNumberModule,
        DialogModule,
        ConfirmDialogModule,
        ReactiveFormsModule,
        ToastModule,
        MessageModule,
        PasswordModule,
        IconFieldModule,
        InputIconModule,
        SelectModule,
        TextareaModule,
        InputGroupModule,
        InputGroupAddonModule,
        AutoCompleteModule,
        ListAccessoriesComponent,
    ],
    providers: [MessageService, ConfirmationService],
    template: `
    <p-toast></p-toast>
    <p-toolbar styleClass="mb-6">
        <ng-template #start>
            <p-button label="Novo acessório" icon="pi pi-plus" severity="secondary" class="mr-2" (onClick)="openNew()" />


        </ng-template>

        <ng-template #end>
        </ng-template>
    </p-toolbar>

    <p-dialog [style]="{ width: '800px' }" [(visible)]="accDialog" header="Registrar acessório" [modal]="true">
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
                        <p-autocomplete class="w-full mb-2" formControlName="AccessoryTypeModel" placeholder="Procure o tipo" [suggestions]="autoFilteredValue" optionLabel="type" (completeMethod)="filterClassAutocomplete($event)" (onSelect)="setAccessoryTypeChoosen($event)" />
                        
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

    <list-accessories [accessories]="accessories" [totalRecords]="totalRecords" [limitPerPage]="limitPerPage" ></list-accessories>
    `
})
export class AccessoriesPage implements OnInit {
    constructor(
        public formBuilder: FormBuilder,
        private messageService: MessageService,
        private confirmationService: ConfirmationService,
        private accessoryService: AccessoryService,

    ) { }

    submitted: boolean = false
    isSubmited: boolean = false
    isLoading: boolean = false
    accDialog: boolean = false
    totalRecords = 0
    limitPerPage = 20

    accessoriesTypes: any[] = [ ]
    autoFilteredValue: any[] = []
    accessories = signal<Accessory[]>([])

    form = this.formBuilder.group({
        Model: ['', [Validators.required]],
        Details: ['', [Validators.required]],
        PriceBuy: ['', []],
        PriceSell: ['', []],
        AccessoryTypeModel: ['', [Validators.required]],
        AccessoryTypeId: ['', [Validators.required]],
    })

    ngOnInit(): void {
        this.loadAccessories()

        this.accessoryService.getAccessoriesTypes(1, 1000, "", "Y").subscribe({
            next: (res: any) => {
                this.accessoriesTypes = res.data
            }, 
            error: (err) => {
                this.messageService.add({ severity: 'error', summary: "Erro", detail: 'Ocorreu um erro ao buscar os tipos de acessórios.' });
            },
        })
    }
    
    loadAccessories() {
        this.accessoryService.getAccessories(1, this.limitPerPage, "", "").subscribe({
            next: (res: any) => {
                this.accessories.set(res.data ?? [])
                this.totalRecords = res.totalRecords
            },
            error: (err) => {
                if (err.status) {
                    this.messageService.add({ severity: 'error', summary: "Erro", detail: 'Ocorreu um erro ao buscar acessórios.' });
                }
                this.isLoading = false
            },
        })
    }

    hideDialog() {
        this.accDialog = false;
        this.submitted = false;
    }

    openNew() {
        this.submitted = false;
        this.accDialog = true;
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

    submit() {
        document.getElementById(`btn_submit`)?.click()
    }

    onSubmit() {
        this.isSubmited = true

        console.log((this.form.value.PriceBuy as string))

        if (this.form.valid) { 
            this.isLoading = true
            delete this.form.value.AccessoryTypeModel

            this.accessoryService.registerAccessory(this.form.value).subscribe({
                next: (res: any) => {
                    this.messageService.add({ severity: 'success', summary: "Sucesso", detail: 'Acessório registrado com sucesso' });
                    this.loadAccessories()
                    this.isSubmited = false
                    this.isLoading = false
                    this.hideDialog()
                    this.form.reset()
                },
                error: (err) => {
                    if (err?.status == 400 && err?.error?.ErrCode === 'u1') {
                        this.messageService.add({ severity: 'error', summary: "Erro", detail: 'E-mail já existente' });
                    } else {
                        this.messageService.add({ severity: 'error', summary: "Erro", detail: 'Ocorreu um erro com sua requisição.' });
            
                    }
                    this.isLoading = false
                },
            
            })
        }
    }

    hasBeenSubmited(controlName: string): boolean {
        const control = this.form.get(controlName)
        return Boolean(control?.invalid)
            && (this.isSubmited || Boolean(control?.touched))
        //|| Boolean(control?.dirty
    }

    isInvalid(controlName: string) {
        const control = this.form.get(controlName);
        return control?.invalid && (control.touched || this.isSubmited);
    }
}

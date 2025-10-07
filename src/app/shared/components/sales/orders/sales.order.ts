import { CommonModule } from '@angular/common';
import { Component, inject, Input, ViewChild } from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import { DataViewModule } from 'primeng/dataview';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { PaginatorModule } from 'primeng/paginator';
import { FormsModule, ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
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
import { Dialog } from 'primeng/dialog'
import { TabsModule } from 'primeng/tabs';
import { FieldsetModule } from 'primeng/fieldset';
import { TextareaModule } from 'primeng/textarea';
import { InputMaskModule } from 'primeng/inputmask';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { DatePickerModule } from 'primeng/datepicker';
import { CardModule } from 'primeng/card';
import { TagModule } from 'primeng/tag';

import { BrStates, SelectItem } from '../../utils';
import { SalesService } from '../../../services/sales.service';
import { UserService } from '../../../services/user.service';



@Component({
    selector: 'open-sales-order',
    imports: [DialogModule, TagModule, TabsModule, CardModule, DatePickerModule, InputMaskModule, InputNumberModule, InputGroupAddonModule, TextareaModule, FieldsetModule, MessageModule, ButtonGroupModule, ConfirmDialogModule, TableModule, SelectModule, ToastModule, InputIconModule, InputTextModule, IconFieldModule, DataViewModule, RippleModule, ButtonModule, CommonModule, FormsModule, ReactiveFormsModule, PaginatorModule],
    providers: [MessageService, ConfirmationService],
    styleUrls: [],
    standalone: true,

    template: `
    <p-toast></p-toast>
    <div style='display:none;'>
        <p-message severity="error"></p-message>
    </div>

    <p-dialog #cdialog [header]="title" [modal]="true" [(visible)]="visible" [style]="{ width: '50rem' }" [breakpoints]="{ '1199px': '75vw', '575px': '90vw' }" >
      
        <div *ngIf="true" style='margin-top:5px; margin-bottom:5px; background: var(--p-message-error-background); outline-color: var(--p-message-error-border-color); color: var(--p-message-error-color); box-shadow: var(--p-message-error-shadow);'>
            <div class='p-message-content' style='justify-content: center;'>
                <p-button type="submit" label="Clique aqui para ver avisos sobre este pedido" (click)="orderProblems()" icon="pi pi-exclamation-triangle" />
            </div>
        </div>

        <div class='ped-total'>
            <div>
                <h5>Total do pedido</h5>
                <p-tag severity="success" value="R$ 1.000.000,00" />
            </div>
        </div>

        <p-tabs value="0">
            <p-tablist>
                <p-tab value="0"><i class="pi pi-user"></i> Dados</p-tab>
                <p-tab value="1"><i class="pi pi-list"></i> itens</p-tab>
                <p-tab value="2"><i class="pi pi-list"></i> Arquivos</p-tab>

            </p-tablist>
            <p-tabpanels>

                <p-tabpanel value="0">
                    <form [formGroup]="salesOrderForm" (ngSubmit)="onSubmit()">
                        <button id="btn_submit" style='display:none;' type="submit"></button>
       
                        <div class='row'>

                            <div class='col-md-4'>
                                <label class="block font-bold mb-3">Nome do cliente</label>
                                <input formControlName="CustomerName" class="w-full md:w-[30rem] mb-2" type="text" pInputText id="Type" required autofocus fluid />
                            </div>

                            <div class='col-md-4'>
                                <label class="block font-bold mb-3">Vendedor</label>
                                <input formControlName="SellerName" class="w-full md:w-[30rem] mb-2" type="text" pInputText id="Type" required autofocus fluid />
                            </div>

                            <div class='col-md-4'>
                                <label class="block font-bold mb-3">Cód. (?)</label>
                                <input formControlName="Id" class="w-full md:w-[30rem] mb-2" type="text" pInputText id="Type" required autofocus fluid />
                            </div>

                        </div>

                        <p-fieldset legend="Dados complementares do cliente">

                            <div class='row'>
                                <div class='col-md-6'>
                                    <label for="Cep" class="block font-bold mb-3">Cep</label>
                                    <p-inputmask mask="99999-999" class="w-full md:w-[30rem] mb-2" formControlName="Cep" placeholder="99999-999" fluid  />
                                </div>

                                <div class='col-md-4'>
                                <label for="PfPj" class="block font-bold mb-3">Tipo de cliente</label>
                                <p-select [invalid]="isInvalid('PfPj')" [options]="TypeClient" formControlName="PfPj" optionLabel="name" placeholder="Selecione o tipo do cliente" class="w-full mb-2" />
                            
                            </div>

                            </div>

                            <div class='row'>
                                <div class='col-md-4'>
                                    <label for="Street" class="block font-bold mb-3">Endereço</label>
                                    <input formControlName="Street" class="w-full md:w-[30rem] mb-2" type="text" pInputText id="Type" required autofocus fluid />

                                </div>

                                <div class='col-md-2'>
                                    <label for="Neighborhood" class="block font-bold mb-3">Bairro</label>
                                    <input formControlName="Neighborhood" class="w-full md:w-[30rem] mb-2" type="text" pInputText id="Type" required autofocus fluid />
                                

                                </div>

                                <div class='col-md-2'>
                                    <label for="City" class="block font-bold mb-3">Cidade</label>
                                    <input formControlName="City" class="w-full md:w-[30rem] mb-2" type="text" pInputText id="Type" required autofocus fluid />
                                

                                </div>

                                <div class='col-md-2'>
                                    <label for="Complement" class="block font-bold mb-3">Complemento</label>
                                    <input formControlName="Complement" class="w-full md:w-[30rem] mb-2" type="text" pInputText id="Type" required autofocus fluid />

                                </div>

                                <div class='col-md-2'>
                                    <label for="State" class="block font-bold mb-3">Estado</label>
                                    <p-select [invalid]="isInvalid('State')" [options]="BrStates" formControlName="State" optionLabel="name" placeholder="Selecione o estado do cliente" class="w-full mb-2" />

                                </div>

                            </div>

                        </p-fieldset>

                        <div class='row'>
                            <div class='col-md-12'>
                                <label for="Details" class="block font-bold mb-3">Detalhes do pedido</label>
                                <textarea  class="w-full mb-2" rows="5" cols="30" pTextarea formControlName="Details"></textarea>
                            </div>
                        </div>

                    </form>
                </p-tabpanel>

                <p-tabpanel value="1">

                </p-tabpanel>

                <p-tabpanel value="2">

                </p-tabpanel>
                
            </p-tabpanels>
        </p-tabs>

        <ng-template #footer>
            <p-button type="submit" label="Salvar" (click)="submit()" icon="pi pi-check" id="action-acom-button"/>
        </ng-template>
    </p-dialog>
    `,
})
export class SalesOrderModal {
    constructor(
        public formBuilder: FormBuilder,
        private messageService: MessageService,
        private userService: UserService,
        private salesService: SalesService,
    ) { }

    BrStates = BrStates

    @ViewChild('cdialog') myDialog!: Dialog
    @Input() title: any


    isLoading: boolean = false
    submitted: boolean = false
    visible: boolean = false
    id: string = ""
    TypeClient: SelectItem[] = [{ name: 'Pessia física', code: 'PF' }, { name: 'Pessoa juridica', code: 'PJ' }]

    salesOrderForm = this.formBuilder.group({
        Id: [{value: '', disabled: true}, []],
        SellerName: [{value: '', disabled: true}, []],
        CustomerName: [{value: '', disabled: true}, []],
        PfPj: [{value: '', disabled: true}, []],
        Cep: [{value: '', disabled: true}, []],
        Street: [{value: '', disabled: true}, []],
        Neighborhood: [{value: '', disabled: true}, []],
        City: [{value: '', disabled: true}, []],
        Complement: [{value: '', disabled: true}, []],
        State: [{value: '', disabled: true}, []],
        Cpf: [{value: '', disabled: true}, []],
        Cnpj: [{value: '', disabled: true}, []],

        Details: ['', []],
    })

    submit() {
        document.getElementById(`btn_submit`)?.click()
    }

    ngOnInit() {

    }

    onSubmit(){
        this.submitted = true

    }

    loadSalesOrder(id: string){

    }

    orderProblems(){

    }

    showSalesOrder(id: string) {
        this.visible = true
        this.id = id

        this.myDialog.maximizable = true
        this.myDialog.maximize()
        this.loadSalesOrder(this.id)
    }

    isInvalid(controlName: string) {
        const control = this.salesOrderForm.get(controlName)
        return control?.invalid && (control.touched || this.submitted)
    }

    hasBeenSubmited(controlName: string): boolean {
        const control = this.salesOrderForm.get(controlName)
        return Boolean(control?.invalid)
            && (this.submitted || Boolean(control?.touched))
        //|| Boolean(control?.dirty
    }
}

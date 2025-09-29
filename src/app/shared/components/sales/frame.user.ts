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
import { ListCustomerNegotiationHistoryComponent } from './list.customer_negotiation_history';
import { FieldsetModule } from 'primeng/fieldset';
import { TextareaModule } from 'primeng/textarea';
import { InputMaskModule } from 'primeng/inputmask';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';

import { SelectItem, showLoading } from '../utils';
import { UserService } from '../../services/user.service';
import { SalesService } from '../../services/sales.service';

@Component({
    selector: 'open-customer-sales',
    imports: [DialogModule, TabsModule, InputMaskModule, InputNumberModule, InputGroupAddonModule, TextareaModule, FieldsetModule, MessageModule, ListCustomerNegotiationHistoryComponent, ButtonGroupModule, ConfirmDialogModule, TableModule, SelectModule, ToastModule, InputIconModule, InputTextModule, IconFieldModule, DataViewModule, RippleModule, ButtonModule, CommonModule, FormsModule, ReactiveFormsModule, PaginatorModule],
    providers: [MessageService, ConfirmationService],
    styleUrls: [],
    standalone: true,

    template: `
    <p-toast></p-toast>
    <p-dialog #cdialog [header]="title" [modal]="true" [(visible)]="visible" [style]="{ width: '50rem' }" [breakpoints]="{ '1199px': '75vw', '575px': '90vw' }" >
        <p-tabs value="0">
            <p-tablist>
                <p-tab value="0"><i class="pi pi-user"></i> Dados</p-tab>
                <p-tab value="1"><i class="pi pi-list"></i> Histórico de compras</p-tab>
            </p-tablist>
            <p-tabpanels>

                <p-tabpanel value="0">
                    <form [formGroup]="customerForm" (ngSubmit)="onSubmit()">
                        <button id="btn_submit_up" style='display:none;' type="submit"></button>

                        <div class='row'>
                            <div class='col-md-4'>
                                <label for="Name" class="block font-bold mb-3">Nome</label>
                                <input formControlName="Name" class="w-full md:w-[30rem] mb-2" type="text" pInputText id="Type" required autofocus fluid />
                            
                                <div class="error-feedback" *ngIf="hasBeenSubmited('Name')">
                                    <p-message styleClass="mb-2" *ngIf="customerForm.controls.Name.hasError('required')" severity="error" variant="simple" size="small">Por favor, digitar o nome do cliente</p-message>
                                </div>
                            </div>

                            <div class='col-md-4'>
                                <label for="Email" class="block font-bold mb-3">E-mail</label>
                                <input formControlName="Email" class="w-full md:w-[30rem] mb-2" type="text" pInputText id="Type" required autofocus fluid />

                                <div class="error-feedback" *ngIf="hasBeenSubmited('Email')">
                                    <p-message styleClass="mb-2" *ngIf="customerForm.controls.Email.hasError('required')" severity="error" variant="simple" size="small">Por favor, digitar o E-mail do cliente</p-message>
                                </div>
                            </div>

                            <div class='col-md-4'>
                                <label for="Email" class="block font-bold mb-3">Tipo de cliente</label>
                                <p-select [invalid]="isInvalid('PfPj')" [options]="TypeClient" formControlName="PfPj" optionLabel="name" placeholder="Selecione o tipo do cliente" class="w-full mb-2" />
                            
                                @if (isInvalid('PfPj')) {
                                    <p-message severity="error" size="small" variant="simple">Por favor, selecione se o tipo do cliente</p-message>
                                }
                            </div>
                        </div>

                        <div class='row'>
                            <div class='col-md-4'>
                                <label for="Cpf" class="block font-bold mb-3">CPF</label>
                                <input formControlName="Cpf" class="w-full md:w-[30rem] mb-2" type="text" pInputText id="Type" required autofocus fluid />
                            

                            </div>

                            <div class='col-md-4'>
                                <label for="Cnpj" class="block font-bold mb-3">CNPJ</label>
                                <input formControlName="Cnpj" class="w-full md:w-[30rem] mb-2" type="text" pInputText id="Type" required autofocus fluid />


                            </div>

                            <div class='col-md-4'>
                                <label for="Birthday" class="block font-bold mb-3">Aniversário</label>
                                <input formControlName="Birthday" class="w-full md:w-[30rem] mb-2" type="text" pInputText id="Type" required autofocus fluid />
                            </div>

                        </div>

                        <div class='row'>
                            <div class='col-md-6'>
                                <label for="Cep" class="block font-bold mb-3">Cep</label>
                                <input formControlName="Cep" class="w-full md:w-[30rem] mb-2" type="text" pInputText id="Type" required autofocus fluid />
                            
                                <div class="error-feedback" *ngIf="hasBeenSubmited('Cep')">
                                    <p-message styleClass="mb-2" *ngIf="customerForm.controls.Cep.hasError('required')" severity="error" variant="simple" size="small">Por favor, digitar o CEP do cliente</p-message>
                                </div>
                            </div>

                            <div class='col-md-6'>
                                <label for="UserName" class="block font-bold mb-3">Vendedor</label>
                                <input formControlName="UserName" class="w-full md:w-[30rem] mb-2" type="text" pInputText id="Type" required autofocus fluid />

                            </div>

                        </div>

                        <div class='row'>
                            <div class='col-md-4'>
                                <label for="Street" class="block font-bold mb-3">Endereço</label>
                                <input formControlName="Street" class="w-full md:w-[30rem] mb-2" type="text" pInputText id="Type" required autofocus fluid />
                            
                                <div class="error-feedback" *ngIf="hasBeenSubmited('Street')">
                                    <p-message styleClass="mb-2" *ngIf="customerForm.controls.Street.hasError('required')" severity="error" variant="simple" size="small">Por favor, digitar o endereço do cliente</p-message>
                                </div>
                            </div>

                            <div class='col-md-2'>
                                <label for="Neighborhood" class="block font-bold mb-3">Bairro</label>
                                <input formControlName="Neighborhood" class="w-full md:w-[30rem] mb-2" type="text" pInputText id="Type" required autofocus fluid />
                            
                                <div class="error-feedback" *ngIf="hasBeenSubmited('Neighborhood')">
                                    <p-message styleClass="mb-2" *ngIf="customerForm.controls.Neighborhood.hasError('required')" severity="error" variant="simple" size="small">Por favor, digitar o bairro do cliente</p-message>
                                </div>
                            </div>

                            <div class='col-md-2'>
                                <label for="City" class="block font-bold mb-3">Cidade</label>
                                <input formControlName="City" class="w-full md:w-[30rem] mb-2" type="text" pInputText id="Type" required autofocus fluid />
                            
                                <div class="error-feedback" *ngIf="hasBeenSubmited('City')">
                                    <p-message styleClass="mb-2" *ngIf="customerForm.controls.City.hasError('required')" severity="error" variant="simple" size="small">Por favor, digitar a cidade do cliente</p-message>
                                </div>
                            </div>

                            <div class='col-md-2'>
                                <label for="Complement" class="block font-bold mb-3">Complemento</label>
                                <input formControlName="Complement" class="w-full md:w-[30rem] mb-2" type="text" pInputText id="Type" required autofocus fluid />
                            
                                <div class="error-feedback" *ngIf="hasBeenSubmited('Complement')">
                                    <p-message styleClass="mb-2" *ngIf="customerForm.controls.Complement.hasError('required')" severity="error" variant="simple" size="small">Por favor, digitar o complemento do cliente</p-message>
                                </div>
                            </div>

                            <div class='col-md-2'>
                                <label for="State" class="block font-bold mb-3">Estado</label>
                                <input formControlName="State" class="w-full md:w-[30rem] mb-2" type="text" pInputText id="Type" required autofocus fluid />
                            
                                <div class="error-feedback" *ngIf="hasBeenSubmited('State')">
                                    <p-message styleClass="mb-2" *ngIf="customerForm.controls.State.hasError('required')" severity="error" variant="simple" size="small">Por favor, digitar o estado do cliente</p-message>
                                </div>
                            </div>

                        </div>

                        <hr/>

                        <div class='row'>
                            <div class='col-md-4'>
                                <label for="HasBoat" class="block font-bold mb-3">Já possui embarcação?</label>
                                <p-select [invalid]="isInvalid('HasBoat')" [options]="HasBoat" formControlName="HasBoat" optionLabel="name" placeholder="Selecione uma opção" class="w-full mb-2" />
                            
                                @if (isInvalid('HasBoat')) {
                                    <p-message severity="error" size="small" variant="simple">Por favor, selecione se o cliente já possui embarcação</p-message>
                                }
                            </div>

                            <div *ngIf="showHasWhichBoat" class='col-md-8'>
                                <label for="WhichBoat" class="block font-bold mb-3">Qual</label>
                                <input formControlName="WhichBoat" class="w-full md:w-[30rem] mb-2" type="text" pInputText id="Type" required autofocus fluid />
                            
                            </div>

                        </div>

                        <p-fieldset legend="Detalhes de Interesse do Cliente - Informações da última negociação" [toggleable]="true" [collapsed]="true">
                            <div class='row'>
                                <div class='col-md-4'>
                                    <label for="" class="block font-bold mb-3">Qualificado?</label>

                                    <p-select [invalid]="isInvalid('Qualified')" [options]="qualified" formControlName="Qualified" optionLabel="name" placeholder="Selecione se o lead é qualificado ou não" class="w-full mb-2" />
                                    @if (isInvalid('Qualified')) {
                                        <p-message severity="error" size="small" variant="simple">Por favor, selecione se o lead é qualificado ou não</p-message>
                                    }
                                </div>

                                <div *ngIf="showQualifiedDiv" class='col-md-8'>
                                    <label for="" class="block font-bold mb-3">Tipo de qualificação</label>
                                    <p-select [invalid]="isInvalid('QualifiedType')" [options]="qualifiedType" formControlName="QualifiedType" optionLabel="name" placeholder="Selecione o tipo de qualificação" class="w-full mb-2" />
                                
                                    @if (isInvalid('Qualified') && showQualifiedDiv) {
                                        <p-message severity="error" size="small" variant="simple">Por favor, selecione se o tipo de qualificação do lead</p-message>
                                    }
                                </div>

                            </div>

                            <div class='row'>

                                <div class='col-md-4'>
                                    <label for="CustomerCity" class="block font-bold mb-3">Cidade do cliente</label>
                                    <input formControlName="CustomerCity" class="w-full md:w-[30rem] mb-2" type="text" pInputText id="Type" required autofocus fluid />
                                    
                                    <div class="error-feedback" *ngIf="hasBeenSubmited('CustomerCity')">
                                        <p-message styleClass="mb-2" *ngIf="customerForm.controls.CustomerCity.hasError('required')" severity="error" variant="simple" size="small">Por favor, digitar a cidade do cliente</p-message>
                                    </div>
                                </div>

                                <div class='col-md-4'>
                                    <label for="NavigationCity" class="block font-bold mb-3">Cidade que o cliente ira navegar</label>
                                    <input formControlName="NavigationCity" class="w-full md:w-[30rem] mb-2" type="text" pInputText id="Type" required autofocus fluid />
                                    
                                    <div class="error-feedback" *ngIf="hasBeenSubmited('NavigationCity')">
                                        <p-message styleClass="mb-2" *ngIf="customerForm.controls.NavigationCity.hasError('required')" severity="error" variant="simple" size="small">Por favor, digitar a cidade de navegação do cliente</p-message>
                                    </div>
                                </div>

                                <div class='col-md-4'>
                                    <label for="BoatCapacity" class="block font-bold mb-3">Capacidade da embarcação</label>
                                    <p-inputnumber  [useGrouping]="false" class="w-full mb-2" formControlName="BoatCapacity" placeholder="*" />
                                    
                                    <div class="error-feedback" *ngIf="hasBeenSubmited('BoatCapacity')">
                                        <p-message styleClass="mb-2" *ngIf="customerForm.controls.BoatCapacity.hasError('required')" severity="error" variant="simple" size="small">Por favor, digitar a capacidade da embarcação</p-message>
                                    </div>
                                </div>

                            </div>

                            <div class='row'> 
                                <div class='col-md-2'>
                                    <label for="" class="block font-bold mb-3">Embarcação nova/usada</label>
                                    <p-select [invalid]="isInvalid('NewUsed')" [options]="NewUsed" formControlName="NewUsed" optionLabel="name" placeholder="Selecione o tipo da embarcação" class="w-full mb-2" />
                                
                                    @if (isInvalid('NewUsed')) {
                                        <p-message severity="error" size="small" variant="simple">Por favor, selecione o tipo da embarcação</p-message>
                                    }
                                </div>

                                <div class='col-md-2'>
                                    <label for="" class="block font-bold mb-3">Embarcação cabinada/aberta</label>
                                    <p-select [invalid]="isInvalid('CabinatedOpen')" [options]="CabinatedOpen" formControlName="CabinatedOpen" optionLabel="name" placeholder="Selecione o tipo da embarcação" class="w-full mb-2" />
                                
                                    @if (isInvalid('CabinatedOpen')) {
                                        <p-message severity="error" size="small" variant="simple">Por favor, selecione se o tipo da embarcação</p-message>
                                    }
                                </div>

                                <div class='col-md-4'>
                                    <label for="" class="block font-bold mb-3">Tamanho mínimo embarcação (aproximado, em Pés)</label>
                                    <p-inputnumber formControlName="MinPesBoat" class="w-full mb-2" locale="pt-BR" />

                                </div>
                                <div class='col-md-4'>
                                    <label for="" class="block font-bold mb-3">Tamanho máximo embarcação (aproximado, em Pés)</label>
                                    <p-inputnumber formControlName="MaxPesBoat" class="w-full mb-2" locale="pt-BR" />
                                
                                </div>

                            </div>

                            <div class='row'>

                            </div>

                        </p-fieldset>

                        
                        <div class='row'>
                            <label for="ExtraInfo" class="block font-bold mb-3">Informações sobre o cliente</label>
                            <textarea rows="5" cols="30" pTextarea formControlName="ExtraInfo" fluid></textarea>
                        </div>

                    </form>
                </p-tabpanel>

                <p-tabpanel value="1">
                    <list-negotiation-customer-history #negHistory/>
                </p-tabpanel>
                
            </p-tabpanels>
        </p-tabs>

        <ng-template #footer>
            <p-button type="submit" label="Salvar" (click)="submit()" icon="pi pi-check" id="action-acom-button"/>
        </ng-template>
    </p-dialog>
    `,
})
export class SalesCustomerModal {
    constructor(
        public formBuilder: FormBuilder,
        private messageService: MessageService,
        private userService: UserService,
        private salesService: SalesService,
    ) { }

    @ViewChild('cdialog') myDialog!: Dialog
    @ViewChild('negHistory') negotiationHistory!: ListCustomerNegotiationHistoryComponent

    @Input() title: any

    TypeClient: SelectItem[] = [{ name: 'Pessia física', code: 'PF' }, { name: 'Pessoa juridica', code: 'PJ' }]
    HasBoat: SelectItem[] = [{ name: 'Sim', code: 'S' }, { name: 'Não', code: 'N' }]
    qualified: SelectItem[] = [{ name: 'Sim', code: 'Y' }, { name: 'Não', code: 'N' }]
    CabinatedOpen: SelectItem[] = [ { name: 'Aberta', code: 'A' }, { name: 'Cabinada', code: 'C' }]
    NewUsed: SelectItem[] = [{ name: 'Nova', code: 'N' }, { name: 'Usada', code: 'U' }]
    qualifiedType: SelectItem[] = [
        { name: 'Muito decidido. Intenção clara de compra imediata', code: 'A' }, 
        { name: 'Interesse real, mas precisa de mais informação', code: 'B' }, 
        { name: 'Inicio de pesquisa, médio/longo prazo', code: 'C' }
    ]

    submitted: boolean = false
    visible: boolean = false
    id: string = ""
    url: any

    customerForm = this.formBuilder.group({
        Name: ['', [Validators.required]],
        Email: ['', [Validators.required]],
        Phone: ['', [Validators.required]],

        PfPj: ['', [Validators.required]],
        Cep: ['', [Validators.required]],
        Street: ['', [Validators.required]],
        Neighborhood: ['', [Validators.required]],
        City: ['', [Validators.required]],
        Complement: ['', []],
        State: ['', [Validators.required]],

        Cpf: ['', []],
        Cnpj: ['', []],
        Birthday: ['', []],

        Qualified: [{value: '', disabled: true}, [Validators.required]],
        QualifiedType: [{value: '', disabled: true}, []],

        HasBoat: ['', []],
        WhichBoat: ['', []],
        
        MinPesBoat: [{value: '', disabled: true}, []],
        MaxPesBoat: [{value: '', disabled: true}, []],
        CustomerCity: [{value: '', disabled: true}, []],
        NavigationCity: [{value: '', disabled: true}, []],
        BoatCapacity: [{value: '', disabled: true}, []],
        NewUsed: [{value: '', disabled: true}, []],
        CabinatedOpen: [{value: '', disabled: true}, []],
        EstimatedValue: [{value: '', disabled: true}, []],


        ComMeanName: ['', [Validators.required]],
        ComMeanId: ['', [Validators.required]],
        UserId: ['', []],
        UserName: [{value: '', disabled: true}, []],

        ExtraInfo: ['', []],
    })

    submit() {
        document.getElementById(`btn_submit`)?.click()
    }

    ngOnInit() {

    }

    onSubmit(){

    }

    showCustomer(id: string) {
        this.visible = true
        this.id = id

        this.myDialog.maximizable = true
        this.myDialog.maximize()
        this.negotiationHistory.loadNegotiationHistory(this.id)
    }

    get showHasWhichBoat(): boolean {
        const c: any = this.customerForm.get('HasBoat')
        if(c!['value']!['code'] == 'S'){
            return true
        }
        return false
    }

    get showQualifiedDiv(): boolean {
        const c: any = this.customerForm.get('Qualified')
        if(c!['value']!['code'] == 'Y'){
            return true
        }
        return false
    }

    isInvalid(controlName: string) {
        const control = this.customerForm.get(controlName)
        return control?.invalid && (control.touched || this.submitted)
    }

    hasBeenSubmited(controlName: string): boolean {
        const control = this.customerForm.get(controlName)
        return Boolean(control?.invalid)
            && (this.submitted || Boolean(control?.touched))
        //|| Boolean(control?.dirty
    }
}

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
import { DatePickerModule } from 'primeng/datepicker';

import { BrStates } from '../utils';
import { SelectItem, showLoading } from '../utils';
import { UserService } from '../../services/user.service';
import { SalesService } from '../../services/sales.service';

@Component({
    selector: 'open-customer-sales',
    imports: [DialogModule, TabsModule, DatePickerModule, InputMaskModule, InputNumberModule, InputGroupAddonModule, TextareaModule, FieldsetModule, MessageModule, ListCustomerNegotiationHistoryComponent, ButtonGroupModule, ConfirmDialogModule, TableModule, SelectModule, ToastModule, InputIconModule, InputTextModule, IconFieldModule, DataViewModule, RippleModule, ButtonModule, CommonModule, FormsModule, ReactiveFormsModule, PaginatorModule],
    providers: [MessageService, ConfirmationService],
    styleUrls: [],
    standalone: true,

    template: `
    <p-toast></p-toast>
    <div style='display:none;'>
        <p-message severity="warn"></p-message>
    </div>

    <p-dialog #cdialog [header]="title" [modal]="true" [(visible)]="visible" [style]="{ width: '50rem' }" [breakpoints]="{ '1199px': '75vw', '575px': '90vw' }" >
      
        <div *ngIf="showFraudDiv" style='margin-top:5px; margin-bottom:5px; background: var(--p-message-warn-background); outline-color: var(--p-message-warn-border-color); color: var(--p-message-warn-color); box-shadow: var(--p-message-warn-shadow);'>
            <div class='p-message-content' style='justify-content: center;'>
                Cliente suspeito de fraude
            </div>
        </div>

        <p-tabs value="0">
            <p-tablist>
                <p-tab value="0"><i class="pi pi-user"></i> Dados</p-tab>
                <p-tab value="1"><i class="pi pi-list"></i> Histórico de acompanhamentos</p-tab>
            </p-tablist>
            <p-tabpanels>

                <p-tabpanel value="0">
                    <form [formGroup]="customerForm" (ngSubmit)="onSubmit()">
                        <button id="btn_submit" style='display:none;' type="submit"></button>

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
                                <label for="Phone" class="block font-bold mb-3">Telefone</label>
                                <p-inputmask mask="99-99999-9999" class="w-full md:w-[30rem] mb-2" formControlName="Phone" placeholder="49-99999-9999" fluid />
                                
                                <div class="error-feedback" *ngIf="hasBeenSubmited('Phone')">
                                    <p-message styleClass="mb-2" *ngIf="customerForm.controls.Phone.hasError('required')" severity="error" variant="simple" size="small">Por favor, digitar o telefone do cliente</p-message>
                                </div>
                            </div>


                        </div>

                        <div class='row'>
                            <div class='col-md-2'>
                                <label for="PfPj" class="block font-bold mb-3">Tipo de cliente</label>
                                <p-select [invalid]="isInvalid('PfPj')" [options]="TypeClient" formControlName="PfPj" optionLabel="name" placeholder="Selecione o tipo do cliente" class="w-full mb-2" />
                            
                                @if (isInvalid('PfPj')) {
                                    <p-message severity="error" size="small" variant="simple">Por favor, selecione se o tipo do cliente</p-message>
                                }
                            </div>

                            <div class='col-md-4'>
                                <label for="Cpf" class="block font-bold mb-3">CPF</label>
                                <p-inputmask mask="999.999.999-99" class="w-full md:w-[30rem] mb-2" formControlName="Cpf" placeholder="999.999.999-99" fluid  />

                            </div>

                            <div class='col-md-4'>
                                <label for="Cnpj" class="block font-bold mb-3">CNPJ</label>
                                <p-inputmask mask="99.999.999/9999-99" class="w-full md:w-[30rem] mb-2" formControlName="Cnpj" placeholder="99.999.999/9999-99" fluid  />

                            </div>

                            <div class='col-md-2'>
                                <label for="Birthday" class="block font-bold mb-3">Aniversário</label>
                                <p-datepicker formControlName="Birthday" dateFormat="dd/mm/yy" required fluid />

                            </div>

                        </div>

                        <div class='row'>
                            <div class='col-md-6'>
                                <label for="Cep" class="block font-bold mb-3">Cep</label>
                                <p-inputmask mask="99999-999" class="w-full md:w-[30rem] mb-2" formControlName="Cep" placeholder="99999-999" fluid  />

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
                                <p-select [invalid]="isInvalid('State')" [options]="BrStates" formControlName="State" optionLabel="name" placeholder="Selecione o estado do cliente" class="w-full mb-2" />
                            
                                @if (isInvalid('State')) {
                                    <p-message severity="error" size="small" variant="simple">Por favor, selecione o estado do cliente</p-message>
                                }
                            </div>

                        </div>

                        <div class='row'>
                            <div class='col-md-4'>
                                <label class="block font-bold mb-3">Cliente com suspeita de fraude?</label>
                                <p-select [invalid]="isInvalid('FraudSuspect')" [options]="fraudSuspect" formControlName="FraudSuspect" optionLabel="name" placeholder="Selecione o estado do cliente" class="w-full mb-2" />
                            
                                @if (isInvalid('FraudSuspect')) {
                                    <p-message severity="error" size="small" variant="simple">Por favor, selecione o estado do cliente</p-message>
                                }
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

                        <p-fieldset legend="Detalhes de Interesse do Cliente - Informações da última negociação" [toggleable]="true">
                            <div class='row'>
                                <div class='col-md-4'>
                                    <label for="" class="block font-bold mb-3">Qualificado?</label>

                                    <p-select  [options]="qualified" formControlName="Qualified" optionLabel="name" placeholder="Selecione se o lead é qualificado ou não" class="w-full mb-2" />
                                </div>

                                <div *ngIf="showQualifiedDiv" class='col-md-8'>
                                    <label for="" class="block font-bold mb-3">Tipo de qualificação</label>
                                    <p-select  [options]="qualifiedType" formControlName="QualifiedType" optionLabel="name" placeholder="Selecione o tipo de qualificação" class="w-full mb-2" />
                                
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
                                    

                                </div>

                                <div class='col-md-4'>
                                    <label for="BoatCapacity" class="block font-bold mb-3">Capacidade da embarcação</label>
                                    <p-inputnumber  [useGrouping]="false" class="w-full mb-2" formControlName="BoatCapacity" placeholder="*" />
                                    

                                </div>

                            </div>

                            <div class='row'> 
                                <div class='col-md-2'>
                                    <label for="" class="block font-bold mb-3">Embarcação nova/usada</label>
                                    <p-select [invalid]="isInvalid('NewUsed')" [options]="NewUsed" formControlName="NewUsed" optionLabel="name" placeholder="Selecione o tipo da embarcação" class="w-full mb-2" />
                                

                                </div>

                                <div class='col-md-2'>
                                    <label for="" class="block font-bold mb-3">Embarcação cabinada/aberta</label>
                                    <p-select [invalid]="isInvalid('CabinatedOpen')" [options]="CabinatedOpen" formControlName="CabinatedOpen" optionLabel="name" placeholder="Selecione o tipo da embarcação" class="w-full mb-2" />
                                
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
    fraudSuspect: SelectItem[] = [{ name: 'Sim', code: 'Y' }, { name: 'Não', code: 'N' }]

    CabinatedOpen: SelectItem[] = [ { name: 'Aberta', code: 'A' }, { name: 'Cabinada', code: 'C' }]
    NewUsed: SelectItem[] = [{ name: 'Nova', code: 'N' }, { name: 'Usada', code: 'U' }]
    qualifiedType: SelectItem[] = [
        { name: 'Muito decidido. Intenção clara de compra imediata', code: 'A' }, 
        { name: 'Interesse real, mas precisa de mais informação', code: 'B' }, 
        { name: 'Inicio de pesquisa, médio/longo prazo', code: 'C' }
    ]
    BrStates = BrStates

    isLoading: boolean = false
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

        Qualified: [{value: '', disabled: true}, []],
        QualifiedType: [{value: '', disabled: true}, []],

        FraudSuspect: ['', [Validators.required]],


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

        // ComMeanName: ['', [Validators.required]],
        // ComMeanId: ['', [Validators.required]],
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
        this.submitted = true

        const ctrl = this.customerForm.get('Birthday')
        ctrl?.clearValidators()
        ctrl?.updateValueAndValidity()
        
        if (this.customerForm.valid) {
            this.isLoading = true

            const save_state = this.customerForm?.value?.State
            const save_pfpj = this.customerForm?.value?.PfPj
            const save_hasboat = this.customerForm?.value?.HasBoat
            const save_fraudsuspect = this.customerForm?.value?.FraudSuspect   
            // @ts-ignore
            this.customerForm.get("State")?.setValue(this.customerForm?.value?.State?.code)
            // @ts-ignore
            this.customerForm.get("PfPj")?.setValue(this.customerForm?.value?.PfPj?.code)
            // @ts-ignore
            this.customerForm.get("HasBoat")?.setValue(this.customerForm?.value?.HasBoat?.code)
            // @ts-ignore
            this.customerForm.get("FraudSuspect")?.setValue(this.customerForm?.value?.FraudSuspect?.code)

            this.salesService.updateCustomer(this.id, this.customerForm.value).pipe(finalize(() => { 
                // @ts-ignore
                this.customerForm.get("State")?.setValue(save_state)
                // @ts-ignore
                this.customerForm.get("PfPj")?.setValue(save_pfpj)
                // @ts-ignore
                this.customerForm.get("HasBoat")?.setValue(save_hasboat)
                // @ts-ignore
                this.customerForm.get("FraudSuspect")?.setValue(save_fraudsuspect)
             })).subscribe({
                next: (res: any) => {
                    this.messageService.add({ severity: 'success', summary: "Sucesso", detail: 'Cliente atualizado(a) com sucesso' });
                    //this.loadCommunicationMeans()
                    
                    this.submitted = false
                    this.isLoading = false

                    

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

    loadCustomer(id: string){
        this.salesService.getCustomer(id).pipe(finalize(() => { this.isLoading = false })).subscribe({
            next: (res: any) => {
                if(res.data['qualified_type']?.trimEnd() == 'A'){
                    //@ts-ignore
                    this.customerForm.get("QualifiedType")?.setValue(this.qualifiedType[0])
                } else if(res.data['qualified_type']?.trimEnd() == 'B'){
                    //@ts-ignore
                    this.customerForm.get("QualifiedType")?.setValue(this.qualifiedType[1])
                } else {
                    //@ts-ignore
                    this.customerForm.get("QualifiedType")?.setValue(this.qualifiedType[2])
                }

                if(res.data['cabinated_open']?.trimEnd() == 'A'){
                    //@ts-ignore
                    this.customerForm.get("CabinatedOpen")?.setValue(this.CabinatedOpen[0])
                } else {
                    //@ts-ignore
                    this.customerForm.get("CabinatedOpen")?.setValue(this.CabinatedOpen[1])
                }

                if(res.data['new_used']?.trimEnd() == 'N'){
                    //@ts-ignore
                    this.customerForm.get("NewUsed")?.setValue(this.NewUsed[0])
                } else {
                    //@ts-ignore
                    this.customerForm.get("NewUsed")?.setValue(this.NewUsed[1])
                }

                if(res.data['pf_pj']?.trimEnd() == 'PF'){
                    //@ts-ignore
                    this.customerForm.get("PfPj")?.setValue(this.TypeClient[0])
                } else if(res.data['pf_pj']?.trimEnd() == 'PJ'){
                    //@ts-ignore
                    this.customerForm.get("PfPj")?.setValue(this.TypeClient[1])
                } else {
                    //@ts-ignore
                    this.customerForm.get("PfPj")?.setValue('')
                }

                if(res.data['state'] !== null){
                    BrStates.forEach(element => {
                        if(element.code == res.data['state']?.trimEnd()){
                            //@ts-ignore
                            this.customerForm.get("State")?.setValue(element)
                        }
                    })
                } 

                this.customerForm.get("Cpf")?.setValue(res.data['cpf'])
                this.customerForm.get("Cnpj")?.setValue(res.data['cnpj'])


                this.customerForm.get("Name")?.setValue(res.data['customer_name'])
                this.customerForm.get("Email")?.setValue(res.data['customer_email'])
                this.customerForm.get("Phone")?.setValue(res.data['customer_phone'])

                this.customerForm.get("NavigationCity")?.setValue(res.data['customer_nav_city'])
                this.customerForm.get("BoatCapacity")?.setValue(res.data['boat_cap_needed'])
                this.customerForm.get("CustomerCity")?.setValue(res.data['customer_city'])


                this.customerForm.get("Cep")?.setValue(res.data['cep'])
                this.customerForm.get("Neighborhood")?.setValue(res.data['neighborhood'])
                this.customerForm.get("Street")?.setValue(res.data['street'])
                this.customerForm.get("Complement")?.setValue(res.data['complement'])
                this.customerForm.get("City")?.setValue(res.data['city'])

                if(res.data['birthdate']){
                    //@ts-ignore
                    this.customerForm.get("Birthday")?.setValue(new Date(Date.parse(res.data['birthdate'])))
                }


                // this.customerForm.get("ComMeanName")?.setValue(res.data['com_name'])
                // this.customerForm.get("ComMeanId")?.setValue(res.data['id_mean_communication'])
                this.customerForm.get("EstimatedValue")?.setValue(res.data['estimated_value'])

                //@ts-ignore
                this.customerForm.get("HasBoat")?.setValue(res.data['has_boat'] == "S" ? this.HasBoat[0] : this.HasBoat[1])
                this.customerForm.get("WhichBoat")?.setValue(res.data['has_boat_which'])
                //@ts-ignore
                this.customerForm.get("MinPesBoat")?.setValue(parseInt(res.data['boat_length_min']) ?? null)
                //@ts-ignore
                this.customerForm.get("MaxPesBoat")?.setValue(parseInt(res.data['boat_length_max']) ?? null)

                this.customerForm.get("UserName")?.setValue(res.data['seller_name'])

                this.customerForm.get("UserId")?.setValue(res.data['user_id'])
                //@ts-ignore
                this.customerForm.get("Qualified")?.setValue(res.data['qualified'] == "S" ? this.qualified[0] : this.qualified[1])
                //@ts-ignore
                this.customerForm.get("FraudSuspect")?.setValue(res.data['suspect_of_fraud'] == "Y" ? this.fraudSuspect[0] : this.fraudSuspect[1])
                
            },
            error: (err) => {
                if (err.status) {
                    this.messageService.add({ severity: 'error', summary: "Erro", detail: 'Ocorreu um erro ao buscar dados do cliente.' });
                }
            },
        })
    }

    showCustomer(id: string) {
        this.visible = true
        this.id = id

        this.myDialog.maximizable = true
        this.myDialog.maximize()
        this.negotiationHistory.loadNegotiationHistory(this.id)
        this.loadCustomer(this.id)
    }

    get showHasWhichBoat(): boolean {
        const c: any = this.customerForm.get('HasBoat')
        if(c?.value?.code == 'S'){
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

    get showFraudDiv(): boolean {
        const c: any = this.customerForm.get('FraudSuspect')
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

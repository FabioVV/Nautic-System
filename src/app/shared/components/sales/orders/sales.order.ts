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
import { AutoCompleteModule, AutoCompleteCompleteEvent } from 'primeng/autocomplete';
import { InputGroupModule } from 'primeng/inputgroup';

import { BrStates, SelectItem } from '../../utils';
import { SalesService } from '../../../services/sales.service';
import { UserService } from '../../../services/user.service';
import { EngineService } from '../../../services/engine.service';
import { BoatService } from '../../../services/boats.service';
import { formatBRLMoney } from '../../utils';


@Component({
    selector: 'open-sales-order',
    imports: [DialogModule, TagModule, AutoCompleteModule, InputGroupModule, TabsModule, CardModule, DatePickerModule, InputMaskModule, InputNumberModule, InputGroupAddonModule, TextareaModule, FieldsetModule, MessageModule, ButtonGroupModule, ConfirmDialogModule, TableModule, SelectModule, ToastModule, InputIconModule, InputTextModule, IconFieldModule, DataViewModule, RippleModule, ButtonModule, CommonModule, FormsModule, ReactiveFormsModule, PaginatorModule],
    providers: [MessageService, ConfirmationService],
    styleUrls: [],
    standalone: true,

    template: `
    <p-toast></p-toast>

    <p-dialog #cdialog [header]="title" [modal]="true" [(visible)]="visible" [style]="{ width: '50rem' }" [breakpoints]="{ '1199px': '75vw', '575px': '90vw' }" >

        <div class='ped-total'>
            <div>
                <h4>Avisos</h4>
                <div class='p-message-content' style='justify-content: center;'>
                    <p-button severity="warn" type="submit" label="Clique aqui para ver avisos sobre este pedido" (click)="orderProblems()" icon="pi pi-exclamation-triangle" />
                </div>
            </div>

            <div>
                <h4>Status</h4>
                <p-tag severity="success" [value]="_statusType" />
            </div>

            <div>
                <h4>Total do pedido</h4>
                <p-tag severity="success" value="R$ 1.000.000,00" />
            </div>
        </div>

        <p-tabs value="0">
            <p-tablist>
                <p-tab value="0"><i class="pi pi-user"></i> Cliente</p-tab>
                <p-tab value="1"><i class="pi pi-list"></i> Pedido</p-tab>
                <p-tab value="2"><i class="pi pi-list"></i> Arquivos</p-tab>

            </p-tablist>
            <p-tabpanels>

                <p-tabpanel value="0">
                    <form [formGroup]="salesOrderForm" >
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
                                <label class="block font-bold mb-3">Código</label>
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


                    </form>
                </p-tabpanel>

                <p-tabpanel value="1">

                    <div class='row'>
                        <div class='col-md-12'>
                            <label for="Details" class="block font-bold mb-3">Total do Pedido</label>
                            <p style='font-size:3em; color:green;'>R$ 1.000.000,00</p>
                        </div>
                    </div>

                    <div class='row'>

                        <div class='col-md-6'>
                            <form [formGroup]="formBoat" style='margin-bottom: 4rem;'>

                                <div class='row'>
                                    <div style='margin-bottom:1rem;' class='col-md-12'>
                                        <label for="AccessoryModel" class="block font-bold mb-3">Casco do pedido</label>

                                        <p-inputgroup>
                                            <p-inputgroup-addon pTooltip="Digite na caixa ao lado para pesquisar" tooltipPosition="top" [style]="{ cursor:'help' }">
                                                <i class="pi pi-filter"></i>
                                            </p-inputgroup-addon>

                                            <p-autocomplete class="w-full mb-2" formControlName="BoatModel" placeholder="Procure pelo casco" [suggestions]="autoFilteredValueBoat" optionLabel="model" (completeMethod)="filterClassAutocompleteBoat($event)" (onSelect)="setBoatChoosen($event)" />
                                        </p-inputgroup>

                                        
                                        <div class="error-feedback" *ngIf="hasBeenSubmited('BoatModel')">
                                            <p-message styleClass="mb-2" *ngIf="formBoat.controls.BoatModel.hasError('required')" severity="error" variant="simple" size="small">Por favor, escolher um casco</p-message>
                                        </div>
                                    </div>

                                    <p-button type="submit" label="Salvar casco" (click)="onSubmitBoat()" icon="pi pi-check" />
                                </div>

                                <hr />

                                <div *ngIf="salesOrderForm.get('BoatModel')?.value" class='card-cs'>
                                    <div>
                                        <h4>{{ formBoat.get('BoatModel')?.value }}</h4>
                                        <p-tag severity="success" [value]="_formatBRLMoney(formBoat.get('BoatPrice')?.value)" />

                                    </div>
                                </div>

                                <hr />
                            </form>
                        </div>

                        <div class='col-md-6'>
                            <form [formGroup]="formEng" style='margin-bottom: 4rem;'>
                                
                                <div class='row'>
                                    <div style='margin-bottom:1rem;' class='col-md-12'>
                                        <label for="AccessoryModel" class="block font-bold mb-3">Motor do casco</label>

                                        <p-inputgroup>
                                            <p-inputgroup-addon pTooltip="Digite na caixa ao lado para pesquisar" tooltipPosition="top" [style]="{ cursor:'help' }">
                                                <i class="pi pi-filter"></i>
                                            </p-inputgroup-addon>

                                            <p-autocomplete class="w-full mb-2" formControlName="EngineModel" placeholder="Procure pelo motor" [suggestions]="autoFilteredValueEng" optionLabel="model" (completeMethod)="filterClassAutocompleteEng($event)" (onSelect)="setEngineChoosen($event)" />
                                        </p-inputgroup>

                                        
                                        <div class="error-feedback" *ngIf="hasBeenSubmitedEngine('EngineModel')">
                                            <p-message styleClass="mb-2" *ngIf="formEng.controls.EngineModel.hasError('required')" severity="error" variant="simple" size="small">Por favor, escolher um motor</p-message>
                                        </div>
                                    </div>

                                    <p-button type="submit" label="Salvar motor" (click)="onSubmitEngine()" icon="pi pi-check" />
                                </div>

                                <hr />

                                <div *ngIf="salesOrderForm.get('EngineModel')?.value" class='card-cs'>
                                    <div>
                                        <h4>{{ formEng.get('EngineModel')?.value }}</h4>
                                        <p-tag severity="success" [value]="_formatBRLMoney(formEng.get('EnginePrice')?.value)" />
                                    </div>
                                </div>

                                <hr />
                            </form>
                        </div>
                    
                    </div>

                    <form [formGroup]="salesOrderFormExtra" (ngSubmit)="onSubmit()">
                        <div class='row'>
                            <div class='col-md-12'>
                                <label for="Details" class="block font-bold mb-3">Detalhes do pedido</label>
                                <textarea  class="w-full mb-2" rows="5" cols="30" pTextarea formControlName="Details"></textarea>
                            </div>
                        </div>
                    </form>



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
        private engineService: EngineService,
        private boatService: BoatService,
    ) { }

    BrStates = BrStates

    @ViewChild('cdialog') myDialog!: Dialog
    @Input() title: any


    isLoading: boolean = false
    submitted: boolean = false
    visible: boolean = false
    id: string = ""
    TypeClient: SelectItem[] = [{ name: 'Pessia física', code: 'PF' }, { name: 'Pessoa juridica', code: 'PJ' }]

    autoFilteredValueEng: any[] = []
    autoFilteredValueBoat: any[] = []

    _statusType: string = ""

    salesOrderFormExtra = this.formBuilder.group({
        Details: ['', []],
    })

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
        StatusType: [{value: '', disabled: true}, []],

        BoatModel: [{value: '', disabled: true}, []],
        BoatId: [{value: '', disabled: true}, []],
        BoatPrice: [{value: 0.0, disabled: true}, []],

        EngineModel: [{value: '', disabled: true}, []],
        EngineId: [{value: '', disabled: true}, []],
        EnginePrice: [{value: 0.0, disabled: true}, []],


        Details: ['', []],
    })

    formBoat = this.formBuilder.group({
        BoatModel: ['', []],
        BoatId: ['', []],
        BoatPrice: [0.0, []],
    })

    formEng = this.formBuilder.group({
        EngineModel: ['', []],
        EngineId: ['', []],
        EnginePrice: [0.0, []],
    })

    submit() {
        document.getElementById(`btn_submit`)?.click()
    }

    ngOnInit() {

    }

    onSubmit(){
        this.submitted = true

    }

    onSubmitBoat(){
        this.submitted = true

        if (this.formBoat.valid) {
            this.isLoading = true

            // @ts-ignore
            this.salesService.insertBoatSalesOrder(this.id, this.formBoat?.value.BoatId).subscribe({
                next: (res: any) => {
                    this.messageService.add({ severity: 'success', summary: "Sucesso", detail: 'Casco vinculado com sucesso' })
                    this.loadSalesOrder(this.id)
                }, 
                error: (err) => {
                    this.messageService.add({ severity: 'error', summary: "Erro", detail: 'Ocorreu um erro ao tentar adicionar o casco' })
                },
            })
            
        }
    }

    onSubmitEngine(){
        this.submitted = true

        if (this.formBoat.valid) {
            this.isLoading = true

            // @ts-ignore
            this.salesService.insertEngineSalesOrder(this.id, this.formEng?.value.EngineId).subscribe({
                next: (res: any) => {
                    this.messageService.add({ severity: 'success', summary: "Sucesso", detail: 'Motor vinculado com sucesso' })
                    this.loadSalesOrder(this.id)

                }, 
                error: (err) => {
                    this.messageService.add({ severity: 'error', summary: "Erro", detail: 'Ocorreu um erro ao tentar adicionar o motor' })
                },
            })
            
        }
    }

    loadSalesOrder(id: string){
        this.salesService.getSalesOrder(id).subscribe({
            next: (res: any) => {
                //@ts-ignore
                this.salesOrderForm.get("Id")?.setValue(res.data['id'])
                this.salesOrderForm.get("SellerName")?.setValue(res.data['seller_name'])
                this.salesOrderForm.get("CustomerName")?.setValue(res.data['customer_name'])
                this.salesOrderForm.get("Cep")?.setValue(res.data['Cep'])
                this.salesOrderForm.get("Street")?.setValue(res.data['Street'])
                this.salesOrderForm.get("Neighborhood")?.setValue(res.data['Neighborhood'])
                this.salesOrderForm.get("City")?.setValue(res.data['City'])
                this.salesOrderForm.get("Complement")?.setValue(res.data['Complement'])
                this.salesOrderForm.get("Cpf")?.setValue(res.data['Cpf'])
                this.salesOrderForm.get("Cnpj")?.setValue(res.data['Cnpj'])
                this.salesOrderForm.get("StatusType")?.setValue(res.data['status_type'])
                this._statusType = res.data['status_type']

               // this.salesOrderForm.get("Details")?.setValue(res.data['details'])
                if(res.data['PfPj']?.trimEnd() == 'PF'){
                    //@ts-ignore
                    this.salesOrderForm.get("PfPj")?.setValue(this.TypeClient[0])
                } else if(res.data['PfPj']?.trimEnd() == 'PJ'){
                    //@ts-ignore
                    this.salesOrderForm.get("PfPj")?.setValue(this.TypeClient[1])
                } else {
                    //@ts-ignore
                    this.salesOrderForm.get("PfPj")?.setValue('')
                }

                if(res.data['State'] !== null){
                    BrStates.forEach(element => {
                        if(element.code == res.data['State']?.trimEnd()){
                            //@ts-ignore
                            this.salesOrderForm.get("State")?.setValue(element)
                        }
                    })
                } 

                this.formBoat.get("BoatModel")?.setValue(res.data['OrderBoatModel'])
                this.formBoat.get("BoatId")?.setValue(res.data['OrderBoatId'])
                this.formBoat.get("BoatPrice")?.setValue(res.data['OrderBoatPrice'])

                this.formEng.get("EngineModel")?.setValue(res.data['OrderEngineModel'])
                this.formEng.get("EngineId")?.setValue(res.data['OrderEngineId'])
                this.formEng.get("EnginePrice")?.setValue(res.data['OrderEnginePrice'])
                        
                this.salesOrderForm.get("BoatModel")?.setValue(res.data['OrderBoatModel'])
                this.salesOrderForm.get("BoatId")?.setValue(res.data['OrderBoatId'])
                this.salesOrderForm.get("BoatPrice")?.setValue(res.data['OrderBoatPrice'])

                this.salesOrderForm.get("EngineModel")?.setValue(res.data['OrderEngineModel'])
                this.salesOrderForm.get("EngineId")?.setValue(res.data['OrderEngineId'])
                this.salesOrderForm.get("EnginePrice")?.setValue(res.data['OrderEnginePrice'])

            }, 
            error: (err) => {
                this.messageService.add({ severity: 'error', summary: "Erro", detail: 'Ocorreu um erro ao tentar buscar pedido de venda' })
            },
        })
    }

    orderProblems(){

    }

    showSalesOrder(id: string, title: string) {
        this.visible = true
        this.id = id

        this.myDialog.maximizable = true
        this.myDialog.maximize()
        this.loadSalesOrder(this.id)
        this.title = title
    }

    filterClassAutocompleteBoat(event: AutoCompleteCompleteEvent){
        const filtered: any[] = []
        const query = event.query   

        this.boatService.getBoats(1, 1000).subscribe({
            next: (res: any) => {
               // this.accessories.set(res.data)

                for (let i = 0; i < res?.data?.length; i++) {
                    const acc = res?.data[i]
                    if (acc?.model?.toLowerCase().indexOf(query.toLowerCase()) == 0) {
                        filtered.push(acc)
                    }
                }

                this.autoFilteredValueBoat = filtered
            }, 
            error: (err) => {
                this.messageService.add({ severity: 'error', summary: "Erro", detail: 'Ocorreu um erro ao buscar os cascos.' });
            },
        })
    }

    filterClassAutocompleteEng(event: AutoCompleteCompleteEvent){
        const filtered: any[] = []
        const query = event.query   

        this.engineService.getEngines(1, 1000, query, "Y").subscribe({
            next: (res: any) => {
                //this.engines.set(res.data)

                for (let i = 0; i < res?.data?.length; i++) {
                    const eng = res?.data[i]
                    if (eng?.model?.toLowerCase().indexOf(query.toLowerCase()) == 0) {
                        filtered.push(eng)
                    }
                }

                this.autoFilteredValueEng = filtered

            }, 
            error: (err) => {
                this.messageService.add({ severity: 'error', summary: "Erro", detail: 'Ocorreu um erro ao buscar os acessórios.' });
            },
        })
    }

    setBoatChoosen(e: any){
        //@ts-ignore
        this.formBoat.get("BoatModel")?.setValue(e.value.model)
        //@ts-ignore
        this.formBoat.get("BoatId")?.setValue(e.value.id)
    }

    setEngineChoosen(e: any){
        //@ts-ignore
        this.formEng.get("EngineModel")?.setValue(e.value.model)
        //@ts-ignore
        this.formEng.get("EngineId")?.setValue(e.value.id)
    }

    _formatBRLMoney(amount: number){
        return formatBRLMoney(amount.toString())
    }

    isInvalid(controlName: string) {
        const control = this.salesOrderForm.get(controlName)
        return control?.invalid && (control.touched || this.submitted)
    }

    hasBeenSubmitedEngine(controlName: string): boolean {
        const control = this.formEng.get(controlName)
        return Boolean(control?.invalid)
            && (this.submitted || Boolean(control?.touched))
        //|| Boolean(control?.dirty
    }

    hasBeenSubmitedBoat(controlName: string): boolean {
        const control = this.salesOrderForm.get(controlName)
        return Boolean(control?.invalid)
            && (this.submitted || Boolean(control?.touched))
        //|| Boolean(control?.dirty
    }

    hasBeenSubmited(controlName: string): boolean {
        const control = this.salesOrderForm.get(controlName)
        return Boolean(control?.invalid)
            && (this.submitted || Boolean(control?.touched))
        //|| Boolean(control?.dirty
    }
}

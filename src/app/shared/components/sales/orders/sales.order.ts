import { CommonModule } from '@angular/common';
import { Component, computed, inject, Input, signal, ViewChild } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
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
import { FileUploadModule } from 'primeng/fileupload';
import { ImageModule } from 'primeng/image';

import { BrStates, SelectItem } from '../../utils';
import { SalesService } from '../../../services/sales.service';
import { UserService } from '../../../services/user.service';
import { EngineService } from '../../../services/engine.service';
import { BoatService } from '../../../services/boats.service';
import { formatBRLMoney } from '../../utils';
import { ListSalesOrderBoatItensComponent } from './list.sales.order_itens';

@Component({
    selector: 'open-sales-order',
    imports: [DialogModule, TagModule, FileUploadModule, ImageModule, AutoCompleteModule, ListSalesOrderBoatItensComponent, InputGroupModule, TabsModule, CardModule, DatePickerModule, InputMaskModule, InputNumberModule, InputGroupAddonModule, TextareaModule, FieldsetModule, MessageModule, ButtonGroupModule, ConfirmDialogModule, TableModule, SelectModule, ToastModule, InputIconModule, InputTextModule, IconFieldModule, DataViewModule, RippleModule, ButtonModule, CommonModule, FormsModule, ReactiveFormsModule, PaginatorModule],
    providers: [MessageService, ConfirmationService],
    styleUrls: [],
    standalone: true,

    template: `
    <p-toast></p-toast>

    <p-dialog #cdialog [header]="title" [modal]="true" [(visible)]="visible" [style]="{ width: '50rem' }" [breakpoints]="{ '1199px': '75vw', '575px': '90vw' }" >

        <div class='ped-total'>
            <div style='display:none;'> <!-- TODO -->
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
                <p-tag severity="success" [value]="TotalOrder" />
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
                                <div class='col-md-4'>
                                    <label class="block font-bold mb-3">Tipo de pessoa</label>
                                    <p-select  [options]="TypeClient" formControlName="PfPj" optionLabel="name" placeholder="Selecione o tipo do cliente" class="w-full mb-2" />

                                </div>

                                <div class='col-md-4'>
                                    <label class="block font-bold mb-3">CPF</label>
                                    <input formControlName="Cpf" class="w-full md:w-[30rem] mb-2" type="text" pInputText id="Type" required autofocus fluid />

                                </div>

                                
                                <div class='col-md-4'>
                                    <label class="block font-bold mb-3">CNPJ</label>
                                    <input formControlName="Cnpj" class="w-full md:w-[30rem] mb-2" type="text" pInputText id="Type" required autofocus fluid />

                                </div>
                            </div>


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
                            <p style='font-size:3em; color:green;'>{{ TotalOrder }}</p>
                        </div>
                    </div>

                    <div class='row'>

                        <div class='col-md-6'>
                            <form [formGroup]="formBoat" style='margin-bottom: 1rem;'>

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

                                    <p-button *ngIf="!SalesOrderCancelled" type="submit" label="Salvar casco" (click)="onSubmitBoat()" icon="pi pi-check" />
                                </div>

                                <hr />

                                <div *ngIf="salesOrderForm.get('BoatModel')?.value" class='card-cs'>
                                    <div>
                                        <h4>{{ formBoat.get('BoatModel')?.value }}</h4>
                                        <p-tag severity="success" [value]="TotalPriceBoat" />

                                    </div>
                                </div>

                                <hr />
                            </form>
                        </div>

                        <div *ngIf="salesOrderForm.get('BoatModel')?.value" class='col-md-6'>
                            <form [formGroup]="formEng" style='margin-bottom: 1rem;'>
                                
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

                                    <p-button *ngIf="!SalesOrderCancelled" type="submit" label="Salvar motor" (click)="onSubmitEngine()" icon="pi pi-check" />
                                </div>

                                <hr />

                                <div *ngIf="salesOrderForm.get('EngineModel')?.value" class='card-cs'>
                                    <div>
                                        <h4>{{ formEng.get('EngineModel')?.value }}</h4>
                                        <p-tag severity="success" [value]="TotalPriceEngine" />
                                    </div>
                                </div>

                                <hr />
                            </form>
                        </div>
                    
                    </div>

                    <div class='row'>
                        <div *ngIf="salesOrderForm.get('BoatModel')?.value" class='col-md-12'>
                            <form [formGroup]="formAcc" style='margin-bottom: 1rem;'>
                                
                                <div class='row'>
                                    <div style='margin-bottom:1rem;' class='col-md-12'>
                                        <label for="AccessoryModel" class="block font-bold mb-3">Acessórios da embarcação</label>

                                        <p-inputgroup>
                                            <p-inputgroup-addon pTooltip="Digite na caixa ao lado para pesquisar" tooltipPosition="top" [style]="{ cursor:'help' }">
                                                <i class="pi pi-filter"></i>
                                            </p-inputgroup-addon>

                                            <p-autocomplete class="w-full mb-2" formControlName="AccessoryModel" placeholder="Procure pelo acessório" [suggestions]="autoFilteredValueAcc" optionLabel="model" (completeMethod)="filterClassAutocompleteAcc($event)" (onSelect)="setAccessoryChoosen($event)" />
                                        </p-inputgroup>

                                        <div class="error-feedback" *ngIf="hasBeenSubmitedAccessory('AccessoryModel')">
                                            <p-message styleClass="mb-2" *ngIf="formAcc.controls.AccessoryModel.hasError('required')" severity="error" variant="simple" size="small">Por favor, escolher um acessório</p-message>
                                        </div>
                                    </div>

                                    <p-button *ngIf="!SalesOrderCancelled" type="submit" label="Salvar acessório" (click)="onSubmitAccessory()" icon="pi pi-check" />
                                </div>

                            </form>
                        </div>
                    </div>

                    <list-sales-orders-boat-itens [SalesOrderCancelled]="SalesOrderCancelled" [reloadSalesOrder]="this.loadSalesOrder" #listSalesOrderBoatItens></list-sales-orders-boat-itens>

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
                    <div *ngIf="!SalesOrderCancelled" class="card flex flex-wrap gap-6 items-center justify-between">
                        <p-fileupload #fu mode="basic" customUpload chooseLabel="Escolha o arquivo" chooseIcon="pi pi-upload" name="file[]" accept="image/*,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain,.doc,.docx,.pdf,.txt" maxFileSize="1000000000" (uploadHandler)="onUpload($event)"></p-fileupload>
                        <p-button label="Enviar arquivo" (onClick)="fu.upload()" severity="secondary" [style]="{'text-align': 'center'}"></p-button>
                    </div>

                    <div class="container">
                        <div class="row">
                            <ng-container *ngFor="let f of salesOrderFiles(); let i = index">

                            <div class="col-6 col-sm-4 col-md-3 mb-4">
                                <select [disabled]="SalesOrderCancelled" style='padding:1rem; border:1px solid black; border-radius:4px;' (change)="changeFileType(f.id, $event)" [(ngModel)]="f.type">
                                    <option *ngFor="let type of FileSoTypes" [value]="type.code">{{ type.name }}</option>
                                </select>

                                <div class="card h-100">
                                    <ng-container [ngSwitch]="fileType(f.path)">
                                        <!-- Images -->
                                        <ng-container *ngSwitchCase="'image'">
                                            <p-image [src]="f.path" alt="Image" width="250" [preview]="true"></p-image>
                                        </ng-container>

                                        <!-- PDF -->
                                        <ng-container *ngSwitchCase="'pdf'">
                                        <div style="height:160px; overflow:hidden;">
                                            <embed [src]="safeUrl(f.path)" type="application/pdf" width="100%" height="160px" />
                                        </div>
                                        </ng-container>

                                        <!-- Other files -->
                                        <ng-container *ngSwitchDefault>
                                        <div class="d-flex align-items-center justify-content-center" style="height:160px;">
                                            <img src="/assets/file.jpg" alt="file" style="width:64px;height:64px;">
                                        </div>
                                        </ng-container>
                                    </ng-container>

                                    <div class="card-body p-2">
                                        <div class="d-flex justify-content-between">
                                        <p-buttongroup *ngIf="!SalesOrderCancelled">
                                            <p-button (click)="removeFile(f.id)" severity="danger" icon="pi pi-trash" rounded></p-button>
                                            <p-button (click)="downloadFile(f.path)" severity="info" icon="pi pi-download" rounded></p-button>
                                        </p-buttongroup>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            </ng-container>
                        </div>
                    </div>

                </p-tabpanel>
                
            </p-tabpanels>
        </p-tabs>

        <ng-template #footer>
            <!-- <p-button type="submit" label="Salvar" (click)="submit()" icon="pi pi-check" id="action-acom-button"/> -->

            <p-button (click)="cancelOrder()" *ngIf="!SalesOrderCancelled" severity="danger" label="Cancelar pedido/Orçamento" />

            <p-button (click)="upgradeToActualSalesOrder()" *ngIf="salesOrderForm.get('StatusType')?.value == 'Novo orçamento'" severity="success" label="Transformar em pedido" />

            <p-button *ngIf="!SalesOrderCancelled" severity="success" label="Gerar PDF" icon="pi pi-file-pdf"  />
            <p-button *ngIf="!SalesOrderCancelled" severity="success" label="Compartilhar via E-mail" icon="pi pi-send" />
            <p-button *ngIf="!SalesOrderCancelled" severity="success" label="Compartilhar Via WhatsApp" icon="pi pi-send" />

        </ng-template>
    </p-dialog>

    <p-confirmdialog
        [rejectLabel]="rejectLabel"
        [acceptLabel]="confirmLabel"
        [acceptAriaLabel]="confirmLabel"
        [rejectAriaLabel]="rejectLabel"
        [style]="{ width: '450px' }"
    />
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
        private confirmationService: ConfirmationService,
        private sanitizer: DomSanitizer
    ) {}

    confirmLabel = "Confirmar"
    rejectLabel = "Cancelar"
    BrStates = BrStates
    @Input() title: any

    @ViewChild('cdialog') myDialog!: Dialog
    @ViewChild('listSalesOrderBoatItens') listSalesOrderBoatItens!: ListSalesOrderBoatItensComponent
    @ViewChild('fu') fileUploader!: any

    salesOrderFiles = signal<any[]>([])

    // @ts-ignore
    get TotalPriceEngine() { return `${this._formatBRLMoney(this.formEng.get('EnginePrice')?.value)}` }
    // @ts-ignore
    get TotalPriceBoat() { return `${this._formatBRLMoney(this.formBoat.get('BoatPrice')?.value)}` }
    // @ts-ignore
    get TotalOrder() { return `${this._formatBRLMoney(this.formEng?.get('EnginePrice')?.value + this.formBoat.get('BoatPrice')?.value + this.salesOrderForm.get('TotalItensPrice')?.value)}` }

    // @ts-ignore
    get SalesOrderCancelled() { 
        if(this.salesOrderForm.get("StatusType")?.value == "Orçamento cancelado" || this.salesOrderForm.get("StatusType")?.value == "Pedido cancelado"){
            return true
        }

        return false 
    }

    isLoading: boolean = false
    submitted: boolean = false
    visible: boolean = false
    id: string = ""
    TypeClient: SelectItem[] = [{ name: 'Pessoa física', code: 'PF' }, { name: 'Pessoa juridica', code: 'PJ' }]
    FileSoTypes: SelectItem[] = [
        { name: 'Comprovante de residência', code: '1' }, 
        { name: 'CNH', code: '2' }, 
        { name: 'Identidade', code: '3' }, 
        { name: 'Contrato de pedido assinado', code: '4' },
        { name: 'Comprovante de pagamento', code: '5' },

        { name: 'Nota fiscal casco', code: '6' },
        { name: 'Nota fiscal motor', code: '7' },
        { name: 'Nota fiscal de acessórios', code: '8' },
        { name: 'Nota fiscal de comissão', code: '9' },

        { name: 'Outro', code: '9999' }
    ]
    
    autoFilteredValueEng: any[] = []
    autoFilteredValueBoat: any[] = []
    autoFilteredValueAcc: any[] = []

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
        TotalItensPrice: [{value: 0.0, disabled: true}, []],


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

    formAcc = this.formBuilder.group({
        AccessoryModel: ['', []],
        AccessoryId: ['', []],
        AccessoryPrice: [0.0, []],
    })


    safeUrl(url: string): SafeResourceUrl {
        return this.sanitizer.bypassSecurityTrustResourceUrl(url)
    }

    submit() {
        document.getElementById(`btn_submit`)?.click()
    }

    ngOnInit() {

    }

    onSubmit(){
        this.submitted = true

    }

    onSubmitAccessory(){
        this.submitted = true

        if (this.formAcc.valid) {
            this.isLoading = true

            // @ts-ignore
            this.salesService.insertAccessorySalesOrder(this.id, this.formAcc?.value.AccessoryId).subscribe({
                next: (res: any) => {
                    this.messageService.add({ severity: 'success', summary: "Sucesso", detail: 'Acessório vinculado com sucesso' })
                    this.loadSalesOrder(this.id)

                }, 
                error: (err) => {
                    this.messageService.add({ severity: 'error', summary: "Erro", detail: 'Ocorreu um erro ao tentar adicionar o acessório' })
                },
            })
            
        }
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

    loadSalesOrder = (id: string) =>{
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
                this.salesOrderForm.get("TotalItensPrice")?.setValue(res.data['TotalItensPrice'])

                //@ts-ignore
                this.listSalesOrderBoatItens.loadSalesOrdersBoatItens(this.id)

                this.loadSalesOrderFiles()

            }, 
            error: (err) => {
                this.messageService.add({ severity: 'error', summary: "Erro", detail: 'Ocorreu um erro ao tentar buscar pedido de venda' })
            },
        })
    }

    orderProblems(){

    }

    changeFileType(id: string, event: any){
        const value = (event.target as HTMLSelectElement).value;

        this.salesService.changeSalesOrderFileType(this.id, id, parseInt(value)).subscribe({
            next: (res: any) => {
                //this.loadSalesOrderFiles()
            },
            error: (err) => {
                this.messageService.add({ severity: 'error', summary: "Erro", detail: 'Ocorreu um erro ao tentar alterar o tipo do arquivo' })
            },
        })
    }

    loadSalesOrderFiles(){
        this.salesService.getSalesOrderFiles(this.id).subscribe({
            next: (res: any) => {
                //@ts-ignore
                this.salesOrderFiles.set(res.data ?? [])
            },
            error: (err) => {
                this.messageService.add({ severity: 'error', summary: "Erro", detail: 'Ocorreu um erro ao buscar os arquivos do pedido de venda' })
            },
        })
    }

    removeFile(id: string) {
        this.confirmationService.confirm({
            message: 'Confirma apagar o arquivo selecionado?',
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
                this.salesService.deleteSalesOrderFile(this.id, id).subscribe({
                    next: (res: any) => {
                        this.loadSalesOrderFiles()
                    }, 
                    error: (err) => {
                        this.messageService.add({ severity: 'error', summary: "Erro", detail: 'Ocorreu um erro ao tentar apagar arquivo' })
                    },
                })
            }
        })
    }

    onUpload(event: any){

        const file: File = event.files[0]
        const formData = new FormData()
        formData.append('file', file, file.name)

        this.salesService.uploadSalesOrderFile(this.id, formData).subscribe({
            next: (res: any) => {
                this.messageService.add({ severity: 'success', summary: "Sucesso", detail: 'Upload feito com sucesso' });
                this.loadSalesOrderFiles()
                this.fileUploader.clear()
            }, 
            error: (err) => {
                if (err.status) {
                    this.messageService.add({ severity: 'error', summary: "Erro", detail: 'Ocorreu um erro ao fazer upload' });
                } 
                this.isLoading = false
            },
        })
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

        this.boatService.getBoatEngines(this.formBoat.get("BoatId")?.value).subscribe({
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
                this.messageService.add({ severity: 'error', summary: "Erro", detail: 'Ocorreu um erro ao buscar os motores.' });
            },
        })
    }

    filterClassAutocompleteAcc(event: AutoCompleteCompleteEvent){
        const filtered: any[] = []
        const query = event.query

        this.boatService.getBoatAccessories(this.formBoat.get("BoatId")?.value).subscribe({
            next: (res: any) => {
                //this.engines.set(res.data)

                for (let i = 0; i < res?.data?.length; i++) {
                    const eng = res?.data[i]
                    if (eng?.model?.toLowerCase().indexOf(query.toLowerCase()) == 0) {
                        filtered.push(eng)
                    }
                }

                this.autoFilteredValueAcc = filtered

            }, 
            error: (err) => {
                this.messageService.add({ severity: 'error', summary: "Erro", detail: 'Ocorreu um erro ao buscar os acessórios.' });
            },
        })
    }

    cancelOrder(){
        this.confirmationService.confirm({
            message: 'Confirma cancelar pedido/orçamento' + `` + '?',
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
                this.salesService.cancelSalesOrder(this.id).subscribe({
                    next: (res: any) => {
                        this.messageService.add({ severity: 'success', summary: "Sucesso", detail: 'Pedido/orçamento cancelado com sucesso' });
                        
                        this.submitted = false
                        this.isLoading = false
                        this.loadSalesOrder(this.id)
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
        })
    }

    upgradeToActualSalesOrder(){
        this.confirmationService.confirm({
            message: 'Confirma transformar o orçamento em pedido' + `` + '?',
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
                this.salesService.upgradeQuoteToOrder(this.id).subscribe({
                    next: (res: any) => {
                        this.messageService.add({ severity: 'success', summary: "Sucesso", detail: 'Pedido criado com sucesso' });
                        
                        this.submitted = false
                        this.isLoading = false
                        this.loadSalesOrder(this.id)
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

    setAccessoryChoosen(e: any){
        //@ts-ignore
        this.formAcc.get("AccessoryModel")?.setValue(e.value.model)
        //@ts-ignore
        this.formAcc.get("AccessoryId")?.setValue(e.value.id)
    }

    downloadFile(path: string) {
        const a = document.createElement('a')
        a.href = path;
        a.download = ''
        a.target = '_blank'
        document.body.appendChild(a)
        a.click()
        a.remove()
    }

    fileType(path: string): 'image' | 'pdf' | 'other' {
        const ext = (path || '').split('?')[0].split('.').pop() || ''
        const e = ext.toLowerCase()
        if (e.match(/^(jpg|jpeg|png|gif|bmp|webp|svg)$/)) return 'image'
        if (e === 'pdf') return 'pdf'
        return 'other'
    }

    _formatBRLMoney(amount: number){
        return formatBRLMoney(amount.toString())
    }

    isInvalid(controlName: string) {
        const control = this.salesOrderForm.get(controlName)
        return control?.invalid && (control.touched || this.submitted)
    }

    hasBeenSubmitedAccessory(controlName: string): boolean {
        const control = this.formAcc.get(controlName)
        return Boolean(control?.invalid)
            && (this.submitted || Boolean(control?.touched))
        //|| Boolean(control?.dirty
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

import { CommonModule } from '@angular/common';
import { Component, ElementRef, Input, OnInit, signal, ViewChild } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { DialogModule } from 'primeng/dialog';
import { DataViewModule } from 'primeng/dataview';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { PaginatorModule } from 'primeng/paginator';
import { FormsModule, ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { MenuItem, MessageService } from 'primeng/api';
import { TableModule } from 'primeng/table';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { InputIconModule } from 'primeng/inputicon';
import { IconFieldModule } from 'primeng/iconfield';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { ToastModule } from 'primeng/toast';
import { ButtonGroupModule } from 'primeng/buttongroup';
import { MessageModule } from 'primeng/message';
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
import { AutoCompleteModule } from 'primeng/autocomplete';
import { InputGroupModule } from 'primeng/inputgroup';
import { FileUploadModule } from 'primeng/fileupload';
import { ImageModule } from 'primeng/image';
import { ActivatedRoute } from '@angular/router';
import { MenubarModule } from 'primeng/menubar';

import { jsPDF } from 'jspdf';

import { BrStates, SelectItem } from '../../utils';
import { SalesService } from '../../../services/sales.service';
import { formatBRLMoney } from '../../utils';

@Component({
    selector: 'quote',
    imports: [DialogModule, TagModule, MenubarModule, FileUploadModule, ImageModule, AutoCompleteModule, InputGroupModule, TabsModule, CardModule, DatePickerModule, InputMaskModule, InputNumberModule, InputGroupAddonModule, TextareaModule, FieldsetModule, MessageModule, ButtonGroupModule, ConfirmDialogModule, TableModule, SelectModule, ToastModule, InputIconModule, InputTextModule, IconFieldModule, DataViewModule, RippleModule, ButtonModule, CommonModule, FormsModule, ReactiveFormsModule, PaginatorModule],
    providers: [MessageService, ConfirmationService],
    styles: `
    .main-page {
        margin-left: 9rem;
        margin-right: 9rem;
        display: flex;
        justify-content: center;
        flex-direction:column;
        padding-top: 10px;
        gap: 1rem;
    }

    h1 {
        margin: 0 !important;
    }

    .header {
        position: relative;
        display: flex;
        flex-direction: column;
    }

    .header-info {
        display: flex;
        justify-content: space-between;
    }

    .header > img {
        height: 250px;
        width: 700px;
        margin: 0 auto;
        object-fit: cover;
    }

    .customer {
        display: flex;
        justify-content: space-between;
        flex-wrap: wrap;
    }

    h6 {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }
    
    hr {
        border-top: solid #bfc4cb !important;
        border-width: 2px 0 0 0 !important;
    }

    .buy-info {
        margin-top:1rem;
    }
    `,
    standalone: true,

    //<img style='height: 340px; width: 100%; margin: 0 auto; object-fit: cover;' src="/assets/placeholders/test.png">
    template: `
    <p-toast></p-toast>
    <div *ngIf="!SalesOrderCancelled" class="card" style='background-color: transparent !important;'>
        <p-menubar [model]="items" />
    </div>

    <section #pdfContent class='main-page'>
        <div class='header'>
            <img style='height: 340px; width: 100%; margin: 0 auto; object-fit: cover;' src="/assets/images/boat2.jpg">

            <div style='display: flex; justify-content: space-between;' >
                <h1>{{ this.formBoat.get("BoatModel")?.value }}</h1>
                <h1>&nbsp;</h1>
                <h4>ORÇAMENTO Nº {{ this.id }} <br> DATA: {{ this.salesOrderForm.get("CreatedAt")?.value | date:'dd/MM/yyyy' }}</h4>
            </div>
        </div>

        <div class='customer'>
            <div>
                <h5>Cliente</h5>
                <hr>
                <h6>{{ this.salesOrderForm.get("CustomerName")?.value }}</h6>
            </div>

            <div>
                <h5>Endereço de entrega</h5>
                <hr>
                <h6>Não especificado</h6>
            </div>

            <div>
                <h5>Data de entrega</h5>
                <hr>
                <h6>Não especificado</h6>
            </div>
        </div>

        <div class='buy-info'>
            <div style='display: flex; justify-content: space-between;' >
                <h1>INFORMAÇÕES DA COMPRA</h1>
                <h1>&nbsp;</h1>
                <h6>&nbsp;</h6>
                <hr/>
            </div>

            <div style='display: flex; justify-content: space-between;' >
                <h1>Embarcação</h1>
                <h1>&nbsp;</h1>
                <h6>&nbsp;</h6>
                <hr/>
            </div>

            <div>

                <p-table [value]="products" [tableStyle]="{ 'min-width': '50rem' }">
                    <ng-template #header>
                        <tr>
                            <th>Cód.</th>
                            <th>Modelo</th>
                            <th>Preço inicial</th>
                            <th>Desconto</th>
                            <th>Preço final</th>
                        </tr>
                    </ng-template>
                    <ng-template #body let-product>
                        <tr>
                            <td>{{ product.code }}</td>
                            <td>{{ this.salesOrderForm.get("CustomerName")?.value }}</td>
                            <td>{{ this.TotalPriceBoat }}</td>
                            <td>-</td>
                            <td>{{ this.TotalPriceBoat }}</td>
                        </tr>
                    </ng-template>
                </p-table>

            </div>
        
            <div style='display: flex; justify-content: space-between;' >
                <h1>Motor</h1>
                <h1>&nbsp;</h1>
                <h6>&nbsp;</h6>
                <hr/>
            </div>

            <div>

                <p-table [value]="products" [tableStyle]="{ 'min-width': '50rem' }">
                    <ng-template #header>
                        <tr>
                            <th>Cód.</th>
                            <th>Modelo</th>
                            <th>Preço inicial</th>
                            <th>Desconto</th>
                            <th>Preço final</th>
                        </tr>
                    </ng-template>
                    <ng-template #body let-product>
                        <tr>
                            <td>{{ product.code }}</td>
                            <td>{{ product.name }}</td>
                            <td>{{ this.TotalPriceEngine }}</td>
                            <td>-</td>
                            <td>{{ this.TotalPriceEngine }}</td>
                        </tr>
                    </ng-template>
                </p-table>

            </div>

            <div style='display: flex; justify-content: space-between;' >
                <h1>Acessórios</h1>
                <h1>&nbsp;</h1>
                <h6>&nbsp;</h6>
                <hr/>
            </div>

            <div>

                <p-table [value]="products" [tableStyle]="{ 'min-width': '50rem' }">
                    <ng-template #header>
                        <tr>
                            <th>Cód.</th>
                            <th>Modelo</th>
                            <th>Preço inicial</th>
                            <th>Desconto</th>
                            <th>Preço final</th>
                        </tr>
                    </ng-template>
                    <ng-template #body let-product>
                        <tr>
                            <td>{{ product.code }}</td>
                            <td>{{ product.name }}</td>
                            <td>{{ product.category }}</td>
                            <td>{{ product.quantity }}</td>
                            <td>{{ product.quantity }}</td>
                        </tr>
                    </ng-template>
                </p-table>

            </div>

        </div>

    </section>

    `,
})
export class QuoteComponent implements OnInit {
    constructor(
        public formBuilder: FormBuilder,
        private messageService: MessageService,
        private salesService: SalesService,
        private sanitizer: DomSanitizer,
        private route: ActivatedRoute
    ) {}

    items: MenuItem[] | undefined
    Uuid: string = ""
    @ViewChild('pdfContent', { static: false }) contentToConvert!: ElementRef;
    
    products: any[] = [
    {
        id: '1000',
        code: 'f230fh0g3',
        name: 'Bamboo Watch',
        description: 'Product Description',
        image: 'bamboo-watch.jpg',
        price: 65,
        category: 'Accessories',
        quantity: 24,
        inventoryStatus: 'INSTOCK',
        rating: 5
    },]

    salesOrderFiles = signal<any[]>([])

    _formatBRLMoney(amount: number){
        return formatBRLMoney(amount.toString())
    }
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
        Uuid: [{value: '', disabled: true}, []],

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


        CreatedAt: ['', []],

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

    ngOnInit() {
        this.Uuid = this.route.snapshot.paramMap.get('id')!
        this.loadSalesOrder()


        this.items = [
            {
                label: 'Gerar PDF',
                icon: 'pi pi-file-pdf',
                command: () => {
                    this.generatePdf()
                }
            },
            {
                label: 'Enviar via WhatsApp',
                icon: 'pi pi-send'
            },
            {
                label: 'Enviar via Email',
                icon: 'pi pi-send'
            }
        ]
    }

    generatePdf(){
        const doc = new jsPDF('p', 'pt', 'a4')
        const pdfTable = this.contentToConvert!.nativeElement

        doc.html(pdfTable, {
            // x: 20,              // left margin in pt
            y: 20,              // top margin in pt
            width: 595,         // pageWidth (595) - 2*margins (20*2) = 555
            windowWidth: 1400,  // render at wide viewport to preserve CSS layout (adjust if needed)
            callback: function (doc) {
                doc.save("orcamento.pdf")
            },
            autoPaging: true
        })
    }

    loadSalesOrder = () =>{
        
        this.salesService.getSalesOrderQuote(this.Uuid).subscribe({
            next: (res: any) => {
                //@ts-ignore
                this.id = res.data['id']
                this.salesOrderForm.get("Id")?.setValue(res.data['id'])
                this.salesOrderForm.get("Uuid")?.setValue(res.data['uuid'])
                this.salesOrderForm.get("CreatedAt")?.setValue(res.data['created_at'])

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


                this.loadSalesOrderFiles()

            }, 
            error: (err) => {
                this.messageService.add({ severity: 'error', summary: "Erro", detail: 'Ocorreu um erro ao tentar buscar pedido de venda' })
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

    hasBeenSubmited(controlName: string): boolean {
        const control = this.salesOrderForm.get(controlName)
        return Boolean(control?.invalid)
            && (this.submitted || Boolean(control?.touched))
        //|| Boolean(control?.dirty
    }
}

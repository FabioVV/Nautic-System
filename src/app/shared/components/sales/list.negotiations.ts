import { CommonModule } from '@angular/common';
import { Component, computed, ElementRef, HostListener, inject, input, Input, OnInit, signal, ViewChild } from '@angular/core';
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
import { SelectModule } from 'primeng/select';
import { ToastModule } from 'primeng/toast';
import { ButtonGroupModule } from 'primeng/buttongroup';
import { MessageModule } from 'primeng/message';
import { finalize } from 'rxjs';
import { CardModule } from 'primeng/card';
import { TooltipModule } from 'primeng/tooltip';
import { ContextMenu, ContextMenuModule } from 'primeng/contextmenu';
import { MenuItem } from 'primeng/api';
import { ToolbarModule } from 'primeng/toolbar';
import { faCakeCandles } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { InputGroupModule } from 'primeng/inputgroup';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { InputMaskModule } from 'primeng/inputmask';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';

import { formatBRLMoney, showLoading } from '../utils';
import { User, UserService } from '../../services/user.service';
import { AccStatus } from '../../../pages/products/accessories/accessories';
import { Negotiation, SalesCustomer, SalesService } from '../../services/sales.service';
import { AutoCompleteCompleteEvent } from 'primeng/autocomplete';

interface Column {
    field: string
    header: string
    customExportHeader?: string
}

interface ExportColumn {
    title: string
    dataKey: string
}

export interface UserStatus {
    name: string
    code: string
}

interface Qualified {
    name: string
    code: string
}

interface QualifiedType {
    name: string
    code: string
}


@Component({
    selector: 'list-negotiations',
    imports: [DialogModule, CardModule, InputGroupAddonModule, InputNumberModule, InputMaskModule, AutoCompleteModule, InputGroupModule, FontAwesomeModule, ToolbarModule, TooltipModule, ContextMenuModule, MessageModule, ButtonGroupModule, ConfirmDialogModule, TableModule, SelectModule, ToastModule, InputIconModule, InputTextModule, IconFieldModule, DataViewModule, RippleModule, ButtonModule, CommonModule, FormsModule, ReactiveFormsModule, PaginatorModule],
    providers: [ConfirmationService, MessageService],
    styleUrl: "negotiation.css",
    standalone: true,

    template: `
    <p-toast></p-toast>
    <p-contextmenu #cm [model]="pcard_menu" (onHide)="onHide()" />

    
    <p-toolbar>

        <ng-template #start>
            <p-button (click)="openNewLead()" pTooltip="Cadastrar novo lead" tooltipPosition="top" icon="pi pi-plus" class="mr-2" text severity="success" />
            <p-button pTooltip="Visualizar seus alertas" tooltipPosition="top" icon="pi pi-bell" class="mr-2" text severity="warn" />

            <p-button (click)="openCustomerBirthdays()" pTooltip="Clientes aniversariantes" tooltipPosition="top" class="mr-2" text severity="secondary">
                <fa-icon style='color:#0ea5e9;' [icon]="faCakeCandles" />
            </p-button>

            <p-button (click)="showPanelExp()" pTooltip="Sobre o painel" tooltipPosition="top" icon="pi pi-question-circle" class="mr-2" text severity="secondary" />
            
        </ng-template>

        <ng-template #center>
            <p-iconfield iconPosition="left">
                <p-inputicon class="pi pi-search" />
                <input [(ngModel)]="negotiationSearch" pInputText (input)="onGlobalFilter($event)" type="text" pInputText placeholder="Pesquisar negócios..." />
            </p-iconfield>
        </ng-template>

        <ng-template #end>
        </ng-template>

    </p-toolbar>

    <div class='kb-painel' style='margin-top:1rem;'>
        <div id='stage1' class='dropzone' (drop)="drop($event)" (dragover)="dragover($event)" (dragenter)="dragenter($event)" (dragleave)="dragleave($event)">
            <h5>Lead</h5>
            <div class='kb-cards'>
                <p-card *ngFor="let n of stageOne(); trackBy: trackById"
                    [attr.data-stage]="n.stage"
                    draggable="true"
                    [id]="n.id"
                    (dragstart)="dragstart($event, n.id)"
                    (contextmenu)="onContextMenu($event, n)"
                >
                    <h6 class="card-text" pTooltip="{{ n.customer_name }}" tooltipPosition="top">{{ n.customer_name }}</h6>
                    <p class="m-0 card-text" pTooltip="{{ n.boat_name }}" tooltipPosition="top">
                        {{ n.boat_name }}
                    </p>
                    <br>
                    <small class="m-0 card-money">
                        {{ this._formatBRLMoney(n.estimated_value) }}
                    </small>
                </p-card>

            </div>
        </div>

        <div id='stage2' class='dropzone' (drop)="drop($event)" (dragover)="dragover($event)" (dragenter)="dragenter($event)" (dragleave)="dragleave($event)" >
            <h5>Lead convertido</h5>
            <div class='kb-cards'>

                <p-card *ngFor="let n of stageTwo(); trackBy: trackById"
                    [attr.data-stage]="n.stage"
                    draggable="true"
                    (dragstart)="dragstart($event, n.id)"
                    [id]="n.id"
                    (contextmenu)="onContextMenu($event, n)"
                >
                    <h6 class="card-text" pTooltip="{{ n.customer_name }}" tooltipPosition="top">{{ n.customer_name }}</h6>
                    <p class="m-0 card-text" pTooltip="{{ n.boat_name }}" tooltipPosition="top">
                        {{ n.boat_name }}
                    </p>
                    <br>
                    <small class="m-0 card-money">
                        {{ this._formatBRLMoney(n.estimated_value) }}
                    </small>
                </p-card>

            </div>
        </div>

        <div id='stage3' class='dropzone' (drop)="drop($event)" (dragover)="dragover($event)" (dragenter)="dragenter($event)" (dragleave)="dragleave($event)" >
            <h5>Contato pessoal</h5>
            <div class='kb-cards'>

                <p-card *ngFor="let n of stageThree(); trackBy: trackById"
                    [attr.data-stage]="n.stage"
                    draggable="true"
                    (dragstart)="dragstart($event, n.id)"
                    [id]="n.id"
                    (contextmenu)="onContextMenu($event, n)"
                >
                    <h6 class="card-text" pTooltip="{{ n.customer_name }}" tooltipPosition="top">{{ n.customer_name }}</h6>
                    <p class="m-0 card-text" pTooltip="{{ n.boat_name }}" tooltipPosition="top">
                        {{ n.boat_name }}
                    </p>
                    <br>
                    <small class="m-0 card-money">
                        {{ this._formatBRLMoney(n.estimated_value) }}
                    </small>
                </p-card>

            </div>
        </div>

        <div id='stage4' class='dropzone' (drop)="drop($event)" (dragover)="dragover($event)" (dragenter)="dragenter($event)" (dragleave)="dragleave($event)" >
            <h5>Negociando</h5>
            <div class='kb-cards'>

                <p-card *ngFor="let n of stageFour(); trackBy: trackById"
                    [attr.data-stage]="n.stage"
                    draggable="true"
                    (dragstart)="dragstart($event, n.id)"
                    [id]="n.id"
                    (contextmenu)="onContextMenu($event, n)"
                >
                    <h6 class="card-text" pTooltip="{{ n.customer_name }}" tooltipPosition="top">{{ n.customer_name }}</h6>
                    <p class="m-0 card-text" pTooltip="{{ n.boat_name }}" tooltipPosition="top">
                        {{ n.boat_name }}
                    </p>
                    <br>
                    <small class="m-0 card-money">
                        {{ this._formatBRLMoney(n.estimated_value) }}
                    </small>
                </p-card>

            </div>
        </div>

        <div id='stage5' class='dropzone' (drop)="drop($event)" (dragover)="dragover($event)" (dragenter)="dragenter($event)" (dragleave)="dragleave($event)" >
            <h5>Fechamento</h5>
            <div class='kb-cards'>

                <p-card *ngFor="let n of stageFive(); trackBy: trackById"
                    [attr.data-stage]="n.stage"
                    draggable="true"
                    (dragstart)="dragstart($event, n.id)"
                    [id]="n.id"
                    (contextmenu)="onContextMenu($event, n)"
                >
                    <h6 class="card-text" pTooltip="{{ n.customer_name }}" tooltipPosition="top">{{ n.customer_name }}</h6>
                    <p class="m-0 card-text" pTooltip="{{ n.boat_name }}" tooltipPosition="top">
                        {{ n.boat_name }}
                    </p>
                    <br>
                    <small class="m-0 card-money">
                        {{ this._formatBRLMoney(n.estimated_value) }}
                    </small>
                </p-card>

            </div>
        </div>

        <div id='stage6' class='dropzone' (drop)="drop($event)" (dragover)="dragover($event)" (dragenter)="dragenter($event)" (dragleave)="dragleave($event)" >
            <h5>Entrega</h5>
            <div class='kb-cards'>

                <p-card *ngFor="let n of stageSix(); trackBy: trackById"
                    [attr.data-stage]="n.stage"
                    draggable="true"
                    (dragstart)="dragstart($event, n.id)"
                    [id]="n.id"
                    (contextmenu)="onContextMenu($event, n)"
                >
                    <h6 class="card-text" pTooltip="{{ n.customer_name }}" tooltipPosition="top">{{ n.customer_name }}</h6>
                    <p class="m-0 card-text" pTooltip="{{ n.boat_name }}" tooltipPosition="top">
                        {{ n.boat_name }}
                    </p>
                    <br>
                    <small class="m-0 card-money">
                        {{ this._formatBRLMoney(n.estimated_value) }}
                    </small>
                </p-card>

            </div>
        </div>

    </div>

    <p-dialog header="Sobre o painel" [modal]="true" [(visible)]="panelExpVisible" [style]="{ width: '50rem' }" [breakpoints]="{ '1199px': '75vw', '575px': '90vw' }">
        <p class="mb-8">
            1 - Lead:

            - Colher dados de comunicação, tais como: Nome, Telefone, E-mail e meio de comunicação ou reativar clientes.

            - Possibilidade de envio de orçamento básico (casco e motor).


            OBS: Cliente não poderá ficar mais que 24 Hrs como Lead. (caso aconteça a cor da borda ficará em vermelho)
        </p>
        <p class="mb-8">
            2 - Lead convertido:

            - Entrar em contato com o cliente, podendo ser por telefone ou pelo whatsapp, alternativa enviando mídias.

            - Definir o perfil da negociação - Respondendo perguntas básicas:

            - Qual a cidade do cliente?

            - Onde o senhor vai navegar?

            - Quantas pessoas o senhor quer levar na embarcação?

            - Tamanho da embarcação?

            - Cabinada ou proa aberta?

            - Barco novo ou usado

            - Tem barco na troca

            - Qual o valor aproximado de investimento?
        </p>
        <p class="mb-8">
            3 - Contato pessoal:

            - Marcar uma reunião presencial com o cliente em loja, escritório ou Marina.

            - Para entrar nessa fase necessário marcar em combo a maneira de contato (loja, escritório, marina, outros) para o sistema gerar relatório por vendedor
        </p>
        <p class="mb-8">
            4 - Negociação:

            - Proposta de compra do cliente

            - Desconto máximo (após proposta do cliente)

            - Análise do Trade in
        </p>
        <p>
            5 - Fechamento:

            - Encaminhar email com etapas do processo até a entrega

            - Assinatura do contrato

            - Pagamento sinal

            - Pagamento de parcelas

            - Burocrácia do trade in

            - Análise de crédito bancário
        </p>
        <p>
            6 - Entrega:

            - Entrada do documento na marinha

            - Vistoria em loja embarcação pronta

            - Quitação

            - Entrega técnica no seco / água
        </p>
    </p-dialog>

    <p-dialog header="Clientes aniversariantes" [modal]="true" [(visible)]="birthdaysDialog" [style]="{ width: '50rem' }" [breakpoints]="{ '1199px': '75vw', '575px': '90vw' }">
        <p-table [value]="customers()"  [columns]="cols" csvSeparator=";" [exportHeader]="'customExportHeader'" stripedRows selectionMode="multiple" [(selection)]="selectedData" dataKey="id" [tableStyle]="{ 'min-width': '50rem', 'margin-top':'10px' }"
            #dt
            [rows]="10"
            [globalFilterFields]="['name']"
            [rowHover]="true"
            dataKey="id"
        >
            <ng-template #caption>
                <div class="text-end pb-4 mt-2">
                    <p-button icon="pi pi-external-link" label="Exportar CSV" (click)="dt.exportCSV()" />
                </div>
            </ng-template>

            <ng-template #header>
                <tr>
                    <th pSortableColumn="customer_name">
                        Nome
                        <p-sortIcon field="name" />
                    </th>

                    <th pSortableColumn="customer_email">
                        E-mail
                        <p-sortIcon field="name" />
                    </th>

                    <th>
                        Telefone
                    </th>

                    <th></th>
                </tr>
            </ng-template>

            <ng-template #body let-user>
                <tr [pSelectableRow]="user">
                    <td>
                        {{ user.customer_name }}
                    </td>

                    <td>
                        {{ user.customer_email }}
                    </td>

                    <td>
                        {{ user.customer_phone }}
                    </td>

                    <td>
                        <p-buttongroup>
                            <p-button icon="pi pi-pencil" severity="contrast" rounded/>
                        </p-buttongroup>
                    </td>
                </tr>

            </ng-template>
        </p-table>
    </p-dialog>

    <p-dialog [style]="{ width: '900px' }" [(visible)]="negotiationDialog" header="Registrar Lead" [modal]="true">
        <ng-template #content>

            <form [formGroup]="form" (ngSubmit)="onSubmit()" style='margin-bottom: 7.5rem;'>
                <button id="btn_submit" style='display:none;' type="submit"></button>
                
                <div class='row'>

                    <div class='col-md-4'>
                        <label for="Name" class="block font-bold mb-3">Nome do cliente</label>
                        <input formControlName="Name" class="w-full md:w-[30rem] mb-2" type="text" pInputText id="Type" required autofocus fluid />
                        
                        <div class="error-feedback" *ngIf="hasBeenSubmited('Name')">
                            <p-message styleClass="mb-2" *ngIf="form.controls.Name.hasError('required')" severity="error" variant="simple" size="small">Por favor, digitar o nome do cliente</p-message>
                        </div>
                    </div>

                    <div class='col-md-4'>
                        <label for="Email" class="block font-bold mb-3">E-mail do cliente</label>
                        <input formControlName="Email" class="w-full md:w-[30rem] mb-2" type="text" pInputText id="Type" required autofocus fluid />
                        
                        <div class="error-feedback" *ngIf="hasBeenSubmited('Email')">
                            <p-message styleClass="mb-2" *ngIf="form.controls.Email.hasError('required')" severity="error" variant="simple" size="small">Por favor, digitar o e-mail do cliente</p-message>
                        </div>
                    </div>

                    <div class='col-md-4'>
                        <label for="Phone" class="block font-bold mb-3">Telefone do cliente</label>
                        <p-inputmask mask="99-99999-9999" class="w-full md:w-[30rem] mb-2" formControlName="Phone" placeholder="49-99999-9999" />
                        
                        <div class="error-feedback" *ngIf="hasBeenSubmited('Phone')">
                            <p-message styleClass="mb-2" *ngIf="form.controls.Phone.hasError('required')" severity="error" variant="simple" size="small">Por favor, digitar o telefone do cliente</p-message>
                        </div>
                    </div>

                </div>

                <div class='row'>

                    <div class='col-md-4'>
                        <label for="ComMeanName" class="block font-bold mb-3">Meio de comunicação que trouxe o cliente</label>

                        <p-inputgroup>
                            <p-inputgroup-addon pTooltip="Digite na caixa ao lado para pesquisar um meio e selecione na lista" tooltipPosition="top" [style]="{ cursor:'help' }">
                                <i class="pi pi-filter"></i>
                            </p-inputgroup-addon>

                            <p-autocomplete class="w-full mb-2" formControlName="ComMeanName" placeholder="Procure o tipo" [suggestions]="autoFilteredValue" optionLabel="name" (completeMethod)="filterClassAutocomplete($event)" (onSelect)="setComMeanChoosen($event)" />
                        </p-inputgroup>

                        <div class="error-feedback" *ngIf="hasBeenSubmited('ComMeanName')">
                            <p-message styleClass="mb-2" *ngIf="form.controls.ComMeanName.hasError('required')" severity="error" variant="simple" size="small">Por favor, digitar o nome do cliente</p-message>
                        </div>
                    </div>

                    <div class='col-md-4'>
                        <label for="EstimatedValue" class="block font-bold mb-3">Valor estimado</label>
                        <p-inputnumber formControlName="EstimatedValue" class="w-full mb-2" mode="currency" currency="BRL" locale="pt-BR" />

                        <div class="error-feedback" *ngIf="hasBeenSubmited('EstimatedValue')">
                            <p-message styleClass="mb-2" *ngIf="form.controls.EstimatedValue.hasError('required')" severity="error" variant="simple" size="small">Por favor, digitar o valor estimado da embarcação</p-message>
                        </div>
                    </div>

                    <div class='col-md-4'>
                        <label for="BoatName" class="block font-bold mb-3">Embarcação aproximada</label>
                        <input formControlName="BoatName" class="w-full md:w-[30rem] mb-2" type="text" pInputText id="Type" required autofocus fluid />

                        <div class="error-feedback" *ngIf="hasBeenSubmited('BoatName')">
                            <p-message styleClass="mb-2" *ngIf="form.controls.BoatName.hasError('required')" severity="error" variant="simple" size="small">Por favor, digitar a embarcação escolhida do cliente</p-message>
                        </div>
                    </div>

                </div>

                <div class='row'>

                    <div class='col-md-4'>
                        <label for="Name" class="block font-bold mb-3">Lead qualificado?</label>

                        <p-select [invalid]="isInvalid('Qualified')" [options]="qualified" formControlName="Qualified" optionLabel="name" placeholder="Selecione se o lead é qualificado ou não" class="w-full mb-2" />
                        @if (isInvalid('Qualified')) {
                            <p-message severity="error" size="small" variant="simple">Por favor, selecione se o lead é qualificado ou não</p-message>
                        }
                    </div>

                </div>

                <div *ngIf="showQualifiedDiv" class='row'>
                    <div class='col-md-12'>
                        <label for="" class="block font-bold mb-3">Tipo de qualificação</label>
                        <p-select [invalid]="isInvalid('QualifiedType')" [options]="qualifiedType" formControlName="QualifiedType" optionLabel="name" placeholder="Selecione o tipo de qualificação" class="w-full mb-2" />
                       
                        @if (isInvalid('Qualified') && showQualifiedDiv) {
                            <p-message severity="error" size="small" variant="simple">Por favor, selecione se o tipo de qualificação do lead</p-message>
                        }
                    </div>

                </div>



            </form>


            <ng-template #footer>
                <p-button label="Cancelar" icon="pi pi-times" text (click)="hideDialog()" />
                <p-button [disabled]="isLoading" (click)="submit()" type="submit" label="Salvar" icon="pi pi-check" />
            </ng-template>

        </ng-template>
    </p-dialog>

    <p-confirmdialog
        [rejectLabel]="rejectLabel"
        [acceptLabel]="confirmLabel"
        [acceptAriaLabel]="confirmLabel"
        [rejectAriaLabel]="rejectLabel"
        [style]="{ width: '550px' }"
    />
    `,
})
export class ListNegotiationsComponent {
    constructor(
        private router: Router,
        public formBuilder: FormBuilder,
        private messageService: MessageService,
        private userService: UserService,
        private salesService: SalesService,
        private confirmationService: ConfirmationService
    ) { }
    faCakeCandles = faCakeCandles


    //@ts-ignore
    @ViewChild('cm') cm: ContextMenu
    elementRef = inject(ElementRef)
    pcard_menu: MenuItem[] | undefined
    selectedCard: any

    negotiations = signal<Negotiation[]>([])
    stageOne = computed(() => this.negotiations()?.filter(n => n.stage === 1))
    stageTwo = computed(() => this.negotiations()?.filter(n => n.stage === 2))
    stageThree = computed(() => this.negotiations()?.filter(n => n.stage === 3))
    stageFour = computed(() => this.negotiations()?.filter(n => n.stage === 4))
    stageFive = computed(() => this.negotiations()?.filter(n => n.stage === 5))
    stageSix = computed(() => this.negotiations()?.filter(n => n.stage === 6))

    id: string = ""
    _name: string = ""
    totalRecords = 0
    limitPerPage = 20
    submitted: boolean = false
    accDialog: boolean = false
    negotiationDialog: boolean = false
    birthdaysDialog: boolean = false
    panelExpVisible: boolean = false
    typingTimeout: any
    isLoading: boolean = false

    negotiationSearch: string = ""


    form = this.formBuilder.group({
        Name: ['', [Validators.required]],
        Email: ['', [Validators.required]],
        Phone: ['', [Validators.required]],
        EstimatedValue: ['', [Validators.required]],
        Qualified: ['', [Validators.required]],
        QualifiedType: ['', []],
        BoatName: ['', [Validators.required]],

        ComMeanName: ['', [Validators.required]],
        ComMeanId: ['', [Validators.required]],
        UserId: ['', []],
    })

    ComMeans: any[] = []
    users = signal<User[]>([])
    customers = signal<SalesCustomer[]>([])

    selectedData!: any[] 
    selectedAccState: AccStatus | undefined = { name: "Indiferente", code: "" }
    accStates: AccStatus[] | undefined
    autoFilteredValue: any[] = []

    cols!: Column[];
    exportColumns!: ExportColumn[];

    confirmLabel = "Confirmar"
    rejectLabel = "Cancelar"

    qualified: Qualified[] = [{ name: 'Sim', code: 'Y' }, { name: 'Não', code: 'N' }]

    qualifiedType: QualifiedType[] = [
        { name: 'Muito decidido. Intenção clara de compra imediata', code: 'A' }, 
        { name: 'Interesse real, mas precisa de mais informação', code: 'B' }, 
        { name: 'Inicio de pesquisa, médio/longo prazo', code: 'C' }
    ]

    onPageChange(e: any) {
        this.loadNegotiations()
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    ngOnInit() {
        this.loadNegotiations()

        this.salesService.getComs(1, 1000, "", "Y").subscribe({
            next: (res: any) => {
                this.ComMeans = res.data
            }, 
            error: (err: any) => {
                this.messageService.add({ severity: 'error', summary: "Erro", detail: 'Ocorreu um erro ao buscar as negociações.' });
            },
        })
        
        this.accStates = [
            { name: "Indiferente", code: "" },
            { name: "Ativo", code: "Y" },
            { name: "Não ativo", code: "N" },
        ]

        this.cols = [
            { field: 'type', header: 'Tipo' },
            { field: 'active', header: 'Ativo' }
        ];

        this.pcard_menu = [
            // {
            //     label: 'Roles',
            //     icon: 'pi pi-users',
            //     items: [
            //         {
            //             label: 'Admin',
            //             command: () => {
                            
            //             }
            //         },
            //         {
            //             label: 'Member',
            //             command: () => {
                            
            //             }
            //         },
            //         {
            //             label: 'Guest',
            //             command: () => {
                            
            //             }
            //         }
            //     ]
            // },
            {
                label: 'Acompanhamento',
                icon: 'pi pi-user-edit',
                command: () => {
                    console.log(this.selectedCard)
                }
            },
            {
                label: 'Alterar negocição',
                icon: 'pi pi-pencil',
                command: () => {
                    console.log(this.selectedCard)
                }
            },
            {
                label: 'Perdeu negociação',
                icon: 'pi pi-user-minus',
                command: () => {
                    console.log(this.selectedCard)
                }
            },
            {
                label: 'WhatsApp',
                icon: 'pi pi-whatsapp',
                command: () => {
                    console.log(this.selectedCard)
                }
            }
        ]

        this.exportColumns = this.cols.map((col) => ({ title: col.header, dataKey: col.field }));
    }

    loadNegotiations(isDelete = false) {
        //const rmLoading = showLoading()

        this.salesService.getNegotiations(this.negotiationSearch).pipe(finalize(() => {  })).subscribe({
            next: (res: any) => {
                this.negotiations.set(res.data)
            },
            error: (err) => {
                if (err.status) {
                    this.messageService.add({ severity: 'error', summary: "Erro", detail: 'Ocorreu um erro ao buscar negociações.' });
                }
                this.isLoading = false
            },
        })
    }

    @HostListener('dragend', ['$event'])
    dragend(e: any) {
        const el = Array.from(this.elementRef.nativeElement.getElementsByClassName('p-card'))
        el.forEach((e: any) => {
            e.classList.remove('hide-card')
        })

        const eld = Array.from(this.elementRef.nativeElement.getElementsByClassName('dropzone'))
        eld.forEach((e: any) => {
            e.classList.remove('highlight-drag')
        })
    }

        dragstart(e: any, dragItemId: number) {
        const el = Array.from(this.elementRef.nativeElement.getElementsByClassName('p-card'))
        el.forEach((e: any) => dragItemId?.toString() != e.id ? e.classList.add('hide-card') : "")

        e.dataTransfer.setData('text', e.target.id)
        console.log(e.target.id)

    }

    dragenter(e: any) {
        const target = e.target.closest('.dropzone')
        if (!target) return
        target.classList.add('highlight-drag')
    }

    dragleave(e: any) {
        const target = e.target.closest('.dropzone')
        if (!target) return

        target.classList.remove('highlight-drag')
    }

    dragover(e: any) {
        e.preventDefault()
    }

    drop(e: any) {
        const target = e.target.closest('.dropzone')
        const card = e.dataTransfer.getData('text')
        const card_el = document.getElementById(card)!
        const dropzone = e.target.querySelector('.kb-cards')
        const card_stage = card_el.getAttribute('data-stage')!
        const dropzone_stage = target.id[target.id.length - 1]

        if (dropzone_stage < card_stage) {
            this.messageService.add({ severity: 'error', summary: "Erro", detail: 'Não é permitido retroceder no atendimento' });
            return
        }

        if ((parseInt(card_stage) + 1) < dropzone_stage && dropzone_stage != 3) {
            this.messageService.add({ severity: 'error', summary: "Erro", detail: 'Não é permitido pular etapas no atendimento' });
            return
        }

        card_el.setAttribute("data-stage", dropzone_stage)

        if (!dropzone) {
            e.target.closest('.kb-cards').appendChild(card_el)
        } else {
            e.target.querySelector('.kb-cards').appendChild(card_el)
        }
    }

    update(id: string, _name: string) {

    }

    deactivate(id: string, _type: string) {
        this.confirmationService.confirm({
            message: 'Confirma desativar o meio de comunicação ' + `<mark>${_type}</mark>` + ' ?',
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

                this.salesService.deactivateComMean(id).pipe(finalize(() => { rmLoading() })).subscribe({
                    next: (res: any) => {
                        this.loadNegotiations(true)
                        this.messageService.add({ severity: 'success', summary: "Sucesso", detail: 'Tipo desativado com sucesso' });
                    },
                    error: (err) => {
                        this.messageService.add({ severity: 'error', summary: "Erro", detail: "Ocorreu um erro ao tentar desativar o tipo." });
                    },
                })
            }
        });
    }

    onContextMenu(event: any, card: any) {
        this.selectedCard = card
        this.cm.show(event)
    }

   onHide() {
        this.selectedCard = null
    }

    _formatBRLMoney(amount: number) { // alias
        return formatBRLMoney(amount.toString())
    }

    trackById(index: number, item: Negotiation) {
        return item.id;
    }

        get showQualifiedDiv(): boolean {
        const c: any = this.form.get('Qualified')
        if(c!['value']!['code'] == 'Y'){
            return true
        }

        return false
    }



    setComMeanChoosen(e: any){
        //@ts-ignore
        this.form.get("ComMeanName")?.setValue(e.value.name)
        //@ts-ignore
        this.form.get("ComMeanId")?.setValue(e.value.id)
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

    submit() {
        document.getElementById(`btn_submit`)?.click()
    }

    onSubmit() {
        this.submitted = true

        if (this.form.valid) {
            this.isLoading = true
            // @ts-ignore

            if(this.form.value.Qualified?.code == 'N'){
                this.form.get("Qualified")?.setValue('N')
            } else {
                this.form.get("Qualified")?.setValue('S')
            }

            // @ts-ignore
            this.form.get("QualifiedType")?.setValue(this.form.value.QualifiedType?.code)
            this.form.get("UserId")?.setValue(this.userService?.getUserData()?.id)

            this.salesService.registerNegotiation(this.form.value).subscribe({
                next: (res: any) => {
                    this.messageService.add({ severity: 'success', summary: "Sucesso", detail: 'Meio registrado com sucesso' });
                    //this.loadCommunicationMeans()
                    
                    this.submitted = false
                    this.isLoading = false
                    this.hideDialog()
                    this.form.reset()

                    window.location.reload()
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

    isInvalid(controlName: string) {
        const control = this.form.get(controlName);
        return control?.invalid && (control.touched || this.submitted);
    }

    hideDialog() {
        this.negotiationDialog = false
        this.submitted = false
    }

    openCustomerBirthdays(){
        this.birthdaysDialog = true

        this.salesService.getCustomersBirthday().pipe(finalize(() => { })).subscribe({
            next: (res: any) => {
                this.customers.set(res.data ?? [])

                this.totalRecords = res.totalRecords
            },
            error: (err) => {
                if (err.status) {
                    this.messageService.add({ severity: 'error', summary: "Erro", detail: 'Ocorreu um erro ao buscar aniversário de clientes.' });
                }
                this.isLoading = false
            },
        })

    }

    openNewLead() {
        this.submitted = false
        this.negotiationDialog = true
    }

    showPanelExp() {
        this.panelExpVisible = true
    }

    onGlobalFilter(event: any) {
        if (this.typingTimeout) {
            clearTimeout(this.typingTimeout)
        }

        this.typingTimeout = setTimeout(() => {
            this.loadNegotiations()
        }, 500)
    }

    hasBeenSubmited(controlName: string): boolean {
        const control = this.form.get(controlName)
        return Boolean(control?.invalid)
            && (this.submitted || Boolean(control?.touched))
        //|| Boolean(control?.dirty
    }

}

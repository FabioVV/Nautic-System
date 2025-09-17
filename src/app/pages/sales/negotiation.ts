import { Component, OnInit, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
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
import { CardModule } from 'primeng/card';
import { TooltipModule } from 'primeng/tooltip';
import { inject } from '@angular/core';
import { ElementRef } from '@angular/core';
import { faCakeCandles } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { InputMaskModule } from 'primeng/inputmask';
import { SelectModule } from 'primeng/select';
import { AutoCompleteModule, AutoCompleteCompleteEvent } from 'primeng/autocomplete';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';

import { User, UserService } from '../../shared/services/user.service';
import { SalesService, Negotiation } from '../../shared/services/sales.service';
import { ListNegotiationsComponent } from '../../shared/components/sales/list.negotiations';
import { showLoading } from '../../shared/components/utils';
import { finalize } from 'rxjs';

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
    selector: 'sales-negotiation',
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
        CardModule,
        FontAwesomeModule,
        InputMaskModule,
        TooltipModule,
        SelectModule,
        AutoCompleteModule,
        InputGroupModule,
        InputGroupAddonModule,
        ListNegotiationsComponent,
    ],
    providers: [MessageService, ConfirmationService],
    template: `
    <p-toast></p-toast>

    <section class='kb-board'>

        <p-toolbar>

            <ng-template #start>
                <p-button (click)="openNewLead()" pTooltip="Cadastrar novo lead" tooltipPosition="top" icon="pi pi-plus" class="mr-2" text severity="success" />
                <p-button pTooltip="Visualizar seus alertas" tooltipPosition="top" icon="pi pi-bell" class="mr-2" text severity="warn" />

                <p-button pTooltip="Clientes aniversariantes" tooltipPosition="top" class="mr-2" text severity="secondary">
                    <fa-icon style='color:#0ea5e9;' [icon]="faCakeCandles" />
                </p-button>

                <p-button (click)="showPanelExp()" pTooltip="Sobre o painel" tooltipPosition="top" icon="pi pi-question-circle" class="mr-2" text severity="secondary" />
                
            </ng-template>

            <ng-template #center>
                <p-iconfield iconPosition="left">
                    <p-inputicon class="pi pi-search" />
                    <input type="text" pInputText placeholder="Pesquisar negócios..." />
                </p-iconfield>
            </ng-template>

            <ng-template #end>
            </ng-template>

        </p-toolbar>

        <list-negotiations />

    </section>



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

    `
})
export class NegotiationPanel implements OnInit {

    constructor(
        public formBuilder: FormBuilder,
        private messageService: MessageService,
        private userService: UserService,
        private confirmationService: ConfirmationService,
        private salesService: SalesService
    ) { }

    faCakeCandles = faCakeCandles
    panelExpVisible: boolean = false
    submitted: boolean = false
    isLoading: boolean = false
    negotiationDialog: boolean = false
    totalRecords = 0
    limitPerPage = 20
    elementRef = inject(ElementRef)

    autoFilteredValue: any[] = []
    ComMeans: any[] = []
    users = signal<User[]>([])
    //negotiations = signal<Negotiation[]>([])

    qualified: Qualified[] = [{ name: 'Sim', code: 'Y' }, { name: 'Não', code: 'N' }]

    qualifiedType: QualifiedType[] = [
        { name: 'Muito decidido. Intenção clara de compra imediata', code: 'A' }, 
        { name: 'Interesse real, mas precisa de mais informação', code: 'B' }, 
        { name: 'Inicio de pesquisa, médio/longo prazo', code: 'C' }
    ]

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
    })

    ngOnInit(): void {
        this.salesService.getComs(1, 1000, "", "Y").subscribe({
            next: (res: any) => {
                this.ComMeans = res.data
            }, 
            error: (err: any) => {
                this.messageService.add({ severity: 'error', summary: "Erro", detail: 'Ocorreu um erro ao buscar as negociações.' });
            },
        })
    }

    get showQualifiedDiv(): boolean {
        const c: any = this.form.get('Qualified')
        if(c!['value']!['code'] == 'Y'){
            return true
        }

        return false
    }

    hideDialog() {
        this.negotiationDialog = false;
        this.submitted = false;
    }

    openNewLead() {
        this.submitted = false;
        this.negotiationDialog = true;
    }

    showPanelExp() {
        this.panelExpVisible = true;
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
            console.log(this.ComMeans)
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

    hasBeenSubmited(controlName: string): boolean {
        const control = this.form.get(controlName)
        return Boolean(control?.invalid)
            && (this.submitted || Boolean(control?.touched))
        //|| Boolean(control?.dirty
    }

    isInvalid(controlName: string) {
        const control = this.form.get(controlName);
        return control?.invalid && (control.touched || this.submitted);
    }
}

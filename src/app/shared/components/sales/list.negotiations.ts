import { CommonModule } from '@angular/common';
import { Component, computed, ElementRef, HostListener, inject, input, Input, OnInit, signal } from '@angular/core';
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
import { Tag } from 'primeng/tag';
import { SelectModule } from 'primeng/select';
import { ToastModule } from 'primeng/toast';
import { ButtonGroupModule } from 'primeng/buttongroup';
import { MessageModule } from 'primeng/message';
import { finalize } from 'rxjs';
import { CardModule } from 'primeng/card';
import { TooltipModule } from 'primeng/tooltip';

import { formatBRLMoney, showLoading } from '../utils';
import { UserService } from '../../services/user.service';
import { AccStatus } from '../../../pages/products/accessories/accessories';
import { Negotiation, SalesService } from '../../services/sales.service';

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
    selector: 'list-negotiations',
    imports: [DialogModule, CardModule, TooltipModule, MessageModule, ButtonGroupModule, ConfirmDialogModule, TableModule, SelectModule, ToastModule, InputIconModule, InputTextModule, IconFieldModule, DataViewModule, RippleModule, ButtonModule, CommonModule, Tag, FormsModule, ReactiveFormsModule, PaginatorModule],
    providers: [ConfirmationService, MessageService],
    styleUrl: "negotiation.css",
    standalone: true,

    template: `
    <p-toast></p-toast>
    <div class='kb-painel' style='margin-top:1rem;'>
        <div id='stage1' class='dropzone' (drop)="drop($event)" (dragover)="dragover($event)" (dragenter)="dragenter($event)" (dragleave)="dragleave($event)">
            <h5>Lead</h5>
            <div class='kb-cards'>
                <p-card *ngFor="let n of stageOne(); trackBy: trackById"
                    [attr.data-stage]="n.stage"
                    draggable="true"
                    (dragstart)="dragstart($event, n.id)"
                    [id]="n.id"
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


    //@Input() negotiations: any
    elementRef = inject(ElementRef)

    negotiations = signal<Negotiation[]>([])
    stageOne = computed(() => this.negotiations().filter(n => n.stage === 1))
    stageTwo = computed(() => this.negotiations().filter(n => n.stage === 2))
    stageThree = computed(() => this.negotiations().filter(n => n.stage === 3))
    stageFour = computed(() => this.negotiations().filter(n => n.stage === 4))
    stageFive = computed(() => this.negotiations().filter(n => n.stage === 5))
    stageSix = computed(() => this.negotiations().filter(n => n.stage === 6))

    id: string = ""
    _name: string = ""

    submitted: boolean = false
    accDialog: boolean = false
    isLoading: boolean = false
    typingTimeout: any


    form = this.formBuilder.group({
        Name: ['', [Validators.required]],
    })

    selectedAccState: AccStatus | undefined = { name: "Indiferente", code: "" }
    accStates: AccStatus[] | undefined
    autoFilteredValue: any[] = []

    nameSearch: string = ""

    cols!: Column[];
    exportColumns!: ExportColumn[];

    confirmLabel = "Confirmar"
    rejectLabel = "Cancelar"

    onPageChange(e: any) {
        this.loadNegotiations()
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    ngOnInit() {
        this.loadNegotiations()
        console.log(this.negotiations())
        
        this.accStates = [
            { name: "Indiferente", code: "" },
            { name: "Ativo", code: "Y" },
            { name: "Não ativo", code: "N" },
        ]

        this.cols = [
            { field: 'type', header: 'Tipo' },
            { field: 'active', header: 'Ativo' }
        ];

        this.exportColumns = this.cols.map((col) => ({ title: col.header, dataKey: col.field }));
    }

    loadNegotiations(isDelete = false) {
        const rmLoading = showLoading()

        this.salesService.getNegotiations(this.nameSearch).pipe(finalize(() => { rmLoading() })).subscribe({
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

    _formatBRLMoney(amount: number) { // alias
        return formatBRLMoney(amount.toString())
    }

    trackById(index: number, item: Negotiation) {
        return item.id;
    }

    hideDialog() {
        this.accDialog = false;
        this.submitted = false;
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

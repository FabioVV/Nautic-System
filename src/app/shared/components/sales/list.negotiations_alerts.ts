import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import { DataViewModule } from 'primeng/dataview';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { PaginatorModule } from 'primeng/paginator';
import { FormsModule, ReactiveFormsModule, FormBuilder } from '@angular/forms';
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
import { ConfirmationService } from 'primeng/api';


import {  openWpp } from '../utils';
import { UserService } from '../../services/user.service';
import {  SalesService } from '../../services/sales.service';
import {  BoatService } from '../../services/boats.service';


export interface BoatSel {
    name: string
    code: string
}

@Component({
    selector: 'list-negotiations-alerts',
    imports: [DialogModule, MessageModule, ButtonGroupModule, ConfirmDialogModule, TableModule, SelectModule, ToastModule, InputIconModule, InputTextModule, IconFieldModule, DataViewModule, RippleModule, ButtonModule, CommonModule, FormsModule, ReactiveFormsModule, PaginatorModule],
    providers: [MessageService, ConfirmationService],
    styleUrls: [],
    standalone: true,

    template: `
    <p-toast></p-toast>
    <div style='padding:1rem;'>
        <p-table [size]="selectedSize" [value]="alerts()" stripedRows selectionMode="multiple" [(selection)]="selectedUsers" dataKey="id" [tableStyle]="{ 'min-width': '50rem', 'margin-top':'10px' }"
            #dt
            [rows]="10"
            [globalFilterFields]="['name']"
            [rowHover]="true"
            dataKey="id"
        >
            <ng-template #header>
                <tr>
                    <th pSortableColumn="customer_name">
                        Cliente
                        <p-sortIcon field="customer_name" />
                    </th>

                    <th>
                        Motivo do alerta
                    </th>

                    <th>
                        Data de alerta
                    </th>

                    <th></th>
                </tr>
            </ng-template>

            <ng-template #body let-aler>
                <tr [pSelectableRow]="aler">
                    <td>
                        {{ aler.customer_name }}
                    </td>

                    <td>
                        {{ aler.motive }}
                    </td>

                    <td>
                        {{ aler.date | date:'dd/MM/yyyy' }}
                    </td>

                    <td>
                        <p-buttongroup>
                            <p-button (click)="reactivateNegotiation(aler.id_business)" icon="pi pi-pencil" severity="contrast" rounded/>
                            <p-button [style]="{color: 'green'}" (click)="_openWpp(aler.customer_phone)" icon="pi pi-whatsapp" severity="contrast" rounded/>
                        </p-buttongroup>
                    </td>
                </tr>

            </ng-template>
        </p-table>
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
export class ListNegotiationsAlertsComponent {
    constructor(
        public formBuilder: FormBuilder,
        private messageService: MessageService,
        private userService: UserService,
        private salesService: SalesService,
        private boatService: BoatService,
        private confirmationService: ConfirmationService,
    ) { }


    selectedSize: any = { name: 'Small', value: 'small' }

    @Input() alerts: any
    @Input() closeAlertModal: any

    selectedUsers!: any[] 
    isLoading: boolean = false

    confirmLabel = "Confirmar"
    rejectLabel = "Cancelar"


    ngOnInit() {

    }

    reactivateNegotiation(id: string) {
        this.confirmationService.confirm({
            message: `Confirma reativar a negociação` + '?',
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
                this.salesService.reactivateNegotiation(id).subscribe({
                    next: (res: any) => {
                        this.messageService.add({ severity: 'success', summary: "Sucesso", detail: 'Pedido/orçamento atualizado com sucesso' });
                        
                        this.isLoading = false
                        this.closeAlertModal()
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

    _openWpp(phone: string){ // alias
        openWpp(phone)
    }

    getSeverity(_data: any) {
        if (_data.active == `Y`) {
            return "success"
        } else {
            return "danger"
        }
    }

    getActiveState(_data: any) {
        if (_data.active == `Y`) {
            return "Ativo"
        } else {
            return "Inativo"
        }
    }

}

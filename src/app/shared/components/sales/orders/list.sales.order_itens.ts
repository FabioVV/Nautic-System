import { CommonModule } from '@angular/common';
import { Component, Input, signal, ViewChild } from '@angular/core';
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
import { finalize } from 'rxjs';
import { ConfirmationService } from 'primeng/api';
import { InputNumberModule } from 'primeng/inputnumber';


import { SalesService } from '../../../services/sales.service';


@Component({
    selector: 'list-sales-orders-boat-itens',
    imports: [DialogModule, MessageModule, InputNumberModule, ButtonGroupModule, ConfirmDialogModule, TableModule, SelectModule, ToastModule, InputIconModule, InputTextModule, IconFieldModule, DataViewModule, RippleModule, ButtonModule, CommonModule, FormsModule, ReactiveFormsModule, PaginatorModule],
    providers: [MessageService, ConfirmationService],
    styleUrls: [],
    standalone: true,

    template: `
    <p-toast></p-toast>
    <p-table [value]="salesOrderItens()" stripedRows selectionMode="multiple" [(selection)]="selectedUsers" dataKey="id" [tableStyle]="{ 'min-width': '50rem', 'margin-top':'10px' }"
        #dt
        [rows]="10"
        [globalFilterFields]="['name']"
        [rowHover]="true"
        dataKey="id"
    >

        <ng-template #header>
            <tr>
                <th pSortableColumn="id_accessory">
                    Cód. Acessório
                    <p-sortIcon field="id_accessory" />
                </th>

                <th pSortableColumn="model">
                    Modelo
                    <p-sortIcon field="model" />
                </th>

                <th pSortableColumn="price">
                    Preço
                    <p-sortIcon field="price" />
                </th>

                <th>
                    Quantidade
                </th>


                <th></th>
            </tr>
        </ng-template>

        <ng-template #body let-acc>
            <tr [pSelectableRow]="acc">
                <td>
                    {{ acc.id_accessory }}
                </td>

                <td>
                    {{ acc.model }}
                </td>

                <td>
                    {{ acc.unit_price }}
                </td>

                <td>
                    <p-inputnumber (onInput)="changeAccQty($event, this.id, acc.id)" [(ngModel)]="acc.qty" [useGrouping]="false" class=""  />
                </td>

                <td>
                    <p-buttongroup>
                        <p-button (click)="removeAccessory(this.id, acc.id, acc.model)" icon="pi pi-trash" severity="contrast" rounded/>
                    </p-buttongroup>
                </td>
            </tr>

        </ng-template>
    </p-table>


    <p-confirmdialog
        [rejectLabel]="rejectLabel"
        [acceptLabel]="confirmLabel"
        [acceptAriaLabel]="confirmLabel"
        [rejectAriaLabel]="rejectLabel"
        [style]="{ width: '550px' }"
    />

    `,
})
export class ListSalesOrderBoatItensComponent {
    constructor(
        public formBuilder: FormBuilder,
        private messageService: MessageService,
        private confirmationService: ConfirmationService,
        private salesService: SalesService,

    ) { }

    salesOrderItens = signal<any[]>([])
    id: string = ""
    _name: string = ""

    selectedUsers!: any[] 
    isLoading: boolean = false


    confirmLabel = "Confirmar"
    rejectLabel = "Cancelar"


    ngOnInit() {

    }

    loadSalesOrdersBoatItens(id: string) {
        this.salesService.getSalesOrderItens(id).pipe(finalize(() => { })).subscribe({
            next: (res: any) => {
                this.salesOrderItens.set(res.data ?? [])
                this.id = id
            },
            error: (err) => {
                if (err.status) {
                    this.messageService.add({ severity: 'error', summary: "Erro", detail: 'Ocorreu um erro ao buscar acessórios.' });
                }
                this.isLoading = false
            },
        })
    }

    changeAccQty(input: any, id_sales_order: string, id_accessory: string){
        console.log(input?.value)

        if(input?.value < 0){
            this.messageService.add({ severity: 'error', summary: "Erro", detail: 'Quantidade de itens não pode ser negativa.' });
            return
        }

        if(input?.value == 0){
            this.salesService.removeSalesOrderAccessory(id_sales_order, id_accessory).subscribe({
                next: (res: any) => {
                    this.messageService.add({ severity: 'success', summary: "Sucesso", detail: 'Pedido/orçamento atualizado com sucesso' });
                    
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

            return
        }

        this.salesService.salesOrderchangeItemQty(id_sales_order, id_accessory, {qty: input?.value}).subscribe({
            next: (res: any) => {
                this.messageService.add({ severity: 'success', summary: "Sucesso", detail: 'Pedido/orçamento atualizado com sucesso' });
                
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

    removeAccessory(id_sales_order: string, id_accessory: string, model:string){
        this.confirmationService.confirm({
            message: `Confirma remover ${model} do pedido/orçamento` + '?',
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
                this.salesService.removeSalesOrderAccessory(id_sales_order, id_accessory).subscribe({
                    next: (res: any) => {
                        this.messageService.add({ severity: 'success', summary: "Sucesso", detail: 'Pedido/orçamento atualizado com sucesso' });
                        
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
        })
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

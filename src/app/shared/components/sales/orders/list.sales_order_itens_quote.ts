import { CommonModule } from '@angular/common';
import { Component, input, Input, signal, ViewChild } from '@angular/core';
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
    selector: 'list-sales-orders-quote-boat-itens',
    imports: [DialogModule, MessageModule, InputNumberModule, ButtonGroupModule, ConfirmDialogModule, TableModule, SelectModule, ToastModule, InputIconModule, InputTextModule, IconFieldModule, DataViewModule, RippleModule, ButtonModule, CommonModule, FormsModule, ReactiveFormsModule, PaginatorModule],
    providers: [MessageService, ConfirmationService],
    styleUrls: [],
    standalone: true,

    template: `
    <p-toast></p-toast>
    <p-table [value]="salesOrderItens()" [tableStyle]="{ 'min-width': '50rem' }">
        <ng-template #header>
            <tr>
                <th>Cód.</th>
                <th>Modelo</th>
                <th>Preço unidade</th>
                <th>Quantidade</th>
            </tr>
        </ng-template>
        <ng-template #body let-acc>
            <tr>
                <td>{{ acc.id_accessory }}</td>
                <td>{{ acc.model }}</td>
                <td>{{ acc.unit_price }}</td>
                <td>{{ acc.qty }}</td>
            </tr>
        </ng-template>
    </p-table>

    `,
})
export class ListSalesOrderQuoteBoatItensComponent {
    constructor(
        public formBuilder: FormBuilder,
        private messageService: MessageService,
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
        this.salesService.getSalesOrderQuoteItens(id).pipe(finalize(() => { })).subscribe({
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

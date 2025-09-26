import { CommonModule } from '@angular/common';
import { Component, inject, Input, ViewChild } from '@angular/core';
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
import { Dialog } from 'primeng/dialog'
import { TabsModule } from 'primeng/tabs';
import { ListCustomerNegotiationHistoryComponent } from './list.customer_negotiation_history';

import { showLoading } from '../utils';
import { UserService } from '../../services/user.service';
import { SalesService } from '../../services/sales.service';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
    selector: 'open-customer-sales',
    imports: [DialogModule, TabsModule, MessageModule, ListCustomerNegotiationHistoryComponent, ButtonGroupModule, ConfirmDialogModule, TableModule, SelectModule, ToastModule, InputIconModule, InputTextModule, IconFieldModule, DataViewModule, RippleModule, ButtonModule, CommonModule, FormsModule, ReactiveFormsModule, PaginatorModule],
    providers: [MessageService, ConfirmationService],
    styleUrls: [],
    standalone: true,

    template: `
    <p-toast></p-toast>
    <p-dialog #cdialog [header]="title" [modal]="true" [(visible)]="visible" [style]="{ width: '50rem' }" [breakpoints]="{ '1199px': '75vw', '575px': '90vw' }" >
        <p-tabs value="0">
            <p-tablist>
                <p-tab value="0"><i class="pi pi-user"></i> Dados</p-tab>
                <p-tab value="1"><i class="pi pi-list"></i> Acompanhamentos</p-tab>
            </p-tablist>
            <p-tabpanels>

                <p-tabpanel value="0">

                </p-tabpanel>

                <p-tabpanel value="1">
                    <list-negotiation-customer-history #negHistory/>
                </p-tabpanel>
                
            </p-tabpanels>
        </p-tabs>
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
    private sanitizer = inject(DomSanitizer)

    visible: boolean = false
    id: string = ""
    url: any

    ngOnInit() {

    }

    showCustomer(id: string) {
        this.visible = true
        this.id = id

        this.myDialog.maximizable = true
        this.myDialog.maximize()
        this.negotiationHistory.loadNegotiationHistory(this.id)
    }
}

import { CommonModule } from '@angular/common';
import { Component, Input, ViewChild } from '@angular/core';
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

import { showLoading } from '../utils';
import { UserService } from '../../services/user.service';
import { SalesService } from '../../services/sales.service';

@Component({
    selector: 'open-customer-sales',
    imports: [DialogModule, MessageModule, ButtonGroupModule, ConfirmDialogModule, TableModule, SelectModule, ToastModule, InputIconModule, InputTextModule, IconFieldModule, DataViewModule, RippleModule, ButtonModule, CommonModule, FormsModule, ReactiveFormsModule, PaginatorModule],
    providers: [MessageService, ConfirmationService],
    styleUrls: [],
    standalone: true,

    template: `
    <p-toast></p-toast>
    <p-dialog #cdialog [header]="title" [modal]="true" [(visible)]="visible" [style]="{ width: '50rem' }" [breakpoints]="{ '1199px': '75vw', '575px': '90vw' }" >
        <iframe id="customer_iframe" src="http://localhost:4200/sales/negotiation-panel" frameborder="0" marginwidth="0" marginheight="0" style="width: 100%; height: 99%;"></iframe>
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
    @Input() title: any

    visible: boolean = false
    id: string = ""

    ngOnInit() {

    }

    showCustomer(id: string) {
        this.visible = true
        this.id = id

        this.myDialog.maximizable = true
        this.myDialog.maximize()
    }
}

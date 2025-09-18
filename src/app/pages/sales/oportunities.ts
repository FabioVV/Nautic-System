import { Component, OnInit, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MessageService } from 'primeng/api';
import { TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
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
import { SelectModule } from 'primeng/select';

import { SalesService, SalesCustomer } from '../../shared/services/sales.service';
import { ListOportunitiesComponent } from '../../shared/components/sales/list.oportunities';

export interface AccStatus {
    name: string
    code: string
}

@Component({
    selector: 'app-sales-oportunities',
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
        SelectModule,
        ListOportunitiesComponent,
    ],
    providers: [MessageService],
    template: `
    <p-toast></p-toast>
    <list-oportunities></list-oportunities>
    `
})
export class SalesOportunitiesPage implements OnInit {

    constructor(
        public formBuilder: FormBuilder,
        private messageService: MessageService,
        private salesService: SalesService,
    ) { }

    submitted: boolean = false
    isSubmited: boolean = false
    isLoading: boolean = false

    ngOnInit(): void {
        //this.loadSalesCustomers()
    }

}

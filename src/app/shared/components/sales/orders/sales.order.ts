import { CommonModule } from '@angular/common';
import { Component, inject, Input, ViewChild } from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import { DataViewModule } from 'primeng/dataview';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { PaginatorModule } from 'primeng/paginator';
import { FormsModule, ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
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
import { FieldsetModule } from 'primeng/fieldset';
import { TextareaModule } from 'primeng/textarea';
import { InputMaskModule } from 'primeng/inputmask';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { DatePickerModule } from 'primeng/datepicker';
import { SalesService } from '../../../services/sales.service';
import { UserService } from '../../../services/user.service';



@Component({
    selector: 'open-customer-sales',
    imports: [DialogModule, TabsModule, DatePickerModule, InputMaskModule, InputNumberModule, InputGroupAddonModule, TextareaModule, FieldsetModule, MessageModule, ButtonGroupModule, ConfirmDialogModule, TableModule, SelectModule, ToastModule, InputIconModule, InputTextModule, IconFieldModule, DataViewModule, RippleModule, ButtonModule, CommonModule, FormsModule, ReactiveFormsModule, PaginatorModule],
    providers: [MessageService, ConfirmationService],
    styleUrls: [],
    standalone: true,

    template: `
    <p-toast></p-toast>
    <div style='display:none;'>
        <p-message severity="warn"></p-message>
    </div>

    <p-dialog #cdialog [header]="title" [modal]="true" [(visible)]="visible" [style]="{ width: '50rem' }" [breakpoints]="{ '1199px': '75vw', '575px': '90vw' }" >
      
        <div *ngIf="showFraudDiv" style='margin-top:5px; margin-bottom:5px; background: var(--p-message-warn-background); outline-color: var(--p-message-warn-border-color); color: var(--p-message-warn-color); box-shadow: var(--p-message-warn-shadow);'>
            <div class='p-message-content' style='justify-content: center;'>
                Cliente suspeito de fraude
            </div>
        </div>

        <p-tabs value="0">
            <p-tablist>
                <p-tab value="0"><i class="pi pi-user"></i> Dados</p-tab>
                <p-tab value="1"><i class="pi pi-list"></i> itens</p-tab>
                <p-tab value="2"><i class="pi pi-list"></i> Arquivos</p-tab>

            </p-tablist>
            <p-tabpanels>

                <p-tabpanel value="0">
                    <form [formGroup]="salesOrderForm" (ngSubmit)="onSubmit()">
                        <button id="btn_submit" style='display:none;' type="submit"></button>


                    </form>
                </p-tabpanel>

                <p-tabpanel value="1">

                </p-tabpanel>

                <p-tabpanel value="2">

                </p-tabpanel>
                
            </p-tabpanels>
        </p-tabs>

        <ng-template #footer>
            <p-button type="submit" label="Salvar" (click)="submit()" icon="pi pi-check" id="action-acom-button"/>
        </ng-template>
    </p-dialog>
    `,
})
export class SalesOrderModal {
    constructor(
        public formBuilder: FormBuilder,
        private messageService: MessageService,
        private userService: UserService,
        private salesService: SalesService,
    ) { }

    @ViewChild('cdialog') myDialog!: Dialog

    @Input() title: any

    isLoading: boolean = false
    submitted: boolean = false
    visible: boolean = false
    id: string = ""

    salesOrderForm = this.formBuilder.group({

    })

    submit() {
        document.getElementById(`btn_submit`)?.click()
    }

    ngOnInit() {

    }

    onSubmit(){
        this.submitted = true

    }

    loadSalesOrder(id: string){

    }

    isInvalid(controlName: string) {
        const control = this.salesOrderForm.get(controlName)
        return control?.invalid && (control.touched || this.submitted)
    }

    hasBeenSubmited(controlName: string): boolean {
        const control = this.salesOrderForm.get(controlName)
        return Boolean(control?.invalid)
            && (this.submitted || Boolean(control?.touched))
        //|| Boolean(control?.dirty
    }
}

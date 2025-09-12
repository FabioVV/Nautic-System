import { Component, OnInit, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Table, TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators, ValidatorFn, AbstractControl } from '@angular/forms';
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


import { AccessoryService, Accessory } from '../../../shared/services/accessories.service';
import { ListAccessoriesComponent } from '../../../shared/components/products/list.accessories';

export interface AccStatus {
    name: string
    code: string
}

@Component({
    selector: 'app-accessory',
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
        ListAccessoriesComponent,
    ],
    providers: [MessageService, ConfirmationService],
    template: `
    <p-toast></p-toast>
    <p-toolbar styleClass="mb-6">

    <ng-template #start>
    <p-button label="Novo acessório" icon="pi pi-plus" severity="secondary" class="mr-2" (onClick)="openNew()" />


    </ng-template>

    <ng-template #end>
    </ng-template>
    </p-toolbar>

    <p-dialog [(visible)]="accDialog" header="Registrar acessório" [modal]="true">
    <ng-template #content>
    <form [formGroup]="form" (ngSubmit)="onSubmit()" style='margin-bottom: 4rem;'>
        <button id="btn_submit" style='display:none;' type="submit"></button>


    </form>


    <ng-template #footer>
    <p-button label="Cancelar" icon="pi pi-times" text (click)="hideDialog()" />
    <p-button [disabled]="isLoading" (click)="submit()" type="submit" label="Salvar" icon="pi pi-check" />
    </ng-template>

    </ng-template>
    </p-dialog>

    <list-accessories [accessories]="accessories" [totalRecords]="totalRecords" [limitPerPage]="limitPerPage" ></list-accessories>
    `
})
export class AccessoriesPage implements OnInit {

    constructor(
        public formBuilder: FormBuilder,
        private messageService: MessageService,
        private confirmationService: ConfirmationService,
        private accessoryService: AccessoryService,

    ) { }

    submitted: boolean = false;
    isSubmited: boolean = false
    isLoading: boolean = false
    accDialog: boolean = false;
    totalRecords = 0;
    limitPerPage = 20;

    accessories = signal<Accessory[]>([]);

    form = this.formBuilder.group({


    })

    ngOnInit(): void {
        this.loadAccessories()
    }


    loadAccessories() {
        this.accessoryService.getAccessories(1, this.limitPerPage, "", "").subscribe({
            next: (res: any) => {
                this.accessories.set(res.data ?? [])
                this.totalRecords = res.totalRecords
            },
            error: (err) => {
                if (err.status) {
                    this.messageService.add({ severity: 'error', summary: "Erro", detail: 'Ocorreu um erro ao buscar acessórios.' });
                }
                this.isLoading = false
            },
        })
    }

    hideDialog() {
        this.accDialog = false;
        this.submitted = false;
    }

    openNew() {
        this.submitted = false;
        this.accDialog = true;
    }

    submit() {
        document.getElementById(`btn_submit`)?.click()
    }

    onSubmit() {
        this.isSubmited = true

        if (this.form.valid) {
            this.isLoading = true

            // this.userService.registerUser(this.form.value).subscribe({
            //     next: (res: any) => {
            //         this.messageService.add({ severity: 'success', summary: "Sucesso", detail: 'Usuário registrado com sucesso' });
            //         this.loadUsers()
            //         this.isSubmited = false
            //         this.isLoading = false
            //         this.hideDialog()
            //         this.form.reset()
            //     },
            //     error: (err) => {
            //         if (err?.status == 400 && err?.error?.ErrCode === 'u1') {
            //             this.messageService.add({ severity: 'error', summary: "Erro", detail: 'E-mail já existente' });
            //         } else {
            //             this.messageService.add({ severity: 'error', summary: "Erro", detail: 'Ocorreu um erro com sua requisição.' });
            //
            //         }
            //         this.isLoading = false
            //     },
            //
            // })
        }
    }

    hasBeenSubmited(controlName: string): boolean {
        const control = this.form.get(controlName)
        return Boolean(control?.invalid)
            && (this.isSubmited || Boolean(control?.touched))
        //|| Boolean(control?.dirty
    }

    isInvalid(controlName: string) {
        const control = this.form.get(controlName);
        return control?.invalid && (control.touched || this.isSubmited);
    }
}

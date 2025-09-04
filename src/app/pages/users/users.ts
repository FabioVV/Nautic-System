import { Component, OnInit, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Table, TableModule } from 'primeng/table';
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
import { ListUsersComponent } from '../../shared/components/users/list.users';
import { User, UserService } from '../../shared/services/user.service';


export interface UserStatus {
    name: string
    code: string
}

@Component({
    selector: 'app-users',
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
        ListUsersComponent,
    ],
    providers: [MessageService, ConfirmationService],
    template: `
    <p-toast></p-toast>
    <p-toolbar styleClass="mb-6">
    <ng-template #start>
        <p-button label="Novo usuário" icon="pi pi-plus" severity="secondary" class="mr-2" (onClick)="openNew()" />

    <!-- <p-button severity="secondary" label="Excluir professor" icon="pi pi-trash" outlined (onClick)="deleteSelectedProducts()" [disabled]="!selectedProducts || !selectedProducts.length" /> -->
    </ng-template>

    <ng-template #end>
    </ng-template>
    </p-toolbar>

    <p-dialog [(visible)]="userDialog" [style]="{ width: '450px' }" header="Registrar turma" [modal]="true">
    <ng-template #content>
    <form [formGroup]="form" (ngSubmit)="onSubmit()">
    <button id="btn_submit" style='display:none;' type="submit"></button>

    <div class="flex flex-col gap-6">
    <div>
    <label for="Name" class="block font-bold mb-3">Nome</label>
    <input formControlName="Name" class="w-full md:w-[30rem] mb-2" type="text" pInputText id="Name" required autofocus fluid />
    <div class="error-feedback" *ngIf="hasBeenSubmited('Name')">
    <p-message styleClass="mb-2" *ngIf="form.controls.Name.hasError('required')" severity="error" variant="simple" size="small">Por favor, digitar um nome</p-message>
    </div>
    </div>
    <div>
    <label for="Description" class="block font-bold mb-3">Descrição</label>
    <input formControlName="Description" class="w-full md:w-[30rem] mb-2" type="text" pInputText id="Description" required autofocus fluid />
    <div class="error-feedback" *ngIf="hasBeenSubmited('Description')">
    <p-message styleClass="mb-2" *ngIf="form.controls.Description.hasError('required')" severity="error" variant="simple" size="small">Por favor, digitar uma descrição</p-message>
    </div>
    </div>
    </div>

    </form>


    <ng-template #footer>
    <p-button label="Cancelar" icon="pi pi-times" text (click)="hideDialog()" />
    <p-button [disabled]="isLoading" (click)="submit()" type="submit" label="Salvar" icon="pi pi-check" />
    </ng-template>

    </ng-template>
    </p-dialog>

    <list-users [users]="users" [totalRecords]="totalRecords" [limitPerPage]="limitPerPage" ></list-users>
    `
})
export class UsersPage implements OnInit {

    constructor(
        public formBuilder: FormBuilder,
        private messageService: MessageService,
        private userService: UserService,
        private confirmationService: ConfirmationService,

    ) { }

    submitted: boolean = false;
    isSubmited: boolean = false
    isLoading: boolean = false
    userDialog: boolean = false;
    totalRecords = 0;
    limitPerPage = 20;

    users = signal<User[]>([]);


    form = this.formBuilder.group({
        Name: ['', [Validators.required]],
        Description: ['', [Validators.required]],
    })

    ngOnInit(): void {
        this.loadUsers()
    }

    loadUsers() {
        this.userService.getUsers(1, this.limitPerPage, "", "", "").subscribe({
            next: (res: any) => {
                this.users.set(res.data ?? [])
                this.totalRecords = res.totalRecords
            },
            error: (err) => {
                if (err.status) {
                    this.messageService.add({ severity: 'error', summary: "Erro", detail: 'Ocorreu um erro ao buscar usuários.' });
                }
                this.isLoading = false
            },
        })
    }

    hideDialog() {
        this.userDialog = false;
        this.submitted = false;
    }

    openNew() {
        this.submitted = false;
        this.userDialog = true;
    }

    submit() {
        document.getElementById(`btn_submit`)?.click()
    }

    onSubmit() {
        this.isSubmited = true

        if (this.form.valid) {
            this.isLoading = true
            /*
                        this.classService.registerClass(this.form.value).subscribe({
                            next: (res: any) => {
                                this.messageService.add({ severity: 'success', summary: "Sucesso", detail: 'Turma registrada com sucesso' });
                                this.loadClasses()
                                this.isSubmited = false
                                this.isLoading = false
                                this.hideDialog()
                                this.form.reset()
                            },
                            error: (err) => {
                                if (err.status == 400) {
                                    this.messageService.add({ severity: 'error', summary: "Erro", detail: 'Ocorreu um erro com sua requisição.' });
                                } else {
                                    this.messageService.add({ severity: 'error', summary: "Erro", detail: 'Ocorreu um erro com sua requisição.' });

                                }
                                this.isLoading = false
                            },

                        })*/
        }
    }

    hasBeenSubmited(controlName: string): boolean {
        const control = this.form.get(controlName)
        return Boolean(control?.invalid)
            && (this.isSubmited || Boolean(control?.touched))
        //|| Boolean(control?.dirty
    }
}

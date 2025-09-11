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


import { ListUsersComponent } from '../../shared/components/users/list.users';
import { User, UserService } from '../../shared/services/user.service';
import { PASSWORD_PATTERN_VALIDATOR } from '../../shared/constants';

export interface UserStatus {
    name: string
    code: string
}

interface Cargo {
    name: string;
    code: string;
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
        SelectModule,
        ListUsersComponent,
    ],
    providers: [MessageService, ConfirmationService],
    template: `
    <p-toast></p-toast>
    <p-toolbar styleClass="mb-6">

        <ng-template #start>
            <p-button label="Novo usuário" icon="pi pi-plus" severity="secondary" class="mr-2" (onClick)="openNew()" />


        </ng-template>

        <ng-template #end>
        </ng-template>
    </p-toolbar>

    <p-dialog [(visible)]="userDialog" header="Registrar usuário" [modal]="true">
    <ng-template #content>
    <form [formGroup]="form" (ngSubmit)="onSubmit()" style='margin-bottom: 4rem;'>
        <button id="btn_submit" style='display:none;' type="submit"></button>

        <div class='row'>

            <div class='col-md-6'>
                <label for="Name" class="block font-bold mb-3">Nome</label>
                <input formControlName="Name" class="w-full md:w-[30rem] mb-2" type="text" pInputText id="Name" required autofocus fluid />
                <div class="error-feedback" *ngIf="hasBeenSubmited('Name')">
                    <p-message styleClass="mb-2" *ngIf="form.controls.Name.hasError('required')" severity="error" variant="simple" size="small">Por favor, digitar um nome</p-message>
                </div>
            </div>

            <div class='col-md-6'>
                <label for="Email" class="block font-bold mb-3">E-mail</label>
                <input formControlName="Email" class="w-full md:w-[30rem] mb-2" type="text" pInputText id="Email" required autofocus fluid />

                <div class="error-feedback" *ngIf="hasBeenSubmited('Email')">
                    <p-message styleClass="mb-2" *ngIf="form.controls.Email.hasError('required')" severity="error" variant="simple" size="small">Por favor, digitar um E-email</p-message>
                    <p-message styleClass="mb-2" *ngIf="form.controls.Email.hasError('Email')" severity="error" variant="simple" size="small">Por favor, digitar um E-mail válido</p-message>
                </div>

            </div>

        </div>

        <div class='row'>
            <div class='col-md-6'>
                <label for="Phone" class="block font-bold mb-3">Telefone</label>

                <input formControlName="Phone" class="w-full md:w-[30rem] mb-2" type="text" pInputText id="Phone" required autofocus fluid />

                <div class="error-feedback" *ngIf="hasBeenSubmited('Phone')">
                    <p-message styleClass="mb-2" *ngIf="form.controls.Phone.hasError('required')" severity="error" variant="simple" size="small">Por favor, digitar um telefone</p-message>
                </div>
            </div>

            <div class='col-md-6'>
                <label for="ConfirmPassword" class="block font-bold mb-3">Cargo</label>

                <p-select [invalid]="isInvalid('Cargo')" [options]="cargos" formControlName="Cargo" optionLabel="name" placeholder="Selecione um cargo" class="w-full mb-2" />
                @if (isInvalid('Cargo')) {
                    <p-message severity="error" size="small" variant="simple">Por favor, selecione um cargo</p-message>
                }
            </div>

        </div>

        <div class='row'>
            <div class='col-md-6'>
                <label for="Password" class="block font-bold mb-3">Senha</label>

                <p-password formControlName="Password" id="Password"  placeholder="********" [toggleMask]="true" styleClass="mb-2" [fluid]="true" [feedback]="false"></p-password>

                <div class="error-feedback" *ngIf="hasBeenSubmited('Password')">
                    <p-message styleClass="mb-2" *ngIf="form.controls.Password.hasError('passwordMismatch')" severity="error" variant="simple" size="small">Por favor, digitar senhas que coincidem</p-message>
                    <p-message styleClass="mb-2" *ngIf="form.controls.Password.hasError('pattern')" severity="error" variant="simple" size="small">
                        Por favor, digite uma senha que contenha:<br />
                        6 caracteres minúsculos <br />
                        1 caractere maiúsculo <br />
                        1 dígito <br />
                        1 caractere especial
                    </p-message>
                </div>
            </div>

            <div class='col-md-6'>
                <label for="ConfirmPassword" class="block font-bold mb-3">Confirme a senha</label>

                <p-password formControlName="ConfirmPassword" id="ConfirmPassword"  placeholder="********" [toggleMask]="true" styleClass="mb-2" [fluid]="true" [feedback]="false"></p-password>

                <div class="error-feedback" *ngIf="hasBeenSubmited('ConfirmPassword')">
                    <p-message styleClass="mb-2" *ngIf="form.controls.ConfirmPassword.hasError('passwordMismatch')" severity="error" variant="simple" size="small">Por favor, digitar senhas que coincidem</p-message>
                    <p-message styleClass="mb-2" *ngIf="form.controls.ConfirmPassword.hasError('pattern')" severity="error" variant="simple" size="small">
                        Por favor, digite uma senha que contenha:<br />
                        6 caracteres minúsculos <br />
                        1 caractere maiúsculo <br />
                        1 dígito <br />
                        1 caractere especial
                    </p-message>

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

    passwordMatchValidator: ValidatorFn = (control: AbstractControl): null => {
        const password = control.get("Password")
        const confirmPassword = control.get("ConfirmPassword")

        if (password && confirmPassword && password.value != confirmPassword.value) {
            confirmPassword?.setErrors({ passwordMismatch: true })
        } else {
            confirmPassword?.setErrors(null)
        }

        return null
    }

    submitted: boolean = false;
    isSubmited: boolean = false
    isLoading: boolean = false
    userDialog: boolean = false;
    totalRecords = 0;
    limitPerPage = 20;

    users = signal<User[]>([]);
    cargos: Cargo[] = [{ name: 'Vendedor', code: 'NY' },
    { name: 'Montador', code: 'RM' },
    { name: 'Executivo', code: 'LDN' },
    { name: 'Administrador', code: 'IST' }]

    form = this.formBuilder.group({
        Name: ['', [Validators.required]],
        Email: ['', [Validators.required, Validators.email]],
        Password: ['', [Validators.pattern(PASSWORD_PATTERN_VALIDATOR)]],
        ConfirmPassword: ['', [Validators.pattern(PASSWORD_PATTERN_VALIDATOR)]],
        Phone: ['', [Validators.required]],
        Cargo: ['', [Validators.required]],

    }, { validators: [this.passwordMatchValidator] })

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

            this.userService.registerUser(this.form.value).subscribe({
                next: (res: any) => {
                    this.messageService.add({ severity: 'success', summary: "Sucesso", detail: 'Usuário registrado com sucesso' });
                    this.loadUsers()
                    this.isSubmited = false
                    this.isLoading = false
                    this.hideDialog()
                    this.form.reset()
                },
                error: (err) => {
                    if (err?.status == 400 && err?.error?.ErrCode === 'u1') {
                        this.messageService.add({ severity: 'error', summary: "Erro", detail: 'E-mail já existente' });
                    } else {
                        this.messageService.add({ severity: 'error', summary: "Erro", detail: 'Ocorreu um erro com sua requisição.' });

                    }
                    this.isLoading = false
                },

            })
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

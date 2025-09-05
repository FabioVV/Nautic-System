import { Component, OnInit, Renderer2, RendererStyleFlags2 } from '@angular/core';
import { MenuItem, MessageService } from 'primeng/api';
import { Router, RouterModule } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators, ValidatorFn, AbstractControl } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { StyleClassModule } from 'primeng/styleclass';
import { DialogModule } from 'primeng/dialog';
import { TooltipModule } from 'primeng/tooltip';
import { AppConfigurator } from './app.configurator';
import { LayoutService } from '../service/layout.service';
import { AuthService } from '../../shared/services/auth.service';
import { User, UserService } from '../../shared/services/user.service';
import { MessageModule } from 'primeng/message';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { SharedService } from '../../shared/services/shared.service';
import { ToastModule } from 'primeng/toast';
import { ThemeService } from '../../shared/services/theme.service';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faHeadset } from '@fortawesome/free-solid-svg-icons';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-topbar',
    standalone: true,
    imports: [TooltipModule, FontAwesomeModule, RouterModule, CommonModule, ReactiveFormsModule, StyleClassModule, DialogModule, MessageModule, PasswordModule, ButtonModule, InputTextModule, AppConfigurator, ToastModule, FormsModule],
    providers: [MessageService],
    template: ` 
    <p-toast></p-toast>

    <div class="layout-topbar">

        <div class="layout-topbar-logo-container">
            <button class="layout-menu-button layout-topbar-action" (click)="layoutService.onMenuToggle()">
                <i class="pi pi-bars"></i>
            </button>
            <a class="layout-topbar-logo" routerLink="/">
                <span>Nautic</span>
            </a>
        </div>


        <div class="layout-topbar-actions">
            <div class="layout-config-menu">
                <button type="button" class="layout-topbar-action" (click)="toggleDarkMode()">
                    <i [ngClass]="{ 'pi ': true, 'pi-moon': layoutService.isDarkTheme(), 'pi-sun': !layoutService.isDarkTheme() }"></i>
                </button>
                <div class="relative">
                    <button
                        class="layout-topbar-action layout-topbar-action-highlight"
                        pStyleClass="@next"
                        enterFromClass="hidden"
                        enterActiveClass="animate-scalein"
                        leaveToClass="hidden"
                        leaveActiveClass="animate-fadeout"
                        [hideOnOutsideClick]="true"
                    >
                        <i class="pi pi-palette"></i>
                    </button>
                    <app-configurator />
                </div>
            </div>

            <button class="layout-topbar-menu-button layout-topbar-action" pStyleClass="@next" enterFromClass="hidden" enterActiveClass="animate-scalein" leaveToClass="hidden" leaveActiveClass="animate-fadeout" [hideOnOutsideClick]="true">
                <i class="pi pi-ellipsis-v"></i>
            </button>

            <div class="layout-topbar-menu hidden lg:block">
                <button style='margin-right:10px;' (click)="openEditAccountModal()" type="button" class="layout-topbar-action">
                    <i class="pi pi-user"></i>
                    <span>Seu perfil</span>
                </button>



                <button (click)="logout()" type="button" class="layout-topbar-action">
                    <i class="pi pi-sign-out"></i>
                    <span>Sair</span>
                </button>
            </div>


            <p-dialog header="Editar sua conta" [modal]="true" (onHide)="closeEditAccountModal()" [(visible)]="editAccountVisible" [style]="{ width: '50rem', z_index: '100' }" [breakpoints]="{ '1199px': '75vw', '575px': '90vw' }">
                <form [formGroup]="form" (ngSubmit)="onSubmit()">
                    <div>

                        <label for="name" class="block text-surface-900 dark:text-surface-0 text-xl font-medium mb-2">Nome</label>
                        <input formControlName="name" pInputText id="name" type="text" placeholder="John Doe" class="w-full  mb-2" />
                        <div class="error-feedback" *ngIf="hasBeenSubmited('name')">

                            <p-message styleClass="mb-2" *ngIf="form.controls.name.hasError('required')" severity="error" variant="simple" size="small">Por favor, digitar seu nome</p-message>
                        </div>

                        <label for="email" class="block text-surface-900 dark:text-surface-0 text-xl font-medium mb-2">Email</label>
                        <input pInputText [disabled]="true" id="email" type="text" placeholder="john@email.com" class="w-full  mb-2" formControlName="email" />
                        <div class="error-feedback" *ngIf="hasBeenSubmited('email')">
                            <p-message styleClass="mb-2" *ngIf="form.controls.email.hasError('required')" severity="error" variant="simple" size="small">Por favor, digitar seu email de preferência</p-message>
                            <p-message styleClass="mb-2" *ngIf="form.controls.email.hasError('email')" severity="error" variant="simple" size="small">Por favor, digitar um email válido</p-message>
                        </div>

                        <br/>
                        <br/>
                        <br/>

                        <label for="oldPassword" class="block text-surface-900 dark:text-surface-0 font-medium text-xl mb-2">Senha antiga</label>
                        <p-password formControlName="oldPassword" id="oldPassword"  placeholder="********" [toggleMask]="true" styleClass="mb-2" [fluid]="true" [feedback]="false"></p-password>
                        <div class="error-feedback" *ngIf="hasBeenSubmited('oldPassword')">
                            <p-message styleClass="mb-2" *ngIf="form.controls.oldPassword.hasError('pattern')" severity="error" variant="simple" size="small">
                                Por favor, digite uma senha que contenha:<br />
                                6 caracteres minúsculos <br />
                                1 caractere maiúsculo <br />
                                1 dígito <br />
                                1 caractere especial
                            </p-message>
                        </div>

                        <label for="newPassword" class="block text-surface-900 dark:text-surface-0 font-medium text-xl mb-2">Senha nova</label>
                        <p-password formControlName="newPassword" id="newPassword"  placeholder="********" [toggleMask]="true" styleClass="mb-2" [fluid]="true" [feedback]="false"></p-password>
                        <div class="error-feedback" *ngIf="hasBeenSubmited('newPassword')">
                            <p-message styleClass="mb-2" *ngIf="form.controls.newPassword.hasError('oldPasswordDirty')" severity="error" variant="simple" size="small">Por favor, digitar a senha nova</p-message>
                            <p-message styleClass="mb-2" *ngIf="form.controls.newPassword.hasError('pattern')" severity="error" variant="simple" size="small">
                                Por favor, digite uma senha que contenha:<br />
                                6 caracteres minúsculos <br />
                                1 caractere maiúsculo <br />
                                1 dígito <br />
                                1 caractere especial
                            </p-message>
                        </div>

                        <label for="confirmPassword" class="block text-surface-900 dark:text-surface-0 font-medium text-xl mb-2">Confirmar senha nova</label>
                        <p-password formControlName="confirmPassword" id="confirmPassword"  placeholder="********" [toggleMask]="true" styleClass="mb-2" [fluid]="true" [feedback]="false"></p-password>
                        <div class="error-feedback" *ngIf="hasBeenSubmited('confirmPassword')">
                            <p-message styleClass="mb-2" *ngIf="form.controls.confirmPassword.hasError('required')" severity="error" variant="simple" size="small">Por favor, digitar uma senha</p-message>
                            <p-message styleClass="mb-2" *ngIf="form.controls.confirmPassword.hasError('passwordMismatch')" severity="error" variant="simple" size="small">Por favor, digitar senhas que coincidem</p-message>
                            <p-message styleClass="mb-2" *ngIf="form.controls.confirmPassword.hasError('pattern')" severity="error" variant="simple" size="small">
                                Por favor, digite uma senha que contenha:<br />
                                6 caracteres minúsculos <br />
                                1 caractere maiúsculo <br />
                                1 dígito <br />
                                1 caractere especial
                            </p-message>
                        </div>


                        <p-button [disabled]="isLoading" type="submit" label="Salvar" styleClass="w-full" ></p-button>
                    </div>
                </form>
            </p-dialog>

        </div>

    </div>

    `
})
export class AppTopbar implements OnInit {
    faHeadset = faHeadset

    items!: MenuItem[]
    userData: User = this.userService.getUserData()

    editAccountVisible!: boolean
    email: string | undefined = "Disabled"

    isSubmited: boolean = false
    isLoading: boolean = false
    passwordPattern: RegExp = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{6,}$/;


    passwordMatchValidator: ValidatorFn = (control: AbstractControl): null => {
        const password = control.get("newPassword")
        const confirmPassword = control.get("confirmPassword")

        if (password && confirmPassword && password.value != confirmPassword.value) {
            confirmPassword?.setErrors({ passwordMismatch: true })
        } else {
            confirmPassword?.setErrors(null)
        }

        return null
    }


    form = this.formBuilder.group({
        name: [this.userData.name, [Validators.required]],
        email: [{ value: this.userData.email, disabled: true }, [Validators.required, Validators.email]],
        oldPassword: ['', [Validators.pattern(this.passwordPattern)]],
        newPassword: ['', [Validators.pattern(this.passwordPattern)]],
        confirmPassword: ['', [Validators.pattern(this.passwordPattern)]],

    }, { validators: [this.passwordMatchValidator] })

    constructor(
        public layoutService: LayoutService,
        public formBuilder: FormBuilder,
        private authService: AuthService,
        private router: Router,
        private userService: UserService,
        private renderer: Renderer2,
        private shared: SharedService,
        private messageService: MessageService,
        private themeService: ThemeService
    ) {

    }

    ngOnInit(): void {
        this.authService.userData$.subscribe(data => { // To update the navbar automagically
            this.userData = data
        })
    }

    logout() {
        this.authService.logoutUser()
    }

    openEditAccountModal() {
        this.editAccountVisible = true
        this.renderer.setStyle(this.shared.getSidebar()?.nativeElement, 'z-index', '1', RendererStyleFlags2.Important)
    }

    closeEditAccountModal() {
        this.editAccountVisible = false;
        this.renderer.setStyle(this.shared.getSidebar()?.nativeElement, 'z-index', '999', RendererStyleFlags2.Important)
    }

    toggleDarkMode() {
        this.layoutService.layoutConfig.update((state) => ({ ...state, darkTheme: !state.darkTheme }));

        this.layoutService.configUpdate$.subscribe(data => {
            this.themeService.saveThemeMode(data)
        })
    }

    onSubmit() {
        this.isSubmited = true
        delete this.form.value.email

        if (this.form.valid) {
            this.isLoading = true

            this.userService.updateUser(this.userData.id, this.form.value).subscribe({
                next: (res: any) => {
                    if (res?.succeeded) {
                        this.isSubmited = false
                        this.authService.updateUserData(res.data)
                        this.messageService.add({ severity: 'success', summary: 'Conta atualizada', detail: 'Sua conta foi atualizada com sucesso.' });
                    }
                    this.isLoading = false
                },
                error: (err: any) => {
                    if (err.status == 400) {
                        this.messageService.add({ severity: 'error', summary: "Erro", detail: err.error?.description ?? "Por favor, verifique suas informações" });

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
}

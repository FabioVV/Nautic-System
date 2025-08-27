import { Component, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { RippleModule } from 'primeng/ripple';
import { AppFloatingConfigurator } from '../../layout/component/app.floatingconfigurator';
import { AuthService } from '../../shared/services/auth.service';
import { MessageService } from 'primeng/api';
import { CommonModule } from '@angular/common';
import { MessageModule } from 'primeng/message';
import { ToastModule } from 'primeng/toast';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [CommonModule, ButtonModule, ToastModule, MessageModule, InputTextModule, PasswordModule, ReactiveFormsModule, RouterModule, RippleModule, AppFloatingConfigurator],
    providers: [MessageService],
    template: `
        <app-floating-configurator />
        <p-toast></p-toast>
        <div class="bg-surface-50 dark:bg-surface-950 flex items-center justify-center min-h-screen min-w-[100vw] overflow-hidden">
            <div class="flex flex-col items-center justify-center">
                <div style="border-radius: 56px; padding: 0.3rem; background: linear-gradient(180deg, var(--primary-color) 10%, rgba(33, 150, 243, 0) 30%)">
                    <div class="w-full bg-surface-0 dark:bg-surface-900 py-20 px-8 sm:px-20" style="border-radius: 53px">
                        <div class="text-center mb-8">

                            <div class="text-surface-900 dark:text-surface-0 text-3xl font-medium mb-4">Bem vindo ao GradeHub!</div>
                            <span class="text-muted-color font-medium">Logue em sua conta para continuar</span>
                        </div>

                        <form [formGroup]="form" (ngSubmit)="onSubmit()">
                            <div>
                                <label for="email" class="block text-surface-900 dark:text-surface-0 text-xl font-medium mb-2">Email</label>
                                <input formControlName="email" pInputText id="email" type="text" placeholder="Email" class="w-full md:w-[30rem] mb-2" />
                                <div class="error-feedback" *ngIf="hasBeenSubmited('email')">
                                    <p-message styleClass="mb-2" *ngIf="form.controls.email.hasError('required')" severity="error" variant="simple" size="small">Por favor, digitar seu email de preferência</p-message>
                                    <p-message styleClass="mb-2" *ngIf="form.controls.email.hasError('email')" severity="error" variant="simple" size="small">Por favor, digitar um email válido</p-message>
                                </div>

                                <label for="password" class="block text-surface-900 dark:text-surface-0 font-medium text-xl mb-2">Senha</label>
                                <p-password formControlName="password" id="password"  placeholder="********" [toggleMask]="true" styleClass="mb-2" [fluid]="true" [feedback]="false"></p-password>
                                <div class="error-feedback" *ngIf="hasBeenSubmited('password')">
                                    <p-message styleClass="mb-2" *ngIf="form.controls.password.hasError('required')" severity="error" variant="simple" size="small">Por favor, digitar uma senha</p-message>
                                </div>
    
                                <p-button [disabled]="isLoading" type="submit" label="Entrar" styleClass="w-full" ></p-button>
                            </div>
                        </form>


                    </div>
                </div>
            </div>
        </div>
    `
})
export class Login implements OnInit {
    constructor(public formBuilder: FormBuilder, private service: AuthService, private messageService: MessageService, private router: Router) { }

    
  ngOnInit(): void {
    if (this.service.isLoggedIn()) {
      this.router.navigateByUrl("/dashboard")
    }
  }

  isSubmited: boolean = false
  isLoading: boolean = false

  form = this.formBuilder.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
  })

  onSubmit() {
    this.isSubmited = true
    if (this.form.valid) {
      this.isLoading = true

      this.service.loginUser(this.form.value).subscribe({
        next: (res: any) => {
          if (res.token) {
            this.isSubmited = false
            this.service.saveUserData(res)

            this.router.navigateByUrl("/dashboard");
          }
          this.isLoading = false

        },
        error: (err) => {
          if (err.status == 400) {
            this.messageService.add({ severity: 'error', summary: "Erro", detail: 'Email ou senha incorretos.' });

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

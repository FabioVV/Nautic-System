import { Component, HostListener, OnInit, signal } from '@angular/core';
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
import { CardModule } from 'primeng/card';
import { TooltipModule } from 'primeng/tooltip';
import { inject } from '@angular/core';
import { ElementRef } from '@angular/core';

import { User, UserService } from '../../shared/services/user.service';


export interface UserStatus {
    name: string
    code: string
}

@Component({
    selector: 'sales-negotiation',
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
        CardModule,
        TooltipModule,
    ],
    providers: [MessageService, ConfirmationService],
    styleUrl: "negotiation.css",
    template: `
    <p-toast></p-toast>
    <section class='kb-board'>

        <div class='kb-painel'>
            <div class='dropzone' (dragover)="dragover($event)" (dragenter)="dragenter($event)" (dragleave)="dragleave($event)">
                <h5>Lead</h5>
                <div class='kb-cards'>
                    <p-card draggable="true" (dragstart)="dragstart($event, '1')" id="1">
                        <h6 class='card-text' pTooltip="Enter your username" tooltipPosition="top">Fábio Gabriel Rodrigues Varela</h6>
                        <p class="m-0 card-text" pTooltip="Enter your username" tooltipPosition="top">
                            NX 250 Aenima 2.0 Volvo AAAAAAAAAAAAAAAAAAAAA
                        </p>
                        <br>
                        <small class="m-0 card-money">
                            R$ 100.000.000,00
                        </small>
                    </p-card>

                    <p-card draggable="true" (dragstart)="dragstart($event, '2')" id="2">
                    <h6 class='card-text' pTooltip="Enter your username" tooltipPosition="top">Fábio Gabriel Rodrigues Varela</h6>
                    <p class="m-0 card-text" pTooltip="Enter your username" tooltipPosition="top">
                    NX 250 Aenima 2.0 Volvo AAAAAAAAAAAAAAAAAAAAA
                    </p>
                    <br>
                    <small class="m-0 card-money">
                    R$ 100.000.000,00
                    </small>
                    </p-card>
                </div>
            </div>

            <div class='dropzone' (dragover)="dragover($event)" (dragenter)="dragenter($event)" (dragleave)="dragleave($event)" >
                <h5>Lead convertido</h5>
                <div class='kb-cards'>
                    <p-card draggable="true" (dragstart)="dragstart($event, '3')" id="3">
                    <h6 class='card-text' pTooltip="Enter your username" tooltipPosition="top">Fábio Gabriel Rodrigues Varela</h6>
                    <p class="m-0 card-text" pTooltip="Enter your username" tooltipPosition="top">
                    NX 250 Aenima 2.0 Volvo AAAAAAAAAAAAAAAAAAAAA
                    </p>
                    <br>
                    <small class="m-0 card-money">
                    R$ 100.000.000,00
                    </small>
                    </p-card>

                    <p-card draggable="true" (dragstart)="dragstart($event, '4')" id="4">
                    <h6 class='card-text' pTooltip="Enter your username" tooltipPosition="top">Fábio Gabriel Rodrigues Varela</h6>
                    <p class="m-0 card-text" pTooltip="Enter your username" tooltipPosition="top">
                    NX 250 Aenima 2.0 Volvo AAAAAAAAAAAAAAAAAAAAA
                    </p>
                    <br>
                    <small class="m-0 card-money">
                    R$ 100.000.000,00
                    </small>
                    </p-card>
                </div>
            </div>

            <div class='dropzone' (dragover)="dragover($event)" (dragenter)="dragenter($event)" (dragleave)="dragleave($event)" >
                <h5>Contato pessoal</h5>
                <div class='kb-cards'>
                </div>
            </div>

            <div class='dropzone' (dragover)="dragover($event)" (dragenter)="dragenter($event)" (dragleave)="dragleave($event)" >
                <h5>Negociando</h5>
                <div class='kb-cards'>
                </div>
            </div>

            <div class='dropzone' (dragover)="dragover($event)" (dragenter)="dragenter($event)" (dragleave)="dragleave($event)" >
                <h5>Fechamento</h5>
                <div class='kb-cards'>

                </div>
            </div>

            <div class='dropzone' (dragover)="dragover($event)" (dragenter)="dragenter($event)" (dragleave)="dragleave($event)" >
                <h5>Entrega</h5>
                <div class='kb-cards'>
                </div>
            </div>

        </div>

    </section>

    `
})
export class NegotiationPanel implements OnInit {

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
    elementRef = inject(ElementRef);

    users = signal<User[]>([]);


    form = this.formBuilder.group({
        Name: ['', [Validators.required]],
        Description: ['', [Validators.required]],
    })

    @HostListener('dragend', ['$event'])
    dragend(e: any) {
        const el = Array.from(this.elementRef.nativeElement.getElementsByClassName('p-card'))
        el.forEach((e: any) => {
            e.classList.remove('hide-card')
        })
    }

    ngOnInit(): void {
        this.loadUsers()
    }

    dragstart(e: any, dragItemId: string) {
        console.log(Array.from(this.elementRef.nativeElement.getElementsByClassName('p-card')))
        const el = Array.from(this.elementRef.nativeElement.getElementsByClassName('p-card'))
        el.forEach((e: any) => {

            if (dragItemId != e.id) {
                e.classList.add('hide-card')
            }
        })
    }


    dragenter(e: any) {
        const target = e.target.closest('.dropzone')
        if (!target) return
        target.classList.add('highlight-drag')
    }

    dragleave(e: any) {
        const target = e.target.closest('.dropzone')
        if (!target) return

        target.classList.remove('highlight-drag');

    }

    dragover(e: any) {
        e.preventDefault()
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

        }
    }

    hasBeenSubmited(controlName: string): boolean {
        const control = this.form.get(controlName)
        return Boolean(control?.invalid)
            && (this.isSubmited || Boolean(control?.touched))
        //|| Boolean(control?.dirty
    }
}

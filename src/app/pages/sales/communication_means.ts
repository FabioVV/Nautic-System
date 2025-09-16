import { Component, OnInit, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { TableModule } from 'primeng/table';
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

import { SalesService, ComMean } from '../../shared/services/sales.service';
import { ListCommunicationMeansComponent } from '../../shared/components/sales/list.communication_means';


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
        ListCommunicationMeansComponent,
    ],
    providers: [MessageService, ConfirmationService],
    template: `
    <p-toast></p-toast>
    <p-toolbar styleClass="mb-6">

        <ng-template #start>
            <p-button label="Novo meio" icon="pi pi-plus" severity="secondary" class="mr-2" (onClick)="openNew()" />
        </ng-template>

        <ng-template #end>
        </ng-template>

    </p-toolbar>

    <p-dialog [(visible)]="accDialog" [style]="{ width: '500px' }" header="Registrar meio" [modal]="true">
    <ng-template #content>
        <form [formGroup]="form" (ngSubmit)="onSubmit()" style='margin-bottom: 4rem;'>
            <button id="btn_submit" style='display:none;' type="submit"></button>

            <div class='row'>
                <div class='col-md-12'>
                    <label for="Name" class="block font-bold mb-3">Nome do meio de comunicação</label>
                    <input formControlName="Name" class="w-full md:w-[30rem] mb-2" type="text" pInputText id="Type" required autofocus fluid />
                    <div class="error-feedback" *ngIf="hasBeenSubmited('Name')">
                        <p-message styleClass="mb-2" *ngIf="form.controls.Name.hasError('required')" severity="error" variant="simple" size="small">Por favor, digitar um nome</p-message>
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

    <list-communication-means [communication_means]="communication_means" [totalRecords]="totalRecords" [limitPerPage]="limitPerPage" ></list-communication-means>
    `
})
export class CommunicationMeanPage implements OnInit {

    constructor(
        public formBuilder: FormBuilder,
        private messageService: MessageService,
        private confirmationService: ConfirmationService,
        private salesService: SalesService,

    ) { }

    submitted: boolean = false;
    isSubmited: boolean = false
    isLoading: boolean = false
    accDialog: boolean = false;
    totalRecords = 0;
    limitPerPage = 20;

    communication_means = signal<ComMean[]>([])

    form = this.formBuilder.group({
        Name: ['', [Validators.required]],
    })

    ngOnInit(): void {
        this.loadCommunicationMeans()
    }


    loadCommunicationMeans() {
        this.salesService.getComs(1, this.limitPerPage, "", "").subscribe({
            next: (res: any) => {
                this.communication_means.set(res.data ?? [])
                this.totalRecords = res.totalRecords
            },
            error: (err) => {
                if (err.status) {
                    this.messageService.add({ severity: 'error', summary: "Erro", detail: 'Ocorreu um erro ao buscar Meios.' });
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

            this.salesService.registerComMean(this.form.value).subscribe({
                next: (res: any) => {
                    this.messageService.add({ severity: 'success', summary: "Sucesso", detail: 'Meio registrado com sucesso' });
                    this.loadCommunicationMeans()
                    this.isSubmited = false
                    this.isLoading = false
                    this.hideDialog()
                    this.form.reset()
                },
                error: (err) => {
                    if (err?.status == 400 && err?.error?.errors?.type == "type already exists") {
                        this.messageService.add({ severity: 'error', summary: "Erro", detail: 'O Meio já existe' });
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

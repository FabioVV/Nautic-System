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
import { ListBoatsComponent } from '../../../shared/components/products/list.boats';
import { Boat, BoatService } from '../../../shared/services/boats.service';



export interface BoatNU {
    name: string
    code: string
}

@Component({
    selector: 'app-boats',
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
        ListBoatsComponent,
    ],
    providers: [MessageService, ConfirmationService],
    template: `
    <p-toast></p-toast>
    <p-toolbar styleClass="mb-6">

    <ng-template #start>
    <p-button label="Novo casco" icon="pi pi-plus" severity="secondary" class="mr-2" (onClick)="openNew()" />


    </ng-template>

    <ng-template #end>
    </ng-template>
    </p-toolbar>

    <p-dialog [(visible)]="userDialog" [style]="{width: '900px'}" header="Registrar casco" [modal]="true">
    <ng-template #content>
        <form [formGroup]="form" (ngSubmit)="onSubmit()" style='margin-bottom: 4rem;'>
            <button id="btn_submit" style='display:none;' type="submit"></button>

            <div class='row'>
                <div class='col-md-6'>
                    <label for="Details" class="block font-bold mb-3">Modelo</label>
                    <input formControlName="Model" class="w-full md:w-[30rem] mb-2" type="text" pInputText id="Type" required autofocus fluid />
                    
                    <div class="error-feedback" *ngIf="hasBeenSubmited('Model')">
                        <p-message styleClass="mb-2" *ngIf="form.controls.Model.hasError('required')" severity="error" variant="simple" size="small">Por favor, digitar o modelo do casco</p-message>
                    </div>
                </div>

                <div class='col-md-6'>
                    <label for="Details" class="block font-bold mb-3">Novo/Usado</label>
                    <p-select [invalid]="isInvalid('NewUsed')" [options]="boatNU" formControlName="NewUsed" optionLabel="name" placeholder="Selecione o se é usado ou novo" class="w-full mb-2" />
                    @if (isInvalid('NewUsed')) {
                        <p-message severity="error" size="small" variant="simple">Por favor, selecione um tipo</p-message>
                    }
                </div>

            </div>

        </form>


        <ng-template #footer>
            <p-button label="Cancelar" icon="pi pi-times" text (click)="hideDialog()" />
            <p-button [disabled]="isLoading" (click)="submit()" type="submit" label="Salvar" icon="pi pi-check" />
        </ng-template>

    </ng-template>
    </p-dialog>

    <list-boats [boats]="boats" [totalRecords]="totalRecords" [limitPerPage]="limitPerPage" ></list-boats>
    `
})
export class BoatsPage implements OnInit {

    constructor(
        public formBuilder: FormBuilder,
        private messageService: MessageService,
        private confirmationService: ConfirmationService,
        private boatsService: BoatService,

    ) { }

    submitted: boolean = false
    isSubmited: boolean = false
    isLoading: boolean = false
    userDialog: boolean = false
    totalRecords = 0
    limitPerPage = 20

    boats = signal<Boat[]>([])

    boatNU: BoatNU[] = [{
        name: "Novo",
        code: "N",
    },
    {
        name: "Usado",
        code: "U",
    }]

    form = this.formBuilder.group({
        Model: ['', [Validators.required]],
        NewUsed: ['', [Validators.required]],
    })

    ngOnInit(): void {
        this.loadBoats()
    }


    loadBoats() {
        this.boatsService.getBoats(1, this.limitPerPage, "", "", "", "").subscribe({
            next: (res: any) => {
                this.boats.set(res.data ?? [])
                this.totalRecords = res.totalRecords
            },
            error: (err) => {
                if (err.status) {
                    this.messageService.add({ severity: 'error', summary: "Erro", detail: 'Ocorreu um erro ao buscar cascos.' });
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

            //@ts-ignore
            if(this.form.value.NewUsed?.code == 'U'){
                this.form.get("NewUsed")?.setValue('U')
            } else {
                this.form.get("NewUsed")?.setValue('N')
            }

            this.boatsService.registerBoat(this.form.value).subscribe({
                next: (res: any) => {
                    this.messageService.add({ severity: 'success', summary: "Sucesso", detail: 'Casco registrado com sucesso' });
                    this.loadBoats()
                    this.isSubmited = false
                    this.isLoading = false
                    this.hideDialog()
                    this.form.reset()
                },
                error: (err) => {
                    if (err?.status == 400 && err?.error?.ErrCode === 'u1') {
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

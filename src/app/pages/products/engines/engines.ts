import { Component, OnInit, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { TableModule } from 'primeng/table';
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
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { SelectModule } from 'primeng/select';

import { SelectItem } from '../../../shared/components/utils';
import { AccessoryService } from '../../../shared/services/accessories.service';
import { ListEnginesComponent } from '../../../shared/components/products/list.engines';
import { Engine, EngineService } from '../../../shared/services/engine.service';

@Component({
    selector: 'app-engines',
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
        IconFieldModule,
        InputIconModule,
        SelectModule,
        ListEnginesComponent,
    ],
    providers: [MessageService, ConfirmationService],
    template: `
    <p-toast></p-toast>
    <p-toolbar styleClass="mb-6">

    <ng-template #start>
    <p-button label="Novo motor" icon="pi pi-plus" severity="secondary" class="mr-2" (onClick)="openNew()" />


    </ng-template>

    <ng-template #end>
    </ng-template>
    </p-toolbar>

    <p-dialog [(visible)]="engineDialog" header="Registrar motor" [style]="{width: '900px'}" [modal]="true">
        <ng-template #content>
            <form [formGroup]="form" (ngSubmit)="onSubmit()" style='margin-bottom: 4rem;'>
                <button id="btn_submit" style='display:none;' type="submit"></button>


                <div class='row'>
                    <div class='col-md-8'>
                        <label for="Model" class="block font-bold mb-3">Modelo</label>
                        <input formControlName="Model" class="w-full md:w-[30rem] mb-2" type="text" pInputText id="Type" required autofocus fluid />
                        
                        <div class="error-feedback" *ngIf="hasBeenSubmited('Model')">
                            <p-message styleClass="mb-2" *ngIf="form.controls.Model.hasError('required')" severity="error" variant="simple" size="small">Por favor, digitar o modelo do motor</p-message>
                        </div>
                    </div>

                    <div class='col-md-4'>
                        <label for="Model" class="block font-bold mb-3">Preço</label>

                        <p-inputnumber formControlName="SellingPrice" class="w-full mb-2" mode="currency" currency="BRL" locale="pt-BR" />

                        <div class="error-feedback" *ngIf="hasBeenSubmited('SellingPrice')">
                            <p-message styleClass="mb-2" *ngIf="form.controls.SellingPrice.hasError('required')" severity="error" variant="simple" size="small">Por favor, digitar o preço de venda</p-message>
                        </div>
                    </div>
                </div>

                <div class='row'>
                    <div class='col-md-6'>
                        <label for="Model" class="block font-bold mb-3">Propulsão</label>

                        <p-select [invalid]="isInvalid('Propulsion')" [options]="propulsions" formControlName="Propulsion" optionLabel="name" placeholder="Selecione uma propulsão" class="w-full mb-2" />
                        @if (isInvalid('Propulsion')) {
                            <p-message severity="error" size="small" variant="simple">Por favor, selecione uma propulsão    </p-message>
                        }
                    </div>

                    <div class='col-md-6'>
                        <label for="Type" class="block font-bold mb-3">Tipo</label>

                        <p-select [invalid]="isInvalid('Type')" [options]="types" formControlName="Type" optionLabel="name" placeholder="Selecione um tipo" class="w-full mb-2" />
                        @if (isInvalid('Type')) {
                            <p-message severity="error" size="small" variant="simple">Por favor, selecione um tipo  </p-message>
                        }
                    </div>

                </div>

                <div class='row'>
                    <div class='col-md-6'>
                        <label for="Command" class="block font-bold mb-3">Comando</label>

                        <p-select [invalid]="isInvalid('Command')" [options]="commands" formControlName="Command" optionLabel="name" placeholder="Selecione um comando" class="w-full mb-2" />
                        @if (isInvalid('Command')) {
                            <p-message severity="error" size="small" variant="simple">Por favor, selecione um comando  </p-message>
                        }
                    </div>

                    <div class='col-md-6'>
                        <label for="FuelType" class="block font-bold mb-3">Combustível</label>

                        <p-select [invalid]="isInvalid('FuelType')" [options]="fuels" formControlName="FuelType" optionLabel="name" placeholder="Selecione um tipo" class="w-full mb-2" />
                        @if (isInvalid('FuelType')) {
                            <p-message severity="error" size="small" variant="simple">Por favor, selecione um tipo  </p-message>
                        }
                    </div>

                </div>
    
                <div class='row'>
                    <div class='col-md-6'>
                        <label for="Tempo" class="block font-bold mb-3">Tempo</label>

                        <p-select [invalid]="isInvalid('Tempo')" [options]="tempos" formControlName="Tempo" optionLabel="name" placeholder="Selecione um tipo" class="w-full mb-2" />
                        @if (isInvalid('Tempo')) {
                            <p-message severity="error" size="small" variant="simple">Por favor, selecione um tipo  </p-message>
                        }
                    </div>


                </div>


    
                <div class='row'>
                    <div class='col-md-4'>
                        <label for="Model" class="block font-bold mb-3">Peso </label>
                        <p-inputnumber formControlName="Weight" suffix=" KG"  mode="decimal" [minFractionDigits]="2" [maxFractionDigits]="5" class="w-full mb-2" locale="pt-BR" />

                        <div class="error-feedback" *ngIf="hasBeenSubmited('Weight')">
                            <p-message styleClass="mb-2" *ngIf="form.controls.Weight.hasError('required')" severity="error" variant="simple" size="small">Por favor, digitar o preço de venda</p-message>
                        </div>
                    </div>

                    <div class='col-md-4'>
                        <label for="Rotation" class="block font-bold mb-3">Rotações</label>
                        <input formControlName="Rotation" class="w-full md:w-[30rem] mb-2" type="text" pInputText id="Type" required autofocus fluid />

                    </div>

                    <div class='col-md-4'>
                        <label for="Power" class="block font-bold mb-3">Potência</label>
                        <p-inputnumber formControlName="Power" [useGrouping]="false" class="w-full mb-2"  />

                        <div class="error-feedback" *ngIf="hasBeenSubmited('Power')">
                            <p-message styleClass="mb-2" *ngIf="form.controls.Power.hasError('required')" severity="error" variant="simple" size="small">Por favor, digitar o valor da potência</p-message>
                        </div>
                    </div>

                </div>

                <div class='row'>
                    <div class='col-md-4'>
                        <label for="Cylinders" class="block font-bold mb-3">Cilindro</label>
                        <p-inputnumber formControlName="Weight" [useGrouping]="false" class="w-full mb-2"  />

                        <div class="error-feedback" *ngIf="hasBeenSubmited('Cylinders')">
                            <p-message styleClass="mb-2" *ngIf="form.controls.Cylinders.hasError('required')" severity="error" variant="simple" size="small">Por favor, digitar o valor dos cilindros</p-message>
                        </div>
                    </div>

                    <div class='col-md-4'>
                        <label for="Clocks" class="block font-bold mb-3">Relógio</label>
                        <p-inputnumber formControlName="Clocks" [useGrouping]="false" class="w-full mb-2"  />

                        <div class="error-feedback" *ngIf="hasBeenSubmited('Clocks')">
                            <p-message styleClass="mb-2" *ngIf="form.controls.Clocks.hasError('required')" severity="error" variant="simple" size="small">Por favor, digitar o valor dos relógios</p-message>
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

    <list-engines [engines]="engines" [totalRecords]="totalRecords" [limitPerPage]="limitPerPage" ></list-engines>
    `
})
export class EnginesPage implements OnInit {

    constructor(
        public formBuilder: FormBuilder,
        private messageService: MessageService,
        private confirmationService: ConfirmationService,
        private accessoryService: AccessoryService,
        private engineService: EngineService,

    ) { }

    submitted: boolean = false
    isSubmited: boolean = false
    isLoading: boolean = false
    engineDialog: boolean = false
    totalRecords = 0
    limitPerPage = 20

    engines = signal<Engine[]>([])

    propulsions: SelectItem[] = [
        { name: 'Padrão', code: 'PD' },
        { name: 'Helice', code: 'HE' },
        { name: 'Hidrojato', code: 'HJ' },
    ]

    tempos: SelectItem[] = [
        { name: '2', code: '2' },
        { name: '4', code: '4' },
    ]

    fuels: SelectItem[] = [
        { name: 'Diesel', code: 'D' },
        { name: 'Gasolina', code: 'G' },
    ]

    types: SelectItem[] = [
        { name: 'Centro', code: 'C' },
        { name: 'Popa', code: 'P' },
    ]

    commands: SelectItem[] = [
        { name: 'Cabo', code: 'C' },
        { name: 'Eletrônico', code: 'E' },
    ]

    form = this.formBuilder.group({
        Model: ['', [Validators.required]],
        SellingPrice: [0, [Validators.required]],
        Type: ['', [Validators.required]],
        Propulsion: ['', [Validators.required]],
        Weight: [0],
        Rotation: [''],
        Power: [0],
        Cylinders: [0],
        Command: ['', [Validators.required]],
        Clocks: [0],
        Tempo: [0, [Validators.required]],
        FuelType: ['', [Validators.required]],
    })

    ngOnInit(): void {
        this.loadEngines()
    }


    loadEngines() {
        this.engineService.getEngines(1, this.limitPerPage, "", "").subscribe({
            next: (res: any) => {
                this.engines.set(res.data ?? [])
                this.totalRecords = res.totalRecords
            },
            error: (err) => {
                if (err.status) {
                    this.messageService.add({ severity: 'error', summary: "Erro", detail: 'Ocorreu um erro ao buscar motores.' });
                }
                this.isLoading = false
            },
        })
    }

    hideDialog() {
        this.engineDialog = false
        this.submitted = false
    }

    openNew() {
        this.submitted = false
        this.engineDialog = true
    }

    submit() {
        document.getElementById(`btn_submit`)?.click()
    }

    onSubmit() {
        this.isSubmited = true

        if (this.form.valid) {
            this.isLoading = true

            //@ts-ignore
            if(this.form.value.Propulsion?.code == 'PD'){
                this.form.get("Propulsion")?.setValue('PD')
            //@ts-ignore
            } else if(this.form.value.Propulsion?.code == 'HE') {
                this.form.get("Propulsion")?.setValue('HE')
            } else {
                this.form.get("Propulsion")?.setValue('HJ')
            }

            //@ts-ignore
            if(this.form.value.Tempo?.code == 2){
                this.form.get("Tempo")?.setValue(2)
            } else {
                this.form.get("Tempo")?.setValue(4)
            }

            //@ts-ignore
            if(this.form.value.Type?.code == 'C'){
                this.form.get("Type")?.setValue('C')
            } else {
                this.form.get("Type")?.setValue('P')
            }

            //@ts-ignore
            if(this.form.value.FuelType?.code == 'D'){
                this.form.get("FuelType")?.setValue('D')
            } else {
                this.form.get("FuelType")?.setValue('G')
            }

            //@ts-ignore
            if(this.form.value.Command?.code == 'C'){
                this.form.get("Command")?.setValue('C')
            } else {
                this.form.get("Command")?.setValue('E')
            }


            this.engineService.registerEngine(this.form.value).subscribe({
                next: (res: any) => {
                    this.messageService.add({ severity: 'success', summary: "Sucesso", detail: 'Motor registrado com sucesso' });
                    this.loadEngines()
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

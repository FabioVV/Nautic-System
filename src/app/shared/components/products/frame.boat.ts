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

import { BrStates } from '../utils';
import { SelectItem, showLoading } from '../utils';
import { UserService } from '../../services/user.service';
import { SalesService } from '../../services/sales.service';
import { BoatService } from '../../services/boats.service';

@Component({
    selector: 'open-boat',
    imports: [DialogModule, TabsModule, DatePickerModule, InputMaskModule, InputNumberModule, InputGroupAddonModule, TextareaModule, FieldsetModule, MessageModule, ButtonGroupModule, ConfirmDialogModule, TableModule, SelectModule, ToastModule, InputIconModule, InputTextModule, IconFieldModule, DataViewModule, RippleModule, ButtonModule, CommonModule, FormsModule, ReactiveFormsModule, PaginatorModule],
    providers: [MessageService, ConfirmationService],
    styleUrls: [],
    standalone: true,

    template: `
    <p-toast></p-toast>
    <p-dialog #cdialog [header]="title" [modal]="true" [(visible)]="visible" [style]="{ width: '50rem' }" [breakpoints]="{ '1199px': '75vw', '575px': '90vw' }" >
        <p-tabs value="0">
            <p-tablist>
                <p-tab value="0"><i class="pi pi-server"></i> Dados</p-tab>
                <p-tab value="1"><i class="pi pi-list"></i> Acessórios</p-tab>
                <p-tab value="2"><i class="pi pi-list"></i> Motores</p-tab>
                <p-tab value="3"><i class="pi pi-images"></i> Imagens</p-tab>
            </p-tablist>
            <p-tabpanels>

                <p-tabpanel value="0">
                    <form [formGroup]="boatForm" (ngSubmit)="onSubmit()">
                        <button id="btn_submit" style='display:none;' type="submit"></button>

                        <div class='row'>
                            <div class='col-md-2'>
                                <label for="" class="block font-bold mb-3">Cód. Casco</label>
                                <input formControlName="Cod" class="w-full  mb-2" type="text" pInputText id="Type" required autofocus fluid />

                            </div>

                            <div class='col-md-6'>
                                <label for="" class="block font-bold mb-3">Modelo</label>
                                <input formControlName="Model" class="w-full  mb-2" type="text" pInputText id="Type" required autofocus fluid />

                                <div class="error-feedback" *ngIf="hasBeenSubmited('Model')">
                                    <p-message styleClass="mb-2" *ngIf="boatForm.controls.Model.hasError('required')" severity="error" variant="simple" size="small">Por favor, digitar o modelo do casco</p-message>
                                </div>
                            </div>

                            <div class='col-md-2'>
                                <label for="" class="block font-bold mb-3">Embarcação nova/usada</label>
                                <p-select [invalid]="isInvalid('NewUsed')" [options]="NewUsed" formControlName="NewUsed" optionLabel="name" placeholder="Selecione o tipo da embarcação" class="w-full mb-2" />
                            
                                @if (isInvalid('NewUsed')) {
                                    <p-message severity="error" size="small" variant="simple">Por favor, selecione o tipo de casco</p-message>
                                }
                            </div>

                            <div class='col-md-2'>
                                <label for="" class="block font-bold mb-3">Embarcação cabinada/aberta</label>
                                <p-select [invalid]="isInvalid('CabinatedOpen')" [options]="CabinatedOpen" formControlName="CabinatedOpen" optionLabel="name" placeholder="Selecione o tipo da embarcação" class="w-full mb-2" />
                                
                                @if (isInvalid('CabinatedOpen')) {
                                    <p-message severity="error" size="small" variant="simple">Por favor, selecione se é cabinada ou aberta</p-message>
                                }
                            </div>
                        </div>

                        <div class='row'>
                            <div class='col-md-4'>
                                <label for="" class="block font-bold mb-3">Ano</label>
                                <input formControlName="Year" class="w-full  mb-2" type="text" pInputText id="Type" required autofocus fluid />

                                <div class="error-feedback" *ngIf="hasBeenSubmited('Year')">
                                    <p-message styleClass="mb-2" *ngIf="boatForm.controls.Year.hasError('required')" severity="error" variant="simple" size="small">Por favor, digitar o ano do casco</p-message>
                                </div>
                            </div>

                            <div class='col-md-4'>
                                <label for="" class="block font-bold mb-3">Horas</label>
                                <p-inputnumber formControlName="Hours" [maxFractionDigits]="2" class="w-full mb-2"  />                                

                            </div>

                        </div>

                        <div class='row'>
                            <div class='col-md-4'>
                                <label for="" class="block font-bold mb-3">Preço</label>
                                <p-inputnumber formControlName="SellingPrice" class="w-full mb-2" mode="currency" currency="BRL" locale="pt-BR" />                                

                            </div>
                                     
                            <div class='col-md-4'>
                                <label for="" class="block font-bold mb-3">Capacidade</label>
                                <p-inputnumber formControlName="Capacity" [useGrouping]="false" class="w-full mb-2" locale="pt-BR" />

                            </div>
                            
                            <div class='col-md-4'>
                                <label for="" class="block font-bold mb-3">Capacidade noturna</label>
                                <p-inputnumber formControlName="NightCapacity" [useGrouping]="false" class="w-full mb-2" locale="pt-BR" />

                            </div>

                        </div>

                        <div class='row'>
                            <div class='col-md-4'>
                                <label for="" class="block font-bold mb-3">Comprimento</label>
                                <p-inputnumber formControlName="Length" mode="decimal" [minFractionDigits]="2" [maxFractionDigits]="5" class="w-full mb-2" locale="pt-BR" />

                            </div>

                            <div class='col-md-4'>
                                <label for="" class="block font-bold mb-3">Boca</label>
                                <p-inputnumber formControlName="Beam"   mode="decimal" [minFractionDigits]="2" [maxFractionDigits]="5" class="w-full mb-2" locale="pt-BR" />

                            </div>

                            <div class='col-md-4'>
                                <label for="" class="block font-bold mb-3">Calado</label>
                                <p-inputnumber formControlName="Draft"   mode="decimal" [minFractionDigits]="2" [maxFractionDigits]="5" class="w-full mb-2" locale="pt-BR" />

                            </div>

                        </div>

                        <div class='row'>
                            <div class='col-md-4'>
                                <label for="" class="block font-bold mb-3">Peso</label>
                                <p-inputnumber formControlName="Weight" suffix=" KG"  mode="decimal" [minFractionDigits]="2" [maxFractionDigits]="5" class="w-full mb-2" locale="pt-BR" />

                            </div>
                                     
                            
                            <div class='col-md-4'>
                                <label for="" class="block font-bold mb-3">Mantido</label>
                                <p-inputnumber formControlName="Trim"   mode="decimal" [minFractionDigits]="2" [maxFractionDigits]="5" class="w-full mb-2" locale="pt-BR" />

                            </div>

                            <div class='col-md-4'>
                                <label for="" class="block font-bold mb-3">Capacidade do tanque</label>
                                <p-inputnumber formControlName="FuelTankCapacity" suffix=" L" mode="decimal" [minFractionDigits]="2" [maxFractionDigits]="5" class="w-full mb-2" locale="pt-BR" />

                            </div>

                        </div>

                        <div class='row'>
                            <div class='col-md-12'>
                                <label for="" class="block font-bold mb-3">Itens inclusos</label>
                                <textarea  class="w-full mb-2" rows="5" cols="30" pTextarea formControlName="Itens"></textarea>

                            </div>
                        </div>

                    </form>
                </p-tabpanel>

                <p-tabpanel value="1">
                </p-tabpanel>

                
                <p-tabpanel value="2">
                </p-tabpanel>

                
                <p-tabpanel value="3">
                </p-tabpanel>
                
            </p-tabpanels>
        </p-tabs>

        <ng-template #footer>
            <p-button type="submit" label="Salvar" (click)="submit()" icon="pi pi-check" id="action-acom-button"/>
        </ng-template>
    </p-dialog>
    `,
})
export class BoatModal {
    constructor(
        public formBuilder: FormBuilder,
        private messageService: MessageService,
        private userService: UserService,
        private salesService: SalesService,
        private boatService: BoatService,
    ) { }

    @ViewChild('cdialog') myDialog!: Dialog
    @Input() title: any

    CabinatedOpen: SelectItem[] = [ { name: 'Aberta', code: 'A' }, { name: 'Cabinada', code: 'C' }]
    NewUsed: SelectItem[] = [{ name: 'Nova', code: 'N' }, { name: 'Usada', code: 'U' }]

    isLoading: boolean = false
    submitted: boolean = false
    visible: boolean = false
    id: string = ""
    url: any

    boatForm = this.formBuilder.group({       
        Cod: [{value: "", disabled: true}, []],
        Model: ['', []],
        Capacity: ['', []],
        NightCapacity: ['', []],
        Length: ['', []],
        Beam: ['', []],
        Draft: ['', []],
        Weight: ['', []],
        Trim: ['', []],
        FuelTankCapacity: ['', []],
        SellingPrice: ['', []],
        Cost: ['', []],
        Year: ['', []],
        Hours: ['', []],

        NewUsed: ['', []],
        CabinatedOpen: ['', []],

        Itens: ['', []],
    })

    submit() {
        document.getElementById(`btn_submit`)?.click()
    }

    ngOnInit() {

    }

    onSubmit(){
        this.submitted = true

        
        if (this.boatForm.valid) {
            this.isLoading = true

            const save_cabopen = this.boatForm?.value?.CabinatedOpen
            const save_newused = this.boatForm?.value?.NewUsed

            // @ts-ignore
            this.boatForm.get("CabinatedOpen")?.setValue(this.boatForm?.value?.CabinatedOpen?.code)
            // @ts-ignore
            this.boatForm.get("NewUsed")?.setValue(this.boatForm?.value?.NewUsed?.code)

            this.boatService.updateBoat(this.id, this.boatForm.value).pipe(finalize(() => { 
                // @ts-ignore
                this.boatForm.get("CabinatedOpen")?.setValue(save_cabopen)
                // @ts-ignore
                this.boatForm.get("NewUsed")?.setValue(save_newused)

             })).subscribe({
                next: (res: any) => {
                    this.messageService.add({ severity: 'success', summary: "Sucesso", detail: 'Casco atualizado com sucesso' });
                    //this.loadCommunicationMeans()
                    this.submitted = false
                    this.isLoading = false
                    
                },
                error: (err) => {
                    if (err?.status == 400 && err?.error?.errors?.type == "TODO") {
                    } else {
                        this.messageService.add({ severity: 'error', summary: "Erro", detail: 'Ocorreu um erro com sua requisição.' });
                    }
                    this.isLoading = false
                },

            })
        }
    }

    loadBoat(id: string){
        this.boatService.getBoat(id).pipe(finalize(() => { this.isLoading = false })).subscribe({
            next: (res: any) => {
                if(res.data['new_used']?.trimEnd() == 'N'){
                    //@ts-ignore
                    this.boatForm?.get("NewUsed")?.setValue(this.NewUsed[0])
                } else {
                    //@ts-ignore
                    this.boatForm?.get("NewUsed")?.setValue(this.NewUsed[1])
                }

                if(res.data['cab_open']?.trimEnd() == 'A'){
                    //@ts-ignore
                    this.boatForm?.get("CabinatedOpen")?.setValue(this.CabinatedOpen[0])
                } else {
                    //@ts-ignore
                    this.boatForm?.get("CabinatedOpen")?.setValue(this.CabinatedOpen[1])
                }

                this.boatForm.get("Cod")?.setValue(`C${res.data['id']}`)
                this.boatForm.get("Model")?.setValue(res.data['model'])

                //@ts-ignore
                this.boatForm.get("Capacity")?.setValue(parseInt(res.data['capacity']))

                this.boatForm.get("NightCapacity")?.setValue(res.data['night_capacity'])
                this.boatForm.get("Length")?.setValue(res.data['lenght'])
                this.boatForm.get("Beam")?.setValue(res.data['beam'])
                this.boatForm.get("Draft")?.setValue(res.data['draft'])
                this.boatForm.get("Weight")?.setValue(res.data['weight'])
                this.boatForm.get("Trim")?.setValue(res.data['trim'])
                this.boatForm.get("FuelTankCapacity")?.setValue(res.data['fuel_tank_capacity'])
                this.boatForm.get("SellingPrice")?.setValue(res.data['selling_price'])
                this.boatForm.get("Cost")?.setValue(res.data['cost'])
                this.boatForm.get("Year")?.setValue(res.data['year'])
                this.boatForm.get("Hours")?.setValue(res.data['hours'])
                this.boatForm.get("Itens")?.setValue(res.data['itens'])

            },
            error: (err) => {
                if (err.status) {
                    this.messageService.add({ severity: 'error', summary: "Erro", detail: 'Ocorreu um erro ao buscar dados do casco.' });
                }
            },
        })
    }

    showBoat(id: string) {
        this.visible = true
        this.id = id

        this.myDialog.maximizable = true
        this.myDialog.maximize()
        this.loadBoat(this.id)
    }

    isInvalid(controlName: string) {
        const control = this.boatForm.get(controlName)
        return control?.invalid && (control.touched || this.submitted)
    }

    hasBeenSubmited(controlName: string): boolean {
        const control = this.boatForm.get(controlName)
        return Boolean(control?.invalid)
            && (this.submitted || Boolean(control?.touched))
        //|| Boolean(control?.dirty
    }
}

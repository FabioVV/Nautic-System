import { CommonModule } from '@angular/common';
import { Component, inject, Input, signal, ViewChild } from '@angular/core';
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
import { AutoCompleteModule, AutoCompleteCompleteEvent } from 'primeng/autocomplete';
import { InputGroupModule } from 'primeng/inputgroup';
import { FileUploadModule } from 'primeng/fileupload';
import { ImageModule } from 'primeng/image';


import { ListEnginesBoatComponent } from './list.engines_boat';
import { ListAccessoriesBoatComponent } from './list.accessories_boat';
import { SelectItem, showLoading } from '../utils';
import { UserService } from '../../services/user.service';
import { SalesService } from '../../services/sales.service';
import { BoatService } from '../../services/boats.service';
import { AccessoryService } from '../../services/accessories.service';
import { EngineService } from '../../services/engine.service';
import { ListAdsBoatComponent } from './list.ads_boat';

@Component({
    selector: 'open-boat',
    imports: [DialogModule, TabsModule, ImageModule, DatePickerModule, FileUploadModule, ListAdsBoatComponent, ListAccessoriesBoatComponent, ListEnginesBoatComponent, InputGroupModule, AutoCompleteModule, InputMaskModule, InputNumberModule, InputGroupAddonModule, TextareaModule, FieldsetModule, MessageModule, ButtonGroupModule, ConfirmDialogModule, TableModule, SelectModule, ToastModule, InputIconModule, InputTextModule, IconFieldModule, DataViewModule, RippleModule, ButtonModule, CommonModule, FormsModule, ReactiveFormsModule, PaginatorModule],
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
                <p-tab value="4"><i class="pi pi-external-link"></i> Onde está anunciado</p-tab>

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

                    <form [formGroup]="formAcc" style='margin-bottom: 4rem;'>
                        <button id="btn_submit_acc" style='display:none;' type="submit"></button>
                        
                        <div class='row'>
                            <div style='margin-bottom:1rem;' class='col-md-12'>
                                <label for="AccessoryModel" class="block font-bold mb-3">Acessório</label>

                                <p-inputgroup>
                                    <p-inputgroup-addon pTooltip="Digite na caixa ao lado para pesquisar" tooltipPosition="top" [style]="{ cursor:'help' }">
                                        <i class="pi pi-filter"></i>
                                    </p-inputgroup-addon>

                                    <p-autocomplete class="w-full mb-2" formControlName="AccessoryModel" placeholder="Procure o acessório desejado" [suggestions]="autoFilteredValueAccessory" optionLabel="model" (completeMethod)="filterClassAutocompleteAcc($event)" (onSelect)="setAccessoryChoosen($event)" />
                                </p-inputgroup>

                                
                                <div class="error-feedback" *ngIf="hasBeenSubmited('AccessoryModel')">
                                    <p-message styleClass="mb-2" *ngIf="formAcc.controls.AccessoryModel.hasError('required')" severity="error" variant="simple" size="small">Por favor, escolher um acessório</p-message>
                                </div>
                            </div>

                            <p-button type="submit" label="Adicionar acessório" (click)="onSubmitAcc()" icon="pi pi-check" />
                        </div>

                        <hr />
                        <list-accessories-boat #accessoryList [id]="id" ></list-accessories-boat>
                    </form>

                </p-tabpanel>

                
                <p-tabpanel value="2">

                    <form [formGroup]="formEng" style='margin-bottom: 4rem;'>
                        <button id="btn_submit_eng" style='display:none;' type="submit"></button>
                        
                        <div class='row'>
                            <div style='margin-bottom:1rem;' class='col-md-12'>
                                <label class="block font-bold mb-3">Motor</label>

                                <p-inputgroup>
                                    <p-inputgroup-addon pTooltip="Digite na caixa ao lado para pesquisar" tooltipPosition="top" [style]="{ cursor:'help' }">
                                        <i class="pi pi-filter"></i>
                                    </p-inputgroup-addon>

                                    <p-autocomplete class="w-full mb-2" formControlName="EngineModel" placeholder="Procure o motor desejado" [suggestions]="autoFilteredValueEng" optionLabel="model" (completeMethod)="filterClassAutocompleteEng($event)" (onSelect)="setEngineChoosen($event)" />
                                </p-inputgroup>

                                
                                <div class="error-feedback" *ngIf="hasBeenSubmited('EngineModel')">
                                    <p-message styleClass="mb-2" *ngIf="formEng.controls.EngineModel.hasError('required')" severity="error" variant="simple" size="small">Por favor, escolher um motor</p-message>
                                </div>
                            </div>

                            <p-button type="submit" label="Adicionar motor" (click)="onSubmitEng()" icon="pi pi-check" />
                        </div>

                        <hr />
                        <list-engines-boat #engineList [id]="id" ></list-engines-boat>

                    </form>

                </p-tabpanel>

                
                <p-tabpanel value="3">
                    <div class="card flex flex-wrap gap-6 items-center justify-between">
                        <p-fileupload #fu mode="basic" customUpload chooseLabel="Escolha o arquivo" chooseIcon="pi pi-upload" name="file[]" accept="image/*" maxFileSize="1000000000" (uploadHandler)="onUpload($event)"></p-fileupload>
                        <p-button label="Enviar arquivo" (onClick)="fu.upload()" severity="secondary" [style]="{'text-align': 'center'}"></p-button>
                    </div>
                    
                    <div class="container">
                        <div class="row">
                        <ng-container *ngFor="let f of boatFiles(); let i = index">
                            <div class="col-6 col-sm-4 col-md-3 mb-4" >
                                <div class="card h-100">
                                    <p-image [src]="f.path" alt="Image" width="250" [preview]="true" />

                                    <div class="card-body p-2">
                                        <div class="d-flex justify-content-between">
                                            <p-buttongroup>
                                                <p-button (click)="removeFile(f.id)" severity="danger" icon="pi pi-trash" rounded/>
                                                <p-button (click)="downloadFile(f.path)" severity="info" icon="pi pi-download" rounded/>
                                            </p-buttongroup>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </ng-container>
                        </div>
                    </div>
                    
                </p-tabpanel>
                
                <p-tabpanel value="4">
                    <form [formGroup]="formAds" style='margin-bottom: 4rem;'>
                        <button id="btn_submit_ads" style='display:none;' type="submit"></button>
                        
                        <div class='row'>
                            <div style='margin-bottom:1rem;' class='col-md-8'>
                                <label class="block font-bold mb-3">Meio de comunicação em que o casco esta anunciado</label>

                                <p-inputgroup>
                                    <p-inputgroup-addon pTooltip="Digite na caixa ao lado para pesquisar" tooltipPosition="top" [style]="{ cursor:'help' }">
                                        <i class="pi pi-filter"></i>
                                    </p-inputgroup-addon>

                                    <p-autocomplete class="w-full mb-2" formControlName="ComMean" placeholder="Procure o meio de comunicação desejado" [suggestions]="autoFilteredValueAds" optionLabel="name" (completeMethod)="filterClassAutocompleteAds($event)" (onSelect)="setComMeanChoosen($event)" />
                                </p-inputgroup>

                                
                                <div class="error-feedback" *ngIf="hasBeenSubmited('ComMean')">
                                    <p-message styleClass="mb-2" *ngIf="formAds.controls.ComMean.hasError('required')" severity="error" variant="simple" size="small">Por favor, escolher um meio</p-message>
                                </div>
                            </div>

                            <div style='margin-bottom:1rem;' class='col-md-4'>
                                <label class="block font-bold mb-3">Link</label>
                                <input formControlName="Link" class="w-full md:w-[30rem] mb-2" type="text" pInputText id="Type" required autofocus fluid />


                                
                                <div class="error-feedback" *ngIf="hasBeenSubmited('Link')">
                                    <p-message styleClass="mb-2" *ngIf="formAds.controls.Link.hasError('required')" severity="error" variant="simple" size="small">Por favor, inserir o link do anuncio</p-message>
                                </div>
                            </div>

                            <p-button type="submit" label="Adicionar anuncio" (click)="onSubmitAds()" icon="pi pi-check" />
                        </div>

                        <hr />

                        <list-ads-boat #adsList [id]="id" />
                    </form>
                </p-tabpanel>

            </p-tabpanels>
        </p-tabs>

        <ng-template #footer>
            <p-button type="submit" label="Salvar" (click)="submit()" icon="pi pi-check" id="action-acom-button"/>
        </ng-template>
    </p-dialog>

    <p-confirmdialog
        [rejectLabel]="rejectLabel"
        [acceptLabel]="confirmLabel"
        [acceptAriaLabel]="confirmLabel"
        [rejectAriaLabel]="rejectLabel"
        [style]="{ width: '550px' }"
    />
    `,
})
export class BoatModal {
    constructor(
        public formBuilder: FormBuilder,
        private messageService: MessageService,
        private userService: UserService,
        private salesService: SalesService,
        private boatService: BoatService,
        private accessoryService: AccessoryService,
        private engineService: EngineService,
        private confirmationService: ConfirmationService,
    ) { }

    confirmLabel = "Confirmar"
    rejectLabel = "Cancelar"

    @ViewChild('engineList') engineListComponent!: ListEnginesBoatComponent
    @ViewChild('accessoryList') accListComponent!: ListAccessoriesBoatComponent
    @ViewChild('adsList') adListComponent!: ListAdsBoatComponent
    @ViewChild('fu') fileUploader!: any

    @ViewChild('cdialog') myDialog!: Dialog
    @Input() title: any = "Casco"

    boatFiles = signal<any[]>([])

    CabinatedOpen: SelectItem[] = [ { name: 'Aberta', code: 'A' }, { name: 'Cabinada', code: 'C' }]
    NewUsed: SelectItem[] = [{ name: 'Nova', code: 'N' }, { name: 'Usada', code: 'U' }]

    autoFilteredValueEng: any[] = []
    autoFilteredValueAccessory: any[] = []
    autoFilteredValueAds: any[] = []


    isLoading: boolean = false
    submitted: boolean = false
    visible: boolean = false
    id: string = ""
    url: any

    responsiveOptions: any[] = [
        {
            breakpoint: '1300px',
            numVisible: 4
        },
        {
            breakpoint: '575px',
            numVisible: 1
        }
    ]


    formEng= this.formBuilder.group({     
        EngineId: ['', []],
        EngineModel: ['', []],
    })

    formAcc= this.formBuilder.group({     
        AccessoryId: ['', []],
        AccessoryModel: ['', []],
    })

    formAds= this.formBuilder.group({     
        ComMeanId: ['', []],
        ComMean: ['', []],
        Link: ['', []],
    })

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

    removeFile(id: string) {
        this.confirmationService.confirm({
            message: 'Confirma apagar a imagem selecionada?',
            header: 'Confirmação',
            icon: 'pi pi-exclamation-triangle',
            closeOnEscape: true,
            rejectButtonProps: {
                label: 'Cancelar',
                severity: 'secondary',
                outlined: true,
            },
            acceptButtonProps: {
                label: 'Confirmar',
                severity: 'danger',
                outlined: true,
            },
            accept: () => {
                this.boatService.deleteBoatImage(this.id, id).subscribe({
                    next: (res: any) => {
                        this.loadBoatFiles()
                    }, 
                    error: (err) => {
                        this.messageService.add({ severity: 'error', summary: "Erro", detail: 'Ocorreu um erro ao tentar apagar arquivo' })
                    },
                })
            }
        })
    }

    downloadFile(path: string) {
        const a = document.createElement('a')
        a.href = path;
        a.download = ''
        a.target = '_blank'
        document.body.appendChild(a)
        a.click()
        a.remove()
    }

    onSubmitAds(){
        this.submitted = true
        
        if (this.formAds.valid) {
            this.isLoading = true

            const formData = {
                link: this.formAds?.value?.Link
            }
            
            this.boatService.registerBoatAd(this.id, this.formAds?.value?.ComMeanId, formData).subscribe({
                next: (res: any) => {
                    this.adListComponent.loadBoatAds()
                }, 
                error: (err) => {
                    if(err?.error?.message == 'ad already linked with the boat'){
                        this.messageService.add({ severity: 'error', summary: "Erro", detail: 'Anúncio já está vinculado ao casco' })
                    } else {
                        this.messageService.add({ severity: 'error', summary: "Erro", detail: 'Ocorreu um erro ao tentar adicionar anuncio' })
                    }
                },
            })
        }
    }

    onSubmitEng(){
        this.submitted = true
        
        if (this.formEng.valid) {
            this.isLoading = true

            this.boatService.registerBoatEngine(this.id, this.formEng?.value?.EngineId).subscribe({
                next: (res: any) => {
                    this.engineListComponent.loadBoatEngines()
                }, 
                error: (err) => {
                    if(err?.error?.message == 'engine already linked with the boat'){
                        this.messageService.add({ severity: 'error', summary: "Erro", detail: 'Motor já está vinculado ao casco' })
                    } else {
                        this.messageService.add({ severity: 'error', summary: "Erro", detail: 'Ocorreu um erro ao tentar adicionar motor' })
                    }
                },
            })
        }
    }

    onSubmitAcc(){
        this.submitted = true

        if (this.formAcc.valid) {
            this.isLoading = true

            this.boatService.registerBoatAccessory(this.id, this.formAcc?.value?.AccessoryId).subscribe({
                next: (res: any) => {
                    this.accListComponent.loadBoatAccessories()
                }, 
                error: (err) => {
                    if(err?.error?.message == 'accessory already linked with the boat'){
                        this.messageService.add({ severity: 'error', summary: "Erro", detail: 'Acessório já está vinculado ao casco' })
                    } else {
                        this.messageService.add({ severity: 'error', summary: "Erro", detail: 'Ocorreu um erro ao tentar adicionar o acessório' })

                    }
                },
            })
            
        }
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

    onUpload(event: any){

        const file: File = event.files[0]
        const formData = new FormData()
        formData.append('file', file, file.name)

        this.boatService.uploadBoatFile(this.id, formData).subscribe({
            next: (res: any) => {
                this.messageService.add({ severity: 'success', summary: "Sucesso", detail: 'Upload feito com sucesso' });
                this.loadBoatFiles()
                this.fileUploader.clear()
            }, 
            error: (err) => {
                if (err.status) {
                    this.messageService.add({ severity: 'error', summary: "Erro", detail: 'Ocorreu um erro ao fazer upload' });
                } 
                this.isLoading = false
            },
        })
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

                this.accListComponent.loadBoatAccessories()
                this.engineListComponent.loadBoatEngines()
                this.adListComponent.loadBoatAds()
                this.loadBoatFiles()
            },
            error: (err) => {
                if (err.status) {
                    this.messageService.add({ severity: 'error', summary: "Erro", detail: 'Ocorreu um erro ao buscar dados do casco.' });
                }
            },
        })
    }

    loadBoatFiles(){
        this.boatService.getBoatFiles(this.id).subscribe({
            next: (res: any) => {
                this.boatFiles.set(res.data)
            },
            error: (err) => {
                if (err.status) {
                    this.messageService.add({ severity: 'error', summary: "Erro", detail: 'Ocorreu um erro ao buscar os arquivos do barco.' });
                }
            },
        })
    }

    filterClassAutocompleteAcc(event: AutoCompleteCompleteEvent){
        const filtered: any[] = []
        const query = event.query   

        this.accessoryService.getAccessories(1, 1000, query, "Y").subscribe({
            next: (res: any) => {
               // this.accessories.set(res.data)

                for (let i = 0; i < res?.data?.length; i++) {
                    const acc = res?.data[i]
                    if (acc?.model?.toLowerCase().indexOf(query.toLowerCase()) == 0) {
                        filtered.push(acc)
                    }
                }

                this.autoFilteredValueAccessory = filtered
            }, 
            error: (err) => {
                this.messageService.add({ severity: 'error', summary: "Erro", detail: 'Ocorreu um erro ao buscar os acessórios.' });
            },
        })
    }

    filterClassAutocompleteEng(event: AutoCompleteCompleteEvent){
        const filtered: any[] = []
        const query = event.query   

        this.engineService.getEngines(1, 1000, query, "Y").subscribe({
            next: (res: any) => {
                //this.engines.set(res.data)

                for (let i = 0; i < res?.data?.length; i++) {
                    const eng = res?.data[i]
                    if (eng?.model?.toLowerCase().indexOf(query.toLowerCase()) == 0) {
                        filtered.push(eng)
                    }
                }

                this.autoFilteredValueEng = filtered

            }, 
            error: (err) => {
                this.messageService.add({ severity: 'error', summary: "Erro", detail: 'Ocorreu um erro ao buscar os acessórios.' });
            },
        })
    }

    filterClassAutocompleteAds(event: AutoCompleteCompleteEvent){
        const filtered: any[] = []
        const query = event.query   

        this.salesService.getComs(1, 1000, "", "Y").subscribe({
            next: (res: any) => {
                for (let i = 0; i < res?.data?.length; i++) {
                    const eng = res?.data[i]
                    if (eng?.name?.toLowerCase().indexOf(query.toLowerCase()) == 0) {
                        filtered.push(eng)
                    }
                }

                this.autoFilteredValueAds = filtered            
            }, 
            error: (err: any) => {
                this.messageService.add({ severity: 'error', summary: "Erro", detail: 'Ocorreu um erro ao buscar os meios.' });
            },
        })
    }

    setAccessoryChoosen(e: any){
        //@ts-ignore
        this.formAcc.get("AccessoryModel")?.setValue(e.value.model)
        //@ts-ignore
        this.formAcc.get("AccessoryId")?.setValue(e.value.id)
    }

    setEngineChoosen(e: any){
        //@ts-ignore
        this.formEng.get("EngineModel")?.setValue(e.value.model)
        //@ts-ignore
        this.formEng.get("EngineId")?.setValue(e.value.id)
    }

    setComMeanChoosen(e: any){
        //@ts-ignore
        this.formAds.get("ComMean")?.setValue(e.value.name)
        //@ts-ignore
        this.formAds.get("ComMeanId")?.setValue(e.value.id)
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

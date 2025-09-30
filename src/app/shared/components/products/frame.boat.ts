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
                <p-tab value="0"><i class="pi pi-user"></i> Dados</p-tab>
                <p-tab value="1"><i class="pi pi-list"></i> Histórico de compras</p-tab>
            </p-tablist>
            <p-tabpanels>

                <p-tabpanel value="0">
                    <form [formGroup]="boatForm" (ngSubmit)="onSubmit()">
                        <button id="btn_submit" style='display:none;' type="submit"></button>

                            <div class='row'>

                            </div>

                        </p-fieldset>

                        
                        <div class='row'>
                            <label for="ExtraInfo" class="block font-bold mb-3">Informações sobre o cliente</label>
                            <textarea rows="5" cols="30" pTextarea formControlName="ExtraInfo" fluid></textarea>
                        </div>

                    </form>
                </p-tabpanel>

                <p-tabpanel value="1">
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
    ) { }

    @ViewChild('cdialog') myDialog!: Dialog

    @Input() title: any


    qualified: SelectItem[] = [{ name: 'Sim', code: 'Y' }, { name: 'Não', code: 'N' }]
    CabinatedOpen: SelectItem[] = [ { name: 'Aberta', code: 'A' }, { name: 'Cabinada', code: 'C' }]
    NewUsed: SelectItem[] = [{ name: 'Nova', code: 'N' }, { name: 'Usada', code: 'U' }]
    qualifiedType: SelectItem[] = [
        { name: 'Muito decidido. Intenção clara de compra imediata', code: 'A' }, 
        { name: 'Interesse real, mas precisa de mais informação', code: 'B' }, 
        { name: 'Inicio de pesquisa, médio/longo prazo', code: 'C' }
    ]
    BrStates = BrStates

    isLoading: boolean = false
    submitted: boolean = false
    visible: boolean = false
    id: string = ""
    url: any

    customerForm = this.formBuilder.group({
        Name: ['', [Validators.required]],
        Email: ['', [Validators.required]],
        Phone: ['', [Validators.required]],

        PfPj: ['', [Validators.required]],
        Cep: ['', [Validators.required]],
        Street: ['', [Validators.required]],
        Neighborhood: ['', [Validators.required]],
        City: ['', [Validators.required]],
        Complement: ['', []],
        State: ['', [Validators.required]],

        Cpf: ['', []],
        Cnpj: ['', []],
        Birthday: ['', []],

        Qualified: [{value: '', disabled: true}, []],
        QualifiedType: [{value: '', disabled: true}, []],

        HasBoat: ['', []],
        WhichBoat: ['', []],
        
        MinPesBoat: [{value: '', disabled: true}, []],
        MaxPesBoat: [{value: '', disabled: true}, []],
        CustomerCity: [{value: '', disabled: true}, []],
        NavigationCity: [{value: '', disabled: true}, []],
        BoatCapacity: [{value: '', disabled: true}, []],
        NewUsed: [{value: '', disabled: true}, []],
        CabinatedOpen: [{value: '', disabled: true}, []],
        EstimatedValue: [{value: '', disabled: true}, []],

        // ComMeanName: ['', [Validators.required]],
        // ComMeanId: ['', [Validators.required]],
        UserId: ['', []],
        UserName: [{value: '', disabled: true}, []],

        ExtraInfo: ['', []],
    })

    submit() {
        document.getElementById(`btn_submit`)?.click()
    }

    ngOnInit() {

    }

    onSubmit(){
        this.submitted = true

        
        if (this.customerForm.valid) {
            this.isLoading = true

        }
    }

    loadBoat(id: string){
        this.salesService.getCustomer(id).pipe(finalize(() => { this.isLoading = false })).subscribe({
            next: (res: any) => {
                if(res.data['qualified_type']?.trimEnd() == 'A'){
                    //@ts-ignore
                    this.customerForm.get("QualifiedType")?.setValue(this.qualifiedType[0])
                } else if(res.data['qualified_type']?.trimEnd() == 'B'){
                    //@ts-ignore
                    this.customerForm.get("QualifiedType")?.setValue(this.qualifiedType[1])
                } else {
                    //@ts-ignore
                    this.customerForm.get("QualifiedType")?.setValue(this.qualifiedType[2])
                }

                if(res.data['cabinated_open']?.trimEnd() == 'A'){
                    //@ts-ignore
                    this.customerForm.get("CabinatedOpen")?.setValue(this.CabinatedOpen[0])
                } else {
                    //@ts-ignore
                    this.customerForm.get("CabinatedOpen")?.setValue(this.CabinatedOpen[1])
                }


                this.customerForm.get("Name")?.setValue(res.data['customer_name'])

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

    get showHasWhichBoat(): boolean {
        const c: any = this.customerForm.get('HasBoat')
        if(c?.value?.code == 'S'){
            return true
        }
        return false
    }

    get showQualifiedDiv(): boolean {
        const c: any = this.customerForm.get('Qualified')
        if(c!['value']!['code'] == 'Y'){
            return true
        }
        return false
    }

    isInvalid(controlName: string) {
        const control = this.customerForm.get(controlName)
        return control?.invalid && (control.touched || this.submitted)
    }

    hasBeenSubmited(controlName: string): boolean {
        const control = this.customerForm.get(controlName)
        return Boolean(control?.invalid)
            && (this.submitted || Boolean(control?.touched))
        //|| Boolean(control?.dirty
    }
}

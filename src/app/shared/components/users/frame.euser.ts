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
import { CheckboxModule } from 'primeng/checkbox';

import { UserService } from '../../services/user.service';
import { SalesService } from '../../services/sales.service';
import { RolesService } from '../../services/roles.service';

@Component({
    selector: 'open-user-emp-modal',
    imports: [DialogModule, TabsModule, DatePickerModule, CheckboxModule, InputMaskModule, InputNumberModule, InputGroupAddonModule, TextareaModule, FieldsetModule, MessageModule, ButtonGroupModule, ConfirmDialogModule, TableModule, SelectModule, ToastModule, InputIconModule, InputTextModule, IconFieldModule, DataViewModule, RippleModule, ButtonModule, CommonModule, FormsModule, ReactiveFormsModule, PaginatorModule],
    providers: [MessageService, ConfirmationService],
    styleUrls: [],
    standalone: true,

    template: `
    <p-toast></p-toast>
    <p-dialog #cdialog [header]="title" [modal]="true" [(visible)]="visible" [style]="{ width: '50rem' }" [breakpoints]="{ '1199px': '75vw', '575px': '90vw' }" >
       
        <p-table [value]="user_permissions()" [tableStyle]="{ 'min-width': '50rem' }">
            <ng-template #header>
                <tr>
                    <th>Módulo</th>
                    <th>Permissão</th>
                </tr>
            </ng-template>
            <ng-template #body let-perm>
                <tr>
                    <td><mark>{{ perm.module }}</mark></td>
                    <td>
                        <span *ngIf="perm.code?.split(':')[1] === 'view'">
                            Acesso/Visualização
                        </span>

                        <span *ngIf="perm.code?.split(':')[1] === 'edit'">
                            Edição
                        </span>
                    </td>
                    <td>{{ perm.description }}</td>
                    <td>

                        <div class="flex items-center gap-2">
                            <p-checkbox (change)="changeUserPermission($event, perm.id_permission)" [binary]="true" [ngModel]="perm.has_permission"  name="size" value="Large" size="large" />
                            <label id="{{perm.id_permission}}"
                            [ngStyle]="{ color: !perm.has_permission ? 'var(--p-amber-500)' : 'var(--p-emerald-500)' }"
                            for="{{ perm.code }}" 
                            class="text-lg">{{ perm.has_permission ? 'Permitido' : 'Não permitido' }}</label>
                        </div>

                    </td>

                </tr>
            </ng-template>
            
        </p-table>

    </p-dialog>
    `,
})
export class UserEmployeeModal {
    constructor(
        public formBuilder: FormBuilder,
        private messageService: MessageService,
        private userService: UserService,
        private salesService: SalesService,
        private rolesService: RolesService,
        private userServuce: UserService
    ) { }

    @ViewChild('cdialog') myDialog!: Dialog
    @Input() title: any

    user_permissions = signal<any[]>([])

    isLoading: boolean = false
    submitted: boolean = false
    visible: boolean = false
    id: string = ""
    url: any

    customerForm = this.formBuilder.group({
        Name: ['', [Validators.required]],

    })

    submit() {
        document.getElementById(`btn_submit`)?.click()
    }

    ngOnInit() {

    }

    onSubmit(){
        this.submitted = true

    }

    loadUserPermissions(id: string){
        this.userService.getUserPermissions(id).pipe(finalize(() => { this.isLoading = false })).subscribe({
            next: (res: any) => {
                this.user_permissions.set(res?.data ?? [])

            },
            error: (err) => {
                if (err.status) {
                    this.messageService.add({ severity: 'error', summary: "Erro", detail: 'Ocorreu um erro ao buscar dados do usuário.' });
                }
            },
        })
    }

    changeUserPermission(event:any, id_permission: string){
        this.userService.updateUserPermissions(this.id, id_permission, event?.target?.checked).pipe(finalize(() => { this.isLoading = false })).subscribe({
            next: (res: any) => {
                const LABEL = document.getElementById(id_permission)
                if(LABEL){
                    if(event?.target?.checked){
                        LABEL.innerText = "Permitido"
                        LABEL.style = "color: var(--p-emerald-500);"
                    } else {
                        LABEL.innerText = "Não permitido"
                        LABEL.style = "color: var(--p-amber-500);"
                    }
                }

                //this.loadUserPermissions(this.id)
                this.messageService.add({ severity: 'success', summary: "Sucesso", detail: 'Permissão modificado com sucesso' });

            },
            error: (err) => {
                if (err.status) {
                    this.messageService.add({ severity: 'error', summary: "Erro", detail: 'Ocorreu um erro ao atualizar permissóes de usuário.' });
                }
            },
        })
    }

    showUserEmployee(id: string, roleName: string) {
        this.visible = true
        this.id = id
        this.title = roleName

        this.myDialog.maximizable = true
        this.myDialog.maximize()
        this.loadUserPermissions(this.id)
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

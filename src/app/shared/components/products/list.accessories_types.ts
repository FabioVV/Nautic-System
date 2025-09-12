import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import { DataViewModule } from 'primeng/dataview';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { PaginatorModule } from 'primeng/paginator';
import { FormsModule, ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { TableModule } from 'primeng/table';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { InputIconModule } from 'primeng/inputicon';
import { IconFieldModule } from 'primeng/iconfield';
import { InputTextModule } from 'primeng/inputtext';
import { Tag } from 'primeng/tag';
import { SelectModule } from 'primeng/select';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { ToastModule } from 'primeng/toast';
import { ButtonGroupModule } from 'primeng/buttongroup';
import { MessageModule } from 'primeng/message';
import { finalize } from 'rxjs';

import { showLoading } from '../utils';
import { AccessoryService } from '../../services/accessories.service';
import { UserService } from '../../services/user.service';
import { AccStatus } from '../../../pages/products.ts/accessories/accessories';

interface Column {
    field: string;
    header: string;
    customExportHeader?: string;
}

interface ExportColumn {
    title: string;
    dataKey: string;
}

@Component({
    selector: 'list-accessories-types',
    imports: [DialogModule, MessageModule, ButtonGroupModule, ConfirmDialogModule, TableModule, SelectModule, ToastModule, InputIconModule, InputTextModule, IconFieldModule, DataViewModule, RippleModule, ButtonModule, CommonModule, Tag, FormsModule, ReactiveFormsModule, PaginatorModule],
    providers: [ConfirmationService, MessageService],
    styleUrls: [],
    standalone: true,

    template: `
    <p-toast></p-toast>
    <p-table [value]="accessories_types()"  [columns]="cols" csvSeparator=";" [exportHeader]="'customExportHeader'" stripedRows selectionMode="multiple" [(selection)]="selectedUsers" dataKey="id" [tableStyle]="{ 'min-width': '50rem', 'margin-top':'10px' }"
    #dt
    [rows]="10"
    [globalFilterFields]="['type']"
    [rowHover]="true"
    dataKey="id"
    >
    <ng-template #caption>
    <div class="flex items-center justify-between mb-4">
        <span class="text-xl font-bold">Tipos de Acessórios</span>
    </div>

    <div class="flex flex-wrap items-center justify-end gap-2">

        <p-iconfield>
        <p-inputicon styleClass="pi pi-search" />
        <input [(ngModel)]="typeSearch" pInputText type="text" (input)="onGlobalFilter($event)" placeholder="Tipo..." />
        </p-iconfield>

        <p-iconfield>
        <p-select [options]="accStates" [(ngModel)]="selectedAccState" optionLabel="name" (onChange)="onGlobalFilter($event)" class="w-full md:w-56" />
        </p-iconfield>
    </div>

    <div class="text-end pb-4 mt-2">
        <p-button icon="pi pi-external-link" label="Exportar CSV" (click)="dt.exportCSV()" />
    </div>

    </ng-template>

    <ng-template #header>
        <tr>
            <th pSortableColumn="type">
                Tipo
                <p-sortIcon field="type" />
            </th>

            <th pSortableColumn="active">
                Ativo
                <p-sortIcon field="active" />
            </th>
            <th></th>
        </tr>
    </ng-template>

    <ng-template #body let-typ>
        <tr [pSelectableRow]="typ">
            <td>
                {{ typ.type }}
            </td>

            <td>
                <p-tag
                [value]="getActiveState(typ)"
                [severity]="getSeverity(typ)"
                styleClass="dark:!bg-surface-900"
                />
            </td>

            <td>
                <p-buttongroup>
                <p-button (click)="updateAccType(typ.id, typ.type)" icon="pi pi-pencil" severity="contrast" rounded/>
                <p-button (click)="deactivateAccType(typ.id, typ.type)" icon="pi pi-trash" severity="contrast" rounded/>
                </p-buttongroup>
            </td>
        </tr>

    </ng-template>
    </p-table>

    <p-paginator (onPageChange)="onPageChange($event)"
    [first]="first"
    [showCurrentPageReport]="true"
    currentPageReportTemplate="Total: {totalRecords} | Mostrando {first} de {last}"
    [rows]="limitPerPage"
    [totalRecords]="totalRecords"
    />

        <p-dialog [(visible)]="accDialog" header="Atualizar tipo" [modal]="true">
        <ng-template #content>
        <form [formGroup]="form" (ngSubmit)="onSubmit()" style='margin-bottom: 4rem;'>
        <button id="btn_submit" style='display:none;' type="submit"></button>

        <div class='row'>
        <div class='col-md-12'>
        <label for="Type" class="block font-bold mb-3">Tipo do acessório</label>
        <input formControlName="Type" class="w-full md:w-[30rem] mb-2" type="text" pInputText id="Type" required autofocus fluid />
        <div class="error-feedback" *ngIf="hasBeenSubmited('Type')">
        <p-message styleClass="mb-2" *ngIf="form.controls.Type.hasError('required')" severity="error" variant="simple" size="small">Por favor, digitar um tipo/descrição do tipo</p-message>
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

    <p-confirmdialog
    [rejectLabel]="rejectLabel"
    [acceptLabel]="confirmLabel"
    [acceptAriaLabel]="confirmLabel"
    [rejectAriaLabel]="rejectLabel"
    [style]="{ width: '450px' }"
    />
    `,
})
export class ListAccessoriesTypesComponent {
    constructor(
        private router: Router,
        public formBuilder: FormBuilder,
        private messageService: MessageService,
        private userService: UserService,
        private accessoryService: AccessoryService,
        private confirmationService: ConfirmationService
    ) { }

    @Input() accessories_types: any
    @Input() totalRecords: any
    @Input() limitPerPage: any

    id: string = ""
    _type: string = ""

    submitted: boolean = false
    accDialog: boolean = false
    isLoading: boolean = false
    typingTimeout: any
    curPage = 1
    first = 1

    form = this.formBuilder.group({
        Type: ['', [Validators.required]],
    })

    selectedUsers!: any[] // does nothing for now

    selectedAccState: AccStatus | undefined = { name: "Indiferente", code: "" }
    accStates: AccStatus[] | undefined
    autoFilteredValue: any[] = []

    typeSearch: string = ""

    cols!: Column[];
    exportColumns!: ExportColumn[];

    confirmLabel = "Confirmar"
    rejectLabel = "Cancelar"

    onPageChange(e: any) {
        this.loadAccessoriesTypes(e.page)
        this.curPage = e.page
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }


    ngOnInit() {
        this.accStates = [
            { name: "Indiferente", code: "" },
            { name: "Ativo", code: "Y" },
            { name: "Não ativo", code: "N" },
        ]

        this.cols = [
            { field: 'type', header: 'Tipo' },
            { field: 'active', header: 'Ativo' }
        ];

        this.exportColumns = this.cols.map((col) => ({ title: col.header, dataKey: col.field }));
    }

    loadAccessoriesTypes(page: number, isDelete = false) {
        if (!isDelete) page++
        const rmLoading = showLoading()

        this.accessoryService.getAccessoriesTypes(page, this.limitPerPage, this.typeSearch, this.selectedAccState?.code as string).pipe(finalize(() => { rmLoading() })).subscribe({
            next: (res: any) => {
                this.accessories_types.set(res.data ?? [])
                this.totalRecords = res.totalRecords
                this.first = 1

            },
            error: (err) => {
                if (err.status) {
                    this.messageService.add({ severity: 'error', summary: "Erro", detail: 'Ocorreu um erro ao buscar tipos.' });
                }
                this.isLoading = false
            },
        })
    }

    updateAccType(id: string, _type: string) {
        this.submitted = false
        this.accDialog = true

        this.id = id
        this._type = _type

        this.form = this.formBuilder.group({
            Type: [this._type, [Validators.required]],
        });
    }

    deactivateAccType(id: string, _type: string) {
        this.confirmationService.confirm({
            message: 'Confirma desativar o tipo ' + `<mark>${_type}</mark>` + ' ?',
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
                const rmLoading = showLoading()

                this.accessoryService.deactivateAccessoryType(id).pipe(finalize(() => { rmLoading() })).subscribe({
                    next: (res: any) => {
                        this.loadAccessoriesTypes(this.curPage, true)
                        this.messageService.add({ severity: 'success', summary: "Sucesso", detail: 'Tipo desativado com sucesso' });
                    },
                    error: (err) => {
                        this.messageService.add({ severity: 'error', summary: "Erro", detail: "Ocorreu um erro ao tentar desativar o tipo." });
                    },
                })
            }
        });
    }

    hideDialog() {
        this.accDialog = false;
        this.submitted = false;
    }


    onSubmit() {
        this.submitted = true

        if (this.form.valid) {
            this.isLoading = true

            this.accessoryService.updateAccessoryType(this.id, this.form.value).subscribe({
                next: (res: any) => {
                    this.messageService.add({ severity: 'success', summary: "Sucesso", detail: 'Tipo atualizado com sucesso' });
                    this.loadAccessoriesTypes(this.curPage, true)
                    this.submitted = false
                    this.isLoading = false
                    this.hideDialog()
                    this.form.reset()
                },
                error: (err) => {
                    this.hideDialog()

                    if (err?.status == 400 && err?.error?.errors?.type == "type must bet active to update it") {
                        this.messageService.add({ severity: 'error', summary: "Erro", detail: 'O tipo precisa estar ativo para edição' });
                    } else if (err?.status == 400 && err?.error?.errors?.type == "type already exists") {
                        this.messageService.add({ severity: 'error', summary: "Erro", detail: 'O tipo já existe' });
                    } else {
                        this.messageService.add({ severity: 'error', summary: "Erro", detail: 'Ocorreu um erro com sua requisição.' });

                    }
                    this.isLoading = false
                },

            })
        }
    }

    submit() {
        document.getElementById(`btn_submit`)?.click()
    }

    onGlobalFilter(event: any) {
        if (this.typingTimeout) {
            clearTimeout(this.typingTimeout)
        }

        this.typingTimeout = setTimeout(() => {
            this.first = 0;
            this.curPage = 1;
            this.loadAccessoriesTypes(0)
        }, 500)
    }

    getSeverity(_data: any) {
        if (_data.active == `Y`) {
            return "success"
        } else {
            return "danger"
        }
    }

    getActiveState(_data: any) {
        if (_data.active == `Y`) {
            return "Ativo"
        } else {
            return "Inativo"
        }
    }

    hasBeenSubmited(controlName: string): boolean {
        const control = this.form.get(controlName)
        return Boolean(control?.invalid)
            && (this.submitted || Boolean(control?.touched))
        //|| Boolean(control?.dirty
    }

}

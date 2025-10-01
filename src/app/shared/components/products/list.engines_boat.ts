import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, signal, ViewChild } from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import { DataViewModule } from 'primeng/dataview';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { PaginatorModule } from 'primeng/paginator';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { TableModule } from 'primeng/table';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { InputIconModule } from 'primeng/inputicon';
import { IconFieldModule } from 'primeng/iconfield';
import { InputTextModule } from 'primeng/inputtext';
import { Tag } from 'primeng/tag';
import { SelectModule } from 'primeng/select';
import { ToastModule } from 'primeng/toast';
import { ButtonGroupModule } from 'primeng/buttongroup';
import { finalize } from 'rxjs';

import { showLoading } from '../utils';
import { UserService } from '../../services/user.service';
import { BoatService } from '../../services/boats.service';


@Component({
    selector: 'list-engines-boat',
    imports: [DialogModule, ButtonGroupModule, ConfirmDialogModule, TableModule, SelectModule, ToastModule, InputIconModule, InputTextModule, IconFieldModule, DataViewModule, RippleModule, ButtonModule, CommonModule, Tag, FormsModule, ReactiveFormsModule, PaginatorModule],
    providers: [ConfirmationService, MessageService],
    styleUrls: [],
    standalone: true,

    template: `
    <p-toast></p-toast>
    <p-table [value]="boatsEngines()"  stripedRows selectionMode="multiple" [(selection)]="selected" dataKey="id" [tableStyle]="{ 'min-width': '50rem', 'margin-top':'10px' }"
        #dt
        [rows]="10"
        [rowHover]="true"
        dataKey="id"
    >
    <ng-template #caption>
        <div class="flex items-center justify-between mb-4">
            <span class="text-xl font-bold">Motores</span>
        </div>
    </ng-template>

    <ng-template #header>
        <tr>
            <th>
                Cód. Motor
            </th>

            <th pSortableColumn="model">
                Modelo
                <p-sortIcon field="model" />
            </th>

            <th></th>
        </tr>
    </ng-template>
    <ng-template #body let-eng>
        <tr [pSelectableRow]="eng">
            <td>
                M{{ eng.id }}
            </td>

            <td>
                {{ eng.model }}
            </td>

            <td>
                <p-button (click)="removeEngine(this.id, eng.id, eng.model)" icon="pi pi-trash" severity="contrast" rounded/>
            </td>
        </tr>
    </ng-template>
    </p-table>

    <p-confirmdialog
    [rejectLabel]="rejectLabel"
    [acceptLabel]="confirmLabel"
    [acceptAriaLabel]="confirmLabel"
    [rejectAriaLabel]="rejectLabel"
    [style]="{ width: '450px' }"
    />

    `,
})
export class ListEnginesBoatComponent {
    constructor(
        private router: Router,
        private messageService: MessageService,
        private userService: UserService,
        private confirmationService: ConfirmationService,
        private boatsService: BoatService,
    ) { }

    confirmLabel = "Confirmar"
    rejectLabel = "Cancelar"
    selected!: any[] // does nothing for now

    @Input() id: any

    boatsEngines = signal<any[]>([])   


    loadBoatEngines() {
        this.boatsService.getBoatEngines(this.id).pipe(finalize(() => { })).subscribe({
            next: (res: any) => {
                this.boatsEngines.set(res.data ?? [])

            },
            error: (err) => {
                if (err.status) {
                    this.messageService.add({ severity: 'error', summary: "Erro", detail: 'Ocorreu um erro ao buscar os motores do casco.' });
                }
            },
        })
    }

    removeEngine(id: string, id_engine: string, model: string) {
        this.confirmationService.confirm({
            message: 'Confirma remover o motor ' + `<mark>${model}</mark>` + ' ?',
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

                this.boatsService.removeBoatEngine(id, id_engine).pipe(finalize(() => { rmLoading() })).subscribe({
                    next: (res: any) => {
                        this.loadBoatEngines()
                        this.messageService.add({ severity: 'success', summary: "Sucesso", detail: 'Motor removido com sucesso' });
                    },
                    error: (err) => {
                        this.messageService.add({ severity: 'error', summary: "Erro", detail: "Ocorreu um erro ao tentar remover o motor." });
                    },
                })
            }
        });
    }

}

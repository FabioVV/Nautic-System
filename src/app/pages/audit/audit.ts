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
import { InputMaskModule } from 'primeng/inputmask';

import { ListLogsComponent } from '../../shared/components/audit/list.logs';
import { User, UserService } from '../../shared/services/user.service';
import { PASSWORD_PATTERN_VALIDATOR } from '../../shared/constants';
import { SelectItem } from '../../shared/components/utils';
import { RolesService } from '../../shared/services/roles.service';
import { LogsService } from '../../shared/services/logs.service';


@Component({
    selector: 'app-audit-logs',
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
        InputMaskModule,
        ListLogsComponent,
    ],
    providers: [MessageService, ConfirmationService],
    template: `
    <p-toast></p-toast>
    <p-toolbar styleClass="mb-6">


        <ng-template #end>
        </ng-template>
    </p-toolbar>


    <list-logs [logs]="logs" [totalRecords]="totalRecords" [limitPerPage]="limitPerPage" ></list-logs>
    `
})
export class AuditLogsPage implements OnInit {

    constructor(
        public formBuilder: FormBuilder,
        private messageService: MessageService,
        private userService: UserService,
        private confirmationService: ConfirmationService,
        private logsService: LogsService,
    ) { }

    submitted: boolean = false
    isSubmited: boolean = false
    isLoading: boolean = false
    totalRecords = 0
    limitPerPage = 20

    logs = signal<any[]>([])


    ngOnInit(): void {
        this.loadLogs()

        // this.rolesService.getRoles(1, 1000, "", "Y").subscribe({
        //     next: (res: any) => {

        //         res?.data?.forEach((i: any) => {
        //             this.roles.push({name: i?.name, code: i?.name})
        //         })

        //     }, 
        //     error: (err: any) => {
        //         this.messageService.add({ severity: 'error', summary: "Erro", detail: 'Ocorreu um erro ao buscar as negociações.' });
        //     },
        // })
    }

    loadLogs() {
        this.logsService.getLogs(1, this.limitPerPage, "", "").subscribe({
            next: (res: any) => {
                this.logs.set(res.data ?? [])
                this.totalRecords = res.totalRecords
            },
            error: (err) => {
                if (err.status) {
                    this.messageService.add({ severity: 'error', summary: "Erro", detail: 'Ocorreu um erro ao buscar os logs do sistema.' });
                }
                this.isLoading = false
            },
        })
    }

}

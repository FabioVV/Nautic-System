import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import { DataViewModule } from 'primeng/dataview';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { PaginatorModule } from 'primeng/paginator';
import { Tag } from 'primeng/tag';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { InputIconModule } from 'primeng/inputicon';
import { IconFieldModule } from 'primeng/iconfield';
import { InputTextModule } from 'primeng/inputtext';

import { UserService } from '../../services/user.service'

@Component({
    selector: 'list-users',
    imports: [DialogModule, InputIconModule, InputTextModule, IconFieldModule, DataViewModule, RippleModule, ButtonModule, CommonModule, Tag, FormsModule, ReactiveFormsModule, PaginatorModule],
    styleUrls: [],
    standalone: true,

    template: `
    <p-dataview #dv
    [value]="users()"
    layout="grid"
    >
    <ng-template #header>
    <div class="flex items-center justify-between">
    <h5></h5>
    <p-iconfield>
    <p-inputicon styleClass="pi pi-search" />
    <input pInputText type="text" (input)="onGlobalFilter($event)" placeholder="Digite o nome..." />
    </p-iconfield>
    </div>
    </ng-template>
    <ng-template #grid let-items>
    <div class="grid grid-cols-12 gap-4">
    <div *ngFor="let user of items" class="col-span-12 sm:col-span-6 md:col-span-4 xl:col-span-4 p-2">
    <div
    class="p-6 border border-surface-200 dark:border-surface-700 bg-surface-0 dark:bg-surface-900 rounded flex flex-col"
    >
    <div class="bg-surface-50 flex justify-center rounded p-4">
    <div class="relative mx-auto" style="width:100% !important;">
    <img
    class="rounded w-full"
    src="assets/images/nowpro.png"
    [alt]="user.name"
    style="height: 200px; object-fit: cover;"
    />
    <p-tag
    [value]="getUserActiveState(user)"
    [severity]="getSeverity(user)"
    class="absolute"
    styleClass="dark:!bg-surface-900"
    [style.left.px]="4"
    [style.top.px]="4"
    />
    </div>
    </div>
    <div class="pt-6">
    <div class="flex flex-row justify-between products-start gap-2">
    <div>
    <div class="text-lg font-medium mt-1">{{ user.name }}</div>
    </div>

    </div>
    <div class="flex flex-col gap-6 mt-6">
    <div class="flex gap-2">
    <button
    pButton
    icon=""
    label="Entrar"
    class="flex-auto whitespace-nowrap"
    (click)="goToClass(user.id)"
    ></button>
    </div>
    </div>
    </div>
    </div>
    </div>
    </div>
    </ng-template>
    </p-dataview>

    <p-paginator (onPageChange)="onPageChange($event)" [first]="1" [rows]="10" [totalRecords]="totalRecords" />

    `,
})
export class ListUsersComponent {

    constructor(
        private router: Router,
        private messageService: MessageService,
        private userService: UserService,

    ) { }

    @Input() users: any
    @Input() totalRecords: any
    private isLoading: boolean = false
    private typingTimeout: any
    private curPage = 1


    onPageChange(e: any) {
        this.loadUsers(e.page)
        this.curPage = e.page
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    loadUsers(page: number) {
        page += 1
        // this.userService.getUsers(page, "").subscribe({
        //     next: (res: any) => {
        //         if (res.succeeded) {
        //             this.classes.set(res.data.$values ?? [])
        //             this.totalRecords = res.totalRecords
        //         }
        //     },
        //     error: (err) => {
        //         if (err.status) {
        //             this.messageService.add({ severity: 'error', summary: "Erro", detail: 'Ocorreu um erro ao buscar turmas. Contate o administrador' });
        //         }
        //         this.isLoading = false
        //     },
        // })
    }

    onGlobalFilter(event: Event) {
        const input = (event.target as HTMLInputElement).value

        if (this.typingTimeout) {
            clearTimeout(this.typingTimeout)
        }

        this.typingTimeout = setTimeout(() => {
            // this.userService.getUsers(this.curPage, input).subscribe({
            //     next: (res: any) => {
            //         if (res.succeeded) {
            //             this.classes.set(res.data.$values ?? [])
            //             this.totalRecords = res.totalRecords
            //         }
            //     },
            //     error: (err) => {
            //         if (err.status) {
            //             this.messageService.add({ severity: 'error', summary: "Erro", detail: 'Ocorreu um erro ao buscar turmas. Contate o administrador' });
            //         }
            //         this.isLoading = false
            //     },
            // })
        }, 500)
    }

    getSeverity(_user: any) {
        if (_user.isActive == `Y`) {
            return "success"
        } else {
            return "danger"
        }
    }

    getUserActiveState(_user: any) {
        if (_user.isActive == `Y`) {
            return "Ativo"
        } else {
            return "Inativo"
        }
    }

    goToClass(classId: string) {
        this.router.navigate([`/classes`, classId])
    }
}

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
import { ClassService } from '../services/class.service';
import { MessageService } from 'primeng/api';
import { InputIconModule } from 'primeng/inputicon';
import { IconFieldModule } from 'primeng/iconfield';
import { InputTextModule } from 'primeng/inputtext';

@Component({
    selector: 'list-users',
    imports: [DialogModule, InputIconModule, InputTextModule, IconFieldModule, DataViewModule, RippleModule, ButtonModule, CommonModule, Tag, FormsModule, ReactiveFormsModule, PaginatorModule],
    styleUrls: [],
    standalone: true,

    template: `
    <p-dataview #dv
    [value]="classes()"
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
    <div *ngFor="let class of items" class="col-span-12 sm:col-span-6 md:col-span-4 xl:col-span-4 p-2">
    <div
    class="p-6 border border-surface-200 dark:border-surface-700 bg-surface-0 dark:bg-surface-900 rounded flex flex-col"
    >
    <div class="bg-surface-50 flex justify-center rounded p-4">
    <div class="relative mx-auto" style="width:100% !important;">
    <img
    class="rounded w-full"
    src="assets/images/nowpro.png"
    [alt]="class.name"
    style="height: 200px; object-fit: cover;"
    />
    <p-tag
    [value]="getClassState(class)"
    [severity]="getSeverity(class)"
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
    <span class="font-medium text-surface-500 dark:text-surface-400 text-sm">
    {{ class.description }}
    </span>
    <div class="text-lg font-medium mt-1">{{ class.name }}</div>
    </div>

    </div>
    <div class="flex flex-col gap-6 mt-6">
    <div class="flex gap-2">
    <button
    pButton
    icon=""
    label="Entrar"
    class="flex-auto whitespace-nowrap"
    (click)="goToClass(class.id)"
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
        private classService: ClassService,
        private messageService: MessageService,

    ) { }

    @Input() classes: any
    @Input() totalRecords: any
    isLoading: boolean = false
    private typingTimeout: any
    curPage = 1


    onPageChange(e: any) {
        this.loadClasses(e.page)
        this.curPage = e.page
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    loadClasses(page: number) {
        page += 1
        this.classService.getClasses(page, "").subscribe({
            next: (res: any) => {
                if (res.succeeded) {
                    this.classes.set(res.data.$values ?? [])
                    this.totalRecords = res.totalRecords
                }
            },
            error: (err) => {
                if (err.status) {
                    this.messageService.add({ severity: 'error', summary: "Erro", detail: 'Ocorreu um erro ao buscar turmas. Contate o administrador' });
                }
                this.isLoading = false
            },
        })
    }

    onGlobalFilter(event: Event) {
        const input = (event.target as HTMLInputElement).value

        if (this.typingTimeout) {
            clearTimeout(this.typingTimeout)
        }

        this.typingTimeout = setTimeout(() => {
            this.classService.getClasses(this.curPage, input).subscribe({
                next: (res: any) => {
                    if (res.succeeded) {
                        this.classes.set(res.data.$values ?? [])
                        this.totalRecords = res.totalRecords
                    }
                },
                error: (err) => {
                    if (err.status) {
                        this.messageService.add({ severity: 'error', summary: "Erro", detail: 'Ocorreu um erro ao buscar turmas. Contate o administrador' });
                    }
                    this.isLoading = false
                },
            })
        }, 500)
    }

    getSeverity(_class: any) {
        if (_class.isActive == `S`) {
            return "success"
        } else {
            return "danger"
        }
    }

    getClassState(_class: any) {
        if (_class.isActive == `S`) {
            return "Turma ativa"
        } else {
            return "Turma inativa"
        }
    }

    goToClass(classId: string) {
        this.router.navigate([`/classes`, classId])
    }
}

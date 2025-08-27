import { Component, signal } from '@angular/core';
import { RippleModule } from 'primeng/ripple';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { DashboardService } from '../../shared/services/dashboard.service';
import { MessageService } from 'primeng/api';

export interface Product {
    id?: string;
    code?: string;
    name?: string;
    description?: string;
    price?: number;
    quantity?: number;
    inventoryStatus?: string;
    category?: string;
    image?: string;
    rating?: number;
}

@Component({
    standalone: true,
    selector: 'recent-students-updates',
    imports: [CommonModule, TableModule, ButtonModule, RippleModule],
    template: `
        <div class="card !mb-8">
            <div class="font-semibold text-xl mb-4">Atividades enviadas recentemente por seus alunos</div>
            <p-table [value]="tableData()" [paginator]="false" [rows]="10" responsiveLayout="scroll">
                <ng-template #header>
                    <tr>
                        <th pSortableColumn="studentEmail">Email <p-sortIcon field="studentEmail"></p-sortIcon></th>
                        <th pSortableColumn="studentDeliveredLink">Link resolução <p-sortIcon field="studentDeliveredLink"></p-sortIcon></th>
                    </tr>
                </ng-template>
                <ng-template #body let-act>
                    <tr>
                        <td style="width: 35%; min-width: 7rem;">{{ act.studentEmail }}</td>
                        <td style="width: 35%; min-width: 8rem;">
                            <a style="text-decoration:underline; color:lightblue;" href="{{ act.studentDeliveredLink }}" target="_blank">
                                {{ getTruncatedLink(act.studentDeliveredLink) }}
                            </a>
                        </td>
                    </tr>
                </ng-template>
            </p-table>
        </div>
    `,
})
export class RecentStudentsUpdates {
    tableData = signal<any[]>([])

    getProductsData() {
        this.dashboardService.getDashboardDataLastStudentsUpdated().subscribe({
            next: (res: any) => {
                this.tableData.set((res.lastUpdated.$values))

            }, 
            error: (err) => {
                if (err.status) {
                    this.messageService.add({ severity: 'error', summary: "Erro", detail: 'Ocorreu um erro ao buscar alguns dados. Contate o administrador' });
                } 
            },
        })
    }

    constructor(
        private dashboardService: DashboardService,
        private messageService: MessageService, 
    ) {}

    ngOnInit() {
        this.getProductsData()
    }

    getTruncatedLink(link: string): string {
        return link.length > 40 ? link.slice(0, 40) + '...' : link
    }
}
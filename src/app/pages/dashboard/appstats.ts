import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardService } from '../../shared/services/dashboard.service';
import { MessageService } from 'primeng/api';

@Component({
    standalone: true,
    selector: 'stats',
    imports: [CommonModule],
    providers:[MessageService],
    template: `
        <div class="col-span-12 lg:col-span-6 xl:col-span-3">
            <div class="card mb-0">
                <div class="flex justify-between mb-4">
                    <div>
                        <span class="block text-muted-color font-medium mb-4">Turmas</span>
                        <div class="text-surface-900 dark:text-surface-0 font-medium text-xl">{{ turmasTotais() }}</div>
                    </div>
                    <div class="flex items-center justify-center bg-blue-100 dark:bg-blue-400/10 rounded-border" style="width: 2.5rem; height: 2.5rem">
                        <i class="pi pi-book text-blue-500 !text-xl"></i>
                    </div>
                </div>

                <span class="text-primary font-medium">{{ turmasAtivasTotais() }} <span class="text-muted-color">Ativa(s)</span>, </span>
                <span class="text-primary font-medium">{{ turmasInativasTotais() }} <span class="text-muted-color">Inativa(s)</span> </span>

            </div>
        </div>

        <div class="col-span-12 lg:col-span-6 xl:col-span-3">

            <div class="card mb-0">
                <div class="flex justify-between mb-4">
                    <div>
                        <span class="block text-muted-color font-medium mb-4">Alunos</span>
                        <div class="text-surface-900 dark:text-surface-0 font-medium text-xl">{{ alunosTotais() }}</div>
                    </div>
                    <div class="flex items-center justify-center bg-cyan-100 dark:bg-cyan-400/10 rounded-border" style="width: 2.5rem; height: 2.5rem">
                        <i class="pi pi-users text-cyan-500 !text-xl"></i>
                    </div>
                </div>

                <span class="text-primary font-medium">{{ alunosAtivasTotais() }} <span class="text-muted-color">de turma(s) ativas</span>, </span>
                <span class="text-primary font-medium">{{ alunosInativasTotais() }} <span class="text-muted-color">de turma(s) inativas</span> </span>

                <span class="text-primary font-medium">&nbsp;</span>
            </div>

        </div>
    `
})
export class Stats implements OnInit {

    alunosTotais = signal<number>(0)
    alunosAtivasTotais = signal<number>(0)
    alunosInativasTotais = signal<number>(0)

    turmasTotais = signal<number>(0)
    turmasAtivasTotais = signal<number>(0)
    turmasInativasTotais = signal<number>(0)

    ngOnInit(): void {
        this.loadDashboardData()
    }

    constructor(
        private dashboardService: DashboardService,
        private messageService: MessageService, 
    
    ) {

    }

    loadDashboardData(){
        this.dashboardService.getDashboardData().subscribe({
            next: (res: any) => {
                this.turmasTotais.set((res.classes))
                this.turmasAtivasTotais.set((res.activeClasses))
                this.turmasInativasTotais.set((res.inactiveClasses))
                this.alunosTotais.set((res.students))
                this.alunosAtivasTotais.set((res.activeStudents))
                this.alunosInativasTotais.set((res.inactiveStudents))
            }, 
            error: (err) => {
                if (err.status) {
                    this.messageService.add({ severity: 'error', summary: "Erro", detail: 'Ocorreu um erro ao buscar alguns dados. Contate o administrador' });
                } 
            },
        })
    }
}
import { Routes } from '@angular/router'
import { authGuard } from '../shared/guards/auth.guard'
import { ListReportNegotiationsComponent } from './reports/reports.negotiations'

export default [
    { path: 'negotiations', component: ListReportNegotiationsComponent, canActivate: [authGuard], data: { "code": "users:view" } },
] as Routes

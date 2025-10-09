import { Routes } from '@angular/router'
import { authGuard } from '../shared/guards/auth.guard'
import { ListReportNegotiationsComponent } from './reports/reports.negotiations'
import { ListReportSalesOrdersComponent } from './reports/reports.sales_orders'
import { ListReportLostNegotiationsComponent } from './reports/reports.lost_negotiations'

export default [
    { path: 'negotiations', component: ListReportNegotiationsComponent, canActivate: [authGuard], data: { "code": "reports_negotiations:view" } },
    { path: 'sales-orders', component: ListReportSalesOrdersComponent, canActivate: [authGuard], data: { "code": "reports_sales_orders:view" } },
    { path: 'lost-negotiations', component: ListReportLostNegotiationsComponent, canActivate: [authGuard], data: { "code": "reports_lost_negotiations:view" } },
] as Routes

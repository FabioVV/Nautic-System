import { Routes } from '@angular/router'
import { authGuard } from '../shared/guards/auth.guard'
import { ListReportNegotiationsComponent } from './reports/reports.negotiations'
import { ListReportSalesOrdersComponent } from './reports/reports.sales_orders'

export default [
    { path: 'negotiations', component: ListReportNegotiationsComponent, canActivate: [authGuard], data: { "code": "reports_negotiations:view" } },
    { path: 'sales-orders', component: ListReportSalesOrdersComponent, canActivate: [authGuard], data: { "code": "reports_sales_orders:view" } },
] as Routes

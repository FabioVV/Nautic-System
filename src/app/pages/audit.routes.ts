import { Routes } from '@angular/router';
import { AuditLogsPage } from './audit/audit';
import { authGuard } from '../shared/guards/auth.guard';


export default [
    { path: 'logs', component: AuditLogsPage, canActivate: [authGuard], data: { "code": "logs:view" } },
] as Routes

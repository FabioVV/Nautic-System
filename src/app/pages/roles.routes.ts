import { Routes } from '@angular/router';
import { authGuard } from '../shared/guards/auth.guard';
import { RolesPage } from './roles/roles';

export default [
    { path: 'roles', component: RolesPage, canActivate: [authGuard], data: { "code": "roles:view" } },
] as Routes

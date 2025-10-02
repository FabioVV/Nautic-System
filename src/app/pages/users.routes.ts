import { Routes } from '@angular/router';
import { UsersPage } from './users/users';
import { authGuard } from '../shared/guards/auth.guard';

export default [
    { path: 'users', component: UsersPage, canActivate: [authGuard], data: { "code": "users:view" } },
] as Routes

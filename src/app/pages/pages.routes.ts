import { Routes } from '@angular/router';
import { UsersPage } from './users/users';

export default [
    { path: 'users', component: UsersPage, data: { "code": "users:view" } },
] as Routes;

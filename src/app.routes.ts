import { Routes } from '@angular/router';
import { AppLayout } from './app/layout/component/app.layout';
import { Dashboard } from './app/pages/dashboard/dashboard';
import { Notfound } from './app/pages/notfound/notfound';
import { authGuard } from './app/shared/guards/auth.guard';


export const appRoutes: Routes = [
    { path: "", redirectTo: "/auth/login", pathMatch: "full" },
    { path: "auth", redirectTo: "/auth/login", pathMatch: "full" },

    { path: 'auth', loadChildren: () => import('./app/pages/auth/auth.routes') },

    {
        path: '',
        component: AppLayout,
        children: [
            { path: 'dashboard', component: Dashboard, canActivate: [authGuard], },
        ]
    },

    {
        path: "system",
        component: AppLayout,
        children: [
            { path: '', loadChildren: () => import('./app/pages/users.routes') },
            { path: '', loadChildren: () => import('./app/pages/permissions.routes') },
            { path: '', loadChildren: () => import('./app/pages/roles.routes') },
        ]
    },


    { path: 'notfound', component: Notfound },
    { path: '**', redirectTo: '/notfound' }
];

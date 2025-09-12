import { Routes } from '@angular/router';
import { authGuard } from '../shared/guards/auth.guard';

import { AccessoriesPage } from './products.ts/accessories/accessories';
import { BoatsPage } from './products.ts/boats/boats';
import { EnginesPage } from './products.ts/engines/engines';
import { AccessoriesTypesPage } from './products.ts/accessories/accessories_types';

export default [
    { path: 'accessories', component: AccessoriesPage, canActivate: [authGuard], data: { "code": "accessories_types:view" } },
    { path: 'accessories-types', component: AccessoriesTypesPage, canActivate: [authGuard], data: { "code": "accessories:view" } },
    { path: 'boats', component: BoatsPage, canActivate: [authGuard], data: { "code": "pboats:view" } },
    { path: 'engines', component: EnginesPage, canActivate: [authGuard], data: { "code": "engines:view" } },
] as Routes;

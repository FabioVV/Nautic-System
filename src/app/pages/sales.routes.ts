import { Routes } from '@angular/router';
import { authGuard } from '../shared/guards/auth.guard';

import { NegotiationPanel } from './sales/negotiation';
import { CommunicationMeanPage } from './sales/communication_means';
import { SalesCustomersPage } from './sales/customers';

export default [
    { path: 'customers', component: SalesCustomersPage, canActivate: [authGuard], data: { "code": "sales_customers:view" } },
    { path: 'negotiation-panel', component: NegotiationPanel, canActivate: [authGuard], data: { "code": "negotiation_panel:view" } },
    { path: 'communication-means', component: CommunicationMeanPage, canActivate: [authGuard], data: { "code": "communication_means:view" } },
] as Routes;

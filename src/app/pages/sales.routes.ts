import { Routes } from '@angular/router';
import { authGuard } from '../shared/guards/auth.guard';

import { NegotiationPanel } from './sales/negotiation';
import { CommunicationMeanPage } from './sales/communication_means';

export default [
    { path: 'negotiation-panel', component: NegotiationPanel, canActivate: [authGuard], data: { "code": "negotiation_panel:view" } },
    { path: 'communication-means', component: CommunicationMeanPage, canActivate: [authGuard], data: { "code": "communication_means:view" } },
] as Routes;

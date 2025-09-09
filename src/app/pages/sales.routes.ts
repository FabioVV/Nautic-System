import { Routes } from '@angular/router';
import { NegotiationPanel } from './sales/negotiation';
import { authGuard } from '../shared/guards/auth.guard';

export default [
    { path: 'negotiation-panel', component: NegotiationPanel, canActivate: [authGuard], data: { "code": "negotiation_panel:view" } },
] as Routes;

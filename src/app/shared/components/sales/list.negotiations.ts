import { CommonModule } from '@angular/common';
import { Component, computed, ElementRef, HostListener, inject, signal, ViewChild } from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import { DataViewModule } from 'primeng/dataview';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { PaginatorModule } from 'primeng/paginator';
import { FormsModule, ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { TableModule } from 'primeng/table';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { InputIconModule } from 'primeng/inputicon';
import { IconFieldModule } from 'primeng/iconfield';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { ToastModule } from 'primeng/toast';
import { ButtonGroupModule } from 'primeng/buttongroup';
import { MessageModule } from 'primeng/message';
import { finalize } from 'rxjs';
import { CardModule } from 'primeng/card';
import { TooltipModule } from 'primeng/tooltip';
import { ContextMenu, ContextMenuModule } from 'primeng/contextmenu';
import { MenuItem } from 'primeng/api';
import { ToolbarModule } from 'primeng/toolbar';
import { faCakeCandles } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { InputGroupModule } from 'primeng/inputgroup';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { InputMaskModule } from 'primeng/inputmask';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { TabsModule } from 'primeng/tabs';
import { TextareaModule } from 'primeng/textarea';

import { formatBRLMoney, showLoading } from '../utils';
import { User, UserService } from '../../services/user.service';
import { Negotiation, NegotiationHistory, SalesCustomer, SalesService } from '../../services/sales.service';
import { AutoCompleteCompleteEvent } from 'primeng/autocomplete';
import { SelectItem } from '../utils';
import { SalesCustomerModal } from './frame.user';
import { SalesAboutPanel } from './about.sales_panel';
import { ListNegotiationHistoryComponent } from './list.negotiation_history';

interface Column {
    field: string
    header: string
    customExportHeader?: string
}

interface ExportColumn {
    title: string
    dataKey: string
}

@Component({
    selector: 'list-negotiations',
    imports: [DialogModule, ListNegotiationHistoryComponent, SalesCustomerModal, SalesAboutPanel, CardModule, TextareaModule, TabsModule, InputGroupAddonModule, InputNumberModule, InputMaskModule, AutoCompleteModule, InputGroupModule, FontAwesomeModule, ToolbarModule, TooltipModule, ContextMenuModule, MessageModule, ButtonGroupModule, ConfirmDialogModule, TableModule, SelectModule, ToastModule, InputIconModule, InputTextModule, IconFieldModule, DataViewModule, RippleModule, ButtonModule, CommonModule, FormsModule, ReactiveFormsModule, PaginatorModule],
    providers: [ConfirmationService, MessageService],
    styleUrl: "negotiation.css",
    standalone: true,

    template: `
    <p-toast></p-toast>
    <p-contextmenu #cm [model]="pcard_menu" (onHide)="onHide()" />

    <p-toolbar>

        <ng-template #start>
            <p-button (click)="openNewLead()" pTooltip="Cadastrar novo lead" tooltipPosition="top" icon="pi pi-plus" class="mr-2" text severity="success" />
            <p-button pTooltip="Visualizar seus alertas" tooltipPosition="top" icon="pi pi-bell" class="mr-2" text severity="warn" />

            <p-button (click)="openCustomerBirthdays()" pTooltip="Clientes aniversariantes" tooltipPosition="top" class="mr-2" text severity="secondary">
                <fa-icon style='color:#0ea5e9;' [icon]="faCakeCandles" />
            </p-button>

            <p-button (click)="showPanelExp()" pTooltip="Sobre o painel" tooltipPosition="top" icon="pi pi-question-circle" class="mr-2" text severity="secondary" />
            
        </ng-template>

        <ng-template #center>
            <p-iconfield iconPosition="left">
                <p-inputicon class="pi pi-search" />
                <input [(ngModel)]="negotiationSearch" pInputText (input)="onGlobalFilter($event)" type="text" pInputText placeholder="Pesquisar negócios..." />
            </p-iconfield>
        </ng-template>

        <ng-template #end>
        </ng-template>

    </p-toolbar>

    <div class='kb-painel' style='margin-top:1rem;'>
        <div id='stage1' class='dropzone' (drop)="drop($event)" (dragover)="dragover($event)" (dragenter)="dragenter($event)" (dragleave)="dragleave($event)">
            <h5 class='card-text' style='background: var(--p-toolbar-background); border: 1px solid var(--p-toolbar-border-color); text-align:center;'>Lead</h5>
            <div class='kb-cards'>
                <p-card *ngFor="let n of stageOne(); trackBy: trackById"
                    [attr.data-stage]="n.stage"
                    [attr.data-customer-id]="n.id_customer"
                    [attr.data-business-id]="n.id"

                    draggable="true"
                    [id]="n.id"
                    (dragstart)="dragstart($event, n.id)"
                    (contextmenu)="onContextMenu($event, n, n.id_customer, n.id)"
                    (dblclick)="openFollowUp(n.id, n.id_customer, n.stage)"
                    [ngStyle]="{'border': '1px solid ' + getBorderColor(n)}"
                >
                    <h6 class="card-text" pTooltip="{{ n.customer_name }}" tooltipPosition="top">{{ n.customer_name }}</h6>
                    <p class="m-0 card-text" pTooltip="{{ n.boat_name }}" tooltipPosition="top">
                        {{ n.boat_name }}
                    </p>
                    <br>
                    <small class="m-0 card-money">
                        {{ this._formatBRLMoney(n.estimated_value) }}
                    </small>
                </p-card>

            </div>
        </div>

        <div id='stage2' class='dropzone' (drop)="drop($event)" (dragover)="dragover($event)" (dragenter)="dragenter($event)" (dragleave)="dragleave($event)" >
            <h5 style='background: var(--p-toolbar-background); border: 1px solid var(--p-toolbar-border-color); color: var(--p-toolbar-color); text-align:center;'>Inicio de negociação</h5>
            <div class='kb-cards'>

                <p-card *ngFor="let n of stageTwo(); trackBy: trackById"
                    [attr.data-stage]="n.stage"
                    [attr.data-customer-id]="n.id_customer"
                    [attr.data-business-id]="n.id"

                    draggable="true"
                    (dragstart)="dragstart($event, n.id)"
                    [id]="n.id"
                    (contextmenu)="onContextMenu($event, n, n.id_customer, n.id)"
                    (dblclick)="openFollowUp(n.id, n.id_customer, n.stage)"
                >
                    <h6 class="card-text" pTooltip="{{ n.customer_name }}" tooltipPosition="top">{{ n.customer_name }}</h6>
                    <p class="m-0 card-text" pTooltip="{{ n.boat_name }}" tooltipPosition="top">
                        {{ n.boat_name }}
                    </p>
                    <br>
                    <small class="m-0 card-money">
                        {{ this._formatBRLMoney(n.estimated_value) }}
                    </small>
                </p-card>

            </div>
        </div>

        <div id='stage3' class='dropzone' (drop)="drop($event)" (dragover)="dragover($event)" (dragenter)="dragenter($event)" (dragleave)="dragleave($event)" >
            <h5 style='background: var(--p-toolbar-background); border: 1px solid var(--p-toolbar-border-color); color: var(--p-toolbar-color); text-align:center;'>Negociando</h5>
            <div class='kb-cards'>

                <p-card *ngFor="let n of stageThree(); trackBy: trackById"
                    [attr.data-stage]="n.stage"
                    [attr.data-customer-id]="n.id_customer"
                    [attr.data-business-id]="n.id"

                    draggable="true"
                    (dragstart)="dragstart($event, n.id)"
                    [id]="n.id"
                    (contextmenu)="onContextMenu($event, n, n.id_customer, n.id)"
                    (dblclick)="openFollowUp(n.id, n.id_customer, n.stage)"
                >
                    <h6 class="card-text" pTooltip="{{ n.customer_name }}" tooltipPosition="top">{{ n.customer_name }}</h6>
                    <p class="m-0 card-text" pTooltip="{{ n.boat_name }}" tooltipPosition="top">
                        {{ n.boat_name }}
                    </p>
                    <br>
                    <small class="m-0 card-money">
                        {{ this._formatBRLMoney(n.estimated_value) }}
                    </small>
                </p-card>

            </div>
        </div>

        <div id='stage4' class='dropzone' (drop)="drop($event)" (dragover)="dragover($event)" (dragenter)="dragenter($event)" (dragleave)="dragleave($event)" >
            <h5 style='background: var(--p-toolbar-background); border: 1px solid var(--p-toolbar-border-color); color: var(--p-toolbar-color); text-align:center;'>Fechamento</h5>
            <div class='kb-cards'>

                <p-card *ngFor="let n of stageFour(); trackBy: trackById"
                    [attr.data-stage]="n.stage"
                    [attr.data-customer-id]="n.id_customer"
                    [attr.data-business-id]="n.id"

                    draggable="true"
                    (dragstart)="dragstart($event, n.id)"
                    [id]="n.id"
                    (contextmenu)="onContextMenu($event, n, n.id_customer, n.id)"
                    (dblclick)="openFollowUp(n.id, n.id_customer, n.stage)"
                >
                    <h6 class="card-text" pTooltip="{{ n.customer_name }}" tooltipPosition="top">{{ n.customer_name }}</h6>
                    <p class="m-0 card-text" pTooltip="{{ n.boat_name }}" tooltipPosition="top">
                        {{ n.boat_name }}
                    </p>
                    <br>
                    <small class="m-0 card-money">
                        {{ this._formatBRLMoney(n.estimated_value) }}
                    </small>
                </p-card>

            </div>
        </div>

        <div id='stage5' class='dropzone' (drop)="drop($event)" (dragover)="dragover($event)" (dragenter)="dragenter($event)" (dragleave)="dragleave($event)" >
            <h5 style='background: var(--p-toolbar-background); border: 1px solid var(--p-toolbar-border-color); color: var(--p-toolbar-color); text-align:center;'>Entrega</h5>
            <div class='kb-cards'>

                <p-card *ngFor="let n of stageFive(); trackBy: trackById"
                    [attr.data-stage]="n.stage"
                    [attr.data-customer-id]="n.id_customer"
                    [attr.data-business-id]="n.id"

                    draggable="true"
                    (dragstart)="dragstart($event, n.id)"
                    [id]="n.id"
                    (contextmenu)="onContextMenu($event, n, n.id_customer, n.id)"
                    (dblclick)="openFollowUp(n.id, n.id_customer, n.stage)"
                >
                    <h6 class="card-text" pTooltip="{{ n.customer_name }}" tooltipPosition="top">{{ n.customer_name }}</h6>
                    <p class="m-0 card-text" pTooltip="{{ n.boat_name }}" tooltipPosition="top">
                        {{ n.boat_name }}
                    </p>
                    <br>
                    <small class="m-0 card-money">
                        {{ this._formatBRLMoney(n.estimated_value) }}
                    </small>
                </p-card>

            </div>
        </div>

    </div>

    <p-dialog header="Sobre o painel" [modal]="true" [(visible)]="panelExpVisible" [style]="{ width: '50rem' }" [breakpoints]="{ '1199px': '75vw', '575px': '90vw' }">
        <sales-about-panel />
    </p-dialog>

    <p-dialog header="Clientes aniversariantes" [modal]="true" [(visible)]="birthdaysDialog" [style]="{ width: '50rem' }" [breakpoints]="{ '1199px': '75vw', '575px': '90vw' }">
        <p-table [value]="customers()"  [columns]="cols" csvSeparator=";" [exportHeader]="'customExportHeader'" stripedRows selectionMode="multiple" [(selection)]="selectedData" dataKey="id" [tableStyle]="{ 'min-width': '50rem', 'margin-top':'10px' }"
            #dt
            [rows]="10"
            [globalFilterFields]="['name']"
            [rowHover]="true"
            dataKey="id"
        >
            <ng-template #caption>
                <div class="text-end pb-4 mt-2">
                    <p-button icon="pi pi-external-link" label="Exportar CSV" (click)="dt.exportCSV()" />
                </div>
            </ng-template>

            <ng-template #header>
                <tr>
                    <th pSortableColumn="customer_name">
                        Nome
                        <p-sortIcon field="name" />
                    </th>

                    <th pSortableColumn="customer_email">
                        E-mail
                        <p-sortIcon field="name" />
                    </th>

                    <th>
                        Telefone
                    </th>

                    <th></th>
                </tr>
            </ng-template>

            <ng-template #body let-user>
                <tr [pSelectableRow]="user">
                    <td>
                        {{ user.customer_name }}
                    </td>

                    <td>
                        {{ user.customer_email }}
                    </td>

                    <td>
                        {{ user.customer_phone }}
                    </td>

                    <td>
                        <p-buttongroup>
                            <p-button icon="pi pi-pencil" severity="contrast" rounded/>
                        </p-buttongroup>
                    </td>
                </tr>

            </ng-template>
        </p-table>
    </p-dialog>

    <p-dialog [style]="{ width: '900px' }" [(visible)]="negotiationDialog" header="Registrar Lead" [modal]="true">
        <ng-template #content>

            <form [formGroup]="form" (ngSubmit)="onSubmit()" style='margin-bottom: 7.5rem;'>
                <button id="btn_submit" style='display:none;' type="submit"></button>
                
                <div class='row'>

                    <div class='col-md-4'>
                        <label for="Name" class="block font-bold mb-3">Nome do cliente</label>
                        <input formControlName="Name" class="w-full md:w-[30rem] mb-2" type="text" pInputText id="Type" required autofocus fluid />
                        
                        <div class="error-feedback" *ngIf="hasBeenSubmited('Name')">
                            <p-message styleClass="mb-2" *ngIf="form.controls.Name.hasError('required')" severity="error" variant="simple" size="small">Por favor, digitar o nome do cliente</p-message>
                        </div>
                    </div>

                    <div class='col-md-4'>
                        <label for="Email" class="block font-bold mb-3">E-mail do cliente</label>
                        <input formControlName="Email" class="w-full md:w-[30rem] mb-2" type="text" pInputText id="Type" required autofocus fluid />
                        
                        <div class="error-feedback" *ngIf="hasBeenSubmited('Email')">
                            <p-message styleClass="mb-2" *ngIf="form.controls.Email.hasError('required')" severity="error" variant="simple" size="small">Por favor, digitar o e-mail do cliente</p-message>
                        </div>
                    </div>

                    <div class='col-md-4'>
                        <label for="Phone" class="block font-bold mb-3">Telefone do cliente</label>
                        <p-inputmask mask="99-99999-9999" class="w-full md:w-[30rem] mb-2" formControlName="Phone" placeholder="49-99999-9999" />
                        
                        <div class="error-feedback" *ngIf="hasBeenSubmited('Phone')">
                            <p-message styleClass="mb-2" *ngIf="form.controls.Phone.hasError('required')" severity="error" variant="simple" size="small">Por favor, digitar o telefone do cliente</p-message>
                        </div>
                    </div>

                </div>

                <div class='row'>

                    <div class='col-md-4'>
                        <label for="ComMeanName" class="block font-bold mb-3">Meio de comunicação que trouxe o cliente</label>

                        <p-inputgroup>
                            <p-inputgroup-addon pTooltip="Digite na caixa ao lado para pesquisar um meio e selecione na lista" tooltipPosition="top" [style]="{ cursor:'help' }">
                                <i class="pi pi-filter"></i>
                            </p-inputgroup-addon>

                            <p-autocomplete class="w-full mb-2" formControlName="ComMeanName" placeholder="Procure o tipo" [suggestions]="autoFilteredValue" optionLabel="name" (completeMethod)="filterClassAutocomplete($event)" (onSelect)="setComMeanChoosen($event)" />
                        </p-inputgroup>

                        <div class="error-feedback" *ngIf="hasBeenSubmited('ComMeanName')">
                            <p-message styleClass="mb-2" *ngIf="form.controls.ComMeanName.hasError('required')" severity="error" variant="simple" size="small">Por favor, digitar o nome do cliente</p-message>
                        </div>
                    </div>

                    <div class='col-md-4'>
                        <label for="EstimatedValue" class="block font-bold mb-3">Valor estimado</label>
                        <p-inputnumber formControlName="EstimatedValue" class="w-full mb-2" mode="currency" currency="BRL" locale="pt-BR" />

                        <div class="error-feedback" *ngIf="hasBeenSubmited('EstimatedValue')">
                            <p-message styleClass="mb-2" *ngIf="form.controls.EstimatedValue.hasError('required')" severity="error" variant="simple" size="small">Por favor, digitar o valor estimado da embarcação</p-message>
                        </div>
                    </div>

                    <div class='col-md-4'>
                        <label for="BoatName" class="block font-bold mb-3">Embarcação aproximada</label>
                        <input formControlName="BoatName" class="w-full md:w-[30rem] mb-2" type="text" pInputText id="Type" required autofocus fluid />

                        <div class="error-feedback" *ngIf="hasBeenSubmited('BoatName')">
                            <p-message styleClass="mb-2" *ngIf="form.controls.BoatName.hasError('required')" severity="error" variant="simple" size="small">Por favor, digitar a embarcação escolhida do cliente</p-message>
                        </div>
                    </div>

                </div>

                <div class='row'>

                    <div class='col-md-4'>
                        <label for="Name" class="block font-bold mb-3">Lead qualificado?</label>

                        <p-select [invalid]="isInvalid('Qualified')" [options]="qualified" formControlName="Qualified" optionLabel="name" placeholder="Selecione se o lead é qualificado ou não" class="w-full mb-2" />
                        @if (isInvalid('Qualified')) {
                            <p-message severity="error" size="small" variant="simple">Por favor, selecione se o lead é qualificado ou não</p-message>
                        }
                    </div>

                </div>

                <div *ngIf="showQualifiedDiv" class='row'>
                    <div class='col-md-12'>
                        <label for="" class="block font-bold mb-3">Tipo de qualificação</label>
                        <p-select [invalid]="isInvalid('QualifiedType')" [options]="qualifiedType" formControlName="QualifiedType" optionLabel="name" placeholder="Selecione o tipo de qualificação" class="w-full mb-2" />
                       
                        @if (isInvalid('Qualified') && showQualifiedDiv) {
                            <p-message severity="error" size="small" variant="simple">Por favor, selecione se o tipo de qualificação do lead</p-message>
                        }
                    </div>

                </div>

            </form>


            <ng-template #footer>
                <p-button label="Cancelar" icon="pi pi-times" text (click)="hideDialog()" />
                <p-button [disabled]="isLoading" (click)="submit()" type="submit" label="Salvar" icon="pi pi-check" />
            </ng-template>

        </ng-template>
    </p-dialog>

    <p-dialog [style]="{ width: '1000px' }" [(visible)]="followupDialog" header="Acompanhamento" [modal]="true" [breakpoints]="{ '1199px': '75vw', '575px': '90vw' }">
        <ng-template #content>

            <p-tabs value="0">
                <p-tablist>
                    <p-tab (click)="setNegFn()" value="0">Negociação</p-tab>
                    <p-tab id="acomp_tab" (click)="setAcomFn()" value="1">Acompanhamento</p-tab>
                </p-tablist>
                <p-tabpanels>
                    <p-tabpanel value="0">

                        <form [formGroup]="updateNegForm" (ngSubmit)="onSubmitUpdate()" style='margin-bottom: 7.5rem;'>
                            <button id="btn_submit_up" style='display:none;' type="submit"></button>
                            
                            <div class='row'>

                                <div class='col-md-4'>
                                    <label for="Name" class="block font-bold mb-3">Nome do cliente</label>
                                    <input formControlName="Name" class="w-full md:w-[30rem] mb-2" type="text" pInputText id="Type" required autofocus fluid />
                                    
                                    <div class="error-feedback" *ngIf="hasBeenSubmitedUpdateNeg('Name')">
                                        <p-message styleClass="mb-2" *ngIf="updateNegForm.controls.Name.hasError('required')" severity="error" variant="simple" size="small">Por favor, digitar o nome do cliente</p-message>
                                    </div>
                                </div>

                                <div class='col-md-4'>
                                    <label for="Email" class="block font-bold mb-3">E-mail do cliente</label>
                                    <input formControlName="Email" class="w-full md:w-[30rem] mb-2" type="text" pInputText id="Type" required autofocus fluid />
                                    
                                    <div class="error-feedback" *ngIf="hasBeenSubmitedUpdateNeg('Email')">
                                        <p-message styleClass="mb-2" *ngIf="updateNegForm.controls.Email.hasError('required')" severity="error" variant="simple" size="small">Por favor, digitar o e-mail do cliente</p-message>
                                    </div>
                                </div>

                                <div class='col-md-4'>
                                    <label for="Phone" class="block font-bold mb-3">Telefone do cliente</label>
                                    <p-inputmask mask="99-99999-9999" class="w-full md:w-[30rem] mb-2" formControlName="Phone" placeholder="49-99999-9999" />
                                    
                                    <div class="error-feedback" *ngIf="hasBeenSubmitedUpdateNeg('Phone')">
                                        <p-message styleClass="mb-2" *ngIf="updateNegForm.controls.Phone.hasError('required')" severity="error" variant="simple" size="small">Por favor, digitar o telefone do cliente</p-message>
                                    </div>
                                </div>

                            </div>

                            <div class='row'>

                                <div class='col-md-4'>
                                    <label for="ComMeanName" class="block font-bold mb-3">Meio de comunicação que trouxe o cliente</label>

                                    <p-inputgroup>
                                        <p-inputgroup-addon pTooltip="Digite na caixa ao lado para pesquisar um meio e selecione na lista" tooltipPosition="top" [style]="{ cursor:'help' }">
                                            <i class="pi pi-filter"></i>
                                        </p-inputgroup-addon>

                                        <p-autocomplete class="w-full mb-2" formControlName="ComMeanName" placeholder="Procure o tipo" [suggestions]="autoFilteredValue" optionLabel="name" (completeMethod)="filterClassAutocomplete($event)" (onSelect)="setComMeanChoosen($event)" />
                                    </p-inputgroup>

                                    <div class="error-feedback" *ngIf="hasBeenSubmitedUpdateNeg('ComMeanName')">
                                        <p-message styleClass="mb-2" *ngIf="updateNegForm.controls.ComMeanName.hasError('required')" severity="error" variant="simple" size="small">Por favor, digitar o nome do cliente</p-message>
                                    </div>
                                </div>

                                <div class='col-md-4'>
                                    <label for="EstimatedValue" class="block font-bold mb-3">Valor estimado</label>
                                    <p-inputnumber formControlName="EstimatedValue" class="w-full mb-2" mode="currency" currency="BRL" locale="pt-BR" />

                                    <div class="error-feedback" *ngIf="hasBeenSubmitedUpdateNeg('EstimatedValue')">
                                        <p-message styleClass="mb-2" *ngIf="updateNegForm.controls.EstimatedValue.hasError('required')" severity="error" variant="simple" size="small">Por favor, digitar o valor estimado da embarcação</p-message>
                                    </div>
                                </div>

                                <div class='col-md-4'>
                                    <label for="BoatName" class="block font-bold mb-3">Embarcação aproximada</label>
                                    <input formControlName="BoatName" class="w-full md:w-[30rem] mb-2" type="text" pInputText id="Type" required autofocus fluid />

                                    <div class="error-feedback" *ngIf="hasBeenSubmitedUpdateNeg('BoatName')">
                                        <p-message styleClass="mb-2" *ngIf="updateNegForm.controls.BoatName.hasError('required')" severity="error" variant="simple" size="small">Por favor, digitar a embarcação escolhida do cliente</p-message>
                                    </div>
                                </div>

                            </div>

                            <div class='row'>

                                <div class='col-md-4'>
                                    <label for="Name" class="block font-bold mb-3">Lead qualificado?</label>

                                    <p-select [invalid]="isInvalidUpdate('Qualified')" [options]="qualified" formControlName="Qualified" optionLabel="name" placeholder="Selecione se o lead é qualificado ou não" class="w-full mb-2" />
                                    @if (isInvalidUpdate('Qualified')) {
                                        <p-message severity="error" size="small" variant="simple">Por favor, selecione se o lead é qualificado ou não</p-message>
                                    }
                                </div>

                            </div>

                            <div *ngIf="showQualifiedDivUpdate" class='row'>
                                <div class='col-md-12'>
                                    <label for="" class="block font-bold mb-3">Tipo de qualificação</label>
                                    <p-select [invalid]="isInvalidUpdate('QualifiedType')" [options]="qualifiedType" formControlName="QualifiedType" optionLabel="name" placeholder="Selecione o tipo de qualificação" class="w-full mb-2" />
                                
                                    @if (isInvalidUpdate('Qualified') && showQualifiedDivUpdate) {
                                        <p-message severity="error" size="small" variant="simple">Por favor, selecione se o tipo de qualificação do lead</p-message>
                                    }
                                </div>

                            </div>

                            <hr>

                            <div class='row'>

                                <div class='col-md-4'>
                                    <label for="City" class="block font-bold mb-3">Cidade do cliente</label>
                                    <input formControlName="City" class="w-full md:w-[30rem] mb-2" type="text" pInputText id="Type" required autofocus fluid />
                                    
                                    <div class="error-feedback" *ngIf="hasBeenSubmitedUpdateNeg('City')">
                                        <p-message styleClass="mb-2" *ngIf="updateNegForm.controls.City.hasError('required')" severity="error" variant="simple" size="small">Por favor, digitar a cidade do cliente</p-message>
                                    </div>
                                </div>

                                <div class='col-md-4'>
                                    <label for="NavigationCity" class="block font-bold mb-3">Cidade que o cliente ira navegar</label>
                                    <input formControlName="NavigationCity" class="w-full md:w-[30rem] mb-2" type="text" pInputText id="Type" required autofocus fluid />
                                    
                                    <div class="error-feedback" *ngIf="hasBeenSubmitedUpdateNeg('NavigationCity')">
                                        <p-message styleClass="mb-2" *ngIf="updateNegForm.controls.NavigationCity.hasError('required')" severity="error" variant="simple" size="small">Por favor, digitar a cidade de navegação do cliente</p-message>
                                    </div>
                                </div>

                                <div class='col-md-4'>
                                    <label for="BoatCapacity" class="block font-bold mb-3">Capacidade da embarcação</label>
                                    <p-inputnumber  [useGrouping]="false" class="w-full mb-2" formControlName="BoatCapacity" placeholder="*" />
                                    
                                    <div class="error-feedback" *ngIf="hasBeenSubmitedUpdateNeg('BoatCapacity')">
                                        <p-message styleClass="mb-2" *ngIf="updateNegForm.controls.BoatCapacity.hasError('required')" severity="error" variant="simple" size="small">Por favor, digitar a capacidade da embarcação</p-message>
                                    </div>
                                </div>

                            </div>

                            <div class='row'> 
                                <div class='col-md-4'>
                                    <label for="" class="block font-bold mb-3">Embarcação nova/usada</label>
                                    <p-select [invalid]="isInvalidUpdate('NewUsed')" [options]="NewUsed" formControlName="NewUsed" optionLabel="name" placeholder="Selecione o tipo da embarcação" class="w-full mb-2" />
                                
                                    @if (isInvalidUpdate('NewUsed')) {
                                        <p-message severity="error" size="small" variant="simple">Por favor, selecione o tipo da embarcação</p-message>
                                    }
                                </div>

                                <div class='col-md-4'>
                                    <label for="" class="block font-bold mb-3">Embarcação cabinada/aberta</label>
                                    <p-select [invalid]="isInvalidUpdate('CabinatedOpen')" [options]="CabinatedOpen" formControlName="CabinatedOpen" optionLabel="name" placeholder="Selecione o tipo da embarcação" class="w-full mb-2" />
                                
                                    @if (isInvalidUpdate('CabinatedOpen')) {
                                        <p-message severity="error" size="small" variant="simple">Por favor, selecione se o tipo da embarcação</p-message>
                                    }
                                </div>

                            </div>

                            <div class='row'>
                                <div class='col-md-4'>
                                    <label for="" class="block font-bold mb-3">Já possui embarcação?</label>
                                    <p-select [invalid]="isInvalidUpdate('HasBoat')" [options]="HasBoat" formControlName="HasBoat" optionLabel="name" placeholder="Selecione uma opção" class="w-full mb-2" />
                                
                                    @if (isInvalidUpdate('HasBoat')) {
                                        <p-message severity="error" size="small" variant="simple">Por favor, selecione se o cliente já possui embarcação</p-message>
                                    }
                                </div>

                                <div *ngIf="showHasWhichBoat" class='col-md-8'>
                                    <label for="" class="block font-bold mb-3">Qual</label>
                                    <input formControlName="WhichBoat" class="w-full md:w-[30rem] mb-2" type="text" pInputText id="Type" required autofocus fluid />
                                
                                </div>

                            </div>

                            <div class='row'>
                                <div class='col-md-4'>
                                    <label for="" class="block font-bold mb-3">Tamanho mínimo embarcação (aproximado, em Pés)</label>
                                    <p-inputnumber formControlName="MinPesBoat" class="w-full mb-2" locale="pt-BR" />

                                </div>
                                <div class='col-md-4'>
                                    <label for="" class="block font-bold mb-3">Tamanho máximo embarcação (aproximado, em Pés)</label>
                                    <p-inputnumber formControlName="MaxPesBoat" class="w-full mb-2" locale="pt-BR" />
                                
                                </div>
                            </div>

                        </form>

                    </p-tabpanel>
                    <p-tabpanel value="1">
                        <form [formGroup]="acoForm" (ngSubmit)="onSubmitUpdateAco()" >
                            <button id="btn_submit_acom" style='display:none;' type="submit"></button>

                            <div class='row'>
                                <div class='col-md-12'>
                                    <label for="Description" class="block font-bold mb-3">Acompanhamento</label>
                                    <textarea rows="5" cols="30" pTextarea formControlName="Description" fluid></textarea>

                                    <div class="error-feedback" *ngIf="hasBeenSubmitedAco('Description')">
                                        <p-message styleClass="mb-2" *ngIf="acoForm.controls.Description.hasError('required')" severity="error" variant="simple" size="small">Por favor, digite o acompanhamento</p-message>
                                    </div>
                                </div>

                            </div>

                            <div class='row'>
                                <div class='col-md-6'>
                                    <label for="ComMeanName" class="block font-bold mb-3">Meio de comunicação do acompanhameto</label>

                                    <p-inputgroup>
                                        <p-inputgroup-addon pTooltip="Digite na caixa ao lado para pesquisar um meio e selecione na lista" tooltipPosition="top" [style]="{ cursor:'help' }">
                                            <i class="pi pi-filter"></i>
                                        </p-inputgroup-addon>

                                        <p-autocomplete class="w-full mb-2" formControlName="ComMeanName" placeholder="Procure o tipo" [suggestions]="autoFilteredValue" optionLabel="name" (completeMethod)="filterClassAutocomplete($event)" (onSelect)="setComMeanChoosenAcom($event)" />
                                    </p-inputgroup>

                                    <div class="error-feedback" *ngIf="hasBeenSubmitedAco('ComMeanName')">
                                        <p-message styleClass="mb-2" *ngIf="acoForm.controls.ComMeanName.hasError('required')" severity="error" variant="simple" size="small">Por favor, digitar o nome do cliente</p-message>
                                    </div>
                                </div>
                            </div>

                        </form>

                        <list-negotiation-history #negHistory/>

                    </p-tabpanel>
                </p-tabpanels>  
            </p-tabs>
            
            <ng-template #footer>
                <p-button label="Cancelar" icon="pi pi-times" text (click)="hideFollowUp()" />
                <p-button [disabled]="isLoading" (click)="submitUpdate()" type="submit" label="Salvar" icon="pi pi-check" id="action-acom-button"/>
            </ng-template>

        </ng-template>
    </p-dialog>

    <p-confirmdialog
        [rejectLabel]="rejectLabel"
        [acceptLabel]="confirmLabel"
        [acceptAriaLabel]="confirmLabel"
        [rejectAriaLabel]="rejectLabel"
        [style]="{ width: '550px' }"
    />

    <open-customer-sales #customerModal title="Cliente"/>
    `,
})
export class ListNegotiationsComponent {
    constructor(
        private router: Router,
        public formBuilder: FormBuilder,
        private messageService: MessageService,
        private userService: UserService,
        private salesService: SalesService,
        private confirmationService: ConfirmationService
    ) { }
    faCakeCandles = faCakeCandles


    @ViewChild('cm') cm!: ContextMenu
    @ViewChild('customerModal') customerModal!: SalesCustomerModal
    @ViewChild('negHistory') negotiationHistory!: ListNegotiationHistoryComponent

    elementRef = inject(ElementRef)
    pcard_menu: MenuItem[] | undefined
    selectedCard: any

    negotiations = signal<Negotiation[]>([])
    stageOne = computed(() => this.negotiations()?.filter(n => n.stage === 1))
    stageTwo = computed(() => this.negotiations()?.filter(n => n.stage === 2))
    stageThree = computed(() => this.negotiations()?.filter(n => n.stage === 3))
    stageFour = computed(() => this.negotiations()?.filter(n => n.stage === 4))
    stageFive = computed(() => this.negotiations()?.filter(n => n.stage === 5))

    _id: string = ""
    _customer_id: string = ""
    _stage: string = ""
    totalRecords = 0
    limitPerPage = 20
    submitted: boolean = false
    accDialog: boolean = false
    negotiationDialog: boolean = false
    followupDialog: boolean = false

    birthdaysDialog: boolean = false
    panelExpVisible: boolean = false
    typingTimeout: any
    isLoading: boolean = false

    negotiationSearch: string = ""

    updateNegForm = this.formBuilder.group({
        Name: [{value: '', disabled: true}, [Validators.required]],
        Email: [{value: '', disabled: true}, [Validators.required]],
        Phone: [{value: '', disabled: true}, [Validators.required]],
        EstimatedValue: ['', [Validators.required]],
        Qualified: ['', [Validators.required]],
        QualifiedType: ['', []],
        BoatName: ['', [Validators.required]],

        City: ['', []],
        NavigationCity: ['', []],
        BoatCapacity: ['', []],
        NewUsed: ['', []],
        CabinatedOpen: ['', []],

        HasBoat: ['', []],
        WhichBoat: ['', []],
        MinPesBoat: ['', []],
        MaxPesBoat: ['', []],

        ComMeanName: [{value: '', disabled: true}, [Validators.required]],
        ComMeanId: ['', [Validators.required]],
        UserId: ['', []],
    })

    form = this.formBuilder.group({
        Name: ['', [Validators.required]],
        Email: ['', [Validators.required]],
        Phone: ['', [Validators.required]],
        EstimatedValue: ['', [Validators.required]],
        Qualified: ['', [Validators.required]],
        QualifiedType: ['', []],
        BoatName: ['', [Validators.required]],

        ComMeanName: ['', [Validators.required]],
        ComMeanId: ['', [Validators.required]],
        UserId: ['', []],
    })

    acoForm = this.formBuilder.group({
        Description: ['', [Validators.required]],
        ComMeanName: ['', [Validators.required]],
        ComMeanId: ['', [Validators.required]],
        UserId: ['', []],
        CustomerId: ['', []],
        Stage: ['', []]
    })

    ComMeans: any[] = []
    users = signal<User[]>([])
    customers = signal<SalesCustomer[]>([])

    selectedData!: any[] 
    selectedAccState: SelectItem = { name: "Indiferente", code: "" }
    accStates: SelectItem[] | undefined
    autoFilteredValue: any[] = []

    cols!: Column[]
    exportColumns!: ExportColumn[]

    confirmLabel = "Confirmar"
    rejectLabel = "Cancelar"

    qualified: SelectItem[] = [{ name: 'Sim', code: 'Y' }, { name: 'Não', code: 'N' }]
    CabinatedOpen: SelectItem[] = [ { name: 'Aberta', code: 'A' }, { name: 'Cabinada', code: 'C' }]
    NewUsed: SelectItem[] = [{ name: 'Nova', code: 'N' }, { name: 'Usada', code: 'U' }]
    HasBoat: SelectItem[] = [{ name: 'Sim', code: 'S' }, { name: 'Não', code: 'N' }]

    qualifiedType: SelectItem[] = [
        { name: 'Muito decidido. Intenção clara de compra imediata', code: 'A' }, 
        { name: 'Interesse real, mas precisa de mais informação', code: 'B' }, 
        { name: 'Inicio de pesquisa, médio/longo prazo', code: 'C' }
    ]

    openCustomerSales(id: number){
        this.customerModal.showCustomer(id.toString())
    }   

    onPageChange(e: any) {
        this.loadNegotiations()
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    ngOnInit() {
        this.loadNegotiations()

        this.salesService.getComs(1, 1000, "", "Y").subscribe({
            next: (res: any) => {
                this.ComMeans = res.data
            }, 
            error: (err: any) => {
                this.messageService.add({ severity: 'error', summary: "Erro", detail: 'Ocorreu um erro ao buscar as negociações.' });
            },
        })
        
        this.accStates = [
            { name: "Indiferente", code: "" },
            { name: "Ativo", code: "Y" },
            { name: "Não ativo", code: "N" },
        ]

        this.cols = [
            { field: 'type', header: 'Tipo' },
            { field: 'active', header: 'Ativo' }
        ];

        this.pcard_menu = [
            // {
            //     label: 'Roles',
            //     icon: 'pi pi-users',
            //     items: [
            //         {
            //             label: 'Admin',
            //             command: () => {
                            
            //             }
            //         },
            //         {
            //             label: 'Member',
            //             command: () => {
                            
            //             }
            //         },
            //         {
            //             label: 'Guest',
            //             command: () => {
                            
            //             }
            //         }
            //     ]
            // },
            {
                label: 'Acompanhamento',
                icon: 'pi pi-user-edit',
                command: (e: any) => {
                    this.openFollowUp(this.selectedCard?.id, this.selectedCard.id_customer, this.selectedCard.stage)
                }
            },
            {
                label: 'Editar cliente',
                icon: 'pi pi-user-edit',
                command: () => {
                    this.openCustomerSales(parseInt(this._customer_id))
                }
            },
            {
                label: 'Perdeu negociação',
                icon: 'pi pi-user-minus',
                command: () => {
                    console.log(this.selectedCard)
                }
            },
            {
                label: 'WhatsApp',
                icon: 'pi pi-whatsapp',
                command: () => {
                    console.log(this.selectedCard)
                }
            }
        ]

        this.exportColumns = this.cols.map((col) => ({ title: col.header, dataKey: col.field }))
    }

    loadNegotiations(isDelete = false) {
        //const rmLoading = showLoading()

        this.salesService.getNegotiations(this.negotiationSearch).pipe(finalize(() => { this.isLoading = false })).subscribe({
            next: (res: any) => {
                this.negotiations.set(res.data)
            },
            error: (err) => {
                if (err.status) {
                    this.messageService.add({ severity: 'error', summary: "Erro", detail: 'Ocorreu um erro ao buscar negociações.' })
                }
            },
        })
    }

    @HostListener('dragend', ['$event'])
    dragend(e: any) {
        const el = Array.from(this.elementRef.nativeElement.getElementsByClassName('p-card'))
        el.forEach((e: any) => {
            e.classList.remove('hide-card')
        })

        const eld = Array.from(this.elementRef.nativeElement.getElementsByClassName('dropzone'))
        eld.forEach((e: any) => {
            e.classList.remove('highlight-drag')
        })
    }

    dragstart(e: any, dragItemId: number) {
        const el = Array.from(this.elementRef.nativeElement.getElementsByClassName('p-card'))
        el.forEach((e: any) => dragItemId?.toString() != e.id ? e.classList.add('hide-card') : "")

        e.dataTransfer.setData('text', e.target.id)
        console.log(e.target.id)

    }

    dragenter(e: any) {
        const target = e.target.closest('.dropzone')
        if (!target) return
        target.classList.add('highlight-drag')
    }

    dragleave(e: any) {
        const target = e.target.closest('.dropzone')
        if (!target) return

        target.classList.remove('highlight-drag')
    }

    dragover(e: any) {
        e.preventDefault()
    }

    drop(e: any) {
        const target = e.target.closest('.dropzone')
        const card = e.dataTransfer.getData('text')
        const card_el = document.getElementById(card)!
        const dropzone = e.target.querySelector('.kb-cards')
        const card_stage = card_el.getAttribute('data-stage')!
        const card_id_customer = card_el.getAttribute('data-customer-id')!
        const card_id_business = card_el.getAttribute('data-business-id')!



        const dropzone_stage = target.id[target.id.length - 1]

        if (dropzone_stage < card_stage) {
            this.messageService.add({ severity: 'error', summary: "Erro", detail: 'Não é permitido retroceder no atendimento' });
            return
        }

        if ((parseInt(card_stage) + 1) < dropzone_stage && dropzone_stage != 3) {
            this.messageService.add({ severity: 'error', summary: "Erro", detail: 'Não é permitido pular etapas no atendimento' });
            return
        }

        // Make this followup open a special form dialog, and modifiy the drop, in here we will save the card dragged, and only when the user successfully submits the form, we move the card

        this.openFollowUp(parseInt(card_id_business), parseInt(card_id_customer), (parseInt(card_stage)))


        card_el.setAttribute("data-stage", dropzone_stage)

        if (!dropzone) {
            e.target.closest('.kb-cards').appendChild(card_el)
        } else {
            e.target.querySelector('.kb-cards').appendChild(card_el)
        }
    }

    onContextMenu(event: any, card: any, id_customer: any, id: any) {
        this.selectedCard = card
        this._customer_id = id_customer
        this._id = id
        this.cm.show(event)
    }

    onHide() {
        this.selectedCard = null
    }

    _formatBRLMoney(amount: number) { // alias
        return formatBRLMoney(amount.toString())
    }

    trackById(index: number, item: Negotiation) {
        return item.id;
    }

    get showQualifiedDiv(): boolean {
        const c: any = this.form.get('Qualified')
        if(c!['value']!['code'] == 'Y'){
            return true
        }

        return false
    }

    get showQualifiedDivUpdate(): boolean {
        const c: any = this.updateNegForm.get('Qualified')
        if(c!['value']!['code'] == 'Y'){
            return true
        }

        return false
    }

    get showHasWhichBoat(): boolean {
        const c: any = this.updateNegForm.get('HasBoat')
        if(c!['value']!['code'] == 'S'){
            return true
        }

        return false
    }

    setComMeanChoosenAcom(e: any){
        //@ts-ignore
        this.acoForm.get("ComMeanName")?.setValue(e.value.name)
        //@ts-ignore
        this.acoForm.get("ComMeanId")?.setValue(e.value.id)
    }
    
    setComMeanChoosen(e: any){
        //@ts-ignore
        this.form.get("ComMeanName")?.setValue(e.value.name)
        //@ts-ignore
        this.form.get("ComMeanId")?.setValue(e.value.id)
    }

    filterClassAutocomplete(event: AutoCompleteCompleteEvent){
        const filtered: any[] = []
        const query = event.query   

        for (let i = 0; i < this.ComMeans.length; i++) {
            const mc = this.ComMeans[i]
            if (mc.name.toLowerCase().indexOf(query.toLowerCase()) == 0) {
                filtered.push(mc)
            }
        }

        this.autoFilteredValue = filtered
    }

    submit() {
        document.getElementById(`btn_submit`)?.click()
    }

    submitUpdate() {
        document.getElementById(`btn_submit_up`)?.click()
    }

    submitUpdateAcom() {
        document.getElementById(`btn_submit_acom`)?.click()
    }

    onSubmitUpdateAco(){
        this.submitted = true
        console.log(this.acoForm.value)

        if (this.acoForm.valid) {
            this.isLoading = true

            // @ts-ignore
            this.acoForm.get("UserId")?.setValue(this.userService?.getUserData()?.id)
            // @ts-ignore
            this.acoForm.get("CustomerId")?.setValue(parseInt(this._customer_id))
            // @ts-ignore
            this.acoForm.get("Stage")?.setValue(parseInt(this._stage))

            delete this.acoForm.value.ComMeanName

            this.salesService.createNegotiationHistory(this._id, this.acoForm.value).subscribe({
                next: (res: any) => {
                    this.messageService.add({ severity: 'success', summary: "Sucesso", detail: 'Negociação atualizada com sucesso' });
                    //this.loadCommunicationMeans()
                    
                    this.submitted = false
                    this.isLoading = false
                    //this.hideFollowUp()
                    this.acoForm.reset()

                    this.negotiationHistory.loadNegotiationHistory(this._id)

                },
                error: (err) => {
                    if (err?.status == 400 && err?.error?.errors?.type == "TODO") {
                    } else {
                        this.messageService.add({ severity: 'error', summary: "Erro", detail: 'Ocorreu um erro com sua requisição.' });
                    }
                    this.isLoading = false
                },

            })
        }
    }
    
    onSubmitUpdate() {
        this.submitted = true

        if (this.updateNegForm.valid) {
            this.isLoading = true

            // @ts-ignore
            this.updateNegForm.get("HasBoat")?.setValue(this.updateNegForm?.value?.HasBoat?.code)
            // @ts-ignore
            this.updateNegForm.get("NewUsed")?.setValue(this.updateNegForm.value.NewUsed?.code)
            // @ts-ignore
            this.updateNegForm.get("CabinatedOpen")?.setValue(this.updateNegForm.value.CabinatedOpen?.code)
            // @ts-ignore
            this.updateNegForm.get("Qualified")?.setValue(this.updateNegForm.value.Qualified?.code)
            // @ts-ignore
            this.updateNegForm.get("QualifiedType")?.setValue(this.updateNegForm.value.QualifiedType?.code)
            this.updateNegForm.get("UserId")?.setValue(this.userService?.getUserData()?.id)

            this.salesService.updateNegotiation(this._id, this.updateNegForm.value).subscribe({
                next: (res: any) => {
                    this.messageService.add({ severity: 'success', summary: "Sucesso", detail: 'Negociação atualizada com sucesso' });
                    //this.loadCommunicationMeans()
                    
                    this.submitted = false
                    this.isLoading = false
                    this.hideFollowUp()
                    this.updateNegForm.reset()

                    this.loadNegotiations()
                },
                error: (err) => {
                    if (err?.status == 400 && err?.error?.errors?.type == "TODO") {
                    } else {
                        this.messageService.add({ severity: 'error', summary: "Erro", detail: 'Ocorreu um erro com sua requisição.' });
                    }
                    this.isLoading = false
                },

            })
        }
    }
        
    onSubmit() {
        this.submitted = true

        if (this.form.valid) {
            this.isLoading = true
            // @ts-ignore

            if(this.form.value.Qualified?.code == 'N'){
                this.form.get("Qualified")?.setValue('N')
            } else {
                this.form.get("Qualified")?.setValue('S')
            }

            // @ts-ignore
            this.form.get("QualifiedType")?.setValue(this.form.value.QualifiedType?.code)
            this.form.get("UserId")?.setValue(this.userService?.getUserData()?.id)

            this.salesService.registerNegotiation(this.form.value).subscribe({
                next: (res: any) => {
                    this.messageService.add({ severity: 'success', summary: "Sucesso", detail: 'Negociação registrada com sucesso' });
                    //this.loadCommunicationMeans()
                    
                    this.submitted = false
                    this.isLoading = false
                    this.hideDialog()
                    this.form.reset()

                    this.loadNegotiations()
                },
                error: (err) => {
                    if (err?.status == 400 && err?.error?.errors?.type == "TODO") {
                    } else {
                        this.messageService.add({ severity: 'error', summary: "Erro", detail: 'Ocorreu um erro com sua requisição.' });
                    }
                    this.isLoading = false
                },

            })
        }
    }

    isInvalid(controlName: string) {
        const control = this.form.get(controlName)
        return control?.invalid && (control.touched || this.submitted)
    }

    isInvalidUpdate(controlName: string) {
        const control = this.updateNegForm.get(controlName)
        return control?.invalid && (control.touched || this.submitted)
    }

    openCustomerBirthdays(){
        this.birthdaysDialog = true

        this.salesService.getCustomersBirthday().pipe(finalize(() => { })).subscribe({
            next: (res: any) => {
                this.customers.set(res.data ?? [])

                this.totalRecords = res.totalRecords
            },
            error: (err) => {
                if (err.status) {
                    this.messageService.add({ severity: 'error', summary: "Erro", detail: 'Ocorreu um erro ao buscar aniversário de clientes.' });
                }
                this.isLoading = false
            },
        })

    }

    openFollowUp(id: number, id_customer: number, stage: number) {
        this.submitted = false
        this.followupDialog = true

        this.salesService.getNegotiation(id?.toString()).pipe(finalize(() => { })).subscribe({
            next: (res: any) => {
                this._id = id?.toString()
                this._customer_id = id_customer?.toString()
                this._stage = stage?.toString()

                if(res.data['qualified_type']?.trimEnd() == 'A'){
                    //@ts-ignore
                    this.updateNegForm.get("QualifiedType")?.setValue(this.qualifiedType[0])
                } else if(res.data['qualified_type']?.trimEnd() == 'B'){
                    //@ts-ignore
                    this.updateNegForm.get("QualifiedType")?.setValue(this.qualifiedType[1])
                } else {
                    //@ts-ignore
                    this.updateNegForm.get("QualifiedType")?.setValue(this.qualifiedType[2])
                }

                if(res.data['cab_open']?.trimEnd() == 'A'){
                    //@ts-ignore
                    this.updateNegForm.get("CabinatedOpen")?.setValue(this.CabinatedOpen[0])
                } else {
                    //@ts-ignore
                    this.updateNegForm.get("CabinatedOpen")?.setValue(this.CabinatedOpen[1])
                }

                if(res.data['new_used']?.trimEnd() == 'N'){
                    //@ts-ignore
                    this.updateNegForm.get("NewUsed")?.setValue(this.NewUsed[0])
                } else {
                    //@ts-ignore
                    this.updateNegForm.get("NewUsed")?.setValue(this.NewUsed[1])
                }

                //@ts-ignore
                this.updateNegForm.get("Name")?.setValue(res.data['customer_name'])
                this.updateNegForm.get("Email")?.setValue(res.data['customer_email'])
                this.updateNegForm.get("Phone")?.setValue(res.data['customer_phone'])

                this.updateNegForm.get("City")?.setValue(res.data['customer_city'])
                this.updateNegForm.get("NavigationCity")?.setValue(res.data['customer_nav_city'])
                this.updateNegForm.get("BoatCapacity")?.setValue(res.data['boat_cap_needed'])

                this.updateNegForm.get("ComMeanName")?.setValue(res.data['com_name'])
                this.updateNegForm.get("ComMeanId")?.setValue(res.data['id_mean_communication'])
                this.updateNegForm.get("BoatName")?.setValue(res.data['boat_name'])
                this.updateNegForm.get("EstimatedValue")?.setValue(res.data['estimated_value'])

                //@ts-ignore
                this.updateNegForm.get("HasBoat")?.setValue(res.data['has_boat'] == "S" ? this.HasBoat[0] : this.HasBoat[1])
                this.updateNegForm.get("WhichBoat")?.setValue(res.data['has_boat_which'])
                //@ts-ignore
                this.updateNegForm.get("MinPesBoat")?.setValue(parseInt(res.data['boat_length_min']) ?? null)
                //@ts-ignore
                this.updateNegForm.get("MaxPesBoat")?.setValue(parseInt(res.data['boat_length_max']) ?? null)


                this.updateNegForm.get("UserId")?.setValue(this.userService?.getUserData()?.id)
                //@ts-ignore
                this.updateNegForm.get("Qualified")?.setValue(res.data['qualified'] == "S" ? this.qualified[0] : this.qualified[1])


                this.negotiationHistory.loadNegotiationHistory(this._id)

            },
            error: (err) => {
                if (err.status) {
                    this.messageService.add({ severity: 'error', summary: "Erro", detail: 'Ocorreu um erro ao buscar negociação.' });
                }
                this.isLoading = false
            },
        })

    }

    hideFollowUp() {
        this.followupDialog = false
        this.submitted = false
    }

    openNewLead() {
        this.submitted = false
        this.negotiationDialog = true
    }

    showPanelExp() {
        this.panelExpVisible = true
    }

    hideDialog() {
        this.negotiationDialog = false
        this.submitted = false
    }

    onGlobalFilter(event: any) {
        if (this.typingTimeout) {
            clearTimeout(this.typingTimeout)
        }

        this.typingTimeout = setTimeout(() => {
            this.loadNegotiations()
        }, 500)
    }

    setNegFn(){
        let btnAction = this.elementRef.nativeElement.querySelector('#action-acom-button')
        if (!btnAction) return
        btnAction.onclick = () => this.submitUpdate()
    }

    setAcomFn(){
        let btnAction = this.elementRef.nativeElement.querySelector('#action-acom-button')
        if (!btnAction) return
        btnAction.onclick = () => this.submitUpdateAcom()
    }

    getBorderColor(n: any): string {
        if (n?.has_passed_24hrs) {
            return 'yellow'
        }

        return 'transparent'
    }

    hasBeenSubmited(controlName: string): boolean {
        const control = this.form.get(controlName)
        return Boolean(control?.invalid)
            && (this.submitted || Boolean(control?.touched))
        //|| Boolean(control?.dirty
    }

    hasBeenSubmitedUpdateNeg(controlName: string): boolean {
        const control = this.updateNegForm.get(controlName)
        return Boolean(control?.invalid)
            && (this.submitted || Boolean(control?.touched))
        //|| Boolean(control?.dirty
    }

    hasBeenSubmitedAco(controlName: string): boolean {
        const control = this.acoForm.get(controlName)
        return Boolean(control?.invalid)
            && (this.submitted || Boolean(control?.touched))
        //|| Boolean(control?.dirty
    }

}

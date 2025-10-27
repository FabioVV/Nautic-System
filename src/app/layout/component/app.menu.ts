import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { AppMenuitem } from './app.menuitem';
import { faPeopleArrows } from '@fortawesome/free-solid-svg-icons';
import { InputTextModule } from 'primeng/inputtext';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { FormsModule } from '@angular/forms';

import { AuthService } from '../../shared/services/auth.service';

@Component({
    selector: 'app-menu',
    standalone: true,
    imports: [CommonModule, InputGroupModule, InputGroupAddonModule, AppMenuitem, RouterModule, InputTextModule, FormsModule],
    template: `
        
    <p-inputgroup>
        <p-inputgroup-addon>
            <i class="pi pi-search"></i>
        </p-inputgroup-addon>
        <input pInputText (change)="SearchModule()" [(ngModel)]="qmodule" type="text" pSize="small" placeholder="Módulo..." />
    </p-inputgroup>

    <ul class="layout-menu">
        <ng-container *ngFor="let item of model; let i = index">
            <li app-menuitem *ngIf="!item.separator" [item]="item" [index]="i" [root]="true"></li>
            <li *ngIf="item.separator" class="menu-separator"></li>
        </ng-container>
    </ul> 
    `
})

export class AppMenu {
    model: MenuItem[] = []
    bkpModel: MenuItem[] = []
    faPeopleArrows = faPeopleArrows

    qmodule: string = ""

    constructor(private authService: AuthService) { }

    SearchModule(){
        if(this.qmodule.trim() == ""){
            this.ngOnInit()
        } else {
            for(const menu of this.model){
                //@ts-ignore
                if(menu?.items){
                    //@ts-ignore
                    menu.items = menu?.items?.filter((i) => i.label?.toLowerCase().includes(this.qmodule.toLowerCase()))
                    this.model = [menu, ...this.model]
                }
            }
        }
    }

    ngOnInit() {
        const dashMenu = {
            label: '',
            items: [
                { label: 'Home', icon: 'pi pi-fw pi-home', routerLink: ['/dashboard'], },
            ],
        }

        let adminMenuItem = {
            label: '',
            items: [
                {
                    label: "Sistema",
                    icon: 'pi pi-cog',
                    items: [
                        {
                            label: 'Usuários',
                            icon: 'pi pi-user',
                            routerLink: ['/system/users'],
                            code: "users:view"
                        },
                        {
                            label: 'Cargos',
                            icon: 'pi pi-users',
                            routerLink: ['/system/roles'],
                            code: "roles:view"
                        },
                    ]
                },  
            ]
        }

        const salesMenuItem = {
            label: '',
            items: [
                {
                    label: 'Painel de vendas',
                    icon: 'pi pi-users',
                    items: [
                        {
                            label: 'Painel de negociações',
                            icon: 'pi pi-comment',
                            routerLink: ['/sales/negotiation-panel'],
                            code: "negotiation_panel:view"
                        },
                        {
                            label: 'Clientes / Contatos',
                            icon: 'pi pi-users',
                            routerLink: ['/sales/customers'],
                            code: "sales_customers:view"
                        },
                        {
                            label: 'Oportunidades',
                            icon: 'pi pi-eye',
                            routerLink: ['/sales/oportunities'],
                            code: "sales_oportunities:view"
                        },
                        // { // FAZER ESSE DEPOIS
                        //     label: 'Mala-Direta',
                        //     icon: 'pi pi-send',
                        //     routerLink: ['/sales/direct-mail'],
                        //     code: "sales_direct_mail:view"
                        // },
                        {
                            label: 'Meios de comunicação',
                            icon: 'pi pi-megaphone',
                            routerLink: ['/sales/communication-means'],
                            code: "communication_means:view"
                        },
                    ]
                },

            ]
        }

        // const afterSalesMenuItem = {
        //     label: 'Pós vendas',
        //     items: [
        //         {
        //             label: 'Clientes',
        //             icon: 'pi pi-users',
        //             routerLink: ['/after-sales/customers'],
        //             code: "aftersales_customers:view"
        //         },
        //     ]
        // }

        const relatSalesMenuItem = {
            label: '',
            items: [
                {
                    label: 'Relatórios de vendas',
                    icon: 'pi pi-fw pi-dollar',
                    items: [
                        {
                            label: 'Negociações',
                            icon: 'pi pi-filter',
                            routerLink: ['/reports/negotiations'],
                            code: "reports_negotiations:view"
                        },
                        {
                            label: 'Negociações perdidas',
                            icon: 'pi pi-filter',
                            routerLink: ['/reports/lost-negotiations'],
                            code: "reports_lost_negotiations:view"
                        },
                        {
                            label: 'Orçamentos/Pedidos',
                            icon: 'pi pi-filter',
                            routerLink: ['/reports/sales-orders'],
                            code: "reports_sales_orders:view"
                        },

                    ]
                },
            ]
        }

        const productsMenu = {
            label: '',
            items: [
                {
                    label: 'Produtos',
                    icon: 'pi pi-hammer',
                    items: [
                        {
                            label: 'Tipos Acessórios',
                            icon: 'pi pi-hammer',
                            routerLink: ['/products/accessories-types'],
                            code: "accessories_types:view"
                        },
                        {
                            label: 'Acessórios',
                            icon: 'pi pi-hammer',
                            routerLink: ['/products/accessories'],
                            code: "accessories:view"
                        },
                        {
                            label: 'Cascos',
                            icon: 'pi pi-hammer',
                            routerLink: ['/products/boats'],
                            code: "pboats:view"
                        },
                        {
                            label: 'Motores',
                            icon: 'pi pi-hammer',
                            routerLink: ['/products/engines'],
                            code: "engines:view"
                        },
                    ],
                },

            ]
        }


        if (this.authService.isLoggedIn()) {
            const userjwt = this.authService.parseUserJwt()
            const isAdmin = userjwt?.roles?.includes("Admin")
            this.model = []

            const menuItems = [relatSalesMenuItem, productsMenu, salesMenuItem].reverse()

            if (isAdmin) {
                this.model = [relatSalesMenuItem, ...this.model]
                this.model = [productsMenu, ...this.model]
                // this.model = [afterSalesMenuItem, ...this.model]
                this.model = [salesMenuItem, ...this.model]
                this.model = [adminMenuItem, ...this.model]

            } else {
                for (const menui of menuItems) {
                    for (const menuii of menui.items) {
                        menuii.items = menuii?.items?.filter((i) => userjwt?.permissions.includes(i.code))
                        if (menuii?.items?.length > 0) {
                            this.model = [menui, ...this.model]
                        }
                    }
                }

            }

            this.model = [dashMenu, ...this.model]

            this.bkpModel = JSON.parse(JSON.stringify(this.model))
        }

    }
}

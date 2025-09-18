import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { AppMenuitem } from './app.menuitem';
import { AuthService } from '../../shared/services/auth.service';
import { updatePreset } from '@primeng/themes';
import { faPeopleArrows } from '@fortawesome/free-solid-svg-icons';

@Component({
    selector: 'app-menu',
    standalone: true,
    imports: [CommonModule, AppMenuitem, RouterModule],
    template: `<ul class="layout-menu">
        <ng-container *ngFor="let item of model; let i = index">
            <li app-menuitem *ngIf="!item.separator" [item]="item" [index]="i" [root]="true"></li>
            <li *ngIf="item.separator" class="menu-separator"></li>
        </ng-container>

    </ul> 
    
    `
})

export class AppMenu {
    model: MenuItem[] = [];
    faPeopleArrows = faPeopleArrows

    constructor(private authService: AuthService) { }

    ngOnInit() {
        this.model = [
            // {
            //     label: 'Hierarchy',
            //     items: [
            //         {
            //             label: 'Submenu 1',
            //             icon: 'pi pi-fw pi-bookmark',
            //             items: [
            //                 {
            //                     label: 'Submenu 1.1',
            //                     icon: 'pi pi-fw pi-bookmark',
            //                     items: [
            //                         { label: 'Submenu 1.1.1', icon: 'pi pi-fw pi-bookmark' },
            //                         { label: 'Submenu 1.1.2', icon: 'pi pi-fw pi-bookmark' },
            //                         { label: 'Submenu 1.1.3', icon: 'pi pi-fw pi-bookmark' }
            //                     ]
            //                 },
            //                 {
            //                     label: 'Submenu 1.2',
            //                     icon: 'pi pi-fw pi-bookmark',
            //                     items: [{ label: 'Submenu 1.2.1', icon: 'pi pi-fw pi-bookmark' }]
            //                 }
            //             ]
            //         },
            //         {
            //             label: 'Submenu 2',
            //             icon: 'pi pi-fw pi-bookmark',
            //             items: [
            //                 {
            //                     label: 'Submenu 2.1',
            //                     icon: 'pi pi-fw pi-bookmark',
            //                     items: [
            //                         { label: 'Submenu 2.1.1', icon: 'pi pi-fw pi-bookmark' },
            //                         { label: 'Submenu 2.1.2', icon: 'pi pi-fw pi-bookmark' }
            //                     ]
            //                 },
            //                 {
            //                     label: 'Submenu 2.2',
            //                     icon: 'pi pi-fw pi-bookmark',
            //                     items: [{ label: 'Submenu 2.2.1', icon: 'pi pi-fw pi-bookmark' }]
            //                 }
            //             ]
            //         }
            //     ]
            // },
        ];

        const dashMenu = {
            label: 'Home',
            items: [
                { label: 'Dashboard', icon: 'pi pi-fw pi-home', routerLink: ['/dashboard'], },
            ],
        }

        let adminMenuItem = {
            label: 'Sistema',
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
        }

        const salesMenuItem = {
            label: 'Vendas',
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
                {
                    label: 'Meios de comunicação',
                    icon: 'pi pi-megaphone',
                    routerLink: ['/sales/communication-means'],
                    code: "communication_means:view"
                },
            ]
        }

        const afterSalesMenuItem = {
            label: 'Pós vendas',
            items: [
                {
                    label: 'Clientes',
                    icon: 'pi pi-users',
                    routerLink: ['/after-sales/customers'],
                    code: "aftersales_customers:view"
                },
            ]
        }

        const relatSalesMenuItem = {
            label: 'Relatórios',
            items: [

            ]
        }

        const productsMenu = {
            label: 'Produtos',
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
            ]
        }


        if (this.authService.isLoggedIn()) {
            const userjwt = this.authService.parseUserJwt()
            const isAdmin = userjwt?.roles.includes("admin")

            const menuItems = [relatSalesMenuItem, productsMenu, afterSalesMenuItem, salesMenuItem].reverse()

            // this.model = [relatSalesMenuItem, ...this.model]
            // this.model = [productsMenu, ...this.model]
            // this.model = [afterSalesMenuItem, ...this.model]
            // this.model = [salesMenuItem, ...this.model]

            if (isAdmin) {
                this.model = [relatSalesMenuItem, ...this.model]
                this.model = [productsMenu, ...this.model]
                this.model = [afterSalesMenuItem, ...this.model]
                this.model = [salesMenuItem, ...this.model]
                this.model = [adminMenuItem, ...this.model]
            } else {
                for (const menui of menuItems) {
                    menui.items = menui.items.filter((i) => userjwt?.permissions.includes(i.code))
                    this.model = [menui, ...this.model]
                }

            }

            // if (isAdmin || this.authService.checkUserPermissionsContains(adminMenuItem.items)) {
            //     if (isAdmin) {
            //         this.model = [adminMenuItem, ...this.model]
            //     } else {
            //         if (this.authService.parseUserJwt().permissions.length != 0) {
            //             adminMenuItem.items = adminMenuItem.items.filter((i) => userjwt?.permissions.includes(i.code))
            //             this.model = [adminMenuItem, ...this.model]
            //         }
            //     }
            // }

            this.model = [dashMenu, ...this.model]
        }

    }
}

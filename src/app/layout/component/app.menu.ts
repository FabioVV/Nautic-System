import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { AppMenuitem } from './app.menuitem';
import { AuthService } from '../../shared/services/auth.service';
import { updatePreset } from '@primeng/themes';

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
    constructor(private authService: AuthService) { }

    ngOnInit() {
        this.model = [
            {
                label: 'Hierarchy',
                items: [
                    {
                        label: 'Submenu 1',
                        icon: 'pi pi-fw pi-bookmark',
                        items: [
                            {
                                label: 'Submenu 1.1',
                                icon: 'pi pi-fw pi-bookmark',
                                items: [
                                    { label: 'Submenu 1.1.1', icon: 'pi pi-fw pi-bookmark' },
                                    { label: 'Submenu 1.1.2', icon: 'pi pi-fw pi-bookmark' },
                                    { label: 'Submenu 1.1.3', icon: 'pi pi-fw pi-bookmark' }
                                ]
                            },
                            {
                                label: 'Submenu 1.2',
                                icon: 'pi pi-fw pi-bookmark',
                                items: [{ label: 'Submenu 1.2.1', icon: 'pi pi-fw pi-bookmark' }]
                            }
                        ]
                    },
                    {
                        label: 'Submenu 2',
                        icon: 'pi pi-fw pi-bookmark',
                        items: [
                            {
                                label: 'Submenu 2.1',
                                icon: 'pi pi-fw pi-bookmark',
                                items: [
                                    { label: 'Submenu 2.1.1', icon: 'pi pi-fw pi-bookmark' },
                                    { label: 'Submenu 2.1.2', icon: 'pi pi-fw pi-bookmark' }
                                ]
                            },
                            {
                                label: 'Submenu 2.2',
                                icon: 'pi pi-fw pi-bookmark',
                                items: [{ label: 'Submenu 2.2.1', icon: 'pi pi-fw pi-bookmark' }]
                            }
                        ]
                    }
                ]
            },

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
                    routerLink: ['/'],
                    code: "users:view"
                },
                {
                    label: 'Cargos',
                    icon: 'pi pi-users',
                    routerLink: ['/'],
                    code: "roles:view"
                },
                {
                    label: 'Permissões',
                    icon: 'pi pi-key',
                    routerLink: ['/teachers'],
                    code: "permissions:view"
                },
            ]
        }

        const salesMenuItem = {
            label: 'Vendas',
            items: [

            ]
        }

        const afterSalesMenuItem = {
            label: 'Pós vendas',
            items: [

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

            ]
        }


        if (this.authService.isLoggedIn()) {
            const userjwt = this.authService.parseUserJwt()

            this.model = [relatSalesMenuItem, ...this.model]
            this.model = [afterSalesMenuItem, ...this.model]
            this.model = [salesMenuItem, ...this.model]
            this.model = [productsMenu, ...this.model]

            if (userjwt?.role.includes("admin") || this.authService.checkUserPermissionsContains(adminMenuItem.items)) {
                if (this.authService.parseUserJwt().permissions.length != 0) {
                    adminMenuItem.items = adminMenuItem.items.filter((i) => userjwt?.permissions.includes(i.code))
                    this.model = [adminMenuItem, ...this.model]
                }
            }

            this.model = [dashMenu, ...this.model]
        }

    }
}

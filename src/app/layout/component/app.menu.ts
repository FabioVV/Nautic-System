import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { AppMenuitem } from './app.menuitem';
import { AuthService } from '../../shared/services/auth.service';

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
    constructor(private authService: AuthService) {

    }


    ngOnInit() {

        this.model = [
            // {
            //     label: 'Home',
            //     items: [{ label: 'Dashboard', icon: 'pi pi-fw pi-home', routerLink: ['/'] }]
            // },
            {
                label: 'Home',
                items: [
                    { label: 'Dashboard', icon: 'pi pi-fw pi-home', routerLink: ['/dashboard'], },
                    // { label: 'Turmas', icon: 'pi pi-fw pi-book', routerLink: ['/classes'] },
                    // { label: 'Atividades', icon: 'pi pi-fw pi-file', routerLink: ['/activities'] },
                    // { label: 'Atividades enviadas', icon: 'pi pi-fw pi-file-arrow-up', routerLink: ['/delivered-activities'] },
                ],
            },
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
            // {
            //     label: 'Info',
            //     items: [
            //         {
            //             label: 'View Source',
            //             icon: 'pi pi-fw pi-github',
            //             url: '',
            //             target: '_blank'
            //         }
            //     ]
            // }
        ];


        const adminMenuItem = {
            label: 'Sistema',
            items: [
                {
                    label: 'Usuários',
                    icon: 'pi pi-fw pi-user-plus',
                    routerLink: ['/']
                },
                {
                    label: 'Cargos',
                    icon: 'pi pi-fw pi-user-plus',
                    routerLink: ['/']
                },
                {
                    label: 'Permissões',
                    icon: 'pi pi-fw pi-user-plus',
                    routerLink: ['/teachers']
                },
            ]
        }

        if (this.authService.isLoggedIn() && this.authService.getUserClaim()?.role == 'admin') {
            this.model = [adminMenuItem, ...this.model];
        }

    }
}

import { Component, OnInit, Renderer2, RendererStyleFlags2 } from '@angular/core';
import { MenuItem, MessageService } from 'primeng/api';
import { Router, RouterModule } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators, ValidatorFn, AbstractControl } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { StyleClassModule } from 'primeng/styleclass';
import { DialogModule } from 'primeng/dialog';
import { TooltipModule } from 'primeng/tooltip';
import { AppConfigurator } from './app.configurator';
import { LayoutService } from '../service/layout.service';
import { AuthService } from '../../shared/services/auth.service';
import { User, UserService } from '../../shared/services/user.service';
import { MessageModule } from 'primeng/message';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { SharedService } from '../../shared/services/shared.service';
import { ToastModule } from 'primeng/toast';
import { ThemeService } from '../../shared/services/theme.service';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faHeadset } from '@fortawesome/free-solid-svg-icons';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-topbar-stripped',
    standalone: true,
    imports: [TooltipModule, FontAwesomeModule, RouterModule, CommonModule, ReactiveFormsModule, StyleClassModule, DialogModule, MessageModule, PasswordModule, ButtonModule, InputTextModule, AppConfigurator, ToastModule, FormsModule],
    providers: [MessageService],
    template: ` 
    <p-toast></p-toast>
    <div style='display:none; height:auto !important; width:auto !important;' class="layout-topbar">
    
        <div class="layout-topbar-actions">
            <div class="layout-config-menu">
                <button type="button" class="layout-topbar-action" (click)="toggleDarkMode()">
                    <i [ngClass]="{ 'pi ': true, 'pi-moon': layoutService.isDarkTheme(), 'pi-sun': !layoutService.isDarkTheme() }"></i>
                </button>
                <div class="relative">
                    <button
                        class="layout-topbar-action layout-topbar-action-highlight"
                        pStyleClass="@next"
                        enterFromClass="hidden"
                        enterActiveClass="animate-scalein"
                        leaveToClass="hidden"
                        leaveActiveClass="animate-fadeout"
                        [hideOnOutsideClick]="true"
                    >
                        <i class="pi pi-palette"></i>
                    </button>
                    <app-configurator />
                </div>
            </div>

        </div>

    </div>

    `
})
export class AppTopbarStripped implements OnInit {
    faHeadset = faHeadset

    items!: MenuItem[]
    userData: User = this.userService.getUserData()

    editAccountVisible!: boolean
    email: string | undefined = "Disabled"

    isSubmited: boolean = false
    isLoading: boolean = false


    constructor(
        public layoutService: LayoutService,
        public formBuilder: FormBuilder,
        private authService: AuthService,
        private router: Router,
        private userService: UserService,
        private renderer: Renderer2,
        private shared: SharedService,
        private messageService: MessageService,
        private themeService: ThemeService
    ) {

    }

    ngOnInit(): void {
        this.authService.userData$.subscribe(data => { // To update the navbar automagically
            this.userData = data
        })
    }

    logout() {
        this.authService.logoutUser()
    }

    openEditAccountModal() {
        this.editAccountVisible = true
        this.renderer.setStyle(this.shared.getSidebar()?.nativeElement, 'z-index', '1', RendererStyleFlags2.Important)
    }

    closeEditAccountModal() {
        this.editAccountVisible = false;
        this.renderer.setStyle(this.shared.getSidebar()?.nativeElement, 'z-index', '999', RendererStyleFlags2.Important)
    }

    toggleDarkMode() {
        this.layoutService.layoutConfig.update((state) => ({ ...state, darkTheme: !state.darkTheme }));

        this.layoutService.configUpdate$.subscribe(data => {
            this.themeService.saveThemeMode(data)
        })
    }

}

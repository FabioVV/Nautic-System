import { Component, OnInit } from '@angular/core';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

import { UserData, UserService } from '../../shared/services/user.service';


@Component({
    selector: 'app-dashboard',
    imports: [ToastModule,],
    providers: [MessageService],

    template: `
        <p-toast></p-toast>
        <h1>Bem vindo(a)! {{ userName }}</h1>

    `
})
export class Dashboard implements OnInit {

    userData: UserData = this.userService.getUserData()
    userName: any = this.userData.name.split(` `)?.at(0) || this.userData.name || this.userData.email

    constructor(
        private userService: UserService,
    ) {

    }

    ngOnInit(): void {
    }

}

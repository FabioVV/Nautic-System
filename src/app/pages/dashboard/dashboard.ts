import { Component, OnInit } from '@angular/core';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { CardModule } from 'primeng/card';

import { User, UserService } from '../../shared/services/user.service';
import { AuthService } from '../../shared/services/auth.service';

@Component({
    selector: 'app-dashboard',
    imports: [ToastModule, CardModule],
    providers: [MessageService],
    template: `
        <p-toast></p-toast>

        <p-card header="">
            <h1>Bem vindo(a)! {{ userName }}</h1>
        </p-card>
    `
})
export class Dashboard implements OnInit {

    userData: User = this.userService.getUserData()
    userName: any = this.userData.name.split(` `)?.at(0) || this.userData.name || this.userData.email

    constructor(
        private userService: UserService,
        private authService: AuthService,

    ) {

    }

    ngOnInit(): void {
        console.log(this.authService.parseUserJwt())
    }

}

import { Component, OnInit } from '@angular/core';
import { ToastModule } from 'primeng/toast';

import { UserData, UserService } from '../../shared/services/user.service';

import { RecentStudentsUpdates } from './studentsupdates';
import { Stats } from './appstats';
import { MessageService } from 'primeng/api';

@Component({
    selector: 'app-dashboard',
    imports: [Stats, RecentStudentsUpdates, ToastModule, ],
    providers:[MessageService],

    template: `
        <p-toast></p-toast>
        <h1>Bem vindo(a)! Professor(a) {{ userName }}</h1>

        <div class="grid grid-cols-12 gap-8">
            <stats class="contents"/>

            <div class="col-span-12 xl:col-span-12">
                <recent-students-updates />
            </div>

        </div>
    `
})
export class Dashboard implements OnInit{

    userData: UserData = this.userService.getUserData()
    userName: any = this.userData.fullName.split(` `)?.at(0) || this.userData.fullName || this.userData.email
    
    constructor(
        private userService: UserService,
    ) {

    }

    ngOnInit(): void {
        
    }
    
}

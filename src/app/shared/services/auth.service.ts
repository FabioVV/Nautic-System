import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { USER_DATA } from '../constants';
import { environment } from '../../../environments/environment';
import { Router } from '@angular/router';
import { UserService } from './user.service';

import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    constructor(private http: HttpClient) {
    }

    router = inject(Router)
    userService = inject(UserService)

    private userDataSubject = new BehaviorSubject<any>(this.userService.getUserData())
    userData$ = this.userDataSubject.asObservable()


    createUser(formData: any) {
        return this.http.post(`${environment.apiBaseURL}/signup`, formData)
    }

    loginUser(formData: any) {
        return this.http.post(`${environment.apiBaseURL}/auth/signin`, formData)
    }

    logoutUser() {
        this.deleteUserStorage()
        this.router.navigateByUrl("/auth/login")
    }

    getUserToken() {
        if (!localStorage.getItem(USER_DATA)) {
            return
        }

        return JSON.parse(localStorage.getItem(USER_DATA) as string).token
    }

    getUserClaim() {
        return JSON.parse(window.atob(this.getUserToken()!.split('.')[1]))
    }

    checkUserPermissionsContains(permsToCheckFor: Array<any>): Boolean {
        return permsToCheckFor.some(p => this.parseUserJwt().permissions.includes(p.code))
    }

    parseUserJwt() {
        if (!localStorage.getItem(USER_DATA)) {
            return
        }

        let token = this.getUserToken()
        let base64Url = token.split('.')[1];
        let base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        let parsedUserJwt = JSON.parse(jsonPayload)

        if ('permissions' in parsedUserJwt && parsedUserJwt['permissions'] == null) {
            parsedUserJwt['permissions'] = []
        }

        return parsedUserJwt
    }

    isLoggedIn() {
        if (!localStorage.getItem(USER_DATA)) {
            return
        }

        const exp = new Date(this.parseUserJwt().exp * 1000)

        if (new Date() >= exp) {
            return false
        }

        return localStorage.getItem(USER_DATA) ?? false
    }

    saveUserData(data: any) {
        localStorage.setItem(USER_DATA, JSON.stringify(data))
    }

    updateUserData(data: any) {
        if (!localStorage.getItem(USER_DATA)) {
            this.router.navigateByUrl("/auth/signin")
            return
        }

        const newUserData = {
            ...this.userService.getUserData(),
            ...data,
        }

        localStorage.setItem(USER_DATA, JSON.stringify(newUserData))
        this.userDataSubject.next(newUserData) // emits the new data
    }

    deleteUserStorage() {
        localStorage.removeItem(USER_DATA);
    }
}

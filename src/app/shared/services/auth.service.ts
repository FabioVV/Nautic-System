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
        return JSON.parse(localStorage.getItem(USER_DATA) as string).token
    }

    getUserClaim() {
        return JSON.parse(window.atob(this.getUserToken()!.split('.')[1]))
    }

    isLoggedIn() { // Check if token has expired
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

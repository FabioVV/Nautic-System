import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { USER_DATA } from '../constants';
import { environment } from '../../../environments/environment';

export interface User {
    name: string,
    email: string
    roles: Array<string>,
    permissions: Array<string>,
}



@Injectable({
    providedIn: 'root'
})
export class UserService {
    constructor(private http: HttpClient) { }

    getUserData(): User {
        return JSON.parse(localStorage.getItem(USER_DATA) as string) ?? false
    }


    updateUser(formData: any) {
        return this.http.patch(`${environment.apiBaseURL}/updateUser`, formData)
    }

    deleteUser(id: string) {
        return this.http.delete(`${environment.apiBaseURL}/deleteUser/${id}`)
    }


    registerUser(formData: any) {
        return this.http.post(`${environment.apiBaseURL}/signup`, formData)
    }

    getUsers(search: string) {
        return this.http.get(`${environment.apiBaseURL}/users?q=${search ?? ""}`)
    }
}


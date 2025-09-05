import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { USER_DATA } from '../constants';
import { environment } from '../../../environments/environment';

export interface User {
    id: string,
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

    updateUser(id: string, formData: any) {
        return this.http.patch(`${environment.apiBaseURL}/users/${id}`, formData)
    }

    deactivateUser(id: string) {
        return this.http.delete(`${environment.apiBaseURL}/users/${id}`)
    }

    registerUser(formData: any) {
        return this.http.post(`${environment.apiBaseURL}/signup`, formData)
    }

    getUsers(page = 1, perPage = 10, name: string, email: string, active: string) {
        return this.http.get(`${environment.apiBaseURL}/users?pageNumber=${page}&perPage=${perPage}&name=${name}&email=${email}&active=${active}`)
    }
}


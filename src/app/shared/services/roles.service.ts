import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class RolesService {
    constructor(private http: HttpClient) { }

    updateRole(id: string, formData: any) {
        return this.http.patch(`${environment.apiBaseURL}/roles/${id}`, formData)
    }

    deactivateRole(id: string) {
        return this.http.delete(`${environment.apiBaseURL}/roles/${id}`)
    }

    registerRole(formData: any) {
        return this.http.post(`${environment.apiBaseURL}/roles`, formData)
    }

    getRoles(page = 1, perPage = 10, name: string = "", showAdmin: string = "N") {
        return this.http.get(`${environment.apiBaseURL}/roles?pageNumber=${page}&perPage=${perPage}&name=${name}&show_admin=${showAdmin}`)
    }
}


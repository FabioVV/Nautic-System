import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { USER_DATA } from '../constants';
import { environment } from '../../../environments/environment';

export interface Accessory {
    id: string,
    name: string,
    email: string
    roles: Array<string>,
    permissions: Array<string>,
}



@Injectable({
    providedIn: 'root'
})
export class AccessoryService {
    constructor(private http: HttpClient) { }

    registerAccessory(formData: any) {
        return this.http.post(`${environment.apiBaseURL}/accessories`, formData)
    }

    getAccessories(page = 1, perPage = 10, name: string, active: string) {
        return this.http.get(`${environment.apiBaseURL}/accessories?pageNumber=${page}&perPage=${perPage}&name=${name}&active=${active}`)
    }
}


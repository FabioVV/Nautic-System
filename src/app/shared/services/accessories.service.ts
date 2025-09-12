import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { USER_DATA } from '../constants';
import { environment } from '../../../environments/environment';

export interface Accessory {
    id: string,
    model: string,
}

export interface AccessoryType {
    id: string,
    type: string,
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

    updateAccessoryType(id: string, formData: any) {
        return this.http.patch(`${environment.apiBaseURL}/accessories/accessories-types/${id}`, formData)
    }

    deactivateAccessoryType(id: string) {
        return this.http.delete(`${environment.apiBaseURL}/accessories/accessories-types/${id}`)
    }

    registerAccessoryType(formData: any) {
        return this.http.post(`${environment.apiBaseURL}/accessories/accessories-types`, formData)
    }

    getAccessoriesTypes(page = 1, perPage = 10, _type: string, active: string) {
        return this.http.get(`${environment.apiBaseURL}/accessories/accessories-types?pageNumber=${page}&perPage=${perPage}&type=${_type}&active=${active}`)
    }
}


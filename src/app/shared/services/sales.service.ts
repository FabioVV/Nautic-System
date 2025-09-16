import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { USER_DATA } from '../constants';
import { environment } from '../../../environments/environment';


export interface ComMean {
    id: string,
    name: string,
}

export interface Negotiation {

}

@Injectable({
    providedIn: 'root'
})
export class SalesService {
    constructor(private http: HttpClient) { }

    registerNegotiation(formData: any) {
        return this.http.post(`${environment.apiBaseURL}/sales/negotiations`, formData)
    }

    getNegotiations(search: string){
        return this.http.get(`${environment.apiBaseURL}/sales/negotiations?search=${search}`)
    }

    registerComMean(formData: any) {
        return this.http.post(`${environment.apiBaseURL}/sales/communication-means`, formData)
    }

    deactivateComMean(id: string) {
        return this.http.delete(`${environment.apiBaseURL}/sales/communication-means/${id}`)
    }

    updateComMean(id: string, formData: any) {
        return this.http.patch(`${environment.apiBaseURL}/sales/communication-means/${id}`, formData)
    }

    getComs(page = 1, perPage = 10, name: string, active: string) {
        return this.http.get(`${environment.apiBaseURL}/sales/communication-means?pageNumber=${page}&perPage=${perPage}&name=${name}&active=${active}`)
    }


}


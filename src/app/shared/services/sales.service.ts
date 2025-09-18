import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { USER_DATA } from '../constants';
import { environment } from '../../../environments/environment';


export interface SalesCustomer {
    id: string,
    id_user: string, // employee that registered this customer
    name: string,
    email: string,
    phone: string,
    birthdate: string,
    pf_pj: string,
    cpf: string,
    cnpj: string,
    cep: string,
    street: string,
    neighborhood: string,
    city: string,
    complement: string,
    qualified: string,
    active: string,
    active_contact: string,
}

export interface ComMean {
    id: string,
    name: string,
}

export interface Negotiation {
    id: number,
    id_customer: number,
    id_mean_communication: number,
    customer_name: string,
    customer_email: string,
    customer_phone: string,
    com_name: string,
    boat_name: string,
    estimated_value: number,
    max_estimated_value: number,
    customer_city: string,
    customer_nav_city: string,
    boat_cap_needed: number,
    new_used: string,
    cab_open: string,
    stage: number,
    Qualified: string,
}

@Injectable({
    providedIn: 'root'
})
export class SalesService {
    constructor(private http: HttpClient) { }

    getCustomersBirthday(){
        return this.http.get(`${environment.apiBaseURL}/sales/customers-birthday`)
    }

    getCustomers(page = 1, perPage = 10, name: string, email: string, phone: string, boat: string){
        return this.http.get(`${environment.apiBaseURL}/sales/customers?pageNumber=${page}&perPage=${perPage}&name=${name}&email=${email}&phone=${phone}&boat=${boat}`)
    }

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

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

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


export interface NegotiationHistory {
    id: number,
    id_customer: number,
    id_mean_communication: number,
    com_name: string,
    customer_name: string,
    description: string,
    created_at: Date,
    id_business: string,
    id_sales_order:string,
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
    qualified: string,
    has_passed_24hrs: boolean,
    customer_score: number,
}

@Injectable({
    providedIn: 'root'
})
export class SalesService {
    constructor(private http: HttpClient) { }

    getCustomersBirthday(){
        return this.http.get(`${environment.apiBaseURL}/sales/customers/birthdays`)
    }
    
    getCustomers(page = 1, perPage = 10, name: string, email: string, phone: string, boat: string){
        return this.http.get(`${environment.apiBaseURL}/sales/customers?pageNumber=${page}&perPage=${perPage}&name=${name}&email=${email}&phone=${phone}&boat=${boat}`)
    }

    getCustomer(id: string){
        return this.http.get(`${environment.apiBaseURL}/sales/customers/${id}`)
    }

    updateCustomer(id: string, formData: any) {
        return this.http.patch(`${environment.apiBaseURL}/sales/customers/${id}`, formData)
    }

    registerNegotiation(formData: any) {
        return this.http.post(`${environment.apiBaseURL}/sales/negotiations`, formData)
    }

    updateNegotiation(id: string, formData: any) {
        return this.http.patch(`${environment.apiBaseURL}/sales/negotiations/${id}`, formData)
    }

    advanceNegotiation(id: string, formData: any) {
        return this.http.patch(`${environment.apiBaseURL}/sales/negotiations/${id}/advance`, formData)
    }

    createNegotiationHistory(id: string, formData: any) {
        return this.http.post(`${environment.apiBaseURL}/sales/negotiations/${id}/history`, formData)
    }

    GetNegotiationHistory(id: string) {
        return this.http.get(`${environment.apiBaseURL}/sales/negotiations/${id}/history`)
    }

    GetCustomerNegotiationHistory(id: string) {
        return this.http.get(`${environment.apiBaseURL}/sales/customers/${id}/negotiations/history`)
    }

    GetUserNegotiationHistory(id: string, id_customer: string) {
        return this.http.get(`${environment.apiBaseURL}/sales/customer/${id_customer}/negotiations/${id}/history`)
    }

    getNegotiations(search: string){
        return this.http.get(`${environment.apiBaseURL}/sales/negotiations?search=${search}`)
    }

    getNegotiationsAlerts(){
        return this.http.get(`${environment.apiBaseURL}/sales/negotiations/alerts`)
    }

    getNegotiation(id: string) {
        return this.http.get(`${environment.apiBaseURL}/sales/negotiations/${id}`)
    }

    deactivateNegotiation(id: string, formData: any) {
        return this.http.patch(`${environment.apiBaseURL}/sales/negotiations/${id}/deactivate`, formData)
    }

    reactivateNegotiation(id: string) {
        return this.http.patch(`${environment.apiBaseURL}/sales/negotiations/${id}/reactivate`, null)
    }

    insertBoatSalesOrder(id: string, id_boat: string) {
        return this.http.patch(`${environment.apiBaseURL}/sales/orders/${id}/boat/${id_boat}`, null)
    }

    insertEngineSalesOrder(id: string, id_engine: string) {
        return this.http.patch(`${environment.apiBaseURL}/sales/orders/${id}/engine/${id_engine}`, null)
    }

    insertAccessorySalesOrder(id: string, id_accessory: string) {
        return this.http.patch(`${environment.apiBaseURL}/sales/orders/${id}/accessory/${id_accessory}`, null)
    }

    getSalesOrder(id: string) {
        return this.http.get(`${environment.apiBaseURL}/sales/orders/${id}`)
    }

    getSalesOrderItens(id: string) {
        return this.http.get(`${environment.apiBaseURL}/sales/orders/${id}/itens`)
    }

    cancelSalesOrder(id: string) {
        return this.http.delete(`${environment.apiBaseURL}/sales/orders/${id}`)
    }

    removeSalesOrderAccessory(id: string, id_accessory: string) {
        return this.http.delete(`${environment.apiBaseURL}/sales/orders/${id}/accessory/${id_accessory}`)
    }

    upgradeQuoteToOrder(id: string) {
        return this.http.patch(`${environment.apiBaseURL}/sales/orders/${id}/upgrade-quote`, null)
    }

    salesOrderchangeItemQty(id: string, id_accessory: string, formData: any) {
        return this.http.patch(`${environment.apiBaseURL}/sales/orders/${id}/accessory/${id_accessory}/change-qty`, formData)
    }

    registerSalesOrderUsingBusinnesHistory(id: string) {
        return this.http.post(`${environment.apiBaseURL}/sales/orders/negotiations/history/${id}`, null)
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

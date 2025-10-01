import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '../../../environments/environment';


export interface Boat {
    id: string,
    model: string,
    selling_price: string,
    cost: string,
    itens: string,
    hours: string,
    year: string,
    new_used: string,
    cab_open: string,
    capacity: string,
    night_capacity: string,
    lenght: string,
    beam: string,
    draft: string,
    weight: string,
    trim: string,
    fuel_tank_capacity: string,
    active: string,
    created_at: string,
    updated_at: string,
}

@Injectable({
    providedIn: 'root'
})
export class BoatService {
    constructor(private http: HttpClient) { }

    registerBoat(formData: any) {
        return this.http.post(`${environment.apiBaseURL}/boats`, formData)
    }

    updateBoat(id: string, formData: any) {
        return this.http.patch(`${environment.apiBaseURL}/boats/${id}`, formData)
    }

    getBoats(page = 1, perPage = 10, model: string, price: string, id: string, active: string) {
        return this.http.get(`${environment.apiBaseURL}/boats?pageNumber=${page}&perPage=${perPage}&model=${model}&price=${price}&id=${id}&active=${active}`)
    }

    registerBoatAccessory(id: string, id_accessory: string | null | undefined) {
        return this.http.post(`${environment.apiBaseURL}/boats/${id}/accessories/${id_accessory ?? ''}`, null)
    }

    registerBoatEngine(id: string, id_engine: string | null | undefined) {
        return this.http.post(`${environment.apiBaseURL}/boats/${id}/engines/${id_engine ?? ''}`, null)
    }

    removeBoatAccessory(id: string, id_accessory: string) {
        return this.http.delete(`${environment.apiBaseURL}/boats/${id}/accessories/${id_accessory}`)
    }

    removeBoatEngine(id: string, id_engine: string) {
        return this.http.delete(`${environment.apiBaseURL}/boats/${id}/engines/${id_engine}`)
    }

    getBoatAccessories(id: string) {
        return this.http.get(`${environment.apiBaseURL}/boats/${id}/accessories`)
    }

    getBoatEngines(id: string) {
        return this.http.get(`${environment.apiBaseURL}/boats/${id}/engines`)
    }

    getBoat(id: string) {
        return this.http.get(`${environment.apiBaseURL}/boats/${id}`)
    }
}


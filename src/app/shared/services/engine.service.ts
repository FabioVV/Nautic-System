import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '../../../environments/environment';

export interface Engine {
  id: string
  model: string
  type: string
  weight: number
  rotation: string
  power: number
  cylinders: number
  selling_price: number
  command: string
  clocks: number
  tempo: number
  fuel_type: string
  active: string
}



@Injectable({
    providedIn: 'root'
})
export class EngineService {
    constructor(private http: HttpClient) { }

    registerEngine(formData: any) {
        return this.http.post(`${environment.apiBaseURL}/engines`, formData)
    }

    getEngines(page = 1, perPage = 10, model: string, active: string) {
        return this.http.get(`${environment.apiBaseURL}/engines?pageNumber=${page}&perPage=${perPage}&model=${model}&active=${active}`)
    }

    getEngine(id: string) {
        return this.http.get(`${environment.apiBaseURL}/engines/${id}`)
    }

    updateEngine(id: string, formData: any) {
        return this.http.patch(`${environment.apiBaseURL}/engines/${id}`, formData)
    }

    deactivateEngine(id: string) {
        return this.http.delete(`${environment.apiBaseURL}/engines/${id}`)
    }
}


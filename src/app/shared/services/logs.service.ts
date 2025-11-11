import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';


@Injectable({
    providedIn: 'root'
})
export class LogsService {
    constructor(private http: HttpClient) { }


    getLogs(page = 1, perPage = 10, action: string = "", description: string = "",) {
        return this.http.get(`${environment.apiBaseURL}/audit/logs?pageNumber=${page}&perPage=${perPage}&action=${action}&description=${description}`)
    }

}


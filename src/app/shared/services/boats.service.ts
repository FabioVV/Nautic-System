import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { USER_DATA } from '../constants';
import { environment } from '../../../environments/environment';

export interface Boat {
    id: string,
}

@Injectable({
    providedIn: 'root'
})
export class BoatService {
    constructor(private http: HttpClient) { }


}


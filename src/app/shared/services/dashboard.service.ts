import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  constructor(private http: HttpClient) { }

  getDashboardData(){
    return this.http.get(`${environment.apiBaseURL}/dashboard/stats`)
  }

  getDashboardDataLastStudentsUpdated(){
    return this.http.get(`${environment.apiBaseURL}/dashboard/studentsLastUpdated`)
  }

}

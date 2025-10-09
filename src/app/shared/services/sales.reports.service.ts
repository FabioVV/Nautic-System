import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '../../../environments/environment';



@Injectable({
    providedIn: 'root'
})
export class SalesReportsService {
    constructor(private http: HttpClient) { }

    getNegotiationsReport(page = 1, perPage = 10, name: string, boat: string, dateIni?: Date | null, dateEnd?: Date | null){
        return this.http.get(`${environment.apiBaseURL}/sales/reports/negotiations?pageNumber=${page}&perPage=${perPage}&name=${name}&boat=${boat}&dateIni=${dateIni?.toISOString()}&dateEnd=${dateEnd?.toISOString()}`)
    }

    getSalesOrdersReport(page = 1, perPage = 10, name: string, boat: string, dateIni?: Date | null, dateEnd?: Date | null){
        return this.http.get(`${environment.apiBaseURL}/sales/reports/sales-orders?pageNumber=${page}&perPage=${perPage}&name=${name}&boat=${boat}&dateIni=${dateIni?.toISOString()}&dateEnd=${dateEnd?.toISOString()}`)
    }

    getLostBusinessReport(page = 1, perPage = 10, name: string, boat: string, dateIni?: Date | null, dateEnd?: Date | null){
        return this.http.get(`${environment.apiBaseURL}/sales/reports/lost-negotiations?pageNumber=${page}&perPage=${perPage}&name=${name}&boat=${boat}&dateIni=${dateIni?.toISOString()}&dateEnd=${dateEnd?.toISOString()}`)
    }
}

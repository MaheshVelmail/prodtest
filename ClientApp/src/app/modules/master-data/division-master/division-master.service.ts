import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppCommonService } from 'app/shared/services/common-service.service';

@Injectable({ providedIn: 'root' })
export class DivisionMasterService {
    constructor(private http: HttpClient,private appCommonService:AppCommonService) {
         
     }
     getAllDivision() {
        return this.appCommonService.HttpGetMethod(`division/GetAllDivision?includeinactive=${true}`)
    }

    addDivision(params: any) {
        return this.appCommonService.HttpPutMethod(`division/AddDivision`, params)
    }

    updateDivision(params: any) {
     return this.appCommonService.HttpPutMethod(`division/UpdateDivision`, params);
    }

    deleteDivision(id: string) {
       return this.appCommonService.HttpDeleteMethod(`division/DeleteDivision/${id}`)
    }
}
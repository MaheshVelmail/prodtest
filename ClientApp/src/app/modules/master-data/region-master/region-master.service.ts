import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppCommonService } from 'app/shared/services/common-service.service';

@Injectable({ providedIn: 'root' })
export class RegionMasterService {
    constructor(private http: HttpClient,private appCommonService:AppCommonService) {
         
     }

    getAllRegion() {
        return this.appCommonService.HttpGetMethod(`region/GetAllRegion?includeinactive=${true}`)
    }
    getAllDivision() {
        return this.appCommonService.HttpGetMethod('division/GetAllDivision')
    }

    addRegion(params: any) {
        return this.appCommonService.HttpPutMethod(`region/AddRegion`, params)
    }

    updateRegion(params: any) {
     return this.appCommonService.HttpPutMethod(`region/UpdateRegion`, params);
    }

    deleteRegion(id: string) {
       return this.appCommonService.HttpDeleteMethod(`region/DeleteRegion/${id}`)
    }
}
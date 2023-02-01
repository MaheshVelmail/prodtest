import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppCommonService } from 'app/shared/services/common-service.service';

@Injectable({ providedIn: 'root' })
export class LineMasterService {
    constructor(private http: HttpClient,private appCommonService:AppCommonService) {
         
     }

    getAll() {
        return this.appCommonService.HttpGetMethod(`line/GetLines?includeinactive=${true}`)
    }
    getLineType() {
        return this.appCommonService.HttpGetMethod('line/GetLineTypes')
    }
    getPlant() {
        return this.appCommonService.HttpGetMethod('plant/GetAllPlants')
    }
    getFillerType() {
        return this.appCommonService.HttpGetMethod('line/GetFillerTypes')
    }


    insert(params: any) {
        return this.appCommonService.HttpPutMethod(`line/AddLine`, params)
    }

    update(params: any) {
     return this.appCommonService.HttpPutMethod(`line/UpdateLine`, params);
    }

    delete(id: string) {
       return this.appCommonService.HttpDeleteMethod(`line/DeleteLine/${id}`)
    }
}
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppCommonService } from 'app/shared/services/common-service.service';



@Injectable({ providedIn: 'root' })
export class DowntimeReasonDetailService {
    constructor(private http: HttpClient,private appCommonService:AppCommonService) {
         
     }
    getAll() {
        return this.appCommonService.HttpGetMethod(`DowntimeReasonCode/GetDowntimeReasonCodes?includeinactive=${false}`)
    }
    getdowntimereasondetails() {
        return this.appCommonService.HttpGetMethod(`DowntimeReasonDetail/GetDowntimeReasonDetails?includeinactive=${true}`)
    }
    insert(params: any) {
        return this.appCommonService.HttpPutMethod(`DowntimeReasonDetail/AddDowntimeReasonDetail`, params)
    }

    update(params: any) {
     return this.appCommonService.HttpPutMethod(`DowntimeReasonDetail/UpdateDowntimeReasonDetail`, params);
    }

    delete(id: string) {
       return this.appCommonService.HttpDeleteMethod(`DowntimeReasonDetail/DeleteDowntimeReasonDetail/${id}`)
    }
}
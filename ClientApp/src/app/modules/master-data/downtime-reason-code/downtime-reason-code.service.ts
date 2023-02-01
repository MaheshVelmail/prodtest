import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppCommonService } from 'app/shared/services/common-service.service';



@Injectable({ providedIn: 'root' })
export class DowntimeReasonCodeService {
    constructor(private http: HttpClient,private appCommonService:AppCommonService) {
         
     }
    getAll() {
        return this.appCommonService.HttpGetMethod(`DowntimeReasonCode/GetDowntimeReasonCodes?includeinactive=${true}`)
    }
    getDowntimeReasonTypes() {
        return this.appCommonService.HttpGetMethod('DowntimeReasonType/GetDowntimeReasonTypes')
    }
    get() {
        return this.appCommonService.HttpGetMethod('DowntimeReasonCode/GetDowntimeReasonCodes')
    }
    insert(params: any) {
        return this.appCommonService.HttpPutMethod(`DowntimeReasonCode/AddDowntimeReasonCode`, params)
    }

    update(params: any) {
     return this.appCommonService.HttpPutMethod(`DowntimeReasonCode/UpdateDowntimeReasonCode`, params);
    }

    delete(id: string) {
       return this.appCommonService.HttpDeleteMethod(`DowntimeReasonCode/DeleteDowntimeReasonCode/${id}`)
    }
}
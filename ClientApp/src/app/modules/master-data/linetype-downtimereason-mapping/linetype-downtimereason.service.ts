import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppCommonService } from 'app/shared/services/common-service.service';

@Injectable({ providedIn: 'root' })
export class LineTypeDowntimeReasonService {
    constructor(private http: HttpClient,private appCommonService:AppCommonService) {
         
     }

    getAll() {
        return this.appCommonService.HttpGetMethod(`line/GetAllLineDowntimeReason?includeinactive=${true}`)
    }
    getLineType() {
        return this.appCommonService.HttpGetMethod('line/GetLineTypes')
    }
    getDowntimeReasonTypes() {
        return this.appCommonService.HttpGetMethod('DowntimeReasonType/GetDowntimeReasonTypes')
    }

    upInsertDelete(action: string,params: any) {
        return this.appCommonService.HttpPutMethod(`line/AddUpdateLineDowntimeReason?action=${action}`, params)
    }
}
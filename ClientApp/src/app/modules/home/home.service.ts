import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppCommonService } from 'app/shared/services/common-service.service';


@Injectable({ providedIn: 'root' })
export class HomeService {
    constructor(private http: HttpClient,private appCommonService:AppCommonService) {
         
     }
    getMyOEERequest(oEEtype:string,isYearEnd:boolean) {
        return this.appCommonService.HttpGetMethod(`Home/GetMyOEERequest?oEEtype=${oEEtype}&isYearEnd=${isYearEnd}`)
    }
    getPlant() {
        return this.appCommonService.HttpGetMethod('plant/GetAllPlants')
    }
    getLinesByPlant(id: string)
    {
        return this.appCommonService.HttpGetMethod(`Line/GetLinesByPlant/${id}`)
        
    }
    saveOEERequest(params: any,oEEtype:string,isYearEndChange:any) {
     return this.appCommonService.HttpPutMethod(`Home/UpdateMyOEERequest?oEEtype=${oEEtype}&isYearEndChange=${isYearEndChange}`,params)
    }
    approveRejectOEERequest(params: any,oEEtype:string)
    {
        
        return this.appCommonService.HttpPutMethod(`Home/ApproveRejectOEERequest?oEEtype=${oEEtype}`,params)
    }
     //DeleteOEERequest
     DeleteOEERequest(params: any,oeeby:any, oEEtype: string)
     {
         if(oeeby=='pendingOeeRequests')
         {
             let adhocOeeRequestId=params.oeeRequestId
            return this.appCommonService.HttpOEEDeleteMethod(`Home/DeleteAdhocOEERequest?adhocOeeRequestId=${adhocOeeRequestId}`, params)
         }
         else
         {
            return this.appCommonService.HttpOEEDeleteMethod(`Home/DeleteYearEndOEERequest?oEEtype=${oEEtype}`, params)
         }
         
     }
}
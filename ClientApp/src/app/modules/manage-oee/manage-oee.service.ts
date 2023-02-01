import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppCommonService } from 'app/shared/services/common-service.service';


@Injectable({ providedIn: 'root' })
export class ManageOeeService {
    constructor(private http: HttpClient, private appCommonService: AppCommonService) {

    }
    // Get OEE Requests
    getOEERequests(lineId: string, oEEtype: string) {
        return this.appCommonService.HttpGetMethod(`OEE/GetOEERequests?lineId=${lineId}&oEEType=${oEEtype}`)
    }
    // Get all plants
    getAllPlants() {
        return this.appCommonService.HttpGetMethod('plant/GetAllPlants')
    }
    // Get lines by plantId
    getLinesByPlant(plantId: string) {
        return this.appCommonService.HttpGetMethod(`Line/GetLinesByPlant/${plantId}`)

    }
    // Search Product
    searchProduct(searchKeyword: string, lineId: string, oEEtype: string) {
        return this.appCommonService.HttpGetMethod(`oee/SearchProduct?searchKeyword=${searchKeyword}&lineId=${lineId}&oEEType=${oEEtype}`);
    }
    // Add OEE request 
    addOEERequest(params: any, oEEtype: string, isYearEndChange: any) {
        return this.appCommonService.HttpPutMethod(`oeebysup/AddOEERequest?oEEtype=${oEEtype}&isYearEndChange=${isYearEndChange}`, params)
    }
    // Update OEE request 
    updateOEERequest(params: any, oEEtype: string, isYearEndChange: any) {
        return this.appCommonService.HttpPutMethod(`oeebysup/UpdateOEERequest?oEEtype=${oEEtype}&isYearEndChange=${isYearEndChange}`, params)
    }
    //DeleteOEERequest
    DeleteOEERequest(oeeby:any,params: any, oEEtype: string, removePendingRequestToo: any)
    {
        return this.appCommonService.HttpOEEDeleteMethod(`${oeeby}/DeleteOEERequest?oEEtype=${oEEtype}&removePendingRequestToo=${removePendingRequestToo}`, params)
    }

}
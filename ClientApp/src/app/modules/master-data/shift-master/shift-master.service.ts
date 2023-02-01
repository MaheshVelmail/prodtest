import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppCommonService } from 'app/shared/services/common-service.service';

@Injectable({ providedIn: 'root' })
export class ShiftMasterService {
    constructor(private http: HttpClient,private appCommonService:AppCommonService) {
         
     }

     GetAllPlantShifts() {
        return this.appCommonService.HttpGetMethod(`shift/GetAllPlantShifts?includeinactive=${true}`)
    }
    getShiftbyLineId(lineId:any,includeinactive:any) {
        return this.appCommonService.HttpGetMethod(`shift/GetAvailableShifts?lineId=${lineId}&includeinactive=${includeinactive}`)
    }
    getPlantList() {
        return this.appCommonService.HttpGetMethod('plant/GetAllPlants')
    }
    getTimeZoneList()
    {
        return this.appCommonService.HttpGetMethod('plant/GetTimezones') 
    }
    //insertUpdate
    addPlantShift(params: any) {
        return this.appCommonService.HttpPutMethod('shift/AddPlantShift', params)
    }
    updatePlantShift(params: any) {
        return this.appCommonService.HttpPutMethod('shift/UpdatePlantShift', params)
    }
    delete(plantshiftid: string) {
       return this.appCommonService.HttpDeleteMethod(`shift/DeletePlantShift/${plantshiftid}`)
    }
    getLinesByPlant(id: any)
    {
        return this.appCommonService.HttpGetMethod(`Line/GetLinesByPlant/${id}`)
        
    }
}
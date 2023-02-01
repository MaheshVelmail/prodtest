import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppCommonService } from 'app/shared/services/common-service.service';

@Injectable({ providedIn: 'root' })
export class ProductionrunService {
    constructor(private http: HttpClient,private appCommonService:AppCommonService) {
         
     }
    getAll(id:string, oEEtype:string) {
        return this.appCommonService.HttpGetMethod(`oee/GetOEERequests?lineId=${id}&oEEType=${oEEtype}`)
    }
    getPlant() {
        return this.appCommonService.HttpGetMethod('plant/GetAllPlants')
    }
    getLinesByPlant(id: any)
    {
        return this.appCommonService.HttpGetMethod(`Line/GetLinesByPlant/${id}`)
        
    }
    save(params: any,oEEtype:string,isYearEndChange:any) {
     return this.appCommonService.HttpPutMethod(`Product/SaveProducts?oEEtype=${oEEtype}&isYearEndChange=${isYearEndChange}`,params)
    }
    searchProduct(searchKeyword:string,id:string, oEEtype:string){
        return  this.appCommonService.HttpGetMethod(`oee/SearchProduct?searchKeyword=${searchKeyword}&lineId=${id}&oEEType=${oEEtype}`); 
    }
    loadProdRun(plantId:any,lineId:any,runDate:any,shitId:any)
    {
        return this.appCommonService.HttpGetMethod(`ProdRun/GetProdRunData?plantId=${plantId}&lineId=${lineId}&runDate=${runDate}&shitId=${shitId}`) 
    }
    GetProductBySKU(lineId:any,sku:any){
        return  this.appCommonService.HttpGetMethod(`ProdRun/GetProductBySKU?lineId=${lineId}&sku=${sku}`); 
    }
    getTypes()
    {
        return this.appCommonService.HttpGetMethod('DowntimeReasonType/GetDowntimeReasonTypes')
    }
    GetAllDownTimeReasonTypesByLineType(lineType:any)
    {
        return this.appCommonService.HttpGetMethod(`DowntimeReasonType/GetAllDownTimeReasonTypesByLineType?lineType=${lineType}`)
    }
    
    getReasonCode(typeId:any)
    {
        return this.appCommonService.HttpGetMethod(`DowntimeReasonCode/GetDowntimeReasonCodesByType?downtimeReasonTypeId=${typeId}`)
    }
    getReasonDetail(downtimeReasonCodeId:any)
    {
        return this.appCommonService.HttpGetMethod(`DowntimeReasonDetail/GetDowntimeReasonDetailsByCode?downtimeReasonCodeId=${downtimeReasonCodeId}`)
    }

    getAllReasonCodes() {
        return this.appCommonService.HttpGetMethod('DowntimeReasonCode/GetDowntimeReasonCodes')
    }
	
    getAllReasonDetails() {
        return this.appCommonService.HttpGetMethod('DowntimeReasonDetail/GetDowntimeReasonDetails')
    }
    addProductRun(params: any)
    {
        return this.appCommonService.HttpPutMethod(`ProdRun/AddProductRun`,params)
    }
    updateProductRun(params: any)
    {
        return this.appCommonService.HttpPutMethod(`ProdRun/UpdateProductRun`,params)
    }
    getShiftbyLineId(lineId:any) {
        return this.appCommonService.HttpGetMethod(`shift/GetShifts?lineId=${lineId}`)
    }
     //Delete ProdRun
    deleteProdRun(params: any)
     {
         return this.appCommonService.HttpProdRunDeleteMethod(`ProdRun/DeleteProdRun`, params)
     }
}
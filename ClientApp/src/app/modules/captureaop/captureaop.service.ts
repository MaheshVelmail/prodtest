import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppCommonService } from 'app/shared/services/common-service.service';


@Injectable({ providedIn: 'root' })
export class CaptureaopService {
    constructor(private http: HttpClient,private appCommonService:AppCommonService) {
         
     }
     GetAllAOP(plantid:any, year:any,month:any) {
        return this.appCommonService.HttpGetMethod(`AOP/GetAllAOP?plantid=${plantid}&year=${year}&month=${month}`)
    }
    GetAOPVolumeForExport(year:any) {
        return this.appCommonService.HttpGetMethod(`AOP/GetAOPVolumeForExport?year=${year}`)
    }
    getPlant() {
        return this.appCommonService.HttpGetMethod('plant/GetAllPlants')
    }
    addAOP(params: any) {
        return this.appCommonService.HttpPutMethod('AOP/addAOP', params)
    }
    updateAOP(params: any) {
        return this.appCommonService.HttpPutMethod('AOP/updateAOP', params)
    }
    searchSuperPackage(plantId:any,year:any,superpackage:any,isAddNewRecord:any){
        return  this.appCommonService.HttpGetMethod(`AOP/SearchAOP?plantId=${plantId}&year=${year}&superpackage=${superpackage}&isAddNewRecord=${isAddNewRecord}`); 
    }
    getAopVolume(plantId:any,year:any,superPackage:any, productCode:any,fillLastYearData:any){
        return  this.appCommonService.HttpGetMethod(`AOP/getAopVolume?plantId=${plantId}&year=${year}&superPackage=${superPackage}&productCode=${productCode}&fillLastYearData=${fillLastYearData}`); 
    }
    searchAopVolume(plantId:any,year:any, searchKeyword:any){
        return  this.appCommonService.HttpGetMethod(`AOP/SearchAOP?plantId=${plantId}&year=${year}&searchKeyword=${searchKeyword}`); 
    }
}
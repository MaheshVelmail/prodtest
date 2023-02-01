import { Injectable } from '@angular/core';
import { AppCommonService } from 'app/shared/services/common-service.service';

@Injectable({ providedIn: 'root' })
export class PlantMasterService {
constructor(private appCommonService:AppCommonService){

}
    getAllPlants(){      
      return this.appCommonService.HttpGetMethod(`plant/GetAllPlants?includeinactive=${true}`);
    }
    deletePlant(id){
      return this.appCommonService.HttpDeleteMethod('Plant/DeletePlant/'+id);
    }
    getPlantType(){
      return this.appCommonService.HttpGetMethod('Plant/GetPlantTypes');
    }
    getAllDevision(){
      return this.appCommonService.HttpGetMethod('division/GetAllDivision');
    }
    getRegionbyId(divisionid:any){
      return this.appCommonService.HttpGetMethod(`region/GetAllRegion?divisionid=${divisionid}`);
    }
    insert(params: any) {
      return this.appCommonService.HttpPutMethod('Plant/AddPlant', params)
    }

    update(params: any) {
      return this.appCommonService.HttpPutMethod('Plant/UpdatePlant', params);
    }
    getTimeZoneList()
    {
        return this.appCommonService.HttpGetMethod('plant/GetTimezones') 
    }
    searchUser(searchKeyword){
      return  this.appCommonService.HttpGetMethod('User/SearchUser?searchKeyword='+searchKeyword);
  }
}
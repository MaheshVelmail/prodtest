import { Injectable } from '@angular/core';
import { AppCommonService } from 'app/shared/services/common-service.service';

@Injectable({ providedIn: 'root' })
export class UserMasterService {
constructor(private appCommonService:AppCommonService){

}
    getLoggedInUser(GSN:any){         
     return  this.appCommonService.HttpGetAuthenticate(`User/Authenticate?GSN=${GSN}`,GSN);
    }
    
    getUsers(){
        return  this.appCommonService.HttpGetMethod('User/GetUsers');
    }
    deleteUser(selectedUserId){
        return  this.appCommonService.HttpDeleteMethod('User/DeleteUser/'+selectedUserId);
    }
    searchUser(searchKeyword){
        return  this.appCommonService.HttpGetMethod('User/SearchUser?searchKeyword='+searchKeyword);
    }
    getGroups(){
        return  this.appCommonService.HttpGetMethod('User/GetGroups');
    }
    getAllPlants(){      
        return this.appCommonService.HttpGetMethod('plant/GetAllPlants');
      }
    addUser(selUser:any){
        return this.appCommonService.HttpPutMethod('User/AddUser', selUser)
    }
    updateUser(selUser:any){
        return this.appCommonService.HttpPutMethod('User/UpdateUser', selUser)
    }
}
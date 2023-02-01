import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { OktaAuthService } from '@okta/okta-angular';
import { UserMasterService } from 'app/modules/master-data/user-master/user-master.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { ProductionTrackerStorageService } from './production-tracker-storage-service.service';

@Injectable({
    providedIn: 'root'
  })
export class RoleGuard implements CanActivate{
    public userInfo:any;
    visibility: BehaviorSubject<boolean>;
    isAuthenticated: boolean=false;
    OktaUserGSN:any;
    constructor(public oktaAuth: OktaAuthService,private _router: Router,public storageService:ProductionTrackerStorageService,private userInfoService:UserMasterService
        ){

      //   if(this.storageService.getLocalStorage('LoggedInUserInfo')==null){
      //        this.getLoggedInUserDetail(this.OktaUserGSN);
        
      // }
    }
    async canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
      const authenticated = await this.oktaAuth.isAuthenticated();
      if (authenticated) { 
        const userClaims = await this.oktaAuth.getUser();
        console.log('OktaUserInfo',userClaims)
        if(userClaims!=undefined)
        {
          let userGSN=userClaims['preferred_username']
          this.OktaUserGSN=userGSN.split('@')[0];
        }
       
        if(this.storageService.getLocalStorage('LoggedInUserInfo')==null){
          
          return this.getLoggedInUserDetail(this.OktaUserGSN).then(res =>  this.checkingAccess(state));
       } else{
       return this.checkingAccess(state);
       } 
      }  
      else
      {
        this._router.navigate(['notauthorized'],{ state: { title: 'You are not authorized to access this site, Please contact OKTA Team.' } })
      }   
    }
    getLoggedInUserDetail(userGsn){
         return new Promise<void>((resolve, reject) => {
            this.userInfoService.getLoggedInUser(userGsn).subscribe(userdata=>{
                if(userdata.data!=null)
                {
                this.storageService.removeLocalStorage('LoggedInUserInfo');
                this.storageService.setLocalStorage('LoggedInUserInfo',userdata.data);
                resolve();
                }
                else
                {
                  
                   this._router.navigate(['notauthorized'],{ state: { title: userdata.message } })
                }
              }, error => {console.log('authenticate',error)});
        });
     }
     validateRoueurl(state:any)
     {
         let isMatch=false
        this.userInfo = this.storageService.getLocalStorage('LoggedInUserInfo'); 
        if(this.userInfo != null){
           this.userInfo.navigations.forEach(elementparent => {
              if(elementparent.children.length>0){
              elementparent.children.forEach(child=>{
                  if(child.route.indexOf(state.url)>-1 && child.canV===true){
                    isMatch= true;
                  }
               })
              } else{
                  if(elementparent.route.indexOf(state.url)>-1 && elementparent.canV===true){
                    isMatch= true;
                  }
              }
            });
        }
         return isMatch
     }
     checkingAccess(state){
        let ismatch: any = false;
        this.visibility = new BehaviorSubject(true);
        if(this.storageService.getLocalStorage('LoggedInUserInfo')!=null){
            ismatch=  this.validateRoueurl(state)
          }
          if(!ismatch) {
          let message='You do not have access to this site. Please contact administrator to request the access.'
          this._router.navigate(['notauthorized'],{ state: { title: message } })
          }  
          this.visibility = new BehaviorSubject(false);          
          return ismatch;
     }
     setLoaderVisibility() {
         return false;
     }
}
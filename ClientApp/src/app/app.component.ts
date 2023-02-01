import {Component,OnInit,ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { DEFAULT_INTERRUPTSOURCES, Idle } from '@ng-idle/core';
import { Keepalive } from '@ng-idle/keepalive';
import { OktaAuthService } from '@okta/okta-angular';
import { BsModalRef, ModalDirective } from 'ngx-bootstrap/modal';
import { BehaviorSubject } from 'rxjs';
import { RoleGuard } from './shared/services/auth-guard.service';
import { ProductionTrackerStorageService } from './shared/services/production-tracker-storage-service.service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  idleState = 'Not started.';
    timedOut = false;
    lastPing?: Date = null;
    title = 'angular-idle-timeout';
    public modalRef: BsModalRef;
    public sessionAlertTitle: string = 'Session Alert!!';
    public logoutClass: string= 'hideBtn';
    public stayClass: string= 'displayBtn';
    visibility: BehaviorSubject<boolean>;
    userDataAvailable:boolean
    @ViewChild('childModal', { static: false }) childModal: ModalDirective;
 constructor( public oktaAuth: OktaAuthService,public routes: Router, private idle: Idle, keepalive: Keepalive,private storageService:ProductionTrackerStorageService,
  public guardservice:RoleGuard) {
    this.getBrowserDetails()
    idle.setIdle(28800); // in seconds (8 hrs)
    idle.setTimeout(3600); // in seconds (1 hr)
    idle.setInterrupts(DEFAULT_INTERRUPTSOURCES);

    idle.onIdleEnd.subscribe(() => {
    this.idleState = 'Please click on Stay to continue your session!'; 
    this.logoutClass = 'hideBtn';
    this.stayClass = 'displayBtn';
  });
    idle.onTimeout.subscribe(() => {
      this.idleState = 'Session Expired! Please click on Logout to proceed further!';
      this.timedOut = true;
      this.logoutClass = 'displayBtn';
      this.stayClass = 'hideBtn';
    });
    idle.onIdleStart.subscribe(() =>{
      this.idleState = 'Session Alert!'
      this.childModal.show();   
    } );
    idle.onTimeoutWarning.subscribe((countdown) => {
        this.idleState = 'Your session will expire in ' + this.fmtMSS(countdown) + ' seconds. Please click on Stay to continue your session!';
        this.logoutClass = 'hideBtn';
        this.stayClass = 'displayBtn';
    });
    // sets the ping interval to 15 seconds
    keepalive.interval(15);
    keepalive.onPing.subscribe(() => this.lastPing = new Date());
    this.reset();
    this.clearLocalStorage();
 }
 getBrowserDetails()
 {

  const isIE = /msie\s|trident\//i.test(window.navigator.userAgent)
  if(isIE)
  {
    window.location.href = '/assets/iEBrowserAlert/iEAlertPage.html';
  }
 }
 clearLocalStorage(){
  this.storageService.removeLocalStorage('LoggedInUserInfo');
//   this.routes.navigate(['home'])
   //this.login()
}
// async login() {
//   await this.oktaAuth.signInWithRedirect();
// }
 getvalue(value){
   
  this.visibility = new BehaviorSubject(value);
 }
    reset() {
      this.idle.watch();
      this.timedOut = false;
    }
    hideChildModal(): void {
      this.childModal.hide();
    }
    stay() {
      this.childModal.hide();
      this.reset();
    }
    logout() {
      this.childModal.hide();
      this.timedOut = true;
     this.storageService.removeLocalStorage('LoggedInUserInfo');
      window.location.href = '/assets/logoutPg/logoutPage.html';
    }
    fmtMSS(s: number) {
	    return ( s- ( s %= 60))/60 + ( 9 < s ? ':':':0') + s ;
   }  
}
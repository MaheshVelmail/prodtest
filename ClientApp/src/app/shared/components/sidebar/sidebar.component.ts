import { Component, ElementRef, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { UserMasterService } from 'app/modules/master-data/user-master/user-master.service';
import { NavItem } from 'app/shared/models/nav-item';
import { NavService } from 'app/shared/services/nav.service';
import { ProductionTrackerStorageService } from 'app/shared/services/production-tracker-storage-service.service';

declare const $: any;


@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class SidebarComponent implements OnInit {
  @ViewChild('appDrawer') appDrawer: ElementRef;
  
   menu:any[];  
   navItems:NavItem[];
   plantusergroupabbr='PU';
   LoggedInUserInfo:any;
  constructor(private navService: NavService,private userInfoService:UserMasterService,public storageService:ProductionTrackerStorageService) { 
    this.LoggedInUserInfo=this.storageService.getLocalStorage('LoggedInUserInfo')
    }

  ngOnInit() {
    this.navItems=this.LoggedInUserInfo.navigations;
    let groupAbbr = this.LoggedInUserInfo.groupAbbr;
    if (groupAbbr == this.plantusergroupabbr) {
      this.menu = this.navItems.filter(item=>item.navId!=1);
    }
    else {
      this.menu = this.navItems;
    }

  }
  ngAfterViewInit() {
    this.navService.appDrawer = this.appDrawer;
  }
  isMobileMenu() {
      if ($(window).width() > 991) {
          return false;
      }
      return true;
  }
}

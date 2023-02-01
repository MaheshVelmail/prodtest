import { Location } from '@angular/common';
import { Component, ElementRef, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserMasterService } from 'app/modules/master-data/user-master/user-master.service';
import { AppCommonService } from 'app/shared/services/common-service.service';
import { ProductionTrackerStorageService } from 'app/shared/services/production-tracker-storage-service.service';
import { OktaAuthService } from '@okta/okta-angular';

@Component({
    selector: 'app-navbar',
    templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.component.css']
})

export class NavbarComponent implements OnInit {
    oktaUSerName:any
    location: Location;
    mobile_menu_visible: any = 0;
    private toggleButton: any;
    private sidebarVisible: boolean;
    public userInfo: any;
    public userDisplayName: string = 'Loading...';
    LoggedInUserInfo:any;
    isAuthenticated: boolean=false;
    userName : string=  ""
    constructor(public oktaAuth: OktaAuthService,private appCommonService: AppCommonService, location: Location, private element: ElementRef, private router: Router,
        public storageService: ProductionTrackerStorageService, private userInfoService: UserMasterService) {
        this.location = location;
        this.LoggedInUserInfo= this.storageService.getLocalStorage('LoggedInUserInfo')
        this.sidebarVisible = false;
        this.setDisplayName();
    }
    setDisplayName() {
        if (this.LoggedInUserInfo != null) {
            this.userDisplayName = this.LoggedInUserInfo.displayname;
        } else {
            this.getLoggedInUserDetail();
        }
    }   
     ngOnInit() {
        const navbar: HTMLElement = this.element.nativeElement;
        this.toggleButton = navbar.getElementsByClassName('navbar-toggler')[0];
        this.router.events.subscribe((event) => {
            this.sidebarClose();
            var $layer: any = document.getElementsByClassName('close-layer')[0];
            if ($layer) {
                $layer.remove();
                this.mobile_menu_visible = 0;
            }
        });
    }
    getLoggedInUserDetail() {
            this.userDisplayName = this.LoggedInUserInfo.displayname;
    }
    sidebarOpen() {
        const toggleButton = this.toggleButton;
        const body = document.getElementsByTagName('body')[0];
        setTimeout(function () {
            toggleButton.classList.add('toggled');
        }, 500);

        body.classList.add('nav-open');

        this.sidebarVisible = true;
    }
    sidebarClose() {
        const body = document.getElementsByTagName('body')[0];
        this.toggleButton.classList.remove('toggled');
        this.sidebarVisible = false;
        body.classList.remove('nav-open');
    }
    sidebarToggle() {
        var $toggle = document.getElementsByClassName('navbar-toggler')[0];

        if (this.sidebarVisible === false) {
            this.sidebarOpen();
        } else {
            this.sidebarClose();
        }
        const body = document.getElementsByTagName('body')[0];

        if (this.mobile_menu_visible == 1) {
            body.classList.remove('nav-open');
            if ($layer) {
                $layer.remove();
            }
            setTimeout(function () {
                $toggle.classList.remove('toggled');
            }, 400);

            this.mobile_menu_visible = 0;
        } else {
            setTimeout(function () {
                $toggle.classList.add('toggled');
            }, 430);

            var $layer = document.createElement('div');
            $layer.setAttribute('class', 'close-layer');


            if (body.querySelectorAll('.main-panel')) {
                document.getElementsByClassName('main-panel')[0].appendChild($layer);
            } else if (body.classList.contains('off-canvas-sidebar')) {
                document.getElementsByClassName('wrapper-full-page')[0].appendChild($layer);
            }

            setTimeout(function () {
                $layer.classList.add('visible');
            }, 100);

            $layer.onclick = function () { //asign a function
                body.classList.remove('nav-open');
                this.mobile_menu_visible = 0;
                $layer.classList.remove('visible');
                setTimeout(function () {
                    $layer.remove();
                    $toggle.classList.remove('toggled');
                }, 400);
            }.bind(this);

            body.classList.add('nav-open');
            this.mobile_menu_visible = 1;

        }
    }
    // singnout() {
    //     this.storageService.removeLocalStorage('LoggedInUserInfo');
    //     this.updateUser().subscribe(() => undefined
    //     );

    //     this.router.navigate(['logout']);
    // }
    async singnout() {
         this.storageService.removeLocalStorage('LoggedInUserInfo');
    // this.updateUser().subscribe(() => undefined
    // );
        await this.oktaAuth.signOut();
      }
    updateUser() {
        return this.appCommonService.HttpGetMethod('User/logout')
    }
    async login() {
        await this.oktaAuth.signInWithRedirect();
      }

}

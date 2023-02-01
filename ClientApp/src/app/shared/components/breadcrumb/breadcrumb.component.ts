import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { UserMasterService } from 'app/modules/master-data/user-master/user-master.service';
import { NavItem } from 'app/shared/models/nav-item';
import { ProductionTrackerStorageService } from 'app/shared/services/production-tracker-storage-service.service';

import { distinctUntilChanged, filter } from 'rxjs/operators';


@Component({
  selector: 'app-breadcrumb',
  templateUrl: './breadcrumb.component.html',
  styleUrls: ['./breadcrumb.component.css']
})

export class BreadcrumbComponent implements OnInit {
  public breadcrumbs: IBreadCrumb[];
  navItems: NavItem[];
  displayName: any;
  lastLogin: any;
  groupName: any;
  maintenanceMessage: any;
  LoggedInUserInfo:any;
  constructor(private router: Router, private activatedRoute: ActivatedRoute, private userInfoService: UserMasterService, public storageService: ProductionTrackerStorageService) {
    this.breadcrumbs = this.generateBreadCrumb(this.activatedRoute.root);
    this.LoggedInUserInfo=this.storageService.getLocalStorage('LoggedInUserInfo')
    this.getUserDetails()
    this.maintenanceMessage = this.LoggedInUserInfo.maintenanceMessage;
  }

  ngOnInit() {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      distinctUntilChanged()).subscribe(() => {
        this.breadcrumbs = this.generateBreadCrumb(this.activatedRoute.root);
      });
      this.navItems = this.LoggedInUserInfo.navigations;
      this.breadcrumbs = this.generateBreadCrumb(this.activatedRoute.root);
  }
  getUserDetails() {
    this.displayName = this.LoggedInUserInfo.displayname;
    let lastLogin = this.LoggedInUserInfo.lastLogin;
    this.lastLogin = new DatePipe('en-Us').transform(lastLogin, 'MM/dd/yyyy HH:mm');
    this.groupName = this.LoggedInUserInfo.groupName;
  }
  generateBreadCrumb(route: ActivatedRoute, url: string = '', breadcrumbs: IBreadCrumb[] = []): IBreadCrumb[] {

    let routePath = route.routeConfig ? route.routeConfig.path : '';
    let routeText = '';
    let currentNavigation;
    let newBreadcrumbs: any = [];
    routeText = this.childRoute(routePath, currentNavigation,breadcrumbs)
    ///For default add Home
    breadcrumbs= this.addDefaultRoute(routePath,breadcrumbs)
    // If dynamic route e.g ':id', remove it
    const lastRoutePart = routePath.split('/').pop();
    const isDynamicRoute = lastRoutePart.startsWith(':');
    if (isDynamicRoute && !!route.snapshot) {
      const paramName = lastRoutePart.split(':')[1];
      routePath = routePath.replace(lastRoutePart, route.snapshot.params[paramName]);
      routeText = route.snapshot.params[paramName];
    }

    //In the routeConfig the complete path is not available,
    //so we rebuild it each time
    const nextUrl = routePath ? `${url}/${routePath}` : url;

    const breadcrumb: IBreadCrumb = {
      label: routeText,
      url: nextUrl,
      isClickable: true,
    };

    // Only adding route with non-empty label

    newBreadcrumbs = this.addNonEmptyRouteToBreadCrumb(breadcrumb,breadcrumbs)
    if (route.firstChild) {
      return this.generateBreadCrumb(route.firstChild, nextUrl, newBreadcrumbs);
    }
    return newBreadcrumbs;
  }

  addNonEmptyRouteToBreadCrumb(breadcrumb: any,breadcrumbs:any) {
    let newBreadcrumbs;
    if (breadcrumb.label) {
      let routeExist = breadcrumbs.find(b => b.label == breadcrumb.label);

      if (!routeExist) {
        newBreadcrumbs = breadcrumb.label ? [...breadcrumbs, breadcrumb] : [...breadcrumbs];
      }
      else {
        newBreadcrumbs = breadcrumbs;
      }
    }
    else {
      newBreadcrumbs = breadcrumbs;
    }
    return newBreadcrumbs;
  }
  addDefaultRoute(routePath: any,breadcrumbs:any) {
    if (routePath == '') {
      let routeExist = breadcrumbs.find(b => b.url == "/home");
      if (!routeExist) {
        let homeRoute = this.navItems ? this.navItems.find(n => n.route == "/home") : null;
        if (homeRoute != null) {
          const homeBreadCrumb: IBreadCrumb = {
            label: homeRoute.displayName,
            url: homeRoute.route,
            isClickable: true
          };
          breadcrumbs.push(homeBreadCrumb);
        }
      }
    }
    return breadcrumbs
  }

  childRoute(routePath: any, currentNavigation: any,breadcrumbs:any) {
    if (this.navItems != null && routePath != '') {
      currentNavigation = this.navItems.find(n => n.route == "/" + routePath);
      if (!currentNavigation) {
        this.navItems.forEach(function (parentRoute) {
          let childRouteFound = parentRoute ? parentRoute.children.find(n => n.route == "/" + routePath) : null;
          if (childRouteFound) {
            currentNavigation = childRouteFound;
            const childBCrumb: IBreadCrumb = {
              label: parentRoute.displayName,
              url: parentRoute.children[0].route,
              isClickable: false
            };
            breadcrumbs.push(childBCrumb);
          }
        });
      }
      return currentNavigation ? currentNavigation.displayName : '';
    }
  }
}


export interface IBreadCrumb {
  label: string;
  url: string;
  isClickable: boolean;
}
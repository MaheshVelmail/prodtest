import { Injectable } from '@angular/core';
import { ProductionTrackerStorageService } from './production-tracker-storage-service.service';

@Injectable({
  providedIn: 'root'
})
export class PermissionService {
  currentRouteData: any
  navigationData: any
  constructor(public storageService: ProductionTrackerStorageService) {

  }
  getPermission(routeUrl: any) {
    this.navigationData = this.storageService.getLocalStorage('LoggedInUserInfo').navigations;
    this.currentRouteData = this.navigationData.filter(item => item.route == routeUrl)
    if (this.currentRouteData.length != 0) {
      return this.currentRouteData.filter(item => item !== undefined)
    }
    else {
      this.currentRouteData = this.navigationData.filter(item => item.children.length > 0).map(item => item.children).map((product: any) => {
        return product.find((item) => {
          return item.route == routeUrl;
        });
      })
      return this.currentRouteData.filter(item => item !== undefined)
    }

  }
}
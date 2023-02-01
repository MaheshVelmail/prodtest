import { Inject, Injectable } from '@angular/core';
import { SESSION_STORAGE, StorageService,LOCAL_STORAGE } from 'ngx-webstorage-service';

@Injectable({
    providedIn: 'root'
})
export class ProductionTrackerStorageService{
    currentRouteData: any
    navigationData: any
    constructor(@Inject(SESSION_STORAGE) private sessionStorage: StorageService,
    @Inject(LOCAL_STORAGE) private localStorage: StorageService) {
 
    }
    public setSessionStorage(STORAGE_KEY:string,storageValue:any) {
        this.sessionStorage.set(STORAGE_KEY,storageValue);
    }
    public getSessionStorage(STORAGE_KEY:string) {
        return this.sessionStorage.get(STORAGE_KEY);
       
    }

    public setLocalStorage(STORAGE_KEY:string,storageValue:any) {
        this.localStorage.set(STORAGE_KEY,storageValue);
    }
    public getLocalStorage(STORAGE_KEY:string) {
        return this.localStorage.get(STORAGE_KEY);
    }
    public removeSessionStorage(STORAGE_KEY:string){
        this.sessionStorage.remove(STORAGE_KEY);
    }
    public removeLocalStorage(STORAGE_KEY:string){
        this.localStorage.remove(STORAGE_KEY);
    }
}
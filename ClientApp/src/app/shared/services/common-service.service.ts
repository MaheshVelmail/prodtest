import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'environments/environment';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { ErrorPageService } from '../components/errorPage/errorPage.component.service';
import { ExceptionHandelerService } from './exception-handeler.service';
import { MessageService } from './message.service';
import { ProductionTrackerStorageService } from './production-tracker-storage-service.service';
import { SpinnerService } from './progress-spinner-configurable.service';

@Injectable()
export class AppCommonService {
  userGSN: any;
  LoggedInUserGSN:any;
  constructor(public msgService: MessageService, private http: HttpClient, private exception: ExceptionHandelerService, private spinnerService: SpinnerService,
    private route: Router, private errorService: ErrorPageService, private storageService: ProductionTrackerStorageService) {
  }

  public _webapi: string = environment.apiUrl
  public result: any;
  catchError(error: any, url: any,gsn:any) {
    let errorMessage = error.error.message
    this.spinnerService.hide();
    this.msgService.displayFailedMessage(errorMessage);
    this.exception.logException(this._webapi + url, error, gsn);
    this.route.navigate(['error']);
    return throwError('Something went wrong!');
  }
  public HttpGetAuthenticate(url: string,gsn:string): Observable<any> {
    this.storageService.removeLocalStorage('getLoggedInUsergsn')
    this.storageService.setLocalStorage('getLoggedInUsergsn',gsn)
    return this.http
      .get(this._webapi + url).pipe(
        map((data: any) => {
          this.result = data;
          return this.result;
        }), catchError(error => {
          return this.catchError(error, url,gsn);
        })
      );
  }
  public HttpGetMethod(url: string): Observable<any> {
    this.LoggedInUserGSN=this.storageService.getLocalStorage('getLoggedInUsergsn')
    const httpOptions = {
      headers: new HttpHeaders({'Content-Type':'application/json','LoggedInUserGSN': this.LoggedInUserGSN})
    };
    return this.http
      .get(this._webapi + url, { headers: httpOptions.headers }).pipe(
        map((data: any) => {
          this.result = data.data;
          return this.result;
        }), catchError(error => {
          return this.catchError(error, url,this.LoggedInUserGSN);
        })
      );
  }
  public HttpDeleteMethod(url: string): Observable<any> {
    this.LoggedInUserGSN=this.storageService.getLocalStorage('getLoggedInUsergsn')
    const httpOptions = {
      headers: new HttpHeaders({'Content-Type':'application/json','LoggedInUserGSN': this.LoggedInUserGSN})
    };
    return this.http
      .delete(this._webapi + url, { headers: httpOptions.headers }).pipe(
        map((deleteData: any) => {
          this.result = deleteData.data;
          if(this.result!=-1)
          {
            this.msgService.displaySuccessMessage(deleteData.message);
          }
          else
          {
            this.msgService.displayFailedMessage(deleteData.message)
          }
          return this.result;
        }), catchError(error => {
          return this.catchError(error, url,this.LoggedInUserGSN);
        })
      );
  }
  public HttpPutMethod(url: string, postdata: any): Observable<any> {
    this.LoggedInUserGSN=this.storageService.getLocalStorage('getLoggedInUsergsn')
    const httpOptions = {
      headers: new HttpHeaders({'Content-Type':'application/json','LoggedInUserGSN': this.LoggedInUserGSN})
    };
    return this.http
      .put(this._webapi + url, postdata,{ headers: httpOptions.headers }).pipe(
        map((putData: any) => {
          this.result = putData.data;
          if(this.result!=-1)
          {
            this.msgService.displaySuccessMessage(putData.message);
          }
          else
          {
            this.msgService.displayFailedMessage(putData.message)
          }
          return this.result;
        }), catchError(error => {
          return this.catchError(error, url,this.LoggedInUserGSN);
        })
      );
  }
  public HttpOEEDeleteMethod(url: string, postdata: any): Observable<any> {
    this.LoggedInUserGSN=this.storageService.getLocalStorage('getLoggedInUsergsn')
    const httpOptions = {
      headers: new HttpHeaders({'Content-Type':'application/json','LoggedInUserGSN': this.LoggedInUserGSN})
    };
    return this.http
      .put(this._webapi + url,postdata,{ headers: httpOptions.headers }).pipe(
        map((data: any) => {
          this.result = data;
          return this.result;
        }), catchError(error => {
          return this.catchError(error, url,this.LoggedInUserGSN);
        })
      );
  }
  public HttpProdRunDeleteMethod(url: string, postdata: any): Observable<any> {
    this.LoggedInUserGSN=this.storageService.getLocalStorage('getLoggedInUsergsn')
    const httpOptions = {
      headers: new HttpHeaders({'Content-Type':'application/json','LoggedInUserGSN': this.LoggedInUserGSN})
    };
    return this.http
      .put(this._webapi + url, postdata,{ headers: httpOptions.headers }).pipe(
        map((data: any) => {
          this.result = data;
          if(this.result!=-1)
          {
            this.msgService.displaySuccessMessage(data.message);
          }
          else
          {
            this.msgService.displayFailedMessage(data.message)
          }
          return this.result;
        }), catchError(error => {
          return this.catchError(error, url,this.LoggedInUserGSN);
        })
      );
  }
}

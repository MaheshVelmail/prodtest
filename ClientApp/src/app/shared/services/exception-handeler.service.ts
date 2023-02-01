import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from 'environments/environment';
import { ErrorPageService } from '../components/errorPage/errorPage.component.service';
import { ExceptionModal } from '../models/ExceptionModal';
import { SpinnerService } from './progress-spinner-configurable.service';


@Injectable({
  providedIn: 'root'
})
export class ExceptionHandelerService {

  constructor(private http: HttpClient, private spinnerService:SpinnerService,private errorService:ErrorPageService,
    private route:Router) { }
  public _webapi:string=environment.apiUrl
  public _logExceptionURL:string='Logger/LogException'
  
  logException(methodName:string,exception:string,loggedUserGSN:string){
    let exceptionObject={
      exceptionObject:methodName,exception:exception,loggedUserGSN:loggedUserGSN
    };
    this.insertinDB(exceptionObject);
  }
  insertinDB(postdata:any){
    

    const exMod:ExceptionModal={
      errorType:postdata.status.toString(),
      message:postdata.message,
      exception:postdata.statusText,
      request:postdata.url,
      filename:'',
      response:''
    }      
        this.http.put(this._webapi + this._logExceptionURL,exMod)
         .subscribe(() => undefined);
          this.errorService.setErrorDetails(postdata);
          this.route.navigateByUrl('/errorPage');
  }
}


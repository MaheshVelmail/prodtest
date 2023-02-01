import { Injectable} from '@angular/core';

@Injectable({
    providedIn: 'root'
})

export class ErrorPageService{
    public statusCode:any;
    public errorText:any;
    public errorMsg:any;
     setErrorDetails(error){
       this.statusCode=error.status;
       this.errorText=error.statusText;
       this.errorMsg=error.error.message;
    }
}
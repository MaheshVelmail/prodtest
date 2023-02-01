import { AfterViewInit, Component, Renderer2 } from '@angular/core';
import { ErrorPageService } from './errorPage.component.service';


@Component({
    selector: 'errorPage',
    styleUrls: ['./errorPage.component.css'],
    templateUrl: './errorPage.component.html'
  
  }) 
  export class ErrorPageComponent implements AfterViewInit{
    public statusCode:any;
    public errorText:any;
    public errorMsg:any;
    constructor(private renderer: Renderer2,private errorService:ErrorPageService){
        this.statusCode=errorService.statusCode;
        this.errorText=errorService.errorText;
        this.errorMsg=errorService.errorMsg;
    }
    ngAfterViewInit() {
      let loader = this.renderer.selectRootElement('#loader');
      this.renderer.setStyle(loader, 'display', 'none');
    
  }
  }
import { AfterViewInit, Component, Renderer2} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductionTrackerStorageService } from 'app/shared/services/production-tracker-storage-service.service';

@Component({
    selector: 'app-notauthorized',
    templateUrl: './notauthorized.component.html',
    styleUrls: ['./notauthorized.component.css']
  
  }) 
  export class NotauthorizedComponent implements AfterViewInit{
    message:string;
    NoAccessMessage:boolean
    constructor( private renderer: Renderer2,private router: Router,private route: ActivatedRoute,public storageService:ProductionTrackerStorageService,){
      this.message=this.router.getCurrentNavigation().extras.state.title
      if(this.message=="NoAccessMessage")
      {
      this.NoAccessMessage=true;
      }
    }
    ngAfterViewInit() {
      let loader = this.renderer.selectRootElement('#loader');
      this.renderer.setStyle(loader, 'display', 'none');
    
  }
    clearLocalStorage(){
      this.storageService.removeLocalStorage('LoggedInUserInfo');
      window.location.href = '/';
  }
  }
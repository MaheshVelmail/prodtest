import { AfterViewInit, Component, Renderer2 } from '@angular/core';
import 'rxjs/add/operator/filter';

@Component({
  selector: 'app-dashboard-layout',
  templateUrl: './dashboard-layout.component.html',
  styleUrls: ['./dashboard-layout.component.scss']
})
export class DashboardLayoutComponent implements AfterViewInit{

  constructor( private renderer: Renderer2){}
  ngAfterViewInit() {
    let loader = this.renderer.selectRootElement('#loader');
    this.renderer.setStyle(loader, 'display', 'none');
  
}
}

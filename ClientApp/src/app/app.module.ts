import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { NgIdleKeepaliveModule } from '@ng-idle/keepalive'; // this includes the core NgIdleModule but includes keepalive providers for easy wireup
import { MomentModule } from 'angular2-moment'; // optional, provides moment-style pipes for date formatting
import { ComponentLoaderFactory } from 'ngx-bootstrap/component-loader';
import { BsModalService, ModalModule } from 'ngx-bootstrap/modal';
import { PositioningService } from 'ngx-bootstrap/positioning';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app.routing';
import { DashboardLayoutComponent } from './modules/dashboard/dashboard-layout.component';
import { BreadcrumbComponent } from './shared/components/breadcrumb/breadcrumb.component';
import { ComponentsModule } from './shared/components/components.module';
import { ErrorPageComponent } from './shared/components/errorPage/errorPage.component';
import { MenuListItemComponent } from './shared/components/menu-list-item/menu-list-item.component';
import { NavbarComponent } from './shared/components/navbar/navbar.component';
import { NotauthorizedComponent } from './shared/components/notauthorized/notauthorized.component';
import { SidebarComponent } from './shared/components/sidebar/sidebar.component';
import { AppCommonService } from './shared/services/common-service.service';
import { ExcelService } from './shared/services/excel.service';
import { ExceptionHandelerService } from './shared/services/exception-handeler.service';
import { NavService } from './shared/services/nav.service';
import {environment} from '../environments/environment';
import { LocationStrategy, Location, PathLocationStrategy } from '@angular/common';
import {
  OKTA_CONFIG,
  OktaAuthModule} from '@okta/okta-angular';
const oktaConfig = { 
  issuer:environment.issuer,
  clientId:environment.clientId,                      // '0oa15pnccvrzD7nqc5d7', '0oa10ga7jckqHoG0q0h8',
  redirectUri:environment.redirectUri,     //window.location.origin + '/login/callback'
}
@NgModule({
  imports: [
    BrowserAnimationsModule,
    HttpClientModule,
    ComponentsModule,
    RouterModule,
    AppRoutingModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule,
    MatMenuModule,
    MatSnackBarModule,
    NgIdleKeepaliveModule.forRoot(),
    MomentModule,
    MatDialogModule,
    ModalModule,
    OktaAuthModule
    
  ],
  declarations: [
    AppComponent,
    DashboardLayoutComponent,
    SidebarComponent,
    MenuListItemComponent,
    NavbarComponent,
    NotauthorizedComponent,
    ErrorPageComponent,
    BreadcrumbComponent
  ],
  providers: [{ provide: OKTA_CONFIG, useValue: oktaConfig },ExcelService,AppCommonService,ExceptionHandelerService,NavService,BsModalService,ComponentLoaderFactory,PositioningService],
  bootstrap: [AppComponent]
})
export class AppModule { }

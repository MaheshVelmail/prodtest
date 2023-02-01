import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';
import { DashboardLayoutComponent } from './modules/dashboard/dashboard-layout.component';
import { ErrorPageComponent } from './shared/components/errorPage/errorPage.component';
import { LogoutPageComponent } from './shared/components/logout/logoutPage.component';
import { NotauthorizedComponent } from './shared/components/notauthorized/notauthorized.component';
import {
  OktaCallbackComponent,
  OktaLoginRedirectComponent,
  OktaAuthGuard
} from '@okta/okta-angular';
const routes: Routes =[
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  }, 
  {
    path: 'notauthorized',
    component: NotauthorizedComponent
  },
  {
    path: 'error',
    component: ErrorPageComponent
  },
  {
    path:'logout',
    component:LogoutPageComponent
  },

  
  
  {
    path: '',canActivate:[OktaAuthGuard],
    component: DashboardLayoutComponent,
    children: [{
      path: '',
      loadChildren: './modules/dashboard/dashboard-layout.module#DashboardLayoutModule'
    },
  ]
  }, 
 
  {path: 'login/callback',component: OktaCallbackComponent},
  {
    path: 'login',
    component: OktaLoginRedirectComponent
  }, 
];

@NgModule({
  imports: [
    CommonModule,
    BrowserModule,
    RouterModule.forRoot(routes)
//     RouterModule.forRoot(routes,{
//       //useHash: true,
//    //relativeLinkResolution: 'legacy'
// })
  ],
  exports: [
  ],
})
export class AppRoutingModule { }

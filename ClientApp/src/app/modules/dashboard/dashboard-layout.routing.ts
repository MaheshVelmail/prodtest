import { Routes } from '@angular/router';
import { ErrorPageComponent } from 'app/shared/components/errorPage/errorPage.component';
import { RoleGuard } from 'app/shared/services/auth-guard.service';
import { CaptureaopComponent } from '../captureaop/captureaop.component';
import { HomeComponent } from '../home/home.component';
import { ManageByPackageComponent } from '../manage-oee/manage-by-package/manage-by-package.component';
import { ManageBySKUComponent } from '../manage-oee/manage-by-sku/manage-by-sku.component';
import { ManageBysuperpackageComponent } from '../manage-oee/manage-by-superpackage/manage-by-superpackage.component';
import { DivisionMasterComponent } from '../master-data/division-master/division-master.component';
import { DowntimeReasonCodeComponent } from '../master-data/downtime-reason-code/downtime-reason-code.component';
import { DowntimeReasonDetailComponent } from '../master-data/downtime-reason-detail/downtime-reason-detail.component';
import { LineMasterComponent } from '../master-data/line-master/line-master.component';
import { LineTypeDowntimeReasonComponent } from '../master-data/linetype-downtimereason-mapping/linetype-downtimereason.component';
import { PlantMasterComponent } from '../master-data/plant-master/plant-master.component';
import { RegionMasterComponent } from '../master-data/region-master/region-master.component';
import { ShiftComponent } from '../master-data/shift-master/shift-master.component';
import { UserMasterComponent } from '../master-data/user-master/user-master.component';
import { ProductionrunComponent } from '../productionrun/productionrun.component';

export const DashboardLayoutRoutes: Routes = [
    { path: 'line', component: LineMasterComponent, canActivate: [RoleGuard] },
    { path: 'plant', component: PlantMasterComponent , canActivate: [RoleGuard]},
    { path: 'region', component: RegionMasterComponent, canActivate: [RoleGuard] },
    { path: 'division', component: DivisionMasterComponent, canActivate: [RoleGuard] },
    { path: 'downtimereasoncode', component: DowntimeReasonCodeComponent, canActivate: [RoleGuard] },
    { path: 'downtimereasondetail', component: DowntimeReasonDetailComponent, canActivate: [RoleGuard] },
    { path: 'linedowntime', component:LineTypeDowntimeReasonComponent,canActivate: [RoleGuard] },
    { path: 'oeebysku', component: ManageBySKUComponent, canActivate: [RoleGuard] },
    { path: 'oeebypkg', component: ManageByPackageComponent, canActivate: [RoleGuard] },
    { path: 'oeebysup', component: ManageBysuperpackageComponent, canActivate: [RoleGuard] },
    { path: 'errorPage', component: ErrorPageComponent, canActivate: [RoleGuard] },
    { path: 'user', component: UserMasterComponent, canActivate: [RoleGuard] },
    { path: 'shift', component: ShiftComponent , canActivate: [RoleGuard]},
    { path: 'prodrun', component: ProductionrunComponent , canActivate: [RoleGuard]},
    { path: 'aop', component: CaptureaopComponent , canActivate: [RoleGuard]},
    { path: 'home', component: HomeComponent , canActivate: [RoleGuard]}
    
];
    
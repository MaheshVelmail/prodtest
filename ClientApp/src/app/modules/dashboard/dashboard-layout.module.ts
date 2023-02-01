import { CommonModule, DatePipe } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatNativeDateModule, MatRippleModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSortModule } from '@angular/material/sort';
import { MatStepperModule } from '@angular/material/stepper';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterModule } from '@angular/router';
import { AutocompleteLibModule } from 'angular-ng-autocomplete';
import { TextMaskModule } from 'angular2-text-mask';
import { ProgressSpinnerConfigurableExample } from 'app/shared/components/spinner/progress-spinner-configurable';
import { MatTableExporterModule } from 'mat-table-exporter';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { BsModalService, ModalModule } from 'ngx-bootstrap/modal';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { CaptureaopComponent } from '../captureaop/captureaop.component';
import { HomeComponent } from '../home/home.component';
import { ManageByPackageComponent } from '../manage-oee/manage-by-package/manage-by-package.component';
import { ManageBySKUComponent } from '../manage-oee/manage-by-sku/manage-by-sku.component';
import { ManageBysuperpackageComponent } from '../manage-oee/manage-by-superpackage/manage-by-superpackage.component';
import { DivisionMasterComponent } from '../master-data/division-master/division-master.component';
import { DivisionMasterService } from '../master-data/division-master/division-master.service';
import { AddUpdateDowntimeReasonCodeDialogComponent } from '../master-data/downtime-reason-code/downtime-reason-code-dialog/add-update-downtime-reason-code-dialog.component';
import { DeleteDowntimeReasonCodeConfirmDialogComponent } from '../master-data/downtime-reason-code/downtime-reason-code-dialog/delete-downtime-reason-code-confirm-dialog.component';
import { DowntimeReasonCodeComponent } from '../master-data/downtime-reason-code/downtime-reason-code.component';
import { AddUpdateDowntimeReasonDetailDialogComponent } from '../master-data/downtime-reason-detail/downtime-reason-detail-dialog/add-update-downtime-reason-detail-dialog.component';
import { DeleteDowntimeReasonDetailConfirmDialogComponent } from '../master-data/downtime-reason-detail/downtime-reason-detail-dialog/delete-downtime-reason-detail-confirm-dialog.component';
import { DowntimeReasonDetailComponent } from '../master-data/downtime-reason-detail/downtime-reason-detail.component';
import { AddUpdateLineDialogComponent } from '../master-data/line-master/line-master-dialog/add-update-line-dialog.component';
import { DeleteLineConfirmDialogComponent } from '../master-data/line-master/line-master-dialog/delete-line-confirm-dialog.component';
import { LineMasterComponent } from '../master-data/line-master/line-master.component';
import { LineMasterService } from '../master-data/line-master/line-master.service';
import { PlantConfirmDialogComponent } from '../master-data/plant-master/plant-master-dialog/plant-confirm-dialog.component';
import { PlantMasterComponent } from '../master-data/plant-master/plant-master.component';
import { PlantMasterService } from '../master-data/plant-master/plant-master.service';
import { RegionMasterComponent } from '../master-data/region-master/region-master.component';
import { AddShiftDialogComponent } from '../master-data/shift-master/shift-master-dialog/add-shift-dialog.component';
import { DeleteShiftConfirmDialogComponent } from '../master-data/shift-master/shift-master-dialog/delete-shift-confirm-dialog.component';
import { ShiftComponent } from '../master-data/shift-master/shift-master.component';
import { UserMasterComponent } from '../master-data/user-master/user-master.component';
import { ProductionrunComponent } from '../productionrun/productionrun.component';
import { DashboardLayoutRoutes } from './dashboard-layout.routing';
import { MatSelectFilterModule } from 'mat-select-filter';
import { AddUpdatelineTypeDowntimeReasonDialogComponent } from '../master-data/linetype-downtimereason-mapping/linetype-downtimereason-dialog/add-update-linetype-downtimereason-dialog.component';
import { DeleteLineTypeDownTypeReasonConfirmDialogComponent } from '../master-data/linetype-downtimereason-mapping/linetype-downtimereason-dialog/delete-linetype-downtimereason-confirm-dialog.component';
import { LineTypeDowntimeReasonComponent } from '../master-data/linetype-downtimereason-mapping/linetype-downtimereason.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(DashboardLayoutRoutes),
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatRippleModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatTooltipModule,
     MatTableModule,
     MatIconModule,
    MatSortModule,
    MatProgressSpinnerModule,
     MatPaginatorModule,
   // StorageServiceModule,
    MatProgressBarModule,
    ModalModule,
    AutocompleteLibModule,
    NgMultiSelectDropDownModule,
    MatRadioModule,
    MatTabsModule,
    MatExpansionModule,
    NgxMaterialTimepickerModule,
    MatCheckboxModule,
    MatStepperModule,
    MatDatepickerModule,
    MatNativeDateModule,
    TextMaskModule,
    MatTableExporterModule,
    MatDialogModule,
    MatSelectFilterModule
  ],
  declarations: [
    AddUpdateLineDialogComponent,
    AddUpdateDowntimeReasonCodeDialogComponent,
    AddUpdateDowntimeReasonDetailDialogComponent,
    DeleteLineConfirmDialogComponent,
    DeleteDowntimeReasonCodeConfirmDialogComponent,
    DeleteDowntimeReasonDetailConfirmDialogComponent,
    AddUpdatelineTypeDowntimeReasonDialogComponent,
    DeleteLineTypeDownTypeReasonConfirmDialogComponent,
    LineMasterComponent,
    PlantMasterComponent,
    RegionMasterComponent,
    DivisionMasterComponent,
    DowntimeReasonCodeComponent,
    DowntimeReasonDetailComponent,
    LineTypeDowntimeReasonComponent,
    ManageBySKUComponent,
    ManageByPackageComponent,
    ManageBysuperpackageComponent,
    ProgressSpinnerConfigurableExample,
    PlantConfirmDialogComponent,
    UserMasterComponent,
    AddShiftDialogComponent,
    DeleteShiftConfirmDialogComponent,
    HomeComponent,
    ShiftComponent,
    ProductionrunComponent,
    CaptureaopComponent
  ],
  providers: [DatePipe,LineMasterService, PlantMasterService, DivisionMasterService, BsModalService],
  entryComponents: [AddUpdateLineDialogComponent,
    AddUpdateDowntimeReasonCodeDialogComponent, AddUpdateDowntimeReasonDetailDialogComponent,AddUpdatelineTypeDowntimeReasonDialogComponent, DeleteLineConfirmDialogComponent, DeleteDowntimeReasonCodeConfirmDialogComponent, DeleteDowntimeReasonDetailConfirmDialogComponent,DeleteLineTypeDownTypeReasonConfirmDialogComponent]
})

export class DashboardLayoutModule { }

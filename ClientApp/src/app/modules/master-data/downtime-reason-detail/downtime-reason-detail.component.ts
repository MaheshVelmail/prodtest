import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { DownTimeReasonDetailModel } from 'app/shared/models/downtime-reason-detail';
import { ExcelService } from 'app/shared/services/excel.service';
import { PermissionService } from 'app/shared/services/permission-service';
import { SpinnerService } from 'app/shared/services/progress-spinner-configurable.service';
import { AddUpdateDowntimeReasonDetailDialogComponent } from './downtime-reason-detail-dialog/add-update-downtime-reason-detail-dialog.component';
import { DeleteDowntimeReasonDetailConfirmDialogComponent } from './downtime-reason-detail-dialog/delete-downtime-reason-detail-confirm-dialog.component';
import { DowntimeReasonDetailService } from './downtime-reason-detail.service';

@Component({
  selector: 'downtime-reason-detail',
  styleUrls: ['downtime-reason-detail.component.css'],
  templateUrl: 'downtime-reason-detail.component.html',
})
export class DowntimeReasonDetailComponent implements OnInit {
  displayedColumns = ['downtimeReasonDetailDesc','downtimeReasonCodeDesc', 'active', 'action'];
  dataSource: MatTableDataSource<DownTimeReasonDetailModel>;
  region:any;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  permissiondata: any
  canInsert: boolean
  canUpdate: boolean
  canDeleted: boolean
  canView: boolean
  enableExcelImport:boolean
  exportData:any;
  filterValueModel:any=''
  constructor(private excelService:ExcelService,public permissionService: PermissionService,private router:Router,private spinnerService:SpinnerService,private changeDetectorRefs: ChangeDetectorRef,public dialog: MatDialog,private downtimeReasonDetailService :DowntimeReasonDetailService) {
    this.getPermission();
    this.spinnerService.hide();
    this.reloadData();
  }
ngOnInit()
{
  this.reloadData();
}
getPermission()
{
  this.permissiondata=this.permissionService.getPermission(this.router.url)
  this.canInsert = this.permissiondata[0].canI;
  this.canUpdate = this.permissiondata[0].canU;
  this.canDeleted = this.permissiondata[0].canD;
}
reloadData() {
  this.spinnerService.show();
  this.downtimeReasonDetailService.getdowntimereasondetails()
    .subscribe(data => {
      let result = data.map(function(elem) {
        return {
          downtimeReasonDetailId:elem.downtimeReasonDetailId,
          downtimeDetailCode:elem.downtimeDetailCode,
          downtimeReasonDetailDesc:elem.downtimeReasonDetailDesc,
          downtimeReasonCodeId:elem.downtimeReasonCodeId,
          downtimeReasonCodeDesc:elem.downtimeReasonCodeDesc,
          active: elem.active?'Active':'Closed'
        }});
      const downTimeReasonDetail: DownTimeReasonDetailModel[] = result;
      this.exportData=downTimeReasonDetail
      if(downTimeReasonDetail.length>0)
      {
        this.enableExcelImport=true;
      }
      this.dataSource = new MatTableDataSource(downTimeReasonDetail);
      this.applyFilter(this.filterValueModel)
      this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.changeDetectorRefs.detectChanges();
    this.spinnerService.hide();
    }, error => console.log(error));
    
}
  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }
  confirmDeleteDialog(line) {
    const dialogRef = this.dialog.open(DeleteDowntimeReasonDetailConfirmDialogComponent, {
      width: '500px',
      data: line
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result==1)
      {
        this.changeLocation()
      }
    });
   
  }
  addReason() {
    const dialogRef = this.dialog.open(AddUpdateDowntimeReasonDetailDialogComponent, {
      width: '500px',
      data: []
    });

    dialogRef.afterClosed().subscribe(res => {
      if(res==1)
      {
        this.changeLocation()
      }
    });
  }
  changeLocation() {
    this.reloadData();
      this.dialog.closeAll();
}
  editReason(region) {
    const dialogRef = this.dialog.open(AddUpdateDowntimeReasonDetailDialogComponent, {
      width: '500px',
      data: region,
    });
    dialogRef.afterClosed().subscribe(response => {
      if(response==1)
      {
        this.changeLocation()
      }
     
    });
  }
  exportAsXLSX():void {
    this.spinnerService.show();
    let exportData=this.exportData.map(function(elem) {
      return {
        'Downtime Reason Code':elem.downtimeReasonCodeDesc,
        'Downtime Detail Code':elem.downtimeDetailCode,
        'Downtime Reason Detail Desc':elem.downtimeReasonDetailDesc,
        'Active': elem.active=='Active'?'Yes':'No'
      }}
      );
    this.excelService.exportAsExcelFile(exportData, 'DowntimeReasonDetail');
    this.spinnerService.hide();
  }
}



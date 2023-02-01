import { DatePipe } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { DownTimeReasonCodeModel } from 'app/shared/models/downtime-reason-code';
import { ExcelService } from 'app/shared/services/excel.service';
import { PermissionService } from 'app/shared/services/permission-service';
import { SpinnerService } from 'app/shared/services/progress-spinner-configurable.service';
import { AddUpdateDowntimeReasonCodeDialogComponent } from './downtime-reason-code-dialog/add-update-downtime-reason-code-dialog.component';
import { DeleteDowntimeReasonCodeConfirmDialogComponent } from './downtime-reason-code-dialog/delete-downtime-reason-code-confirm-dialog.component';
import { DowntimeReasonCodeService } from './downtime-reason-code.service';


@Component({
  selector: 'downtime-reason-code',
  styleUrls: ['downtime-reason-code.component.css'],
  templateUrl: 'downtime-reason-code.component.html',
})
export class DowntimeReasonCodeComponent implements OnInit {
  displayedColumns = ['downtimeReasonCodeDesc','downtimeReasonTypeDesc', 'active', 'action'];
  dataSource: MatTableDataSource<DownTimeReasonCodeModel>;
  region:any;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  permissiondata: any
  canInsert: boolean
  canUpdate: boolean
  canDeleted: boolean
  canView: boolean
  datenow:any
  enableExcelImport:boolean
  exportData:any
  filterValueModel:any=''
  constructor(private excelService:ExcelService,public datepipe: DatePipe,public permissionService: PermissionService,private router:Router,private spinnerService:SpinnerService,private changeDetectorRefs: ChangeDetectorRef,public dialog: MatDialog,private downtimeReasonCodeService :DowntimeReasonCodeService) {
    this.datenow=this.datepipe.transform(new Date(), 'yyyy/MM/dd');
    this.getPermission();
    this.spinnerService.hide();
    this.reloadData();
  }
ngOnInit()
{
  this.reloadData();
}
reloadData() {
  this.spinnerService.show();
  this.downtimeReasonCodeService.getAll()
    .subscribe(data => {
      let result = data.map(function(elem) {
        return {
          downtimeReasonCodeId:elem.downtimeReasonCodeId,
          downtimeReasonCode:elem.downtimeReasonCode,
          downtimeReasonCodeDesc: elem.downtimeReasonCodeDesc,
          downtimeReasonTypeId:elem.downtimeReasonTypeId,
          downtimeReasonTypeDesc:elem.downtimeReasonTypeDesc,
          active: elem.active?'Active':'Closed'
        }});
      const downTimeReasonCode: DownTimeReasonCodeModel[] = result;
      this.exportData=downTimeReasonCode
      if(downTimeReasonCode.length>0)
      {
        this.enableExcelImport=true;
      }
      this.dataSource = new MatTableDataSource(downTimeReasonCode);
      this.applyFilter(this.filterValueModel)
      this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.changeDetectorRefs.detectChanges();
    this.spinnerService.hide();
    }, error => console.log(error));
    
}
  getPermission()
  {
    this.permissiondata=this.permissionService.getPermission(this.router.url)
    this.canInsert = this.permissiondata[0].canI;
    this.canUpdate = this.permissiondata[0].canU;
    this.canDeleted = this.permissiondata[0].canD;
  }
  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }
  confirmDeleteDialog(line) {
    const dialogRef = this.dialog.open(DeleteDowntimeReasonCodeConfirmDialogComponent, {
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
    const dialogRef = this.dialog.open(AddUpdateDowntimeReasonCodeDialogComponent, {
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
    const dialogRef = this.dialog.open(AddUpdateDowntimeReasonCodeDialogComponent, {
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
        'Downtime Reason Code':elem.downtimeReasonCode,
        'Downtime Reason Code Desc': elem.downtimeReasonCodeDesc,
        'Downtime Reason Type':elem.downtimeReasonTypeDesc,
        'Active': elem.active=='Active'?'Yes':'No'
      }});
    this.excelService.exportAsExcelFile(exportData, 'DowntimeCodes');
    this.spinnerService.hide();
  }
}



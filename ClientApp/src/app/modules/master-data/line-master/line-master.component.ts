import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { LineMasterModel } from 'app/shared/models/line-master';
import { MessageService } from 'app/shared/services/message.service';
import { PermissionService } from 'app/shared/services/permission-service';
import { SpinnerService } from 'app/shared/services/progress-spinner-configurable.service';
import { AddUpdateLineDialogComponent } from './line-master-dialog/add-update-line-dialog.component';
import { DeleteLineConfirmDialogComponent } from './line-master-dialog/delete-line-confirm-dialog.component';
import { LineMasterService } from './line-master.service';

@Component({
  selector: 'line-master',
  styleUrls: ['line-master.component.css'],
  templateUrl: 'line-master.component.html',
})
export class LineMasterComponent implements OnInit {
  displayedColumns = ['lineName', 'lineType', 'plantDesc', 'fillerType', 'active', 'action'];
  dataSource: MatTableDataSource<LineMasterModel>;
  line: any;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  permissiondata: any
  canInsert: boolean
  canUpdate: boolean
  canDeleted: boolean
  canView: boolean
  filterValueModel:any=''
  constructor(public permissionService: PermissionService, public msgService: MessageService, private router: Router, private spinnerService: SpinnerService, private changeDetectorRefs: ChangeDetectorRef, public dialog: MatDialog, private lineMasterService: LineMasterService) {
    this.getPermission();
    this.spinnerService.hide();
    this.reloadData();
  }
  ngOnInit() {
    this.reloadData();
  }
  getPermission() {
    this.permissiondata = this.permissionService.getPermission(this.router.url)
    this.canInsert = this.permissiondata[0].canI;
    this.canUpdate = this.permissiondata[0].canU;
    this.canDeleted = this.permissiondata[0].canD;
  }
  reloadData() {
    this.spinnerService.show();
    this.dialog.closeAll();
    this.lineMasterService.getAll()
      .subscribe(data => {
        let result = data.map(function (elem) {
          return {
            lineId: elem.lineId,
            lineName: elem.lineName,
            lineType: elem.lineType,
            plantName: elem.plantName,
            plantDesc: elem.plantDesc,
            plantId: elem.plantId,
            fillerType: elem.fillerType,
            active: elem.active ? 'Active' : 'Closed'
          }
        });
        const linemaster: LineMasterModel[] = result;
        this.dataSource = new MatTableDataSource(linemaster);
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
    const dialogRef = this.dialog.open(DeleteLineConfirmDialogComponent, {
      width: '500px',
      data: line
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result == 1) {
        this.reloadData();
      }
    });

  }
  addLine() {
    const dialogRef = this.dialog.open(AddUpdateLineDialogComponent, {
      width: '500px',
      data: []
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result == 1) {
        this.changeLocation()
      }
    });
  }
  changeLocation() {

    // save current route first
    this.reloadData();
  }
  editLine(line) {
    const dialogRef = this.dialog.open(AddUpdateLineDialogComponent, {
      width: '500px',
      data: line,
    });
    dialogRef.afterClosed().subscribe(res => {
      if (res == 1) {
        this.changeLocation()
      }
    });
  }
}



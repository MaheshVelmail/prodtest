import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { LineTypeDownTimeReasonModel } from 'app/shared/models/lineType-downtime-reason';
import { MessageService } from 'app/shared/services/message.service';
import { PermissionService } from 'app/shared/services/permission-service';
import { SpinnerService } from 'app/shared/services/progress-spinner-configurable.service';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { AddUpdatelineTypeDowntimeReasonDialogComponent } from './linetype-downtimereason-dialog/add-update-linetype-downtimereason-dialog.component';
import { DeleteLineTypeDownTypeReasonConfirmDialogComponent } from './linetype-downtimereason-dialog/delete-linetype-downtimereason-confirm-dialog.component';
import { LineTypeDowntimeReasonService } from './linetype-downtimereason.service';
@Component({
  selector: 'linetype-downtimereason',
  styleUrls: ['linetype-downtimereason.component.css'],
  templateUrl: 'linetype-downtimereason.component.html',
})
export class LineTypeDowntimeReasonComponent implements OnInit {
  displayedColumns = ['lineType', 'downtimereasonTypeDesc', 'active', 'action'];
  dataSource: MatTableDataSource<LineTypeDownTimeReasonModel>;
  line: any;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  permissiondata: any
  canInsert: boolean
  canUpdate: boolean
  canDeleted: boolean
  canView: boolean
  filterValueModel:any=''
  downTimeReasonTypeIdArray:any=[]
  @ViewChild('confirmModal', { static: false }) confirmModal: ModalDirective;
  popup_downtimereasonTypeIdsDesc:any;
  constructor(public permissionService: PermissionService, public msgService: MessageService, private router: Router, private spinnerService: SpinnerService, private changeDetectorRefs: ChangeDetectorRef, public dialog: MatDialog, private lineTypeDowntimeReasonService: LineTypeDowntimeReasonService) {
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
    this.lineTypeDowntimeReasonService.getAll()
      .subscribe(data => {
        let result = data.map(function (elem) {
          return {
            id: elem.id,
            lineType: elem.lineType,
            downTimeReasonTypeId: elem.downTimeReasonTypeId,
            downtimereasonTypeDesc: elem.downtimereasonTypeDesc + '  ' ,
            active: elem.active ? 'Active' : 'Closed'
          }
          
        }
        );
      let prepare_result = result.map(function (elem) {
        return {
          id: elem.id,
          lineType: elem.lineType,
          downTimeReasonTypeIds: result.filter(item => item.lineType.includes(elem.lineType)).map(item => (item.downTimeReasonTypeId)),
          downtimereasonTypeIdsDesc: result.filter(item => item.lineType.includes(elem.lineType)).map(item => (item.downtimereasonTypeDesc)) ,
          active: elem.active
        }
      });
      let prepare_resultWithUniqueDowntimeReasonType = prepare_result.map(function (elem) {
        return {
          id: elem.id,
          lineType: elem.lineType,
          downTimeReasonTypeIds:elem.downTimeReasonTypeIds.filter(function(elem, index, self) {
            return index === self.indexOf(elem);
        }),
          downtimereasonTypeIdsDesc:elem.downtimereasonTypeIdsDesc.filter(function(elem, index, self) {
            return index === self.indexOf(elem);
        }) ,
          active: elem.active
        }
      });
      const uniquelineType = [];

        const unique_result = prepare_resultWithUniqueDowntimeReasonType.filter(element => {
          const isDuplicate = uniquelineType.includes(element.lineType);

          if (!isDuplicate) {
            uniquelineType.push(element.lineType);

            return true;
          }

          return false;
        });        
        this.dataSource = new MatTableDataSource(unique_result);
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
  confirmDeleteDialog(row) {
    const dialogRef = this.dialog.open(DeleteLineTypeDownTypeReasonConfirmDialogComponent, {
      width: '500px',
      data: row
    });

    dialogRef.afterClosed().subscribe(async result => {
      const delay = ms => new Promise(res => setTimeout(res, ms));
      await delay(1500);
      if (result == 1) {
        this.reloadData();
      }
    });

  }
  addLine() {
    const dialogRef = this.dialog.open(AddUpdatelineTypeDowntimeReasonDialogComponent, {
      width: '500px',
      data: []
    });

    dialogRef.afterClosed().subscribe(async result => {
      const delay = ms => new Promise(res => setTimeout(res, ms));
      await delay(1000);
      if (result == 1) {
        this.reloadData();
      }
    });
  }
  editLine(linetypeDowntime) {
    const dialogRef = this.dialog.open(AddUpdatelineTypeDowntimeReasonDialogComponent, {
      width: '500px',
      data: linetypeDowntime,
    });
    dialogRef.afterClosed().pipe().subscribe(async result => {
      const delay = ms => new Promise(res => setTimeout(res, ms));
      await delay(3000);
        if (result == 1) {
          this.reloadData();
        }
    });
  }
  showPopupDialog(row) {
    this.popup_downtimereasonTypeIdsDesc=null
    this.popup_downtimereasonTypeIdsDesc = row.downtimereasonTypeIdsDesc;
    this.confirmModal.show();
  }
  cancelConfirm()
  {
    this.confirmModal.hide()
  }
  
}



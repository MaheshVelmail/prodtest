import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { ShiftMasterModel } from 'app/shared/models/shift-master';
import { PermissionService } from 'app/shared/services/permission-service';
import { SpinnerService } from 'app/shared/services/progress-spinner-configurable.service';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { AddShiftDialogComponent } from './shift-master-dialog/add-shift-dialog.component';
import { DeleteShiftConfirmDialogComponent } from './shift-master-dialog/delete-shift-confirm-dialog.component';
import { ShiftMasterService } from './shift-master.service';
import * as moment from 'moment';

@Component({
  selector: 'shift-master',
  styleUrls: ['shift-master.component.css'],
  templateUrl: 'shift-master.component.html'
  
})
export class ShiftComponent implements OnInit {
  columnList = ["plantName","lineName","shiftName", "shiftDisplayTime",'active', "action"];
  List: any
  editedData: ShiftMasterModel[];
  newSKUData: ShiftMasterModel[];
  plantlist: any;
  linelist: any;
  planbmodeldata: any;
  dataSource: MatTableDataSource<ShiftMasterModel>;
  plantTypeData: any;
  linesDataByPlant: any;
  selectedplant: any;
  selectedline: any;
  oEEtype: string
  isChecked: boolean
  disablesaveBtn: boolean = true;
  inputboxError: boolean;
  element: any;
  filterValueModel:any=''
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  isYearEndChangeModel: any
  getLineId: any;
  getPlantId:any;
  model = { casePerHour: null };
  public casePerHour: any = {};
  // Add new sku section
  @ViewChild('addModal', { static: false }) addModal: ModalDirective;
  validationForm: FormGroup;
  Form: FormGroup;
  
  submitted = false;
  searchedData:any=[];
  timeout: any = null;
  isVisible:string='none';
  selectedUserVal:any;
  isContainerVisible:string='none';
  disableSavebtn:boolean = true;
  showSkuDetail:boolean
  panelOpenState = false;
  norecords:boolean
  permissiondata: any
  canInsert: boolean
  canUpdate: boolean
  canDeleted: boolean
  canView: boolean
  @ViewChild('resetbtn') resetbtn:ElementRef;
  constructor(private router:Router,public permissionService: PermissionService,public dialog: MatDialog,private changeRef: ChangeDetectorRef, private cdref: ChangeDetectorRef, private formBuilder: FormBuilder, private spinnerService: SpinnerService, private shiftMasterService: ShiftMasterService) {
    this.getPermission();
    this.spinnerService.hide();    
  }
  ngOnInit() {
    this.GetAllPlantShifts();
  }
  getPermission()
  {
    this.permissiondata=this.permissionService.getPermission(this.router.url)
    this.canInsert = this.permissiondata[0].canI;
    this.canUpdate = this.permissiondata[0].canU;
    this.canDeleted = this.permissiondata[0].canD;
  }
  changeValue(event: any) {
    this.element = event;
  }
  undo(e: any) {
    e.editable = false;
    e.planPercentage = e.planPercentageOriginal;
    e.casePerHour = e.casePerHourOriginal;
    e.casePerHourCapacity = e.casePerHourCapacityOriginal;
    const index = this.editedData.indexOf(e);
    if (index > -1) {
      this.editedData.splice(index, 1);
    }
    if (this.editedData.length > 0) {
      this.disablesaveBtn = false;
    }
    else {
      this.disablesaveBtn = true;
    }
    this.changeRef.detectChanges();
  }
  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  GetAllPlantShifts() {
    this.disableSavebtn=false;
    this.spinnerService.show();
    this.shiftMasterService.GetAllPlantShifts()
      .subscribe(data => {
        let result = data.map(function(elem) {
          return {
            plantShiftId: elem.plantShiftId,
            plantId: elem.plantId,
            plantName:elem.plantName,
            lineId : elem.lineId,
            lineName : elem.lineName,
            shiftName:elem.shiftName,
            shiftId: elem.shiftId,
            startTime: moment(elem.startTime, "hh:mm A").format("HH:mm"),
            endTime:moment(elem.endTime, "hh:mm A").format("HH:mm"),
            hour: moment(elem.endTime,"HH:mm A").diff(moment(elem.startTime,"HH:mm A"), 'hours'),
            minute: moment.utc(moment(elem.endTime, "HH:mm").diff(moment(elem.startTime, "HH:mm"))).format("mm"),
            timeZone: elem.timeZone,
            shiftDisplayTime:elem.shiftDisplayTime,
            active: elem.active?'Active':'Closed'
          }});
        const Listdata: ShiftMasterModel[] = result;
        this.dataSource = new MatTableDataSource(Listdata);
        this.applyFilter(this.filterValueModel)
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.spinnerService.hide();
      }, error => console.log(error));

  }
  ngAfterContentChecked() {
    this.cdref.detectChanges();

  }
  edit(e: any) {
    e.editable = !e.editable;
    e.lineId = this.getLineId;
    e.plantId = this.getPlantId;
    this.editedData.push(e);
    if (this.editedData.length > 0) {
      this.disablesaveBtn = false;
    }
    else {
      this.disablesaveBtn = true;
    }

  }
  ResetAllControls(){
    this.validationForm.reset();
    this.submitted=false;
    this.selectedUserVal=null;
   }
  cancelModal(){
    this.addModal.hide();
    this.ResetAllControls();
    this.resetbtn.nativeElement.disabled = false;
}
  addShift() {
    const dialogRef = this.dialog.open(AddShiftDialogComponent, {
      width: '500px',
      data: []
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result==1)
      {
        this.changeLocation()
      }
    });
  }
  editShift(shiftdata) {
    const dialogRef = this.dialog.open(AddShiftDialogComponent, {
      width: '500px',
      data: shiftdata,
    });
    dialogRef.afterClosed().subscribe(resp => {
      if(resp==1)
      {
        this.changeLocation()
      }
     
    });
  }
  confirmDeleteDialog(row) {
    const dialogRef = this.dialog.open(DeleteShiftConfirmDialogComponent, {
      width: '500px',
      data: row
    });

    dialogRef.afterClosed().subscribe(res => {
      if(res==1)
      {
        this.changeLocation()
      }
    });
   
  }
  changeLocation() {
    // changes for page Refresh and pagination issue
    this.GetAllPlantShifts();
      this.dialog.closeAll()
}
}
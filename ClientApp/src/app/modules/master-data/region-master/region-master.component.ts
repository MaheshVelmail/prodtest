import { ChangeDetectorRef, Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { RegionMasterModel } from 'app/shared/models/region-master';
import { PermissionService } from 'app/shared/services/permission-service';
import { SpinnerService } from 'app/shared/services/progress-spinner-configurable.service';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { RegionMasterService } from './region-master.service';

@Component({
  selector: 'region-master',
  styleUrls: ['region-master.component.css'],
  templateUrl: 'region-master.component.html',
})
export class RegionMasterComponent implements OnInit {
  displayedColumns = ['regionName', 'divisionName', 'active', 'action'];
  dataSource: MatTableDataSource<RegionMasterModel>;
  region:any;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  permissiondata: any
  canInsert: boolean
  canUpdate: boolean
  canDeleted: boolean
  canView: boolean
  regionformGroup: FormGroup;
  btnText: string;
  titleText: string;
  deleteRegionId:any;
  statusDiv: boolean;
  divisionListData: RegionMasterModel[];
  divisionListDataList: [];
  filterValueModel:any=''
  @ViewChild('cancelbtn') cancelbtn:ElementRef;
  @ViewChild('regionNameInput') regionNameInput:ElementRef;
  @ViewChild('addUpdateRegiononModal', { static: false }) addUpdateRegiononModal: ModalDirective;
  @ViewChild('deleteRegionModal', { static: false }) deleteRegionModal: ModalDirective;
  constructor(private formBuilder: FormBuilder, public permissionService: PermissionService,private router:Router,private spinnerService:SpinnerService,private changeDetectorRefs: ChangeDetectorRef,public dialog: MatDialog,private regionMasterService :RegionMasterService) {
    this.getPermission();
    this.regionformGroup = this.formBuilder.group({
      'regionId': '',
      'divisionId': new FormControl ('', [Validators.required]),
      'regionName': new FormControl ('', [Validators.required,Validators.maxLength(50)]),
       'divisionName': '',
      'active': new FormControl (true),

    });
  }
ngOnInit()
{
  this.getAllRegion();
}
 getPermission()
  {
    this.permissiondata=this.permissionService.getPermission(this.router.url)
    this.canInsert = this.permissiondata[0].canI;
    this.canUpdate = this.permissiondata[0].canU;
    this.canDeleted = this.permissiondata[0].canD;
  }
  getAllRegion() {
  this.spinnerService.show();
  this.regionMasterService.getAllRegion()
    .subscribe(data => {
      let result = data.map(function(elem) {
        return {
          regionId: elem.regionId,
          regionName: elem.regionName,
          divisionId: elem.divisionId,
          divisionName: elem.divisionName,
          active: elem.active?'Active':'Closed'
        }});
      const regionmaster: RegionMasterModel[] = result;
      this.dataSource = new MatTableDataSource(regionmaster);
      this.applyFilter(this.filterValueModel)
      this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.spinnerService.hide();
    }, error => console.log(error));
    
}
  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); 
    filterValue = filterValue.toLowerCase();
    this.dataSource.filter = filterValue;
  }
  addRegion() {
    this.btnText = 'add'
    this.titleText = 'Add Region'
    this.statusDiv = false;
    this.getAllDivision();
    this.addUpdateRegiononModal.show();
  }
  editRegion(row) {
    this.btnText = 'update'
    this.titleText = 'Edit Region'
    this.statusDiv = true;
    this.getAllDivision();
    this.regionformGroup.get('regionId').setValue(row.regionId);
    this.regionformGroup.get('divisionId').setValue(row.divisionId);
    this.regionformGroup.get('regionName').setValue(row.regionName);
    this.regionformGroup.get('divisionName').setValue(row.divisionName);
    this.regionformGroup.get('active').setValue(row.active=='Active'?true:false);
    this.addUpdateRegiononModal.show();
  }
  reloadRegionData(){
    this.regionformGroup.reset()
    this.getAllRegion();
    this.spinnerService.hide();
  }
  addUpdateDivisionRegion(data: any) {
    if(!this.statusDiv){
      data.active=true;
    }
    if(data.active==null)
    {
      data.active=false;
    }
    if (data.regionId > 0) {
      this.spinnerService.show();
    this.addUpdateRegiononModal.hide();
      this.regionMasterService.updateRegion(data)
        .subscribe(() => {
          this.reloadRegionData()
        },
          error => console.log('updateRegion log',error)
        );
    }
    else {
      this.spinnerService.show();
    this.addUpdateRegiononModal.hide();
      data.regionId=0;
      this.regionMasterService.addRegion(data)
        .subscribe(() => {
         
          this.reloadRegionData()
        }
        )
    }

  }
  openDeleteRegionModel(row) {
    this.deleteRegionId=row.regionId
    this.deleteRegionModal.show();
   
  }
  clickOnDeleteRegion()
  {
    this.spinnerService.show();
    this.deleteRegionModal.hide();
    this.regionMasterService.deleteRegion(this.deleteRegionId)
    .subscribe(() => {
      this.getAllRegion();
      this.spinnerService.hide();
    },
      error => console.log(error)
    );
  }
  getAllDivision() {
    this.divisionListData=[]
    this.regionMasterService.getAllDivision()
      .subscribe(data => {
        this.divisionListData = data;
        this.divisionListDataList= data;
      }, error => console.log(error));
  }
  // @HostListener('focusout', ['$event']) public onListenerTriggered(event: any): void {
  //   this.setFocusToInput();
  // }
  // setFocusToInput() {
  //   this.regionNameInput.nativeElement.focus();
  //   this.cancelbtn.nativeElement.focus();
  // }
  onCloseclick(){
    this.addUpdateRegiononModal.hide();
    this.deleteRegionModal.hide();
  }
}



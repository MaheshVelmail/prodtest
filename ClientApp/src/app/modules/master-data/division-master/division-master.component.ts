import { ChangeDetectorRef, Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { DivisionMasterModel } from 'app/shared/models/division-master';
import { PermissionService } from 'app/shared/services/permission-service';
import { SpinnerService } from 'app/shared/services/progress-spinner-configurable.service';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { DivisionMasterService } from './division-master.service';

@Component({
  selector: 'division-master',
  styleUrls: ['division-master.component.css'],
  templateUrl: 'division-master.component.html',
})
export class DivisionMasterComponent implements OnInit {
  @ViewChild('addUpdateDivisionModal', { static: false }) addUpdateDivisionModal: ModalDirective;
  @ViewChild('deleteDivisionModal', { static: false }) deleteDivisionModal: ModalDirective;
  displayedColumns = ['divisionName', 'active', 'action'];
  @ViewChild('divisionNameInput') divisionNameInput:ElementRef;
  dataSource: MatTableDataSource<DivisionMasterModel>;
  region: any;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  permissiondata: any
  canInsert: boolean
  canUpdate: boolean
  canDeleted: boolean
  canView: boolean
  divisionformGroup: FormGroup;
  btnText: string;
  titleText: string;
  statusDiv: boolean;
  deleteDivisionId:any;
  filterValueModel:any=''
  @ViewChild('cancelbtn') cancelbtn:ElementRef;
  constructor(private formBuilder: FormBuilder, public permissionService: PermissionService, private router: Router, private spinnerService: SpinnerService, private changeDetectorRefs: ChangeDetectorRef, public dialog: MatDialog, private divisionMasterService: DivisionMasterService) {
    this.getPermission();
    this.divisionformGroup = this.formBuilder.group({
      'divisionId': new FormControl(''),
      'divisionName': new FormControl('', [Validators.required, Validators.maxLength(50)]),
      'active': new FormControl(true),
    });
  }
  ngOnInit() {
    this.getAllDivision();
  }
  getPermission() {
    this.permissiondata = this.permissionService.getPermission(this.router.url)
    this.canInsert = this.permissiondata[0].canI;
    this.canUpdate = this.permissiondata[0].canU;
    this.canDeleted = this.permissiondata[0].canD;
  }
  getAllDivision() {
    this.spinnerService.show();
    this.divisionMasterService.getAllDivision()
      .subscribe(data => {
        let result = data.map(function (elem) {
          return {
            divisionId: elem.divisionId,
            divisionName: elem.divisionName,
            active: elem.active ? 'Active' : 'Closed'
          }
        });
        const divisionmaster: DivisionMasterModel[] = result;
        this.dataSource = new MatTableDataSource(divisionmaster);
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
  openDeleteDivisionModel(row:any)
  {
    this.deleteDivisionId=row.divisionId;
    this.deleteDivisionModal.show();
  }
  clickOnDeleteDivision() {
    this.spinnerService.show();
    this.deleteDivisionModal.hide();
    this.divisionMasterService.deleteDivision(this.deleteDivisionId)
      .subscribe(() => {
        this.getAllDivision();
          this.spinnerService.hide();
      },
        error => console.log(error)
      );
  }
  addUpdateDivision(data: any) {
    if(!this.statusDiv){
      data.active=true;
    }
    if(data.active==null)
    {
      data.active=false;
    }
    if (data.divisionId > 0) {
      this.spinnerService.show();
      this.addUpdateDivisionModal.hide();
      this.divisionMasterService.updateDivision(data)
        .subscribe(() => {
          this.divisionformGroup.reset();
          this.getAllDivision();
          this.spinnerService.hide();
        },
          error => console.log('update division log',error)
        );
    }
    else {
      data.divisionId=0;
      this.spinnerService.show();
      this.addUpdateDivisionModal.hide();
      this.divisionMasterService.addDivision(data)
        .subscribe(() => {
          this.divisionformGroup.reset()
          this.getAllDivision();
          this.spinnerService.hide();
          
        },
          error => console.log('insert division log',error)
        );
    }

  }
  addDivision() {
    this.btnText = 'add'
    this.titleText = 'Add Division'
    this.statusDiv = false
    this.addUpdateDivisionModal.show();
  }
  editDivision(row) {
    this.btnText = 'update'
    this.titleText = 'Edit Division'
    this.statusDiv = true;
    this.divisionformGroup.get('divisionId').setValue(row.divisionId);
    this.divisionformGroup.get('divisionName').setValue(row.divisionName);
    this.divisionformGroup.get('active').setValue(row.active=='Active'?true:false);
    this.addUpdateDivisionModal.show();
  }
  onCloseclick(){
    this.addUpdateDivisionModal.hide();
    this.deleteDivisionModal.hide();
  }
  @HostListener('focusout', ['$event']) public onListenerTriggered(event: any): void {
    this.setFocusToInput();
  }
  setFocusToInput() {
    this.divisionNameInput.nativeElement.focus();
    this.cancelbtn.nativeElement.focus();
  }
}



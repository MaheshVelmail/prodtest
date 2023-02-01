import { ChangeDetectorRef, Component, OnInit, ViewChild, ElementRef, HostListener } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { PlantMasterModel } from 'app/shared/models/plant-master';
import { MessageService } from 'app/shared/services/message.service';
import { PermissionService } from 'app/shared/services/permission-service';
import { SpinnerService } from 'app/shared/services/progress-spinner-configurable.service';
import { BehaviorSubject } from 'rxjs';
import { PlantMasterService } from './plant-master.service';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-plant-master',
  templateUrl: './plant-master.component.html',
  styleUrls: ['./plant-master.component.css']
})
export class PlantMasterComponent implements OnInit {
  displayedColumns = ['plantName', 'plantType', 'divisionName', 'regionName', 'timezone', 'siteDirectorEmail', 'active', 'action'];
  dataSource: MatTableDataSource<PlantMasterModel>;
  visibility: BehaviorSubject<boolean>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('addUpdatePlantModal', { static: false }) addUpdatePlantModal: ModalDirective;
  @ViewChild('deletePlantModal', { static: false }) deletePlantModal: ModalDirective;
  @ViewChild('cancelbtn') cancelbtn: ElementRef;
  @ViewChild('plantName') plantName: ElementRef;
  selPlantrow: any;
  permissiondata: any
  canInsert: boolean
  canUpdate: boolean
  canDeleted: boolean
  canView: boolean
  formGroup: FormGroup;
  plantTypeData: any;
  plantRegionData: any;
  plantDevisionData: any;
  timeZoneListData: any;
  plantTypeDataList: any=[];
  plantRegionDataList: any=[];
  plantDevisionDataList: any=[];
  timeZoneListDataList: any=[];
  btnText: string
  titleText: string
  statusDiv: boolean;
  isVisible: string = 'none';
  isContainerVisible: string = 'none';
  isEmailDivVisible: string = 'none';
  searchedUsers: any = [];
  selectedUserVal: any;
  timeout: any = null;
  clearSearch = false;
  showHideDuplicateUser = false;
  emailLengthLimit: string = '';
  emailLengthLimitFlag: boolean = false;
  emailTitle: string = '';
  searchedUsersEmail: any = [];
  deletePlantId: any;
  emailObj: any = {};
  disableSubmitOnEmail: boolean = false;
  @ViewChild('nameSearchInput') nameSearchInput: ElementRef;
  filterValueModel:any=''
  constructor(private formBuilder: FormBuilder, public permissionService: PermissionService, private spinnerService: SpinnerService, private changeDetectorRefs: ChangeDetectorRef, public dialog: MatDialog, private plantservice: PlantMasterService, public msgService: MessageService, private router: Router) {
    this.getPermission();
    this.spinnerService.hide();
    this.getMasterData();
    this.formGroup = this.formBuilder.group({
      'plantId': '',
      'plantName': new FormControl('', [Validators.required, Validators.maxLength(3)]),
      'plantDesc': new FormControl('', [Validators.required]),
      'plantType': new FormControl('', [Validators.required]),
      'divisionId': new FormControl('', [Validators.required]),
      'regionId': new FormControl('', [Validators.required]),
      'timezone': new FormControl('', [Validators.required]),
      'active': new FormControl(true),
      'director': new FormControl(''),
      'email': new FormControl(''),

    });

  }

  ngOnInit() {
    this.GetPlantData();
  }
  getPermission() {
    this.permissiondata = this.permissionService.getPermission(this.router.url)
    this.canInsert = this.permissiondata[0].canI;
    this.canUpdate = this.permissiondata[0].canU;
    this.canDeleted = this.permissiondata[0].canD;
  }
  GetPlantData() {
    this.spinnerService.show();
    this.plantservice.getAllPlants()
      .subscribe(data => {
        let result = data.map(function (elem) {
          return {
            plantId: elem.plantId,
            plantName: elem.plantName,
            plantDesc: elem.plantDesc,
            plantType: elem.plantType,
            divisionId: elem.divisionId,
            regionId: elem.regionId,
            divisionName: elem.divisionName,
            regionName: elem.regionName,
            timezone: elem.timezone,
            active: elem.active ? 'Active' : 'Closed',
            siteDirectorEmail: elem.siteDirectorEmail,
            siteDirectorEmailHome: elem.siteDirectorEmail != null ? (elem.siteDirectorEmail.split(';').map(item => item.trim())).join("\n") : elem.siteDirectorEmail
          }
        });
        const plantmaster: PlantMasterModel[] = result;
        this.dataSource = new MatTableDataSource(plantmaster);
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
  refreshData() {
    // save current route first
    const currentRoute = this.router.url;
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.GetPlantData();
      this.dialog.closeAll();
      this.router.navigate([currentRoute]); // navigate to same route

    });
  }

  addPlant() {
    this.btnText = 'add'
    this.titleText = 'Add Plant'
    this.statusDiv = false;
    this.searchedUsersEmail = [];
    this.formGroup.reset();
    this.isContainerVisible = 'none';
    this.addUpdatePlantModal.show();
  }
  editPlant(row) {
    this.btnText = 'update'
    this.titleText = 'Edit Plant'
    this.statusDiv = true;
    this.isContainerVisible = 'none';
    this.getRegiondata(row.divisionId);
    this.searchedUsersEmail = (!row.siteDirectorEmail || /^\s*$/.test(row.siteDirectorEmail)) ? row.siteDirectorEmail.trim() : row.siteDirectorEmail.split(';').map(function (item) { return { email: item.trim() } });
    if (this.searchedUsersEmail == null || this.searchedUsersEmail.length == 0) {
      this.searchedUsersEmail = [];
    }
    this.formGroup.get('plantId').setValue(row.plantId);
    this.formGroup.get('plantName').setValue(row.plantName);
    this.formGroup.get('plantDesc').setValue(row.plantDesc);
    this.formGroup.get('plantType').setValue(row.plantType);
    this.formGroup.get('divisionId').setValue(row.divisionId);
    this.formGroup.get('regionId').setValue(row.regionId);
    this.formGroup.get('timezone').setValue(row.timezone);
    this.formGroup.get('active').setValue(row.active == 'Active' ? true : false);
    this.addUpdatePlantModal.show();
  }
  GetAllPlantType() {
    this.plantservice.getPlantType().subscribe(data => {
      this.plantTypeData = data;
      this.plantTypeDataList = data;
    });
  }
  getRegiondata(event: any) {
    this.spinnerService.show();
    this.plantservice.getRegionbyId(event).subscribe(data => {
      this.plantRegionData = data;
      this.plantRegionDataList = data;
      this.spinnerService.hide();
    });
  }
  getTimeZoneList() {
    this.plantservice.getTimeZoneList()
      .subscribe(data => {
        this.timeZoneListData = data;
        this.timeZoneListDataList = data;
      }, error => console.log(error));
  }
  GetAllDevisions() {
    this.plantservice.getAllDevision().subscribe(data => {
      this.plantDevisionData = data;
      this.plantDevisionDataList = data;
    });
  }
  onNoClick(): void {
    this.addUpdatePlantModal.hide();
  }
  reloadPlantData() {
    this.formGroup.reset()
    this.GetPlantData();
    this.spinnerService.hide();
  }
  InsertUpdatePlant(data: any) {
    if (!this.statusDiv) {
      data.active = true;
    }
    if (data.active == null) {
      data.active = false;
    }
    data.siteDirectorEmail = this.searchedUsersEmail.map(function (item) { return item.email; }).join(';');
    if (data.plantId > 0) {
      this.spinnerService.show();
      this.addUpdatePlantModal.hide();
      this.plantservice.update(data)
        .subscribe(() => {
          this.emailLengthLimit=null
          this.reloadPlantData()
        }

        );
    }
    else {
      data.plantId = 0;
      this.spinnerService.show();
      this.addUpdatePlantModal.hide();

      this.plantservice.insert(data)
        .subscribe(() => {
          this.emailLengthLimit=null
          this.reloadPlantData()
        }

        )
    }

  }
  getMasterData() {
    this.GetAllPlantType();
    this.GetAllDevisions();
    this.getTimeZoneList();
  }

  ResetUserSearchControl(event: any) {
    this.searchedUsers = null;
    this.selectedUserVal = null;
    this.showHideDuplicateUser = false;
    if (this.formGroup.controls['director'].value.length >= 1) {
      this.disableSubmitOnEmail = true;
    } else {
      this.disableSubmitOnEmail = false;
    }
    clearTimeout(this.timeout);
    var $this = this;
    if (event.keyCode == 13) {
      this.search();
    }
    else {
      if (this.formGroup.controls['director'].value.length >= 3) {
        this.timeout = setTimeout(function () {
          $this.search();
        }, 2000);
      }
    }
  }
  search() {

    let searchuser: string = this.formGroup.get('director').value;
    if (searchuser !== '' && searchuser.length >= 3) {
      this.isVisible = 'inline-block';
      this.plantservice.searchUser(searchuser).subscribe(data => {
        this.searchedUsers = data;
        if (data == null) {
          this.selectedUserVal = null;
        }
        this.isVisible = 'none';
        this.isContainerVisible = 'inline-block';
      })
    }
  }

  selectedUser(selUser: any) {
    this.selectedUserVal = selUser;
    this.emailTitle = "";
    if (selUser.email != null) {
      this.emailLengthLimit = this.emailLengthLimit + ';' + selUser.email;
      if (this.emailLengthLimit.length < 250) {
        this.emailLengthLimitFlag = false;
        if (this.searchedUsersEmail.filter(obj => obj.email == selUser.email).length > 0) {
          this.showHideDuplicateUser = true;
        }
        else {
          this.emailObj = { email: selUser.email };
          this.searchedUsersEmail.push(this.emailObj);
          this.showHideDuplicateUser = false;
        }
      }
      else {
        this.emailLengthLimitFlag = true;
      }
    }
    this.disableSubmitOnEmail = false;
    this.formGroup.get('director').setValue('');
    this.isContainerVisible = 'none';
    this.nameSearchInput.nativeElement.blur();
  }
  select_cross() {
    this.selectedUserVal = null;
    this.isContainerVisible = 'none';
  }
  getControlLabel(type: string) {
    return this.formGroup.controls[type].value;
  }
  deleteEmail(email: any) {
    this.searchedUsersEmail = this.searchedUsersEmail.filter(obj => obj.email !== email);
    if (this.searchedUsersEmail.length == 0) {
      this.searchedUsersEmail = [];
    }
  }

  openDeletePlantModel(row) {
    this.deletePlantId = row.plantId
    this.deletePlantModal.show();

  }
  clickOnDeletePlant() {
    this.spinnerService.show();
    this.deletePlantModal.hide();
    this.plantservice.deletePlant(this.deletePlantId)
      .subscribe(() => {
        this.GetPlantData();
        this.spinnerService.hide();
      },
        error => console.log(error)
      );
  }
  onCloseclick() {
    this.addUpdatePlantModal.hide();
    this.deletePlantModal.hide();
  }
  @HostListener('focusout', ['$event']) public onListenerTriggered(event: any): void {
    this.setFocusToInput();
  }
  setFocusToInput() {
    this.cancelbtn.nativeElement.focus();
  }

}

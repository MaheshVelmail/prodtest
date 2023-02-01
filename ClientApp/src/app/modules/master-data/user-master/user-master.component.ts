import { ChangeDetectorRef, Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { UserMasterModel } from 'app/shared/models/user-master';
import { MessageService } from 'app/shared/services/message.service';
import { PermissionService } from 'app/shared/services/permission-service';
import { ProductionTrackerStorageService } from 'app/shared/services/production-tracker-storage-service.service';
import { SpinnerService } from 'app/shared/services/progress-spinner-configurable.service';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { UserMasterService } from './user-master.service';

@Component({
  selector: 'app-user-master',
  templateUrl: './user-master.component.html',
  styleUrls: ['./user-master.component.css']
})

export class UserMasterComponent implements OnInit {
  keyword = 'displayName';
  displayedColumns = ['displayname', 'gsn', 'email', 'groupName', 'plantName', 'action'];
  dataSource: MatTableDataSource<UserMasterModel>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('confirmModal', { static: false }) confirmModal: ModalDirective;
  @ViewChild('addeditModal', { static: false }) addeditModal: ModalDirective;
  @ViewChild('loadingdiv') loadingdiv: any
  @ViewChild('resetbtn') resetbtn: ElementRef;
  @ViewChild('nameSearchInput') nameSearchInput: ElementRef;
  @ViewChild('cancelbtn') cancelbtn: ElementRef;
  confirmationDialogTitle: string = 'Confirmation?';
  confirmationMsg: string = 'Are you sure, you want to delete this user?';
  selectedRow: any;
  selectedUserVal: any;
  dataUsers: any;
  errorMsg: string;
  isLoadingResult: boolean;
  validationForm: FormGroup;
  addEditDialogTitle: string;
  userSearchedData: UserMasterModel[];
  originalData: any;
  isVisible: string = 'none';
  isContainerVisible: string = 'none';
  isEmailDivVisible: string = 'none';
  initialValue: any;
  optionSelected = false;
  clearSearch = false;
  showHideSaveBtn = false;
  searchedUsers: any = [];
  timeout: any = null;
  userGroups: any = [];
  limitSelection = false;
  cities: any = [];
  selectedItems: any = [];
  dropdownSettings: any = {};
  dropdownSettingsPlants: any = {};
  dropdownSettingsDefaultPlant: any = {};
  userPlants: any = [];
  defaultPlant: any = [];
  submitted = false;
  permissiondata: any
  selectedPlant: any
  canInsert: boolean
  canUpdate: boolean
  canDeleted: boolean
  canView: boolean
  griduserData: any
  selectedDefaultPlant: any;
  selectDefaultPlantLabel: string;
  selectPlantLabel: string;
  selectGroupLabel: string;
  showAddUserControls: boolean;
  userGSNSelected: boolean = false;
  btnText: string;
  hiddenPlantdd: boolean = false;
  filterValueModel:any=''
  constructor(public storageService: ProductionTrackerStorageService, public permissionService: PermissionService, private router: Router, private spinnerService: SpinnerService, private userService: UserMasterService,
    private changeDetectorRefs: ChangeDetectorRef, private formBuilder: FormBuilder, private msgService: MessageService) {
    this.getPermission();
    this.GeUserData();
    this.GetUserGroups();
    this.getPlant();
    this.validationForm = this.formBuilder.group({
      'gsn': new FormControl('', [Validators.required, Validators.minLength(3)]),
      'userId': new FormControl(''),
      'displayName': new FormControl(''),
      'email': new FormControl(''),
      'userGroups': new FormControl('', [Validators.required]),
      'userPlants': new FormControl('', [Validators.required]),
      'defaultPlant': new FormControl('')
    });



  }
  @HostListener('focusout', ['$event']) public onListenerTriggered(event: any): void {
    this.setFocusToInput();
  }
  setFocusToInput() {
    if (!this.userGSNSelected) {
      this.nameSearchInput.nativeElement.focus();
    }
    this.cancelbtn.nativeElement.focus();
  }
  getPermission() {
    this.permissiondata = this.permissionService.getPermission(this.router.url)
    this.canInsert = this.permissiondata[0].canI;
    this.canUpdate = this.permissiondata[0].canU;
    this.canDeleted = this.permissiondata[0].canD;

  }

  ngOnInit() {
    this.dropdownSettings = {
      singleSelection: true,
      idField: 'groupId',
      textField: 'groupName',
      selectAllText: 'Select All',
      unSelectAllText: 'Unselect All',
      itemsShowLimit: 3,
      allowSearchFilter: true,
      closeDropDownOnSelection: true
    };
    this.dropdownSettingsPlants = {
      singleSelection: false,
      idField: 'plantId',
      textField: 'plantDesc',
      selectAllText: 'Select All',
      unSelectAllText: 'Unselect All',
      allowSearchFilter: true,
      enableCheckAll: true,
      limitSelection: -1,
      clearSearchFilter: true,
      maxHeight: 197,
      itemsShowLimit: 5,
      searchPlaceholderText: 'Search plant',
      noDataAvailablePlaceholderText: 'No plant available',
      closeDropDownOnSelection: false,
      showSelectedItemsAtTop: false,
      defaultOpen: false
    };
    this.dropdownSettingsDefaultPlant = {
      singleSelection: true,
      idField: 'plantId',
      textField: 'plantDesc',
      selectAllText: 'Select All',
      unSelectAllText: 'Unselect All',
      itemsShowLimit: 1,
      allowSearchFilter: true,
      closeDropDownOnSelection: true
    };
    this.showAddUserControls = true;
  }

  addUser() {
    this.hiddenPlantdd = false;
    this.validationForm.get('gsn').enable();
    this.addEditDialogTitle = 'Add User';
    this.selectPlantLabel = "Plant(s)";
    this.selectGroupLabel = "Group";
    this.selectDefaultPlantLabel = "Default Plant";
    this.showAddUserControls = true;
    this.userGSNSelected = false;
    this.btnText = "add";
    this.addeditModal.show();
  }

  GetUserGroups() {
    this.userService.getGroups().subscribe(data => {
      this.userGroups = data;
    })
  }

  GeUserData() {
    this.spinnerService.show();
    this.userService.getUsers().subscribe(data => {
      this.griduserData = data
      let gridData = data.map(function (element) {
        return {
          displayname: element.displayname,
          gsn: element.gsn,
          email: element.email,
          groupName: element.groupName,
          groupId: element.groupId,
          userId: element.userId,
          defaultPlant: element.userPlants.filter(item => item.isDefaultPlant).map(function (item) {
            return item.plantName
          }),
          plants: element.userPlants.filter(userPlant => !userPlant.isDefaultPlant).map(function (elem) {
            return " " + elem.plantName
          })
        }
      })
      const usermaster: UserMasterModel[] = gridData;
      this.dataSource = new MatTableDataSource(usermaster);
      this.applyFilter(this.filterValueModel)
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.changeDetectorRefs.detectChanges();
      this.spinnerService.hide();
    })

  }
  cancelConfirm() {
    this.selectedRow = null;
    this.confirmModal.hide();
  }
  confirmDeleteDialog(row) {
    this.selectedRow = row;
    this.confirmModal.show();
  }
  deleteUser() {
    if (this.selectedRow != null && this.selectedRow.userId != 0) {
      this.userService.deleteUser(this.selectedRow.userId).subscribe(data => {
        if (data) {
          this.confirmModal.hide();
          this.GeUserData();
          this.msgService.displaySuccessMessage('User has been deleted successfully!');
        }
      }, error => {
        console.log(error);
      });
    }
    else {
      this.msgService.displaySuccessMessage('Please select user to delete;');
    }
  }
  editUser(row) {
    this.showAddUserControls = false;
    this.selectedRow = row;
    this.addEditDialogTitle = 'Edit User';
    this.validationForm.get('gsn').setValue(row.gsn);
    this.validationForm.get('displayName').setValue(row.displayname);
    this.btnText = "update";
    if (row.email != null) {
      this.isEmailDivVisible = 'inline-block';
      this.validationForm.get('email').setValue(row.email);
    }
    let selItems = [];
    selItems = [{ groupId: row.groupId, groupName: row.groupName }]
    this.validationForm.get('userGroups').setValue(selItems);
    let userDatarow = this.griduserData.filter(item => item.gsn == row.gsn)
    let userPlants = userDatarow[0].userPlants
    let defaultPlantData = userDatarow[0].userPlants.filter(item => item.isDefaultPlant)
    let defaultplant = defaultPlantData.map(function (element) {
      return {
        plantId: element.plantId,
        plantDesc: element.plantDesc
      }
    });
    this.validationForm.get('userPlants').setValue(userPlants);
    let selDefaultPlant = [];
    selDefaultPlant = defaultplant
    this.selectedDefaultPlant = selDefaultPlant
    this.defaultPlant = selDefaultPlant
    this.validationForm.get('defaultPlant').setValue(selDefaultPlant);
    this.selectedUserVal = { userId: row.userId };
    this.validationForm.get('userId').setValue(row.userId);
    this.validationForm.get('gsn').disable();
    this.selectPlantLabel = "Plant(s)";
    this.selectGroupLabel = "Group";
    this.selectDefaultPlantLabel = "Default Plant";

    this.addeditModal.show();
  }
  public onDeSelect(item: any) {
    let defaultplant = this.validationForm.get('defaultPlant').value;
    if (item.plantId == defaultplant[0].plantId)
      this.validationForm.get('defaultPlant').reset();

  }

  savedata(data) {
    this.submitted = true;
    if (data.defaultPlant == "" || data.defaultPlant == null) {
      data.defaultPlant = []
    }
    if (this.validationForm.valid) {
      this.spinnerService.show();
      let seluser: any = {};
      if (data.userId != 0) {

        seluser.userId = data.userId;
        if (data.defaultPlant.length != 0) {
          let defaultplant = data.defaultPlant.map(function (k) {
            return {plantId : k.plantId,
              plantDesc: k.plantDesc,
              isDefaultPlant: true}
          })
          let selectedPlant = data.userPlants.map(function (element) {
            return {
              plantId: element.plantId,
              plantDesc: element.plantDesc,
              isDefaultPlant: false
            }
          })
          let selectUniquePlant = selectedPlant.filter(item => item.plantId !== defaultplant[0].plantId)
          seluser.userPlants = defaultplant.concat(selectUniquePlant)
        }
        else {
          let selectedPlant = data.userPlants.map(function (elem) {
            return {
              plantId: elem.plantId,
              plantDesc: elem.plantDesc,
              isDefaultPlant: false
            }
          })
          seluser.userPlants = selectedPlant
        }

        seluser.groupId = data.userGroups[0].groupId;
        seluser.groupName = data.userGroups[0].groupName;
        seluser.email = data.email;
        seluser.gsn = this.validationForm.get('gsn').value;
        seluser.active = true;
      }
      else {
        seluser.userId = 0;
        if (data.defaultPlant.length != 0) {
          let defaultplant = data.defaultPlant.map(function (a) {
            return {plantId : a.plantId,
              plantDesc: a.plantDesc,
            isDefaultPlant: true}
          })
          let selectedPlant = data.userPlants.map(function (item) {
            return {
              plantId: item.plantId,
              plantDesc: item.plantDesc,
              isDefaultPlant: false
            }
          })
          let selectUniquePlant = selectedPlant.filter(item => item.plantId !== defaultplant[0].plantId)
          seluser.userPlants = defaultplant.concat(selectUniquePlant)
        }
        else {
          let selectedPlant = data.userPlants.map(function (i) {
            return {
              plantId: i.plantId,
              plantDesc: i.plantDesc,
              isDefaultPlant: false
            }
          })
          seluser.userPlants = selectedPlant
        }
        seluser.groupId = data.userGroups[0].groupId;
        seluser.groupName = data.userGroups[0].groupName;
        seluser.gsn = this.selectedUserVal.gsn;
        seluser.displayName = this.selectedUserVal.displayName;
        seluser.employeeid = this.selectedUserVal.employeeId;
        seluser.email = data.email;
        seluser.active = true;
      }
      if (seluser.userId <= 0) {
        this.userService.addUser(seluser).subscribe(() => {
          this.reloadData();
        })
      }
      else {
        this.userService.updateUser(seluser).subscribe(() => {
          this.reloadData();
        })
      }

      this.isEmailDivVisible = 'none';
    }
  }
  reloadData()
  {
    this.GeUserData();
    this.cancelModal();
    this.spinnerService.hide();
  }
  cancelModal() {
    this.addeditModal.hide();
    this.ResetAllControls();
    this.isEmailDivVisible = 'none';
    this.clearSearch = false;
    this.isVisible = 'none';
    this.isContainerVisible = 'none';
  }
  resetModal() {
    this.ResetAllControls();
    this.isEmailDivVisible = 'none';
    this.clearSearch = false;
  }
  ResetUserSearchControl(event: any) {
    this.searchedUsers = null;
    this.selectedUserVal = null;
    if (this.validationForm.controls['gsn'].value != '') { this.clearSearch = true; } else { this.clearSearch = false; }
    this.validationForm.get('email').setValue('');
    this.isEmailDivVisible = 'none';
    if (this.validationForm.valid) { this.showHideSaveBtn = true; } else { this.showHideSaveBtn = false; }
    clearTimeout(this.timeout);
    var $this = this;
    if (event.keyCode == 13) {
      this.search();
    }
    else {
      if (this.validationForm.controls['gsn'].value.length >= 3) {
        this.timeout = setTimeout(function () {
          $this.search();
        }, 2000);
      }
    }
  }
  ResetAllControls() {
    this.validationForm.reset();
    this.submitted = false;
    this.selectedUserVal = null;
    this.selectedRow = null;
  }
  search() {
    let searchuser: string = this.validationForm.get('gsn').value;
    if (searchuser !== '' && searchuser.length >= 3) {
      this.isVisible = 'inline-block';
      this.userService.searchUser(searchuser).subscribe(data => {
        this.searchedUsers = data;
        if (data == null || data.length == 0) {
          this.selectedUserVal = null;
          this.isContainerVisible = 'none';
        } else { this.isContainerVisible = 'inline-block'; }
        this.isVisible = 'none';

      })
    }
  }
  selectedUser(selUser: any) {
    this.selectedUserVal = selUser;
    this.validationForm.get('userId').setValue(0);
    this.validationForm.get('displayName').setValue(selUser.displayName);
    this.validationForm.get('gsn').setValue(selUser.gsn);
    this.nameSearchInput.nativeElement.value = selUser.displayName + ' (' + selUser.gsn + ')';
    if (selUser.email != null) {
      this.isEmailDivVisible = 'inline-block';
      this.validationForm.get('email').setValue(selUser.email);
    }
    this.validationForm.get('userGroups').setValue(selUser.groupName);
    this.validationForm.get('userPlants').setValue(selUser.plantId);
    this.isContainerVisible = 'none';
    this.userGSNSelected = true;
    this.nameSearchInput.nativeElement.blur();
  }
  select_cross() {
    this.selectedUserVal = null;
    this.isContainerVisible = 'none';
  }
  getControlLabel(type: string) {
    return this.validationForm.controls[type].value;
  }
  getPlant() {
    this.userService.getAllPlants().subscribe(data => {
      this.userPlants = data;
    })
  }
  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }
  clearSearchField() {
    this.validationForm.controls['gsn'].reset();
    this.clearSearch = false;
    this.isEmailDivVisible = 'none';
    this.isVisible = 'none';
    this.isContainerVisible = 'none';
    if (this.validationForm.valid) { this.showHideSaveBtn = true; } else { this.showHideSaveBtn = false; }
  }
  groupPlantDrpChange(event: any) {
    this.hiddenPlantdd = false;
    if (event != undefined || event != null) {
      let userGroups = this.validationForm.get('userGroups').value;
      if (userGroups.length != 0) {
        if (userGroups[0].groupId == 1 || userGroups[0].groupId == 2) {
          this.hiddenPlantdd = true;
          this.selectedPlant = this.userPlants
        }
      }

    }
   if (this.validationForm.valid) 
   { this.showHideSaveBtn = true; } 
   else
    { this.showHideSaveBtn = false; }
  }

}
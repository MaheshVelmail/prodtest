import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { ManageBySKUModel } from 'app/shared/models/manage-by-sku';
import { MessageService } from 'app/shared/services/message.service';
import { PermissionService } from 'app/shared/services/permission-service';
import { ProductionTrackerStorageService } from 'app/shared/services/production-tracker-storage-service.service';
import { SpinnerService } from 'app/shared/services/progress-spinner-configurable.service';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { ManageOeeService } from '../manage-oee.service';

@Component({
  selector: 'manage-by-superpackage',
  templateUrl: './manage-by-superpackage.component.html',
  styleUrls: ['./manage-by-superpackage.component.css']
})
export class ManageBysuperpackageComponent implements OnInit {
  columnList = ["superPackage", "casePerHourCapacity", "planPercentage", "casePerHour", "action"];
  List: any
  editedData: ManageBySKUModel[];
  newSKUData: ManageBySKUModel[];
  deletedData: ManageBySKUModel[];
  plantlist: any;
  linelist: any;
  planbmodeldata: any;
  dataSource: MatTableDataSource<ManageBySKUModel>;
  plantTypeData: any;
  linesDataByPlant: any;
  selectedplant: any;
  selectedline: any;
  isChecked: boolean
  disablesavebtn: boolean = true;
  disableAddbtn: boolean = true;
  inputboxError: boolean;
  element: any;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  isYearEndChangeModel: any
  lineId: any;
  plantId: any;
  model = { casePerHour: null };
  public casePerHour: any = {};
  // Add new sku section
  @ViewChild('addeditModal', { static: false }) addeditModal: ModalDirective;
  addOEERequestForm: FormGroup;
  Form: FormGroup;
  submitted = false;
  searchedData: any = [];
  timeout: any = null;
  isVisible: string = 'none';
  selectedUserVal: any;
  isContainerVisible: string = 'none';
  showSkuDetail: boolean
  panelOpenState = false;
  norecords: boolean
  permissiondata: any
  canInsert: boolean
  canUpdate: boolean
  canDeleted: boolean
  canView: boolean
  showValidationMessage: boolean
  searchBtnShow: boolean = true;
  mainContentDiv: boolean = false;
  oEEtype: any = 'BYSUPERPACKAGE';
  oeeby: any = 'OEEBYSUP';
  deleteOeeMessage: string;
  removePendingRequestToo: boolean
  filterValueModel:any=''
  plantTypeDataList:any=[]
  linesDataByPlantList:any=[]
  @ViewChild('deleteOEEConfirmationModal', { static: false }) deleteOEEConfirmationModal: ModalDirective;
  @ViewChild('deleteConfirmationModal', { static: false }) deleteConfirmationModal: ModalDirective;
  @ViewChild('resetbtn') resetbtn: ElementRef;
  constructor(public msgService: MessageService, public storageService: ProductionTrackerStorageService, private router: Router, public permissionService: PermissionService, public dialog: MatDialog, private changeRef: ChangeDetectorRef, private cdref: ChangeDetectorRef, private formBuilder: FormBuilder, private spinnerService: SpinnerService, private manageOeeService: ManageOeeService) {
    this.getPermission();
    this.spinnerService.hide();
    this.oEEtype = 'BYSUPERPACKAGE';
    this.isYearEndChangeModel = false
    this.getDefaultPlant();
    this.getAllPlants();
    this.addOEERequestForm = this.formBuilder.group({
      'displayName': new FormControl(''),
      'lineId': new FormControl(''),
      'plantId': new FormControl(''),
      'productId': new FormControl(''),
      'superPackage': new FormControl(''),
      'casePerHourCapacity': new FormControl('', [Validators.required, Validators.min(0)]),
      'planPercentage': new FormControl('', [Validators.required, Validators.min(1), Validators.max(100)]),
      'casePerHour': new FormControl('', [Validators.required, Validators.min(0)]),
      'isYearEndChange': new FormControl('')

    });
  }
  ngOnInit() {
    this.editedData = [];
    this.newSKUData = [];
  }
  getDefaultPlant() {
    let plantlist = this.storageService.getLocalStorage('LoggedInUserInfo').userPlants;
    let defaultplant = plantlist.filter(item => item.isDefaultPlant);
    if (defaultplant.length != 0) {
      this.selectedplant = defaultplant[0].plantId
      this.getLinesByPlant(this.selectedplant)
    }
  }
  getPermission() {
    this.permissiondata = this.permissionService.getPermission(this.router.url)
    this.canInsert = this.permissiondata[0].canI;
    this.canUpdate = this.permissiondata[0].canU;
    this.canDeleted = this.permissiondata[0].canD;
  }
  changeValue(event: any) {
    this.element = event;
  }
  undo(e: any) {
    this.showValidationMessage = false;
    e.editable = false;
    e.planPercentage = e.planPercentageOriginal;
      e.casePerHour = e.casePerHourOriginal;
      e.casePerHourCapacity = e.casePerHourCapacityOriginal
    const index = this.editedData.indexOf(e);
    if (index > -1) {
      this.editedData.splice(index, 1);
    }
    if (this.editedData.length > 0) {
      this.disablesavebtn = false;
    }
    else {
      this.disablesavebtn = true;
    }
    this.changeRef.detectChanges();
  }
  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  getOEERequests(id: any) {
    this.lineId = id;
    this.disableAddbtn = false;
    this.spinnerService.show();
    this.manageOeeService.getOEERequests(id, this.oEEtype)
      .subscribe(data => {
        const Listdata: ManageBySKUModel[] = data;
        this.dataSource = new MatTableDataSource(Listdata);
        this.applyFilter(this.filterValueModel)
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.editedData = []
        this.spinnerService.hide();
      }, error => console.log(error));

  }
  ngAfterContentChecked() {
    this.cdref.detectChanges();

  }
  getAllPlants() {
    this.manageOeeService.getAllPlants()
      .subscribe(data => {
        this.plantTypeData = data;
        this.plantTypeDataList=data
      }, error => console.log(error));
  }
  getLinesByPlant(id: any) {
    this.dataSource = new MatTableDataSource([]);
    this.editedData=[]
    this.disableAddbtn=true;
    this.plantId = id;
    this.manageOeeService.getLinesByPlant(id)
      .subscribe(data => {
        this.linesDataByPlant = data;
        this.linesDataByPlantList = data;
      }, error => console.log(error));
  }
  edit(e: any) {
    e.editable = !e.editable;
    e.lineId = this.lineId;
    e.plantId = this.plantId;
    this.editedData.push(e);
    if (this.editedData.length > 0) {
      this.disablesavebtn = false;
    }
    else {
      this.disablesavebtn = true;
    }

  }
  calPlanPercentage(r: any) {
    let val = ((r.casePerHour / r.casePerHourCapacity) * 100)
    return val.toFixed(2)
  }
  calCasePerHour(r: any) {
    let val = ((r.casePerHourCapacity * r.planPercentage) / 100)
    return val.toFixed(2)
  }
  casePerHourmethod(row: any, data: any, event: any) {
    if (event.target.value == '') {
      event.target.value = 0
    }
    if (row.casePerHour == '') {
      row.casePerHour = 0
    }
    if (row.casePerHourCapacity == '') {
      row.casePerHourCapacity = 0
    }
    if (row.planPercentage == '') {
      row.planPercentage = 0
    }
    if (data == 'casePerHour') {
      row.casePerHour = parseFloat(event.target.value).toFixed(2)
      let plantPercentage = parseFloat(((event.target.value / row.casePerHourCapacity) * 100).toFixed(2))
      row.planPercentage = plantPercentage > 100 ? 100 : plantPercentage
      if (plantPercentage > 100) {
        row.casePerHour = ((row.casePerHourCapacity * 100) / 100).toFixed(2)
      }
    }
    else if (data == 'casePerHourCapacity') {
      row.casePerHourCapacity = event.target.value;
      row.planPercentage = parseFloat(((row.casePerHour / event.target.value) * 100).toFixed(2))
    }
    else {
      row.planPercentage = parseFloat(event.target.value).toFixed(2);
      row.casePerHour = parseFloat(((row.casePerHourCapacity * event.target.value) / 100).toFixed(2))
    }
  }
  deleteOeeRequest() {
    let data = this.deletedData[0]
    this.spinnerService.show();
    this.removePendingRequestToo = false
    this.manageOeeService.DeleteOEERequest(this.oeeby, data, this.oEEtype, this.removePendingRequestToo)
      .subscribe(response => {
        if (response.data == -1) {
          this.deleteOeeMessage = response.message;
          this.spinnerService.hide();
          this.deleteOEEConfirmationModal.show();
        }
        else {
          this.deletedData = [];
          this.getOEERequests(this.selectedline);
          this.msgService.displaySuccessMessage(response.message);
          this.spinnerService.hide();
        }
      },
        error => console.log('Delete OEE Request', error)
      );

  }
  confirmedForDeleteOee() {
    this.spinnerService.show();
    this.removePendingRequestToo = true
    let data = this.deletedData[0]
    this.manageOeeService.DeleteOEERequest(this.oeeby, data, this.oEEtype, this.removePendingRequestToo)
      .subscribe(response => {
        this.msgService.displaySuccessMessage(response.message);
        this.deletedData = [];
        this.onCloseclick()
        this.getOEERequests(this.selectedline);
        this.spinnerService.hide();
      },
        error => console.log('Delete OEE Request', error)
      );
  }
  onCloseclick() {
    this.spinnerService.hide();
    this.deleteConfirmationModal.hide();
    this.deleteOEEConfirmationModal.hide();
  }
  DeleteConfirmed(row: any) {
    this.deletedData = [];
    row.lineId = this.selectedline;
    row.plantId = this.selectedplant;
    this.deletedData.push(row)
    this.deleteConfirmationModal.show();
  }
  deleteOee() {
    this.deleteConfirmationModal.hide();
    this.deleteOeeRequest();
  }
  updateOEERequest() {
    this.spinnerService.show();
    this.showValidationMessage = false;
    let IsInvalidPlanPercentage = this.editedData.filter(item => item.planPercentage == Infinity || item.planPercentage > 100 || isNaN(item.planPercentage) || item.casePerHourCapacity == 0)
    if (IsInvalidPlanPercentage.length != 0) {
      this.showValidationMessage = true;
      this.spinnerService.hide();
    }
    else {
      this.disablesavebtn = true;
      this.manageOeeService.updateOEERequest(this.editedData, this.oEEtype, this.isYearEndChangeModel)
        .subscribe(linelist => {
          this.getOEERequests(this.lineId);
          this.spinnerService.hide();

        },
          error => console.log('save products log', error)
        );
    }
  }

  // Add new SkU code Selection

  addOEERequest(data) {
    this.newSKUData.push(data);
    this.submitted = true;
    if (this.addOEERequestForm.valid) {
      this.manageOeeService.addOEERequest(this.newSKUData, this.oEEtype, this.isYearEndChangeModel)
        .subscribe(() => {
          this.cancelModal()
          this.getOEERequests(this.lineId);
        },
          error => console.log('save products log', error)
        );

    }
  }
  ResetAllControls() {
    this.addOEERequestForm.reset();
    this.submitted = false;
    this.selectedUserVal = null;
  }
  cancelModal() {
    this.addeditModal.hide();
    this.ResetAllControls();
    this.resetbtn.nativeElement.disabled = false;
  }
  addSkU() {
    this.searchedData = []
    this.isContainerVisible = 'none';
    this.addOEERequestForm.get('displayName').enable();
    this.addeditModal.show();
    this.mainContentDiv = false;
  }
  ResetUserSearchControl(event: any) {
    this.searchedData = [];
    this.addOEERequestForm.get('lineId').setValue('');
    this.addOEERequestForm.get('plantId').setValue('');
    this.addOEERequestForm.get('productId').setValue('');
    this.addOEERequestForm.get('superPackage').setValue('');
    this.addOEERequestForm.get('casePerHourCapacity').setValue('');
    this.addOEERequestForm.get('planPercentage').setValue('');
    this.addOEERequestForm.get('casePerHour').setValue('');
    this.addOEERequestForm.get('isYearEndChange').setValue(this.isYearEndChangeModel);
    this.searchBtnShow = false;
    this.mainContentDiv = false;
    this.isContainerVisible = 'none';
    if (event.target.value == '') {
      this.searchBtnShow = true;
    }
    clearTimeout(this.timeout);
  }
  search() {
    this.submitted = false;
    this.norecords = false;
    let searchKeyword: string = this.addOEERequestForm.get('displayName').value;
    if (searchKeyword !== '') {
      this.isVisible = 'inline-block';
      this.manageOeeService.searchProduct(searchKeyword, this.lineId, this.oEEtype).subscribe(data => {
        this.searchedData = data;
        if (this.searchedData.length == 0) {
          this.norecords = true;
        }
        if (data == null) {
          this.selectedUserVal = null;
        }
        this.isVisible = 'none';
        this.isContainerVisible = 'inline-block';
      })
    }
  }
  selectedUser(selData: any) {
    this.selectedUserVal = selData;
    this.mainContentDiv = true;
    this.addOEERequestForm.get('lineId').setValue(this.lineId);
    this.addOEERequestForm.get('plantId').setValue(this.plantId);
    this.addOEERequestForm.get('displayName').setValue(selData.superPackage);
    this.addOEERequestForm.get('productId').setValue(selData.productId);
    this.addOEERequestForm.get('superPackage').setValue(selData.superPackage);
    this.addOEERequestForm.get('casePerHourCapacity').setValue(selData.casePerHourCapacity);
    this.addOEERequestForm.get('planPercentage').setValue(selData.planPercentage);
    this.addOEERequestForm.get('casePerHour').setValue(selData.casePerHour);
    this.addOEERequestForm.get('isYearEndChange').setValue(this.isYearEndChangeModel);
    this.isContainerVisible = 'none';
    this.showSkuDetail = true;
    this.addOEERequestForm.get('displayName').setValue('');
    this.searchBtnShow = true;
  }
  casePerHourmethodForAdd(inputVal: any, data: any, event: any) {
    if (event.target.value == '') {
      event.target.value = 0
    }
   if (inputVal.casePerHour == '') {
      inputVal.casePerHour = 0
    }
    if (inputVal.casePerHourCapacity == '') {
      inputVal.casePerHourCapacity = 0
    }
    if (inputVal.planPercentage == '') {
      inputVal.planPercentage = 0
    }
    if (data == 'casePerHour') {
      this.addOEERequestForm.get('casePerHour').setValue(parseFloat(event.target.value).toFixed(2));
      let plantPercentage = parseFloat(((event.target.value / inputVal.casePerHourCapacity) * 100).toFixed(2))
      this.addOEERequestForm.get('planPercentage').setValue((plantPercentage > 100 ? 100 : plantPercentage));
      if (plantPercentage > 100) {
        this.addOEERequestForm.get('casePerHour').setValue(parseFloat(((inputVal.casePerHourCapacity * 100) / 100).toFixed(2)));
      }
    }
    else if (data == 'casePerHourCapacity') {
      this.addOEERequestForm.get('casePerHourCapacity').setValue(parseFloat(event.target.value).toFixed(2));
      this.addOEERequestForm.get('planPercentage').setValue(parseFloat(((inputVal.casePerHour / event.target.value) * 100).toFixed(2)));
    }
    else {
      this.addOEERequestForm.get('planPercentage').setValue(parseFloat(event.target.value).toFixed(2));
      this.addOEERequestForm.get('casePerHour').setValue(parseFloat(((inputVal.casePerHourCapacity * event.target.value) / 100).toFixed(2)));
    }
  }
  select_cross() {
    this.selectedUserVal = null;
    this.isContainerVisible = 'none';
  }
  resetModal() {
    this.ResetAllControls();
  }
  keyPressNumbers(event, value: any, input: any) {
    var charCode = (event.which) ? event.which : event.keyCode;
    let val = parseInt(value);
    if (input == 'planPercentage') {
      if (val >= 10 || charCode > 31 && (charCode < 48 || charCode > 57)) {
        event.preventDefault();
        return false;
      }

    }
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      event.preventDefault();
      return false;
    } else {
      return true;
    }

  }
}
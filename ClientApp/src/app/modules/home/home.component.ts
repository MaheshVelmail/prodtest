import { DatePipe } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { Router } from '@angular/router';
import { ManageBySKUModel } from 'app/shared/models/manage-by-sku';
import { ExcelService } from 'app/shared/services/excel.service';
import { MessageService } from 'app/shared/services/message.service';
import { PermissionService } from 'app/shared/services/permission-service';
import { ProductionTrackerStorageService } from 'app/shared/services/production-tracker-storage-service.service';
import { SpinnerService } from 'app/shared/services/progress-spinner-configurable.service';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { HomeService } from './home.service';


@Component({
  selector: 'app-homepage',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class HomeComponent implements OnInit {
  BySKUcolumnList = ["plantName", "requestor", "productCode", "productDesc", "package", "superPackage", "casePerHourCapacity", "planPercentage", "casePerHour", "requestedOn", "action"];
  ByPackagecolumnList = ["plantName", "requestor", "package", "superPackage", "casePerHourCapacity", "planPercentage", "casePerHour", "requestedOn", "action"];
  BySuperPackagecolumnList = ["plantName", "requestor", "superPackage", "casePerHourCapacity", "planPercentage", "casePerHour", "requestedOn", "action"];
  panelOpenState = false;
  List: any
  bySuperPackageeditedData: ManageBySKUModel[];
  byPackageeditedData: ManageBySKUModel[];
  bySKUeditedData: ManageBySKUModel[];
  oEERequestbyNextYrbySuperPackageeditedData: ManageBySKUModel[];
  oEERequestbyNextYrbyPackageeditedData: ManageBySKUModel[];
  oEERequestbyNextYrbySKUeditedData: ManageBySKUModel[];
  approveRejectProductData: ManageBySKUModel[];
  deletedData: ManageBySKUModel[];
  plantlist: any;
  linelist: any;
  planbmodeldata: any;
  // myOeeReuest Datasource, paginator and sorting
  myOEERequestSuperPackagedataSource: MatTableDataSource<ManageBySKUModel>;
  @ViewChild('superPackagepaginator') superPackagepaginator: MatPaginator;
  @ViewChild('superPackagesort') superPackagesort: MatSort;
  myOEERequestPackagedataSource: MatTableDataSource<ManageBySKUModel>;
  @ViewChild('packagepaginator') packagepaginator: MatPaginator;
  @ViewChild('packagesort') packagesort: MatSort;
  myOEERequestSKUdataSource: MatTableDataSource<ManageBySKUModel>;
  @ViewChild('skupaginator') skupaginator: MatPaginator;
  @ViewChild('skusort') skusort: MatSort;
  myOEERequestSuperPackageCount: any
  myOEERequestPackageCount: any
  myOEERequestskuCount: any
  // OEERequestsForNextYear Datasource, paginator and sorting
  oEERequestsForNextYearSuperPackagedataSource: MatTableDataSource<ManageBySKUModel>;
  @ViewChild('oEERequestsForNextYearsuperPackagepaginator') oEERequestsForNextYearsuperPackagepaginator: MatPaginator;
  @ViewChild('oEERequestsForNextYearsuperPackagesort') oEERequestsForNextYearsuperPackagesort: MatSort;
  oEERequestsForNextYearPackagedataSource: MatTableDataSource<ManageBySKUModel>;
  @ViewChild('oEERequestsForNextYearpackagepaginator') oEERequestsForNextYearpackagepaginator: MatPaginator;
  @ViewChild('oEERequestsForNextYearpackagesort') oEERequestsForNextYearpackagesort: MatSort;
  oEERequestsForNextYearSKUdataSource: MatTableDataSource<ManageBySKUModel>;
  @ViewChild('oEERequestsForNextYearskupaginator') oEERequestsForNextYearskupaginator: MatPaginator;
  @ViewChild('oEERequestsForNextYearskusort') oEERequestsForNextYearskusort: MatSort;
  plantTypeData: any;
  linesDataByPlant: any;
  selectedplant: any;
  selectedline: any;
  isChecked: boolean
  element: any;
  rowValidationMsg: any;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  isYearEndChangeModel: any
  getLineId: any;
  disablesavebtn: boolean = true;
  model = { casePerHour: null };
  public casePerHour: any = {};
  byPackageNextYearRequestCount: any = 0;
  byPackageRequestCount: any = 0;
  bySKUNextYearRequestCount: any = 0;
  bySKURequestCount: any = 0;
  bySuperPackageNextYearRequestCount: any = 0;
  bySuperPackageRequestCount: any = 0
  noRequestMsg: any = "No request pending."
  permissiondata: any
  canUpdate: boolean
  canApprove: boolean
  canReject: boolean
  canDeleted: boolean
  userRole: any;
  showValidationMessage: boolean
  oeeRequestRecjectionForm: FormGroup;
  plantusergroupabbr = 'PU'
  oEEtype: any;
  oeeby: any;
  deleteOeeMessage: string;
  pendingOeeReqBySupfilterValueModel:any=''
  pendingOeeReqByPacfilterValueModel:any=''
  pendingOeeReqBySkufilterValueModel:any=''
  nextYrOeeReqBySupfilterValueModel:any=''
  nextYrOeeReqByPacfilterValueModel:any=''
  nextYrOeeReqBySkufilterValueModel:any=''
  nextYearBySkUDataForExcel:any;
  nextYearByPackageDataForExcel:any;
  nextYearBySuperPackageDataForExcel:any;
  deleteOeeRequestMsg:string;
  @ViewChild('rejectionModal', { static: false }) rejectionModal: ModalDirective;
  @ViewChild('deleteOEEConfirmationModal', { static: false }) deleteOEEConfirmationModal: ModalDirective;
  constructor(private excelService:ExcelService,public datepipe: DatePipe,public msgService: MessageService, public storageService: ProductionTrackerStorageService, public permissionService: PermissionService, private router: Router, public dialog: MatDialog, private changeRef: ChangeDetectorRef,
    private cdref: ChangeDetectorRef, private formBuilder: FormBuilder,
    private spinnerService: SpinnerService, private homeService: HomeService) {
    this.spinnerService.hide();
    this.getPermission();
    this.prodScreenRedirection()
    this.isYearEndChangeModel = true
    this.oeeRequestRecjectionForm = this.formBuilder.group({
      'oeeRequestId': new FormControl(''),
      'productId': new FormControl(''),
      'lineId': new FormControl(''),
      'comments': new FormControl('', [Validators.required]),
      'IsApproved': new FormControl(false),
      'oeeType': new FormControl('')
    });
  }
  // this mentod will be use for plantUser to redirect to prodrun page.
  prodScreenRedirection() {
    let groupAbbr = this.storageService.getLocalStorage('LoggedInUserInfo').groupAbbr;
    if (groupAbbr == this.plantusergroupabbr) {
      this.router.navigate(['prodrun']);
    }
  }
  ngOnInit() {
    this.getMyOEERequest('BYSUPERPACKAGE');
    this.getOEERequestsForNextYear('BYSUPERPACKAGE');
    this.bySuperPackageeditedData = [];
    this.byPackageeditedData = [];
    this.bySKUeditedData = [];
    this.oEERequestbyNextYrbySuperPackageeditedData = [];
    this.oEERequestbyNextYrbyPackageeditedData = [];
    this.oEERequestbyNextYrbySKUeditedData = [];
  }
  getPermission() {
    this.permissiondata = this.permissionService.getPermission(this.router.url)
    this.canUpdate = this.permissiondata[0].canU;
    this.canApprove = this.permissiondata[0].canA;
    this.canReject = this.permissiondata[0].canR;
    this.canDeleted = this.permissiondata[0].canD;
  }
  changeValue(event: any) {
    this.element = event;
  }
  pendingOeeRequests(e: any, array: any) {
    e.editable = false
    e.planPercentage = e.planPercentageOriginal;
    e.casePerHour = e.casePerHourOriginal;
    e.casePerHourCapacity = e.casePerHourCapacityOriginal
    const i = array.indexOf(e);
    if (i > -1) {
      array.splice(i, 1);
    }
    if (array.length > 0) {
      this.disablesavebtn = false;
    }
    else {
      this.disablesavebtn = true;
    }
    return array
  }
  undo(oeeRequestgrid: any, e: any, oEEType: any) {
    this.showValidationMessage = false;
    if (oeeRequestgrid == 'pendingOeeRequests') {
      switch (oEEType) {
        case "BYSUPERPACKAGE":
          this.bySuperPackageeditedData = this.pendingOeeRequests(e, this.bySuperPackageeditedData)
          break;

        case "BYPACKAGE":
          this.byPackageeditedData = this.pendingOeeRequests(e, this.byPackageeditedData)
          break;

        default:
          this.bySKUeditedData = this.pendingOeeRequests(e, this.bySKUeditedData)
          break;

      }
    }
    else {
      switch (oEEType) {
        case "BYSUPERPACKAGE":
          this.oEERequestbyNextYrbySuperPackageeditedData = this.pendingOeeRequests(e, this.oEERequestbyNextYrbySuperPackageeditedData)
          break;
        case "BYPACKAGE":
          this.oEERequestbyNextYrbyPackageeditedData = this.pendingOeeRequests(e, this.oEERequestbyNextYrbyPackageeditedData)
          break;

        default:
          this.oEERequestbyNextYrbySKUeditedData = this.pendingOeeRequests(e, this.oEERequestbyNextYrbySKUeditedData)
          break;

      }
    }
  }

  MyOEERequestapplyFilter(filterValue: string, oEERequestsType: string) {
    switch (oEERequestsType) {
      case 'MyOEERequestBySuperPackage':
        this.myOEERequestSuperPackagedataSource.filter = filterValue.trim().toLowerCase();
        break;
      case 'MyOEERequestByPackage':
        this.myOEERequestPackagedataSource.filter = filterValue.trim().toLowerCase();
        break;
      case 'MyOEERequestBySku':
        this.myOEERequestSKUdataSource.filter = filterValue.trim().toLowerCase();
        break;
      case 'oEERequestsForNextYearBySuperPackage':
        this.oEERequestsForNextYearSuperPackagedataSource.filter = filterValue.trim().toLowerCase();
        break;
      case 'oEERequestsForNextYearByPackage':
        this.oEERequestsForNextYearPackagedataSource.filter = filterValue.trim().toLowerCase();
        break;
      default:
        this.oEERequestsForNextYearSKUdataSource.filter = filterValue.trim().toLowerCase();
        break;
    }
  }
  onPendingOeeTabChange(event: MatTabChangeEvent) {
    this.disablesavebtn = true;
    let i = event.index
    switch (i) {
      case 0:
        this.getMyOEERequest('BYSUPERPACKAGE')
        break;

      case 1:
        this.getMyOEERequest('BYPACKAGE')
        break;

      default:
        this.getMyOEERequest('BYSKU')
        break;

    }
  }


  getMyOEERequest(oEEtype: string) {
    switch (oEEtype) {
      case 'BYSUPERPACKAGE':
        this.homeService.getMyOEERequest(oEEtype, false)
          .subscribe(data => {
            let res = data;
            if (data != null) {
              const Listdata: ManageBySKUModel[] = res.items;
              this.myOEERequestSuperPackagedataSource = new MatTableDataSource(Listdata);
              this.MyOEERequestapplyFilter(this.pendingOeeReqBySupfilterValueModel,'MyOEERequestBySuperPackage')
              this.bySuperPackageRequestCount = res.bySuperPackageRequestCount
              this.byPackageRequestCount = res.byPackageRequestCount
              this.bySKURequestCount = res.bySkuRequestCount
              setTimeout(() => this.myOEERequestSuperPackagedataSource.paginator = this.superPackagepaginator);
              setTimeout(() => this.myOEERequestSuperPackagedataSource.sort = this.superPackagesort);
              this.bySuperPackageeditedData = []
              this.spinnerService.hide();

            }
            this.spinnerService.hide();
          }, error => console.log(error));
        break;

      case 'BYPACKAGE':
        this.spinnerService.show();
        this.homeService.getMyOEERequest(oEEtype, false)
          .subscribe(data => {
            let res = data;
            if (res != null) {
              const Listdata: ManageBySKUModel[] = res.items;
              this.myOEERequestPackagedataSource = new MatTableDataSource(Listdata);
              this.MyOEERequestapplyFilter(this.pendingOeeReqByPacfilterValueModel,'MyOEERequestByPackage')
              this.bySuperPackageRequestCount = res.bySuperPackageRequestCount
              this.byPackageRequestCount = res.byPackageRequestCount
              this.bySKURequestCount = res.bySkuRequestCount
              this.myOEERequestPackagedataSource.paginator = this.packagepaginator;
              this.myOEERequestPackagedataSource.sort = this.packagesort;
              this.byPackageeditedData = []
              this.spinnerService.hide();
            }
            this.spinnerService.hide();

          }, error => console.log(error));
        break;

      default:
        this.spinnerService.show();
        this.homeService.getMyOEERequest(oEEtype, false)
          .subscribe(data => {
            let res = data;
            if (res != null) {
              const Listdata: ManageBySKUModel[] = res.items;
              this.myOEERequestSKUdataSource = new MatTableDataSource(Listdata);
              this.MyOEERequestapplyFilter(this.pendingOeeReqBySkufilterValueModel,'MyOEERequestBySku')
              this.bySuperPackageRequestCount = res.bySuperPackageRequestCount
              this.byPackageRequestCount = res.byPackageRequestCount
              this.bySKURequestCount = res.bySkuRequestCount
              this.myOEERequestSKUdataSource.paginator = this.skupaginator;
              this.myOEERequestSKUdataSource.sort = this.skusort;
              this.bySKUeditedData = []
              this.spinnerService.hide();
            }
            this.spinnerService.hide();
          }, error => console.log(error));
        break;
    }
  }
  onOeeRequestsForNextYearTabChange(event: MatTabChangeEvent) {
    this.disablesavebtn = true;
    let k = event.index
    switch (k) {
      case 0:
        this.getOEERequestsForNextYear('BYSUPERPACKAGE')
        break;
      case 1:
        this.getOEERequestsForNextYear('BYPACKAGE')
        break;
      default:

        this.getOEERequestsForNextYear('BYSKU')
        break;
    }
  }
  getOEERequestsForNextYear(oEEtype: string) {
    switch (oEEtype) {
      case 'BYSUPERPACKAGE':
        this.homeService.getMyOEERequest(oEEtype, true)
          .subscribe(data => {
            let res = data
            if (res != null) {
              const Listdata: ManageBySKUModel[] = res.items;
              this.nextYearBySuperPackageDataForExcel=Listdata;
              this.oEERequestsForNextYearSuperPackagedataSource = new MatTableDataSource(Listdata);
              this.MyOEERequestapplyFilter(this.nextYrOeeReqBySupfilterValueModel,'oEERequestsForNextYearBySuperPackage')
              this.bySuperPackageNextYearRequestCount = res.bySuperPackageNextYearRequestCount
              this.byPackageNextYearRequestCount = res.byPackageNextYearRequestCount
              this.bySKUNextYearRequestCount = res.bySkuNextYearRequestCount
              setTimeout(() => this.oEERequestsForNextYearSuperPackagedataSource.paginator = this.oEERequestsForNextYearsuperPackagepaginator);
              setTimeout(() => this.oEERequestsForNextYearSuperPackagedataSource.sort = this.oEERequestsForNextYearsuperPackagesort);
              this.oEERequestbyNextYrbySuperPackageeditedData = []
              this.spinnerService.hide();
            }
            this.spinnerService.hide();
          }, error => console.log(error));
        break;

      case 'BYPACKAGE':
        this.spinnerService.show();
        this.homeService.getMyOEERequest(oEEtype, true)
          .subscribe(data => {
            let res = data
            if (res != null) {
              const Listdata: ManageBySKUModel[] = res.items;
              this.nextYearByPackageDataForExcel=Listdata;
              this.oEERequestsForNextYearPackagedataSource = new MatTableDataSource(Listdata);
              this.MyOEERequestapplyFilter(this.nextYrOeeReqByPacfilterValueModel,'oEERequestsForNextYearByPackage')
              this.bySuperPackageNextYearRequestCount = res.bySuperPackageNextYearRequestCount
              this.byPackageNextYearRequestCount = res.byPackageNextYearRequestCount
              this.bySKUNextYearRequestCount = res.bySkuNextYearRequestCount
              this.oEERequestsForNextYearPackagedataSource.paginator = this.oEERequestsForNextYearpackagepaginator;
              this.oEERequestsForNextYearPackagedataSource.sort = this.oEERequestsForNextYearpackagesort;
              this.oEERequestbyNextYrbyPackageeditedData = []
              this.spinnerService.hide();
            }
            this.spinnerService.hide();
          }, error => console.log(error));
        break;

      default:
        this.spinnerService.show();
        this.homeService.getMyOEERequest(oEEtype, true)
          .subscribe(data => {
            let res = data
            if (res != null) {
              const Listdata: ManageBySKUModel[] = res.items;
              this.nextYearBySkUDataForExcel=Listdata;
              this.oEERequestsForNextYearSKUdataSource = new MatTableDataSource(Listdata);
              this.MyOEERequestapplyFilter(this.nextYrOeeReqBySkufilterValueModel,'oEERequestsForNextYearBySKU')
              this.bySuperPackageNextYearRequestCount = res.bySuperPackageNextYearRequestCount
              this.byPackageNextYearRequestCount = res.byPackageNextYearRequestCount
              this.bySKUNextYearRequestCount = res.bySkuNextYearRequestCount
              this.oEERequestsForNextYearSKUdataSource.paginator = this.oEERequestsForNextYearskupaginator;
              this.oEERequestsForNextYearSKUdataSource.sort = this.oEERequestsForNextYearskusort;
              this.oEERequestbyNextYrbySKUeditedData = []
              this.spinnerService.hide();
            }
            this.spinnerService.hide();
          }, error => console.log(error));
        break;


    }
  }
  ngAfterContentChecked() {
    this.cdref.detectChanges();

  }
  editOeeRequest(e: any, array: any) {
    e.editable = !e.editable;
    e.lineId = this.getLineId;
    array.push(e);
    if (array.length > 0) {
      this.disablesavebtn = false;
    }
    else {
      this.disablesavebtn = true;
    }
    return array
  }
  edit(oeeRequestgrid: any, e: any, oEEType: any) {
    if (oeeRequestgrid == 'pendingOeeRequests') {
      switch (oEEType) {
        case "BYSUPERPACKAGE":
          this.bySuperPackageeditedData = this.editOeeRequest(e, this.bySuperPackageeditedData)
          break;
        case "BYPACKAGE":
          this.byPackageeditedData = this.editOeeRequest(e, this.byPackageeditedData)
          break;
        default:
          this.bySKUeditedData = this.editOeeRequest(e, this.bySKUeditedData)
          break;
      }
    }
    else {
      switch (oEEType) {
        case "BYSUPERPACKAGE":
          this.oEERequestbyNextYrbySuperPackageeditedData = this.editOeeRequest(e, this.oEERequestbyNextYrbySuperPackageeditedData)
          break;
        case "BYPACKAGE":
          this.oEERequestbyNextYrbyPackageeditedData = this.editOeeRequest(e, this.oEERequestbyNextYrbyPackageeditedData)
          break;
        default:
          this.oEERequestbyNextYrbySKUeditedData = this.editOeeRequest(e, this.oEERequestbyNextYrbySKUeditedData)
          break;
      }
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
    switch (data) {
      case 'casePerHour':
        row.casePerHour = parseFloat(event.target.value).toFixed(2)
        let plantPercentage = parseFloat(((event.target.value / row.casePerHourCapacity) * 100).toFixed(2))
        row.planPercentage = plantPercentage > 100 ? 100 : plantPercentage
        if (plantPercentage > 100) {
          row.casePerHour = ((row.casePerHourCapacity * 100) / 100).toFixed(2)
        }
        break
      case 'casePerHourCapacity':
        row.casePerHourCapacity = event.target.value;
        row.planPercentage = parseFloat(((row.casePerHour / event.target.value) * 100).toFixed(2))
        break;
      default:
        row.planPercentage = parseFloat(event.target.value).toFixed(2);
        row.casePerHour = ((row.casePerHourCapacity * event.target.value) / 100).toFixed(2)
        break
    }
  }
  saveOeeReuqestApiCall(oeeType: any, oeeRequestgrid, array: any) {
    let pendingsupdataForValidation = array.filter(item => item.planPercentage == Infinity || item.planPercentage > 100 || isNaN(item.planPercentage) || item.casePerHourCapacity == 0)
    if (pendingsupdataForValidation.length != 0) {
      this.showValidationMessage = true;
      this.spinnerService.hide();
    }
    else {
      this.disablesavebtn = true;
      let isYearEndChange=oeeRequestgrid!='pendingOeeRequests'?true:false
      this.homeService.saveOEERequest(array, oeeType, isYearEndChange)
        .subscribe(() => {
          if (oeeRequestgrid == 'pendingOeeRequests') {
            this.getMyOEERequest(oeeType)
          }
          else {
            this.getOEERequestsForNextYear(oeeType)
          }
          this.spinnerService.hide();
        },
          error => console.log('save getMyOEERequest log', error)
        );



    }
  }
  exportAsXLSX(oeeRequestgrid: any, oeeType: any)
  {
    this.spinnerService.show();
   if(oeeRequestgrid == 'OeeRequestsForNextYr')
   {
    const date = this.datepipe;
    switch (oeeType) {
      case "BYSUPERPACKAGE":
        let superPackageexportData
        if(this.nextYearBySuperPackageDataForExcel!=null)
        {
          superPackageexportData=this.nextYearBySuperPackageDataForExcel.map(function(elem) {
            return {
              'Plant/Line': elem.plantDesc +'('+ elem.plantName +')/'+ elem.lineName,
              'Requester': elem.requestor,
              'Super Package': elem.superPackage,
              'Case/hr Capacity':elem.casePerHourCapacity,
              '% Plan':elem.planPercentage,
              'Case/hr Plan':elem.casePerHour,
              'Requested On':date.transform(elem.requestedOn,'dd/MM/yyyy'),
            }});
            this.excelService.exportAsExcelFile(superPackageexportData, 'SuperPackage_RequestsForNextYr');
        this.spinnerService.hide();
        }
        break;

      case "BYPACKAGE":
        let PackageexportData
        if(this.nextYearByPackageDataForExcel!=null)
        {
          PackageexportData=this.nextYearBySuperPackageDataForExcel.map(function(elem) {
            return {
              'Plant/Line': elem.plantDesc +'('+ elem.plantName +')/'+ elem.lineName,
              'Requester': elem.requestor,
              'Package':elem.package,
              'Super Package': elem.superPackage,
              'Case/hr Capacity':elem.casePerHourCapacity,
              '% Plan':elem.planPercentage,
              'Case/hr Plan':elem.casePerHour,
              'Requested On':date.transform(elem.requestedOn,'dd/MM/yyyy'),
            }});
            this.excelService.exportAsExcelFile(PackageexportData, 'Package_RequestsForNextYr');
        this.spinnerService.hide();
        }
        break;
      default:
        let skuexportData
        if(this.nextYearBySkUDataForExcel!=null)
        {
          skuexportData=this.nextYearBySkUDataForExcel.map(function(elem) {
            return {
              'Plant/Line': elem.plantDesc +'('+ elem.plantName +')/'+ elem.lineName,
              'Requester': elem.requestor,
              'SKU':elem.productCode,
              'Product Description:':elem.productDesc,
              'Package':elem.package,
              'Super Package': elem.superPackage,
              'Case/hr Capacity':elem.casePerHourCapacity,
              '% Plan':elem.planPercentage,
              'Case/hr Plan':elem.casePerHour,
              'Requested On':date.transform(elem.requestedOn,'dd/MM/yyyy'),
            }});
            this.excelService.exportAsExcelFile(skuexportData, 'SKU_RequestsForNextYr');
        this.spinnerService.hide();
        }
        break;
    }
   }
  }
  saveOEERequest(oeeRequestgrid: any, oeeType: any) {
    this.spinnerService.show();
    this.showValidationMessage = false;
    if (oeeRequestgrid == 'pendingOeeRequests') {
      switch (oeeType) {
        case "BYSUPERPACKAGE":
          this.saveOeeReuqestApiCall('BYSUPERPACKAGE', oeeRequestgrid, this.bySuperPackageeditedData)
          break;

        case "BYPACKAGE":
          this.saveOeeReuqestApiCall('BYPACKAGE', oeeRequestgrid, this.byPackageeditedData)
          break;
        default:
          this.saveOeeReuqestApiCall('BYSKU', oeeRequestgrid, this.bySKUeditedData)
          break;
      }
    }
    else {
      switch (oeeType) {
        case "BYSUPERPACKAGE":
          this.saveOeeReuqestApiCall('BYSUPERPACKAGE', oeeRequestgrid, this.oEERequestbyNextYrbySuperPackageeditedData)
          break;

        case "BYPACKAGE":
          this.saveOeeReuqestApiCall('BYPACKAGE', oeeRequestgrid, this.oEERequestbyNextYrbyPackageeditedData)
          break
        default:
          this.saveOeeReuqestApiCall('BYSKU', oeeRequestgrid, this.oEERequestbyNextYrbySKUeditedData)
          break;

      }
    }

  }
  approveRejectOEERequest(approveReject: any, product_data: any, oEEType: any) {
    if (approveReject == 'reject') {
      this.oeeRequestRecjectionForm.get('oeeType').setValue(oEEType);
      this.oeeRequestRecjectionForm.get('lineId').setValue(product_data.lineId);
      this.oeeRequestRecjectionForm.get('oeeRequestId').setValue(product_data.oeeRequestId);
      this.oeeRequestRecjectionForm.get('productId').setValue(product_data.productId);
      this.rejectionModal.show();
    }
    else {
      product_data.isApproved = true;
      this.spinnerService.show();
      this.homeService.approveRejectOEERequest(product_data, oEEType)
        .subscribe(() => {
          this.getMyOEERequest(oEEType)
          this.spinnerService.hide();
        },
          error => console.log('approve OEERequest log', error)
        );
    }

  }
  rejectOeeRequest(formdata: any) {
    let oeeType = formdata.oeeType;
    if (oeeType != undefined) {
      this.spinnerService.show();
      this.rejectionModal.hide();
      this.homeService.approveRejectOEERequest(formdata, oeeType)
        .subscribe(() => {
          this.oeeRequestRecjectionForm.get('comments').reset();
          this.getMyOEERequest(oeeType)
          this.spinnerService.hide();
        },
          error => console.log('insert line log', error)
        );
    }

  }
  oncloseClick() {
    this.rejectionModal.hide();
  }
  changeLocation() {

    // save current route first
    const currentRoute = this.router.url;

    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.dialog.closeAll()
      this.router.navigate([currentRoute]); // navigate to same route


    });
  }

  confirmedForDeleteOee() {
    this.spinnerService.show();
    let data = this.deletedData[0]
    this.homeService.DeleteOEERequest(data,this.oeeby, this.oEEtype)
      .subscribe(response => {
        this.msgService.displaySuccessMessage(response.message);
        this.deletedData = [];
        this.onCloseclick()
        if(this.oeeby=='pendingOeeRequests')
        {
        this.getMyOEERequest(this.oEEtype)
        }
        else
        {
          this.getOEERequestsForNextYear(this.oEEtype)
        }
        this.spinnerService.hide();
      },
        error => console.log('Delete OEE Request', error)
      );
  }
  onCloseclick() {
    this.spinnerService.hide();
    this.deletedData = []
    this.deleteOEEConfirmationModal.hide();
  }
  DeleteConfirmed(oeeby: any,row: any,oEEtype: any) {
    this.oeeby = oeeby
    this.oEEtype = oEEtype;
    this.deletedData = [];
    this.deletedData.push(row)
    if(oeeby=='pendingOeeRequests')
    {
     this.deleteOeeRequestMsg='Are you sure you want to delete this Adhoc request?'
    }
    else
    {
      this.deleteOeeRequestMsg='Are you sure you want to delete this year end request?'
    }
    this.deleteOEEConfirmationModal.show()
  }
}

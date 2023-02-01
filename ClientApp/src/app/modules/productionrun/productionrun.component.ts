import { SelectionModel } from '@angular/cdk/collections';
import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { DatePipe } from '@angular/common';
import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSelect } from '@angular/material/select';
import { MatSort } from '@angular/material/sort';
import { MatStepper } from '@angular/material/stepper';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { ProdRunModel, ProdrunDownTimesModel } from 'app/shared/models/prod-run';
import { PermissionService } from 'app/shared/services/permission-service';
import { ProductionTrackerStorageService } from 'app/shared/services/production-tracker-storage-service.service';
import { SpinnerService } from 'app/shared/services/progress-spinner-configurable.service';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { ProductionrunService } from './productionrun.service';
@Component({
  selector: 'app-productionrun',
  templateUrl: './productionrun.component.html',
  styleUrls: ['./productionrun.component.css'],
  encapsulation: ViewEncapsulation.None,
  providers: [{
    provide: STEPPER_GLOBAL_OPTIONS, useValue: { showError: true }
  }]
})
export class ProductionrunComponent implements OnInit {
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  columnListfirstFormGroup = ["sequenceNumber", "productCode", "productDesc", "runDuration", "planQuantity", "capacityQuantity", "actualQuantity", "perEff", "prodrunaction"];
  columnListsecondFormGroup = ["sequenceNumber", "type", "downtimeReasonDesc", "downtimeReasonDetailDesc", "downtimeDuration", "laborreleased", "downtimeaction"];
  List: any
  plantlist: any;
  linelist: any;
  planbmodeldata: any;
  firstFormdataSource: MatTableDataSource<ProdRunModel>[];
  secondFormdataSource: MatTableDataSource<ProdrunDownTimesModel>[];
  @ViewChild('firstFormdataSourcepaginator') firstFormdataSourcepaginator: MatPaginator[];
  @ViewChild('firstFormdataSourcesort') firstFormdataSourcesort: MatSort[];
  @ViewChild('secondFormdataSourcepaginator') secondFormdataSourcepaginator: MatPaginator;
  @ViewChild('secondFormdataSourcesort') secondFormdataSourcesort: MatSort;
  plantTypeData: any;
  linesDataByPlant: any;
  selectedplant: any;
  selectedline: any;
  selectedshift: any
  selectedDate = new Date();
  isChecked: boolean
  disablesavebtn: boolean = true;
  hiddensavebtn: boolean = true;
  disableAddbtn: boolean = true;
  inputboxError: boolean;
  element: any;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  isYearEndChangeModel: any
  getLineId: any;
  getPlantId: any;
  model = { casePerHour: null };
  public casePerHour: any = {};
  // Add new sku section
  @ViewChild('addeditModal', { static: false }) addeditModal: ModalDirective;
  validationForm: FormGroup;
  Form: FormGroup;
  submitted = false;
  searchedData: any = [];
  timeout: any = null;
  time: any;
  isVisible: string = 'none';
  selectedUserVal: any;
  isContainerVisible: string = 'none';
  showSkuDetail: boolean
  panelOpenState = false;
  permissiondata: any
  showValidationMessage: boolean
  @ViewChild('resetbtn') resetbtn: ElementRef;
  @ViewChild('contentDivPrint') divPrint: ElementRef;
  firstFormselection = new SelectionModel<Element>(true, []);
  secondFormselection = new SelectionModel<Element>(true, []);
  Isstepperhidden: boolean = true;
  shiftbyLineData: any
  productionrunData: any
  editInput: boolean;
  shiftDurationHrInput: any
  shiftDurationMinInput: any
  durationHrInput: any
  durationMinInput: any
  shiftDurationInputOnPrint: any = "0 hrs 0 mins"
  WorkHourBasedOnEfficienty: any;
  searchedProductCodeData: any;
  DataForValidation: any;
  isEmptyrow: boolean;
  sumProduced: any
  sumRunDuration: any
  preparedFirstFormData: any[];
  editedFirstFormData: any[];
  preparedSecondFormData: any[];
  editedSecondFormData: any[];
  remainingRunDuration: any;
  sumDurationBasedOnEfficiency: any;
  totalPerOfEff: any;
  downtimeDetails: any = 0;
  secondFormDowntimeDetails: any;
  rowValidationMsg: any;
  typesData: any;
  reasonCode: any;
  reasonDetail: any;
  laborReleasedData: any;
  downtimeHr: any = 0;
  downtimeMin: any
  selectedType: any;
  filteredDowntimeReasonTypList:any=[]
  filteredDowntimeReasonCodeList:any=[]
  filteredDowntimeReasonDetailList:any=[]
  plantTypeDataList:any=[]
  linesDataByPlantList:any=[]
  @ViewChild("stepper", { static: false }) stepper: MatStepper;
  @ViewChild(MatSelect) select: MatSelect;
  isProductionDowntimesData: boolean
  allReasonCodesData: any;
  allReasonDetailsData: any;
  typeoptionDefaultval: any;
  editedSecondFormsumDuration: any=0;
  isGobtnDisable: boolean = false
  timemask = [/[0-2]/, /\d/, ':', /[0-5]/, /\d/]
  myModel: any
  hideTypeSelection: boolean
  hideReasonCodeSelection: boolean
  hideReasonDetailSelection: boolean
  hidelaborReleasedSelection: boolean
  showPlantLineOnNextClick: boolean
  displayplantName: any;
  displaylineName: any;
  displayDate: any;
  displayDateOnPrint: any;
  displayShiftName: any;
  minDate = new Date();
  maxDate = new Date();
  isFirstFormSelected: boolean;
  groupName: string;
  isFirstFormEmpty: boolean;
  shiftDurationHour: any;
  shiftDurationMinute: any
  UpdateRunDurationHr: any;
  UpdateRunDurationMin: any;
  canInsert:any;
  canUpdate:any;
  canDelete:any;
  printSecondForm: any;
  loggedInUserGroup: any;
  showProdRunDeleteButton= false;
  durationHrInputVaue:any; 
  hideNextBtn:boolean=false;
  hideDummySKUNextBtn:boolean=true;
  dummySKUProductId:any
  dummySKUProductCode:any
  dummySKUDetailsFromAPI:any;
  productionHeaderDetails:any;
  existingShiftDuration:any;
  maxShiftduration:any=1440   //Allowed max 1440 mins or 24 hr shift duration for a production day on that line 
  prodRunSumOfShiftDuration:any=0;
  disableNextButton:any=false;
  prodrunallshiftDetails:any;
  shiftValidationMsg:any;
  prepareShiftDetails:any;
  diffInSavedAndEnteredShiftDuration:any
  enteredNewShiftDurationVal:any
  diffInPositive:any;
  @ViewChild('shiftDurationInputControl') shiftDurationInputControl: ElementRef;
  @ViewChild('prodCodeInputControl') prodCodeInputControl: ElementRef;
  @ViewChild('confirmModal', { static: false }) confirmModal: ModalDirective;
  @ViewChild('deleteProdRunconfirmModal', { static: false }) deleteProdRunconfirmModal: ModalDirective;
  @ViewChild('alertModal', { static: false }) alertModal: ModalDirective;
  @ViewChild('shiftalertModal', { static: false }) shiftalertModal: ModalDirective;
  @ViewChild('alertDummySKUModal', { static: false }) alertDummySKUModal: ModalDirective;
  @ViewChild('productCodeNotFoundModal', { static: false }) productCodeNotFoundModal: ModalDirective;
  @ViewChild('printModal', { static: false }) printModal: ModalDirective;
  confirmationDialogTitle: string = 'Are you sure you want to remove the selected record(s)?'
  confirmationMsg: string = 'Selected record(s) will be removed from the screen temporarily. If you wish to undo your changes, just click the cancel button. But, once you save your changes, all the selected record(s) will be removed permanently.'
  confirmationProdRunDeleteDialogTitle: string = 'Are you sure you want to delete the production data for this shift?'
  deleteProdRunconfirmationMsg:any
  constructor(public storageService: ProductionTrackerStorageService, public datepipe: DatePipe, private _formBuilder: FormBuilder, private router: Router, public permissionService: PermissionService, public dialog: MatDialog, private changeRef: ChangeDetectorRef, private cdref: ChangeDetectorRef, private spinnerService: SpinnerService, private productionrunService: ProductionrunService) {
    this.getPermission();
    this.allowBackDateEntries();
    this.spinnerService.hide();
    this.isYearEndChangeModel = false
    this.getDefaultPlant();
    this.getPlantList();
    //this.getTypes();
    this.getAllReasonCodes();
    this.getAllReasonDetails();

  }
  setFocusToShiftDuration() {
    setTimeout(() => {
      this.shiftDurationInputControl.nativeElement.focus();
    }, 150);
  }
  setFocusToProdCode() {
    setTimeout(() => {
      this.prodCodeInputControl.nativeElement.focus();
    }, 150);
  }
  getDummySKU()
  {
    let dummySkUDetailsFromAPI = this.storageService.getLocalStorage('LoggedInUserInfo').dummySku;
    this.dummySKUDetailsFromAPI =dummySkUDetailsFromAPI;
    this.dummySKUProductCode=dummySkUDetailsFromAPI.productCode;
  }
  ngOnInit() {
    this.editedFirstFormData = [];
    this.editedSecondFormData = [];
    this.firstFormGroup = this._formBuilder.group({
      firstCtrl: ['']
    });
    this.secondFormGroup = this._formBuilder.group({
      secondCtrl: ['']
    });
    this.groupName = this.storageService.getLocalStorage('LoggedInUserInfo').displayname;
    this.getDummySKU();
  }
  allowBackDateEntries() {
    this.maxDate.setDate(this.maxDate.getDate())
    this.loggedInUserGroup = this.storageService.getLocalStorage('LoggedInUserInfo').groupAbbr;
    if (this.loggedInUserGroup== "PM") {
      this.minDate.setDate(this.minDate.getDate() - 30);
    }
    else if (this.loggedInUserGroup=="PU") {
      this.minDate.setDate(this.minDate.getDate() - 7);
    }
    else {
      this.minDate = null
    }
  }

  getDefaultPlant() {
    let plantlist = this.storageService.getLocalStorage('LoggedInUserInfo').userPlants;
    let defaultplant = plantlist.filter(item => item.isDefaultPlant);
    if (defaultplant.length != 0) {
      this.selectedplant = defaultplant[0].plantId
      this.getLinesByPlant(this.selectedplant)
    }
  }
  setTime(e): void {
    this.time = e.target.value;
  }
  Go() {
    this.disableNextButton=false;
    this.secondFormDowntimeDetails=0
    this.editedSecondFormsumDuration=0
    this.sumProduced=0
    this.remainingRunDuration=0
    this.shiftDurationHrInput=0
    this.shiftDurationMinInput=0
    this.downtimeHr = 0
    this.downtimeMin = 0
    this.downtimeDetails=0
    this.totalPerOfEff=0
    this.editedFirstFormData = []
    this.isFirstFormEmpty = true
    this.Isstepperhidden = false;
    this.setFocusToShiftDuration();
    this.getPlantLineDateShift();
    this.showPlantLineOnNextClick = true;
    this.hiddensavebtn = false
    this.GetAllDownTimeReasonTypesByLineType()
    this.LoadProductionRun();
    this.laborReleased();
    this.stepper.previous();
    this.isGobtnDisable = true;
    this.hideNextBtn=false;
    this.hideDummySKUNextBtn=true;
  }
  Cancel() {
    this.productionrunData = []
    this.Isstepperhidden = true;
    this.showPlantLineOnNextClick = false;
    this.firstFormdataSource = []
    this.secondFormdataSource = [];
    this.editedFirstFormData = [];
    this.editedSecondFormData = [];
    this.isGobtnDisable = false
    this.downtimeHr = 0
    this.downtimeDetails = 0
    this.shiftDurationHrInput = ''
    this.shiftDurationMinInput = ''
    this.sumProduced = 0
    this.remainingRunDuration = 0
    this.totalPerOfEff = 0;
    this.firstFormselection.clear()
    this.secondFormselection.clear()
    this.isfirstFormAllSelected();
    this.issecondFormMAllSelected();
    this.stepper.previous()

  }
  changeValue(event: any) {
    this.element = event;
  }
  ngAfterContentChecked() {
    this.cdref.detectChanges();

  }
  getShiftByLine(lineId:any)
  {
    this.spinnerService.show()
  this.productionrunService.getShiftbyLineId(lineId)
      .subscribe(data => {
        this.shiftbyLineData = data;
        this.selectedshift=undefined;
        this.spinnerService.hide()
      }, error => console.log(error));
  }
  getPlantList() {
    this.productionrunService.getPlant()
      .subscribe(data => {
        this.plantTypeData = data;
        this.plantTypeDataList=data
      }, error => console.log(error));
  }
  getLinesByPlant(id: any) {
    this.getPlantId = id;
    this.spinnerService.show()
    this.productionrunService.getLinesByPlant(id)
      .subscribe(data => {
        this.linesDataByPlant = data;
        this.linesDataByPlantList = data;
        this.selectedline=undefined;
        this.selectedshift=undefined;
        this.spinnerService.hide()
      }, error => console.log(error));

  }
  getPlantLineDateShift() {
    let getPlantName = this.plantTypeData.filter(item => item.plantId == this.selectedplant)
    this.displayplantName = getPlantName[0].plantDesc + ' (' + getPlantName[0].plantName + ')'
    let getLineName = this.linesDataByPlant.filter(item => item.lineId == this.selectedline)
    this.displaylineName = getLineName[0].lineName
    this.displayDate = this.datepipe.transform(this.selectedDate, 'MM/dd/yyyy');
    let getShiftName = this.shiftbyLineData.filter(item => item.shiftId == this.selectedshift)
    this.displayShiftName = getShiftName[0].shiftName
    this.displayDateOnPrint = this.datepipe.transform(this.selectedDate, 'MM/dd/yyyy');
  }
  select_cross() {
    this.selectedUserVal = null;
    this.isContainerVisible = 'none';
  }
  //firstForm contains productionRuns details and seconnd form contains productionDowntimes details
  saveFirstSecondFormData() {
    if(this.editedFirstFormData.length==1)
    {
      if(this.editedFirstFormData[0].productCode===this.dummySKUProductCode)
      {       this.secondFormDowntimeDetails=this.downtimeDetails
      }

    }
      let checkDuration = this.secondFormDowntimeDetails - this.editedSecondFormsumDuration
      if (checkDuration != 0) {

          this.rowValidationMsg = "You must account for all downtime calculated. You have " + checkDuration + " mins remaining."
          this.alertConform();

      }
      else {
        let getEmptydowntimeReasonTypeDesc = this.editedSecondFormData.filter(item => item.downtimeReasonTypeDesc === "" || item.downtimeReasonTypeId==="" || item.downtimeReasonTypeId===0)
        let getEmptydowntimeReasonCodeDesc = this.editedSecondFormData.filter(item => item.downtimeReasonCodeDesc === "" || item.downtimeReasonCodeId==="" || item.downtimeReasonCodeId===0)
        let getEmptydowntimeReasonDetailDesc = this.editedSecondFormData.filter(item => item.downtimeReasonDetailId==="" || item.downtimeReasonDetailId===0)
        let getEmptydowntimeDuration = this.editedSecondFormData.filter(item => item.downtimeDuration === "")
        if (getEmptydowntimeReasonTypeDesc.length != 0) {
          this.rowValidationMsg = "Please fill the type before saving the form.";
          this.alertConform();
        }
        else if (getEmptydowntimeReasonCodeDesc.length != 0) {
          this.rowValidationMsg = "Please fill the reason code before saving the form.";
          this.alertConform();
        }
        else if (getEmptydowntimeReasonDetailDesc.length != 0) {
          this.rowValidationMsg = "Please fill the reason detail before saving the form.";
          this.alertConform();
        }
        else if (getEmptydowntimeDuration.length != 0) {
          this.rowValidationMsg = "Please remove the empty row(s) or fill valid data in them before saving the form.";
          this.alertConform();
        }
        else {
          this.spinnerService.show();
          let formattedDate = this.datepipe.transform(this.selectedDate, 'yyyy-MM-dd');
          
          let shiftDurationHrInput=this.shiftDurationHrInput==''?0:this.shiftDurationHrInput
    let  shiftDurationMinInput=this.shiftDurationMinInput==''?0:this.shiftDurationMinInput
          let shiftDurationdurationinMinute = (parseInt(shiftDurationHrInput) * 60) + parseInt(shiftDurationMinInput)
          // assign shiftDurationdurationinMinute to dummy sku run duration
          // let checkdummysku=this.editedFirstFormData.filter(item=>item.productCode==this.dummySKUProductCode);
          // if(checkdummysku.length>0)
          // {
          //   this.editedFirstFormData[0].runDuration = shiftDurationdurationinMinute;
          // }
          // if prodrun(firstform) is empty
          let prepareEditedFirstFormDataForEmptyProdrun = 
            [{
              actualQuantity:0,
              actualQuantityOriginal: 0,
              capacityQuantity:0,
              capacityQuantityOriginal: 0,
              headerId: 0,
              planQuantity: 0,
              planQuantityOriginal: 0,
              productCode: 0,
              productDesc: 0,
              productId: 0,
              runDuration: 0,
              runDurationOriginal: 0,
              runId: 0,
              sequenceNumber: 0,
            }]
          let prepareEditedFirstFormData = this.editedFirstFormData.map(function (elem) {
            return {
              actualQuantity:elem.actualQuantity,
              actualQuantityOriginal: elem.actualQuantityOriginal,
              capacityQuantity: isNaN(elem.capacityQuantity)?0:elem.capacityQuantity,
              capacityQuantityOriginal: elem.capacityQuantityOriginal,
              headerId: elem.headerId,
              planQuantity: isNaN(elem.planQuantity)?0:elem.planQuantity,
              planQuantityOriginal: elem.planQuantityOriginal,
              productCode: elem.productCode,
              productDesc: elem.productDesc,
              productId: elem.productId,
              runDuration: elem.runDuration,
              runDurationOriginal: elem.runDurationOriginal,
              runId: elem.runId,
              sequenceNumber: elem.sequenceNumber
            }
          },this);
          let params = {
            productionHeader: {
              plantId: this.selectedplant,
              lineId: this.selectedline,
              runDate: formattedDate,
              shiftId: this.selectedshift,
              shiftDuration: shiftDurationdurationinMinute
            },
            productionRuns: this.editedFirstFormData.length>0? prepareEditedFirstFormData:prepareEditedFirstFormDataForEmptyProdrun,
            productionDowntimes: this.editedSecondFormData
          }
          this.productionrunService.addProductRun(params)
            .subscribe((response) => {
              if(response.data==-1)
              {
                this.isGobtnDisable = false
              }
              else
              {
                this.spinnerService.hide();
                this.editedFirstFormData = [];
                this.editedSecondFormData = [];
                this.firstFormGroup = this._formBuilder.group({
                  firstCtrl: ['']
                });
                this.secondFormGroup = this._formBuilder.group({
                  secondCtrl: ['']
                });
                this.showPlantLineOnNextClick = false
                this.selectedDate = new Date();
                this.productionrunData = []
                this.firstFormdataSource = []
                this.secondFormdataSource = []
              }
              
            },
              error => {
                console.log('save saveProductRun', error)
                this.spinnerService.hide();
                this.isGobtnDisable = false
              }
            );
          this.Isstepperhidden = true;
          this.isGobtnDisable = false
        }

      }
  }
  backClick(){
    this.stepper.previous();
  }
  // get user's role permission
  getPermission() {
    this.permissiondata = this.permissionService.getPermission(this.router.url)
    this.canInsert = this.permissiondata[0].canI;
    this.canUpdate = this.permissiondata[0].canU;
    this.canDelete = this.permissiondata[0].canD;  
  }
  // get productionRuns & productionDowntimes details
  LoadProductionRun() {
    this.showProdRunDeleteButton=false
    this.spinnerService.show();
    let formattedDate = this.datepipe.transform(this.selectedDate, 'yyyy/MM/dd');
    this.productionrunService.loadProdRun(this.selectedplant, this.selectedline, formattedDate, this.selectedshift)
      .subscribe(data => {
        this.spinnerService.hide();
        if (data != 1) {
          this.productionrunData = data;
          let prodrunsData = this.productionrunData.productionRuns
          this.productionHeaderDetails=this.productionrunData.productionHeaderDetails
          let productionDowntimesData = this.productionrunData.productionDowntimes
          this.prodrunallshiftDetails = this.productionrunData.productionRunShiftDetails
          this.prodRunSumOfShiftDuration= this.prodrunallshiftDetails.map(t => t.shiftDuration).reduce((acc, value) => acc + value, 0)
          // if (prodrunsData.length != 0) {
            this.showProdRunDeleteButton=true
            if (productionDowntimesData.length > 0) {
              this.isProductionDowntimesData = true;
            }
            let prepareProdDowntimeData = productionDowntimesData.map(function (elem) {
              return {
                typesData:this.typesData,
                downtimeDuration: elem.downtimeDuration,
                downtimeId: elem.downtimeId,
                downtimeReasonCodeDesc: elem.downtimeReasonCodeDesc,
                downtimeReasonCodeId: elem.downtimeReasonCodeId,
                downtimeReasonDetailDesc: elem.downtimeReasonDetailDesc,
                downtimeReasonDetailId: elem.downtimeReasonDetailId,
                downtimeReasonTypeDesc: elem.downtimeReasonTypeDesc,
                downtimeReasonTypeId: elem.downtimeReasonTypeId,
                downtimeReasonCode: elem.downtimeReasonCodes,
                downtimeReasonDetail: elem.downtimeReasonDetails,
                headerId: elem.headerId,
                labourReleased: elem.labourReleased,
                sequenceNumber: elem.sequenceNumber
              }
            },this);
            this.editedFirstFormData = prodrunsData;
            if (this.editedFirstFormData.length != 0) {
              this.isFirstFormEmpty = false;
            }
            // firstFormdataSource will be use to bind the records of productionRuns data into firstFormGroup(productionRuns form).
            this.firstFormdataSource = prodrunsData;
            // secondFormdataSource will be use to bind the records of ProdDowntime data into secondFormGroup (ProdDowntimeform).
            this.secondFormdataSource = prepareProdDowntimeData;
            this.editedSecondFormData = prepareProdDowntimeData;
            this.editedSecondFormsumDuration = this.editedSecondFormData.map(t => t.downtimeDuration).reduce((acc, value) => acc + value, 0)
          
          // else {
          //   if(this.canInsert)
          //   {
          //   this.editedFirstFormData.push({ productCode: "", productDesc: "", runDuration: "", planQuantity: 0, capacityQuantity: 0, actualQuantity: 0, headerId: 0, item: '', productId: 0, runId: 0, sequenceNumber: this.editedFirstFormData.length + 1 })
          //   this.firstFormdataSource = [...this.editedFirstFormData];
          //   this.isFirstFormEmpty = false
          //   }
          // }
        }
        this.calculateProduced(); //this method will be use to calcute total produced.
        this.calculateshiftDurationInput();//this method will be use to calculate shift duration hour and minute.
        this.calculateTotalDownTimeAndPerOfEff(); //this method will be use to calculate total downtime and percentage efficiency.
      }, error => {
        console.log(error)
        this.spinnerService.hide();
      });
  }
  // get product details by SKU (Prodcut Code).
  GetProductBySKU(r: any, productCodeVal: any) {
    r.planQuantity = "";
    r.capacityQuantity = "";
    r.actualQuantity = "";
    r.runDuration = "";
    r.planQuantityOriginal ="";
    r.capacityQuantityOriginal ="";
    r.runDurationOriginal="";
    if (productCodeVal != "") {
      //check dummy sku
      if(productCodeVal==this.dummySKUProductCode)
       {
        let checkdummySKU = this.editedFirstFormData.filter(item => (item.productCode===this.dummySKUProductCode))
          if(checkdummySKU.length>=1)
          {
           //this.isFirstFormEmpty=true;
          // this.adjustCalculation();
           this.alertDummySKUModal.show();
          }
          else
          {
            this.getDummySkUDetails(r)
            this.updateInsertFirstFormData(r)
            this.calculateTotalDownTimeAndPerOfEff()
            //this.dummySKUResetCal();
          }
       }
       else
       {
        this.hideNextBtn=false;
        this.hideDummySKUNextBtn=true;
        this.productionrunService.GetProductBySKU(this.selectedline, productCodeVal)
        .subscribe(data => {
          if (data != null) {
            this.searchedProductCodeData = data;
            r.productCode = this.searchedProductCodeData.productCode;
            r.productId = this.searchedProductCodeData.productId;
            r.productDesc = this.searchedProductCodeData.productDesc;
            r.planQuantity = parseFloat(this.searchedProductCodeData.planQuantity).toFixed(0)
            r.capacityQuantity = parseFloat(this.searchedProductCodeData.capacityQuantity).toFixed(0)
            r.planQuantityOriginal = this.searchedProductCodeData.planQuantityOriginal;
            r.capacityQuantityOriginal = this.searchedProductCodeData.capacityQuantityOriginal;
            r.runDurationOriginal = 60;
            r.runDuration = 0;//making it 0 to avoid pre-filling of any duration
           
            this.updateInsertFirstFormData(r)
          }
          else {
            // in case of  No record found
            r.productDesc = 'No record found.';
            r.planQuantity = "";
            r.capacityQuantity = "";
            r.actualQuantity = "";
            r.runDuration = "";
            this.updateInsertFirstFormData(r)
            this.productCodeNotFoundModal.show();
          }
        }, error => console.log(error));
       }
      }
    // else
    // {
    //   r.actualQuantity=0;
    //   r.capacityQuantity=0;
    //   r.capacityQuantityOriginal=0;
    //   r.headerId=0;
    //   r.item=0;
    //   r.perEff=0;
    //   r.planQuantity=0;
    //   r.actualQuantityOriginal=0;
    //   r.planQuantityOriginal=0;
    //   r.productCode="";
    //   r.productDesc="";
    //   r.productId=0;
    //   r.runDurationOriginal=0;
    //   r.runDuration=0;
    //   r.runId=0;
    //   this.updateInsertFirstFormData(r)
    //   this.calculateTotalDownTimeAndPerOfEff();
    //   this.calculateProduced();
    // }
}
// This menthod will be use to check the Shift duration value on Product Code input focus.
checkShiftDuration()
{
  let shiftDurationHrInput=this.shiftDurationHrInput==''?0:this.shiftDurationHrInput
    let  shiftDurationMinInput=this.shiftDurationMinInput==''?0:this.shiftDurationMinInput
  let shiftDurationdurationinMinute = (parseInt(shiftDurationHrInput) * 60) + parseInt(shiftDurationMinInput)
  if(shiftDurationdurationinMinute==0)
  {
    this.rowValidationMsg = "Please enter shift duration.";
    this.alertConform();
  }
}
emptycheckForProductCodeProducedQuantity(getEmptyfield:any)
{
  if(getEmptyfield.productCode==="")
  {
    this.rowValidationMsg = "Please fill in the details for product code for  Item " +getEmptyfield.sequenceNumber + " before adding new Item."
    this.alertConform();
  }
  if(getEmptyfield.actualQuantity==="" && getEmptyfield.productCode==="")
  {
    this.rowValidationMsg = "Please fill in the details for product code & produced quantity for  Item " +getEmptyfield.sequenceNumber + " before adding new Item."
    this.alertConform();
  }
  if(getEmptyfield.actualQuantity==="" && getEmptyfield.productCode!=="")
  {
    this.rowValidationMsg = "Please fill in the details for produced quantity for  Item " +getEmptyfield.sequenceNumber + " before adding new Item."
    this.alertConform();
  }
  if(getEmptyfield.productCode==="" && getEmptyfield.actualQuantity!=="" && getEmptyfield.runDuration!==0)
  {
    this.rowValidationMsg = "Please fill in the details for product code for  Item " +getEmptyfield.sequenceNumber + " before adding new Item."
    this.alertConform();
  }
}
emptyCheckForFirstForm()
{
  let getEmptyfield = this.editedFirstFormData.filter(item =>item.productCode === "" || item.runDuration === 0 || item.actualQuantity === "")
      if (getEmptyfield.length != 0) {
        if(getEmptyfield[0].productDesc==='No record found.')
        {
          this.rowValidationMsg = "Please enter valid Product Code for Item " +getEmptyfield[0].sequenceNumber + " before adding new Item."
          this.alertConform();
        }
        else
        {
        this.emptycheckForProductCodeProducedQuantity(getEmptyfield[0])
          if(getEmptyfield[0].runDuration===0 && getEmptyfield[0].productCode!=="" && getEmptyfield[0].actualQuantity!=="")
          {
            this.rowValidationMsg = "Please enter valid run duration for  Item " +getEmptyfield[0].sequenceNumber + " before adding new Item."
            this.alertConform();
          }
          if(getEmptyfield[0].productCode==="" && getEmptyfield[0].runDuration===0 )
          {
            this.rowValidationMsg = "Please fill in the details for product code and run duration for Item " +getEmptyfield[0].sequenceNumber + " before adding new Item."
            this.alertConform();
          }
          
        }
      }
      else {
        this.editedFirstFormData.push({ productCode: "", productDesc: "", runDuration: "", planQuantity: "", capacityQuantity: "", actualQuantity: 0, headerId: 0, item: '', productId: 0, runId: 0, sequenceNumber: this.editedFirstFormData.length + 1 })
        this.firstFormdataSource = [...this.editedFirstFormData];
        this.isFirstFormEmpty = false
        this.prodrunscrollToDown();
      }
}
prodrunscrollToDown() {
  setTimeout(function() {  const div = document.getElementById('prodruntable');
  $('#prodruntable').animate({
     scrollTop: div.scrollHeight - div.clientHeight
  }, 500);}, 2);
}
// this mentod will be use to add the new production run entry.
  firstFormaddElement() {
    // To check if shift duration is empty.
    this.firstFormselection.clear()
    this.isfirstFormAllSelected();
    let shiftDurationHrInput=this.shiftDurationHrInput==''?0:this.shiftDurationHrInput
    let  shiftDurationMinInput=this.shiftDurationMinInput==''?0:this.shiftDurationMinInput
    let shiftDurationdurationinMinute = (parseInt(shiftDurationHrInput) * 60) + parseInt(shiftDurationMinInput)
    if (shiftDurationdurationinMinute != 0) {
      let checkdummysku=this.editedFirstFormData.filter(item=>item.productCode===this.dummySKUProductCode)
      if (checkdummysku.length>1 && this.editedFirstFormData.length>1)
     {
      this.rowValidationMsg="Dummy SKU alredy entered.Only one dummy SKU is allowed per shift.";
      this.alertConform();
     }
     else
     {
      this.emptyCheckForFirstForm();

     }
    }
    else {
      this.rowValidationMsg = "Please enter shift duration.";
      this.alertConform();
    }
  }
  downtimescrollToDown() {
    setTimeout(function() {  const div = document.getElementById('downtimetable');
    $('#downtimetable').animate({
       scrollTop: div.scrollHeight - div.clientHeight
    }, 500);}, 2);
}

  // this mentod will be use to add the new production downtime entry.
  secondFormaddElement() {
    this.secondFormselection.clear();
    this.issecondFormMAllSelected();
    this.isProductionDowntimesData = false;
      let prepareProdDowntimeData = this.editedSecondFormData.map(function (elem) {
        let downTimeReasonCodeList= this.allReasonCodesData.filter(item => item.downtimeReasonTypeId == elem.downtimeReasonTypeId)
        let downtimeReasonDetailList= this.allReasonDetailsData.filter(item => item.downtimeReasonCodeId == elem.downtimeReasonCodeId)
        return {
          typesData:this.typesData,
          downtimeDuration: elem.downtimeDuration,
          downtimeId: elem.downtimeId,
          downtimeReasonCodeDesc: elem.downtimeReasonCodeDesc,
          downtimeReasonCodeId: elem.downtimeReasonCodeId,
          downtimeReasonDetailDesc: elem.downtimeReasonDetailDesc,
          downtimeReasonDetailId: elem.downtimeReasonDetailId,
          downtimeReasonTypeDesc: elem.downtimeReasonTypeDesc,
          downtimeReasonTypeId: elem.downtimeReasonTypeId,
          downtimeReasonCode: downTimeReasonCodeList,
          downtimeReasonDetail: downtimeReasonDetailList,
          headerId: elem.headerId,
          labourReleased: elem.labourReleased,
          sequenceNumber: elem.sequenceNumber
        }
      },this);
      this.editedSecondFormData=[]
      this.editedSecondFormData=prepareProdDowntimeData
      this.editedSecondFormData.push({typesData:this.typesData,downtimeReasonTypeId: "", downtimeReasonCodeId: "", downtimeReasonDetailId: "",downtimeDuration: 0, labourReleased: "No", sequenceNumber: this.editedSecondFormData.length + 1 })
      this.secondFormdataSource = [...this.editedSecondFormData];
      this.downtimescrollToDown()
  }
  //On clicking of delete button, delete the selected item of production run Or downtime records..
  deleteSelectedRow(formNo: string) {
    if (formNo == 'firstForm') {
      this.isFirstFormSelected = true;
    }
    this.confirmDeleteDialog();
  }
  // this method will be use to adjust the calucation after removing productionrun records or downtime records.
  adjustCalculation() {
    this.calculateTotalDownTimeAndPerOfEff()
    let shiftDurationHrInput=this.shiftDurationHrInput==''?0:this.shiftDurationHrInput
    let  shiftDurationMinInput=this.shiftDurationMinInput==''?0:this.shiftDurationMinInput
    let nonDummySkUList=this.editedFirstFormData.filter(item=>item.productCode!=this.dummySKUProductCode)
    this.sumRunDuration = this.editedFirstFormData.map(t => t.runDuration).reduce((acc, value) => acc + value, 0)
    let shiftDurationdurationinMinute = (parseInt(shiftDurationHrInput) * 60) + parseInt(shiftDurationMinInput)
    this.remainingRunDuration = shiftDurationdurationinMinute - this.sumRunDuration
    this.sumProduced = nonDummySkUList.map(t => t.actualQuantity).reduce((acc, value) => acc + value, 0)
  }
  firstformmasterToggle() {
    this.isfirstFormAllSelected() ?
        this.firstFormselection.clear() :
        this.editedFirstFormData.forEach(element => this.firstFormselection.select(element));
  }
  isfirstFormAllSelected() {
    const numSelected = this.firstFormselection.selected.length;
    const numRows = this.editedFirstFormData.length;
    return numSelected === numRows;
  }
  // This method will be used to delete the production run selected items.
  firstFormremoveSelectedRows() {
    this.isFirstFormEmpty = true;
    this.hideDummySKUNextBtn=true;
    this.hideNextBtn=false;
    let nonDeletedItem=this.editedFirstFormData;
    nonDeletedItem=this.editedFirstFormData.filter((elem=>!this.firstFormselection.selected.includes(elem)) )
   // let checkDummySKU=nonDeletedItem.filter(elem=>elem.productCode===this.dummySKUProductCode)

    let newProdRunData=nonDeletedItem.map(function (elem,position) {
      return {
        actualQuantity: elem.actualQuantity,
        capacityQuantity: elem.capacityQuantity,
        capacityQuantityOriginal: elem.capacityQuantityOriginal,
        headerId: elem.capacityQuantityOriginal,
        item: elem.item,
        perEff: elem.perEff,
        planQuantity: elem.planQuantity,
        planQuantityOriginal: elem.planQuantityOriginal,
        productCode: elem.productCode,
        productDesc: elem.productDesc,
        productId: elem.productId,
        runDurationOriginal:elem.runDurationOriginal,
        runDuration: elem.runDuration,
        runId: elem.runId,
        sequenceNumber: position+1
      }
    });
    this.editedFirstFormData = newProdRunData
    this.firstFormdataSource =this.editedFirstFormData
    this.firstFormdataSource = [...this.firstFormdataSource];
    
    this.firstFormselection = new SelectionModel<Element>(true, []);
      this.adjustCalculation();
      this.calculateTotalDownTimeAndPerOfEff()
     if (this.editedFirstFormData.length != 0) {
       this.isFirstFormEmpty = false
     }
    this.cancelConfirm();
  }
  secondFormMasterToggle() {
    this.issecondFormMAllSelected() ?
        this.secondFormselection.clear() :
        this.editedSecondFormData.forEach(element => this.secondFormselection.select(element));
  }
  issecondFormMAllSelected() {
    const numSelected = this.secondFormselection.selected.length;
    const numRows = this.editedSecondFormData.length;
    return numSelected === numRows;
  }
  // This method will be use to delete the production downtime selected items.
  secondFormremoveSelectedRows() {
    this.secondFormselection.selected.forEach(item => {
      let currentItem:any=item;
      let index: number = this.editedSecondFormData.findIndex(d => d.downtimeReasonTypeId==currentItem.downtimeReasonTypeId && d.downtimeReasonCodeId==currentItem.downtimeReasonCodeId
        && d.downtimeReasonDetailId==currentItem.downtimeReasonDetailId && d.labourReleased==currentItem.labourReleased);
      this.secondFormdataSource.splice(index, 1);
      this.preparedSecondFormData= this.secondFormdataSource
      let preparedSecondFormdataSource = this.preparedSecondFormData.map(function (elem,idx) {
        return {
          typesData:elem.typesData,
          downtimeDuration: elem.downtimeDuration,
          downtimeId: elem.downtimeId,
          downtimeReasonCodeDesc: elem.downtimeReasonCodeDesc,
          downtimeReasonCodeId: elem.downtimeReasonCodeId,
          downtimeReasonDetailDesc: elem.downtimeReasonDetailDesc,
          downtimeReasonDetailId: elem.downtimeReasonDetailId,
          downtimeReasonTypeDesc: elem.downtimeReasonTypeDesc,
          downtimeReasonTypeId: elem.downtimeReasonTypeId,
          downtimeReasonCode: elem.downtimeReasonCode,
          downtimeReasonDetail: elem.downtimeReasonDetail,
          headerId: elem.headerId,
          labourReleased: elem.labourReleased,
          sequenceNumber: idx+1
        }
      });
      this.editedSecondFormData = preparedSecondFormdataSource
      this.secondFormdataSource=this.editedSecondFormData
      this.secondFormdataSource = [...this.secondFormdataSource];
    });
    this.secondFormselection = new SelectionModel<Element>(true, []);
    this.editedSecondFormsumDuration = this.editedSecondFormData.map(t => t.downtimeDuration).reduce((acc, value) => acc + value, 0)
    this.cancelConfirm();
  }
  checkEmpty(shiftDurationdurationinMinute:any)
  {
    let downtimeDetailsData: any = (shiftDurationdurationinMinute / 60)
    this.downtimeDetails = shiftDurationdurationinMinute
    if (isNaN(this.downtimeDetails)) {
      this.downtimeDetails = 0;
    }
    this.downtimeHr = Math.floor(parseInt(downtimeDetailsData));
    if (isNaN(this.downtimeHr)|| this.downtimeHr < 0) {
      this.downtimeHr = 0;
    }
    this.downtimeMin = (shiftDurationdurationinMinute % 60)
    if (isNaN(this.downtimeMin)) {
      this.downtimeMin = 0;
    }
    this.totalPerOfEff = 0
  }
  // get shift duration hour and minute input from user and calcualte sum duration and remaining duration.
  shiftDurationDetails() {
    this.shiftDurationHrInputFocusOut()
    this.shiftDurationMinInputFocusOut()
    let shiftDurationHrInput=(this.shiftDurationHrInput=='' || this.shiftDurationHrInput==null)?0:this.shiftDurationHrInput
    let  shiftDurationMinInput=(this.shiftDurationMinInput=='' || this.shiftDurationMinInput==null)?0:this.shiftDurationMinInput
    //Print page shift duration on this change 
    this.shiftDurationInputOnPrint = (shiftDurationHrInput + ' hrs ' + shiftDurationMinInput + ' mins');

    let shiftDurationdurationinMinute = (parseInt(shiftDurationHrInput) * 60) + parseInt(shiftDurationMinInput)
    let nonDummySKU=this.editedFirstFormData.filter(item => item.productCode != this.dummySKUProductCode)
    let getrunDurationList = this.editedFirstFormData.filter(item => item.runDuration != "")
    this.sumRunDuration = getrunDurationList.map(t => t.runDuration).reduce((acc, value) => acc + value, 0)
    let remainingRunDuration = shiftDurationdurationinMinute - parseInt(this.sumRunDuration)
    if (isNaN(remainingRunDuration)) {
      this.remainingRunDuration = 0;
    }
    else {
      this.remainingRunDuration = remainingRunDuration;
    }
    let checkemptyfield = this.editedFirstFormData.filter(item => item.runDuration == "" && item.productCode == "")
    if (checkemptyfield.length > 0) {
     this.checkEmpty(shiftDurationdurationinMinute)
    }
    else {
      let downtimeDetailsData: any = ((shiftDurationdurationinMinute / 60) - nonDummySKU.map(r => ((r.runDuration / 60) * ((r.actualQuantity * 100) / parseInt(r.capacityQuantity))) / 100).reduce((acc, value) => acc + value, 0)) * 60
      this.downtimeDetails = (Math.round(downtimeDetailsData * 100) / 100).toFixed(0);
      if (isNaN(this.downtimeDetails)) {
        this.downtimeDetails = 0;
      }
      this.downtimeHr = Math.floor(parseInt(downtimeDetailsData) / 60);
      if (isNaN(this.downtimeHr) || this.downtimeHr < 0) {
        this.downtimeHr = 0;
      }
      this.downtimeMin = (Math.round((downtimeDetailsData % 60) * 100) / 100).toFixed(0);
      if (isNaN(this.downtimeMin)) {
        this.downtimeMin = 0;
      }
      if(parseInt(this.downtimeMin) == 60){
        this.downtimeHr = this.downtimeHr + 1;
        this.downtimeMin = 0;
      }
      this.secondFormDowntimeDetails = this.downtimeDetails;
      let totalPerOfEffData: any = (1 - (this.downtimeDetails / shiftDurationdurationinMinute)) * 100
      this.totalPerOfEff = totalPerOfEffData.toFixed(2)
      if (isNaN(this.totalPerOfEff)) {
        this.totalPerOfEff = 0;
      }
    }
    this.calculateTotalDownTimeAndPerOfEff();
  }
  // this mehod will be use to get the updated prod run duration.
  UpdateProdRunDuration(r: any, durationVal: any, inputType: any) {
    let duration=(durationVal=='' || durationVal==null )?0:durationVal
    if (r.productCode != "") {
        if (inputType == 'hr') {
          let minutes = parseInt(r.runDuration) % 60;
          r.runDuration = (parseInt(duration) * 60) + minutes
          if (r.runId != "") {
            let perHrPlan = r.planQuantityOriginal / (r.runDurationOriginal / 60)
            let perHrCap = r.capacityQuantityOriginal / (r.runDurationOriginal / 60)
            let planQuant: any = (r.runDuration / 60) * (perHrPlan);
            r.planQuantity = (parseFloat(planQuant)).toFixed(0)
            let capQuant: any = (r.runDuration / 60) * (perHrCap);
            r.capacityQuantity = (parseFloat(capQuant)).toFixed(0)
          }
          else {
            let perHrPlan = r.planQuantityOriginal
            let perHrCap = r.capacityQuantityOriginal
            let planQuant: any = (r.runDuration / 60) * (perHrPlan);
            r.planQuantity = (parseFloat(planQuant)).toFixed(0)
            let capQuant: any = (r.runDuration / 60) * (perHrCap);
            r.capacityQuantity = (parseFloat(capQuant)).toFixed(0)
          }
          this.updateInsertFirstFormData(r)
         // let nonDummySkuList=this.editedFirstFormData.filter(item => item.productCode != this.dummySKUProductCode)
          let getrunDurationList = this.editedFirstFormData.filter(item => item.runDuration != "")
          this.sumRunDuration = getrunDurationList.map(t => t.runDuration).reduce((acc, value) => acc + value, 0)
          let shiftDurationHrInput=this.shiftDurationHrInput==''?0:this.shiftDurationHrInput
          let  shiftDurationMinInput=this.shiftDurationMinInput==''?0:this.shiftDurationMinInput
          let shiftDurationdurationinMinute = (parseInt(shiftDurationHrInput) * 60) + parseInt(shiftDurationMinInput)
          this.remainingRunDuration = shiftDurationdurationinMinute - this.sumRunDuration
        }
        else {
          let hours = Math.floor(parseInt(r.runDuration) / 60);
          r.runDuration = (hours * 60) + parseInt(duration)
          if (r.runId != "") {
            let perHrPlan = r.planQuantityOriginal / (r.runDurationOriginal / 60)
            let perHrCap = r.capacityQuantityOriginal / (r.runDurationOriginal / 60)
            let planQuant: any = (r.runDuration / 60) * (perHrPlan);
            r.planQuantity = parseInt(planQuant)
            let capQuant: any = (r.runDuration / 60) * (perHrCap);
            r.capacityQuantity = parseInt(capQuant)
          }
          else {
            let perHrPlan = r.planQuantityOriginal
            let perHrCap = r.capacityQuantityOriginal
            let planQuant: any = (r.runDuration / 60) * (perHrPlan);
            r.planQuantity = parseInt(planQuant)
            let capQuant: any = (r.runDuration / 60) * (perHrCap);
            r.capacityQuantity = parseInt(capQuant)
          }
          this.updateInsertFirstFormData(r)
          let nonDummySkuList=this.editedFirstFormData.filter(item => item.productCode != this.dummySKUProductCode)
          let getrunDurationList = nonDummySkuList.filter(item => item.runDuration != "")
          this.sumRunDuration = getrunDurationList.map(t => t.runDuration).reduce((acc, value) => acc + value, 0)
          this.calculateRemainingDuration();
        }
    }
    // else
    // {
    //   // this.rowValidationMsg = "Please enter product code first.";
    //   // this.alertConform();
    //   r.planQuantity = "";
    //   r.capacityQuantity = "";
    //   r.actualQuantity = "";
    //   r.runDuration = "";
    //   this.updateInsertFirstFormData(r)
    // }
  }
  calculateRemainingDuration()
  {
    let shiftDurationHrInput=this.shiftDurationHrInput==''?0:this.shiftDurationHrInput
    let  shiftDurationMinInput=this.shiftDurationMinInput==''?0:this.shiftDurationMinInput
    let shiftDurationdurationinMinute = (parseInt(shiftDurationHrInput) * 60) + parseInt(shiftDurationMinInput)
    //let nonDummySkUList=this.editedFirstFormData.filter(item=>item.productCode!=this.dummySKUProductCode)
    let getrunDurationList = this.editedFirstFormData.filter(item => item.runDuration != "")
    this.sumRunDuration = getrunDurationList.map(t => t.runDuration).reduce((acc, value) => acc + value, 0)
    this.remainingRunDuration = shiftDurationdurationinMinute - this.sumRunDuration
  }
  // insert edited/new production run data into editedFirstFormData array.
  updateInsertFirstFormData(item) {
    if(this.editedFirstFormData.length==1)
    {
      item.sequenceNumber=1
    }
    if(item.productDesc==="No record found.")
    {
      item.productCode="";
      item.planQuantity = "";
      item.capacityQuantity = "";
      item.actualQuantity = "";
      item.runDuration = "";
    }
    const i = this.editedFirstFormData.findIndex(_item => _item.sequenceNumber === item.sequenceNumber);
    if (i > -1) {
      this.editedFirstFormData[i] = item
    }
    else {
      this.editedFirstFormData.push(item);
    }
    //let nonDummySKU= this.editedFirstFormData.filter(t => t.productCode!=this.dummySKUProductCode)
  if(this.editedFirstFormData.length>0)
  {
    this.calculateRemainingDuration();
  }
  }
  //insert edited production downtime data into editedSecondFormData array.
  updateInsertSecondFormData(item) {
    if(this.editedSecondFormData.length==1)
    {
      item.sequenceNumber=1
    }
    const i = this.editedSecondFormData.findIndex(_item => _item.sequenceNumber == item.sequenceNumber);
    if (i > -1) {
      this.editedSecondFormData[i] = item
    }
    else {
      this.editedSecondFormData.push(item);
    }
    this.editedSecondFormsumDuration = this.editedSecondFormData.map(t => t.downtimeDuration).reduce((acc, value) => acc + value, 0)
    this.adjustCalculation()
  }
  // calcuate percentage of efficiency
  CalculatePerOfEfficiency(r: any, event: any) {
    if(event.target.value!='' && r.productDesc!='')
    {
      if(r.productDesc!=='No record found.')
      {
     let eventValue=parseInt(event.target.value);
      r.actualQuantity = eventValue
      r.perEff = (eventValue * 100) / parseInt(r.capacityQuantity);
      this.updateInsertFirstFormData(r)
      let nonDummySKU=this.editedFirstFormData.filter(item => item.productCode != this.dummySKUProductCode)
      let getactualQuantityList = nonDummySKU.filter(item => item.capacityQuantity != "")
      this.sumProduced = getactualQuantityList.map(t => t.actualQuantity).reduce((acc, value) => acc + value, 0)
      this.calculateTotalDownTimeAndPerOfEff()
      }
    }
    else
    {
      let eventValue=event.target.value;
      r.actualQuantity = eventValue
      r.perEff = (eventValue * 100) / parseInt(r.capacityQuantity);
      this.updateInsertFirstFormData(r)
    }
}
  // calcuate total downtime and percentage of efficiency
  calculateTotalDownTimeAndPerOfEff() {
    
    let shiftDurationHrInput=this.shiftDurationHrInput==''?0:this.shiftDurationHrInput
    let  shiftDurationMinInput=this.shiftDurationMinInput==''?0:this.shiftDurationMinInput
    let shiftDurationdurationinMinute = (parseInt(shiftDurationHrInput) * 60) + parseInt(shiftDurationMinInput)
    let nonDummySKU =this.editedFirstFormData.filter(item=>item.productCode!=this.dummySKUProductCode)
    let data=nonDummySKU.filter(item=>item.productCode!=='')
    let downtimeDetailsData: any = ((shiftDurationdurationinMinute / 60) - data.map(r => ((r.runDuration / 60) * ((r.actualQuantity * 100) / parseInt(r.capacityQuantity))) / 100).reduce((acc, value) => acc + value, 0)) * 60
    this.downtimeDetails = (Math.round(downtimeDetailsData * 100) / 100).toFixed(0);
    if (isNaN(this.downtimeDetails)) {
      this.downtimeDetails = 0;
    }
    this.downtimeHr = Math.floor(parseInt(downtimeDetailsData) / 60);
    if (isNaN(this.downtimeHr) || this.downtimeHr < 0) {
      this.downtimeHr = 0;
    }
    this.downtimeMin = (Math.round((downtimeDetailsData % 60) * 100) / 100).toFixed(0);
    if (isNaN(this.downtimeMin)) {
      this.downtimeMin = 0;
    }
    if(parseInt(this.downtimeMin) == 60){
      this.downtimeHr = this.downtimeHr + 1;
      this.downtimeMin = 0;
    }
    this.secondFormDowntimeDetails = this.downtimeDetails;
    let totalPerOfEffData: any = (1 - (this.downtimeDetails / shiftDurationdurationinMinute)) * 100
    this.totalPerOfEff = totalPerOfEffData.toFixed(2)
    if (isNaN(this.totalPerOfEff)) {
      this.totalPerOfEff = 0;
    }
    // if firstform have only dummy sku
    if(this.editedFirstFormData.length==1)
    {
      if(this.editedFirstFormData[0].productCode===this.dummySKUProductCode)
      {
        this.downtimeDetails=shiftDurationdurationinMinute;
        this.downtimeHr = Math.floor(parseInt(this.downtimeDetails) / 60);
        this.downtimeMin = (Math.round((this.downtimeDetails % 60) * 100) / 100).toFixed(0);
        this.totalPerOfEff = 0;
      }
     
    }

  }
  // calcuate total Sum of Produced.
  calculateProduced() {
    let getNonDummySKu=this.editedFirstFormData.filter(item=>item.productCode!=this.dummySKUProductCode)
    this.sumProduced = getNonDummySKu.map(t => t.actualQuantity).reduce((acc, value) => acc + value, 0)
  }
  // calculate shift duration hour and minute.
  calculateshiftDurationInput() {
    //console.log(this.productionHeaderDetails,'this.productionHeaderDetails')
    let shitdurationTotalRunDuration = this.editedFirstFormData.map(t => t.runDuration).reduce((acc, value) => acc + value, 0)
    let shitdurationTotalMinute =this.productionHeaderDetails.length==0?0: this.productionHeaderDetails[0].shiftDuration;
    let hours = Math.floor(parseInt(shitdurationTotalMinute) / 60);
    let minutes = parseInt(shitdurationTotalMinute) % 60;
    this.shiftDurationHrInput = hours
    this.shiftDurationMinInput = minutes
    this.remainingRunDuration = shitdurationTotalMinute-shitdurationTotalRunDuration;
    this.calculateTotalDownTimeAndPerOfEff();
    this.shiftDurationInputOnPrint = (hours + ' hrs ' + minutes + ' mins');
  }
// calculate production downtime product duration hour.
  calculateDurationinInHr(value: any) {
    return (Math.floor(parseInt(value) / 60))
  }
  // calculate production downtime product duration minutes.
  calculateDurationinInMin(value: any) {
    return (parseInt(value) % 60)
  }
// for print screen
  calculateDurationinRowWithHrs(value: any) {
    let hours = Math.floor(parseInt(value) / 60);
    let minutes = parseInt(value) % 60;
    let durationVal = (hours) + ' hrs ' + (minutes + ' mins')
    if (isNaN(hours) || isNaN(minutes)) {
      return null;
    }
    return durationVal
  }

// calcuate SKU percent efficiency .
  CalForPerEffCol(row: any) {
    let calVal: any = (row.actualQuantity * 100) / parseInt(row.capacityQuantity)
    let retVal = calVal.toFixed(2).slice(0, -1)
    if (isNaN(retVal)) {
      return '';
    }
    else {
      return retVal;
    }


  }
  beforeNextCheckEmpty(getEmptyfield:any)
  {
    // if(getEmptyfield[0].productDesc!=="No record found.")
    // {
    //   this.rowValidationMsg = "Please enter Product Code."
    //   this.alertConform();
    // }
    if(getEmptyfield[0].productCode!=this.dummySKUProductCode && getEmptyfield[0].actualQuantity=="")
    {
      if(getEmptyfield[0].productCode!=''&& getEmptyfield[0].runDuration!="" && getEmptyfield[0].actualQuantity!="")
      {
        this.rowValidationMsg = "Please enter produced details for Item " + getEmptyfield[0].sequenceNumber + "."
        this.alertConform();
      }

    }
    // else
    // {
    //   this.productCodeNotFoundModal.show()
     
    // }
  }
  checkIfRowEmpty(array:any)
  {
    let getEmptyfield = array.filter(item => item.productCode === "" || item.runDuration ===0 || item.actualQuantity==="")
      if (getEmptyfield.length != 0) {
        let actualQuantity=getEmptyfield.filter(item=>item.actualQuantity==="")
        let productCode=getEmptyfield.filter(item=>item.productCode==="")
        let runDuration=getEmptyfield.filter(item=>item.runDuration===0)
        if(actualQuantity.length!=0)
        {
          this.rowValidationMsg = "Please fill in the produced quantity before proceeding next."; 
        }
        if(productCode.length!=0)
        {
          this.rowValidationMsg = "Please fill in the product code before proceeding next."; 
        }
        if(runDuration.length!=0)
        {
          this.rowValidationMsg = "Please enter valid runDuration before proceeding next."; 
        }
        this.alertConform();
      }
      else {
        this.showPlantLineOnNextClick = true;
        this.isFirstFormSelected = false;
        this.stepper.next()
      }
  }
  ShowShiftDetailsAlert()
  {
    this.existingShiftDuration=0
    this.enteredNewShiftDurationVal=0
    this.diffInSavedAndEnteredShiftDuration=0 
    this.diffInPositive=0
    this.enteredNewShiftDurationVal = (parseInt(this.shiftDurationHrInput) * 60) + parseInt(this.shiftDurationMinInput)
    this.existingShiftDuration =this.productionHeaderDetails.length==0?0: this.productionHeaderDetails[0].shiftDuration;
    this.diffInSavedAndEnteredShiftDuration=this.existingShiftDuration-this.enteredNewShiftDurationVal
    this.diffInPositive=Math.abs(this.diffInSavedAndEnteredShiftDuration)
    //Display alert if total entered time goes over 14,40 mins..
    let totalAllShiftDuration= this.prodRunSumOfShiftDuration - this.diffInSavedAndEnteredShiftDuration
    if(totalAllShiftDuration<=this.maxShiftduration)
    {
      this.clickForNext()
    }
    else
        {
          const result = this.shiftbyLineData.map(item => ({
            ...item, 
            isGrouped : this.prodrunallshiftDetails.findIndex(g => g.shiftId == item.shiftId) >= 0 ,
            shiftDurationValue:this.prodrunallshiftDetails.find(g => g.shiftId == item.shiftId)
            }
         ));
         this.prepareShiftDetails=[]
        this.prepareShiftDetails = result.map(function (elem) {
          return {
            shiftId:elem.shiftId,
            shiftName: elem.shiftName,
            shiftDuration: elem.shiftDurationValue==undefined?0:elem.shiftDurationValue.shiftDuration
          }
        },this).sort();
          //this.disableNextButton=true;    // uncomment it to disable the next button

          this.shiftValidationMsg = "This line has exceeded 1,440 minutes for this production day. Please correct the shift(s) to properly reflect production."
          this.shiftalertModal.show();
        }
      }
  cancelshiftDetailsAlertConform()
  {
    this.shiftalertModal.hide();
  }


  // navigate to productiondowntime form.
  clickForNext() {
    this.shiftalertModal.hide();
    // check shift duration entry.
    let formattedDate = this.datepipe.transform(this.selectedDate, 'MM/dd/yyyy');
    this.deleteProdRunconfirmationMsg='Production data for selected line and shift will be removed permanently for ' + formattedDate+ ' . You would not be able to recover the data once deleted. Please click Yes to continue.'
    if (this.canDelete && (this.productionrunData.productionRuns.length > 0 ||this.productionrunData.productionDowntimes.length > 0)) {
      this.showProdRunDeleteButton=true
    }
    else
    {
      this.showProdRunDeleteButton=false
    }
    let shiftDurationHrInput=this.shiftDurationHrInput==''?0:this.shiftDurationHrInput
    let  shiftDurationMinInput=this.shiftDurationMinInput==''?0:this.shiftDurationMinInput
    if(shiftDurationHrInput!=0 || shiftDurationMinInput!=0)
    {
    if (this.remainingRunDuration != 0 && this.remainingRunDuration != undefined) {
      let getEmptyfield = this.editedFirstFormData.filter(item =>item.productCode == "" || item.runDuration == "" || item.actualQuantity == "")
      if (getEmptyfield.length != 0) {
      this.beforeNextCheckEmpty(getEmptyfield)
        }
      // else {
      //     this.rowValidationMsg = "You must account for all of the shift duration. " + this.remainingRunDuration + " minutes remain."
      //     this.alertConform();
      // }

    }
    if (this.remainingRunDuration == undefined) {
      this.rowValidationMsg = "Please enter duration."
      this.alertConform();
    }
    else {
      this.checkIfRowEmpty(this.editedFirstFormData)
    }
  }
else
{
  this.rowValidationMsg = "Please enter shift duration."
  this.alertConform();
}
}

// production downtime duration.
  productionDownTimeDuration(r: any, updatedDuration: any, inputType: any) {
    if(r.downtimeDuration=="")
    {
      r.downtimeDuration=0
    }
     let updatedValue=(updatedDuration=='')?0:updatedDuration
      if (inputType == 'hr') {
        let minutes = parseInt(r.downtimeDuration) % 60;
        r.downtimeDuration = (parseInt(updatedValue) * 60) + minutes
        this.updateInsertSecondFormData(r)
      }
      else {
        let hours = Math.floor(parseInt(r.downtimeDuration) / 60);
        r.downtimeDuration = (hours * 60) + parseInt(updatedValue)
        this.updateInsertSecondFormData(r)
      }

  }
  downtimeMinutesRemaining(secondFormDowntimeDetails:any,editedSecondFormsumDuration:any)
  {
    if (isNaN(editedSecondFormsumDuration)) {
      editedSecondFormsumDuration=0
    }
    if (isNaN(secondFormDowntimeDetails)) {
      secondFormDowntimeDetails=0
    }
    // if prod screen has only dummy sku
    if(this.editedFirstFormData.length==1)
    {
      if(this.editedFirstFormData[0].productCode===this.dummySKUProductCode)
      {       secondFormDowntimeDetails=this.downtimeDetails
      }

    }
    return (secondFormDowntimeDetails -editedSecondFormsumDuration);
   
  }
  // get all reason codes
  getAllReasonCodes() {
    this.productionrunService.getAllReasonCodes()
      .subscribe(data => {
        this.allReasonCodesData = data
      }, error => console.log(error));
  }
  // get all reason details.
  getAllReasonDetails() {
    this.productionrunService.getAllReasonDetails()
      .subscribe(data => {
        this.allReasonDetailsData = data
      }, error => console.log(error));
  }
  // get downtime reason types by LineType.
  GetAllDownTimeReasonTypesByLineType() {
   let  getLineDetailsBySelectedLine= this.linesDataByPlant.filter(item => item.lineId == this.selectedline)
   let lineType=getLineDetailsBySelectedLine[0].lineType
    this.productionrunService.GetAllDownTimeReasonTypesByLineType(lineType)
      .subscribe(data => {
        this.filteredDowntimeReasonTypList=[]
        this.typesData = data.map(function(elem) {
          return {
            downTimeReasonTypeId:elem.downTimeReasonTypeId,
            downtimeReasonTypeDesc:elem.downtimereasonTypeDesc
          }});

        this.filteredDowntimeReasonTypList=this.typesData
        
      }, error => console.log(error));
  }
  // get downtime reason code.
  getReasonCode(r: any, typeId: any) {
    this.filteredDowntimeReasonCodeList=[]
    r.downtimeReasonTypeId = typeId;
    r.downtimeReasonCodeId = 0
    r.downtimeReasonDetailId = 0
    r.downtimeReasonCode = this.allReasonCodesData.filter(item => item.downtimeReasonTypeId == typeId).sort((a, b) => a.downtimeReasonCodeDesc.localeCompare(b.downtimeReasonCodeDesc));
    this.filteredDowntimeReasonCodeList=this.allReasonCodesData.filter(item => item.downtimeReasonTypeId == typeId)
    this.updateInsertSecondFormData(r)

  }
  // get downtime reason details.
  getReasonDetail(r: any, downtimeReasonCodeId: any) {
    r.downtimeReasonCodeId = downtimeReasonCodeId
    r.downtimeReasonDetailId = 0
    r.downtimeReasonDetail = this.allReasonDetailsData.filter(item => item.downtimeReasonCodeId == downtimeReasonCodeId).sort((a, b) => a.downtimeReasonDetailDesc.localeCompare(b.downtimeReasonDetailDesc));
    this.filteredDowntimeReasonDetailList=this.allReasonDetailsData.filter(item => item.downtimeReasonCodeId == downtimeReasonCodeId)
    this.updateInsertSecondFormData(r)
  }
  //This method will be called on change of reason details dropdown. 
  reasonDetailChange(r: any, downtimeReasonDetailId: any) {
    r.downtimeReasonDetailId = downtimeReasonDetailId
    this.updateInsertSecondFormData(r)
    this.hideReasonDetailSelection = true;
  }
  filterArrayList(r)
  {
   // this.filteredDowntimeReasonTypList=this.typesData
    this.filteredDowntimeReasonCodeList=this.allReasonCodesData.filter(item => item.downtimeReasonTypeId == r.downtimeReasonTypeId)
    this.filteredDowntimeReasonDetailList=this.allReasonDetailsData.filter(item => item.downtimeReasonCodeId == r.downtimeReasonCodeId)
  }
  //This method will be called on change of labor realesed dropdown. 
  laborReleasedChange(r: any, labourReleased: any) {
    if (r.downtimeDuration == "") {
      r.downtimeDuration = 0
    }
    r.labourReleased = labourReleased
    this.updateInsertSecondFormData(r)
    this.hidelaborReleasedSelection = true;
  }
  // get labor released data.
  laborReleased() {
    this.laborReleasedData = [{
      value: "Yes", id: 1
    },
    {
      value: "No", id: 2
    }
    ]
  }
  cancelConfirm() {
    this.confirmModal.hide();
    this.firstFormselection = new SelectionModel<Element>(true, []);
    this.secondFormselection = new SelectionModel<Element>(true, []);
  }
  deleteProdRuncancelConfirm()
  {
    this.deleteProdRunconfirmModal.hide();
  }
  deleteProdRun()
  {
    let formattedDate = this.datepipe.transform(this.selectedDate, 'yyyy-MM-dd');
    let productionHeaderEntity = {
        lineId: this.selectedline,
        runDate: formattedDate,
        shiftId: this.selectedshift
      }
    this.spinnerService.show();
    this.deleteProdRunconfirmModal.hide();
    this.productionrunService.deleteProdRun(productionHeaderEntity)
      .subscribe(() => {
        this.Cancel();
        this.spinnerService.hide();
      },
        error => console.log(error)
      );
  }
  confirmProdRunDeleteDialog() {
    this.deleteProdRunconfirmModal.show();
  }
  confirmDeleteDialog() {
    this.confirmModal.show();
  }
  alertConform() {
    this.alertModal.show();
  }
  cancelAlertConform() {
    let shiftDurationHrInput=this.shiftDurationHrInput==''?0:this.shiftDurationHrInput
    let  shiftDurationMinInput=this.shiftDurationMinInput==''?0:this.shiftDurationMinInput
    let shiftDurationdurationinMinute = (parseInt(shiftDurationHrInput) * 60) + parseInt(shiftDurationMinInput)
    if(shiftDurationdurationinMinute!=0)
    {
      this.alertModal.hide();
    }
    else
    {
      this.setFocusToShiftDuration();
      this.alertModal.hide();
    }
  }
  cancelNoProdCodeConform() {
    this.setFocusToProdCode();
    this.productCodeNotFoundModal.hide();
  }
  printModalShow() {  
    let typeData = this.typesData==undefined ? [] : this.typesData
    this.printSecondForm = this.editedSecondFormData.map(function (elem,idx) {
      if(elem.downtimeReasonCode!=undefined && elem.downtimeReasonDetail!=undefined){
      let  downtimeReasonTypeDesc=typeData.filter(item=>item.downTimeReasonTypeId==elem.downtimeReasonTypeId)
      let downtimeCodeDesc= elem.downtimeReasonCode.filter(item=>item.downtimeReasonCodeId==elem.downtimeReasonCodeId)
      let downtimeReasonDetailDesc= elem.downtimeReasonDetail.filter(item=>item.downtimeReasonDetailId==elem.downtimeReasonDetailId)
      return {
        downtimeReasonTypeDesc: downtimeReasonTypeDesc[0].downtimeReasonTypeDesc,
        downtimeReasonCodeDesc: downtimeCodeDesc[0].downtimeReasonCodeDesc,
        downtimeReasonDetailDesc: downtimeReasonDetailDesc[0].downtimeReasonDetailDesc,
        labourReleased:elem.labourReleased,
        downtimeDuration: elem.downtimeDuration
      }
    }
    });
    
    this.printModal.show();
  }
  printPopUp() {
   
    let elem = this.divPrint.nativeElement;
    let domClone = elem.cloneNode(true);

    let $printSection = document.getElementById("printSection");

    if (!$printSection) {
      $printSection = document.createElement("div");
      $printSection.id = "printSection";
      document.body.appendChild($printSection);
    }

    $printSection.innerHTML = "";
    $printSection.appendChild(domClone);
    window.print();
  }
  CancelPrint() {
    this.printModal.hide();
  }
  filteredReturn(value:any)
  {
  this.typesData=this.typesData.filter(item=>item.downtimeReasonTypeDesc.includes(value))
  }
  shiftDurationHrInputFocusOut()
  {
    if(this.shiftDurationHrInput==null)
    {
      this.shiftDurationHrInput=0
    }
    else if(this.shiftDurationHrInput>=24)
    {
      this.shiftDurationMinInput=0;
    }
  }
  shiftDurationMinInputFocusOut()
  {
    if(this.shiftDurationMinInput==null)
    {
      this.shiftDurationMinInput=0
    }
    else if(this.shiftDurationHrInput>=24)
    {
      this.shiftDurationMinInput=0;
    }
  }

  // naviagte to downtime screen with dummy sku
  moveToDowntimeScreen()
  {
    let shiftDurationHrInput=this.shiftDurationHrInput==''?0:this.shiftDurationHrInput
    let  shiftDurationMinInput=this.shiftDurationMinInput==''?0:this.shiftDurationMinInput
    if(shiftDurationHrInput!=0 || shiftDurationMinInput!=0)
    {
    this.stepper.next();
  }
else
{
  let getdummyProductCode= this.editedFirstFormData.filter(t => t.productCode==this.dummySKUProductCode)
  if(getdummyProductCode.length==1)
  {
    this.stepper.next();
  }
  else
  {
    this.rowValidationMsg = "Please enter shift duration."
    this.alertConform();
  }

}
    
  }
 // hardcoded dummy sku values
  getDummySkUDetails(r:any)
  {
    r.productCode = this.dummySKUDetailsFromAPI.productCode;
    r.productId = this.dummySKUDetailsFromAPI.productId;
    r.productDesc = this.dummySKUDetailsFromAPI.productDesc;
    r.planQuantity = 0
    r.actualQuantity =0
    r.actualQuantityOriginal =0
    r.capacityQuantity = 0
    r.planQuantityOriginal = 0;
    r.capacityQuantityOriginal = 0;
    r.runDurationOriginal = 0;
    r.runDuration = 0
  }

  cancelDummySKUAlert()
  {
  this.alertDummySKUModal.hide();
  }
}


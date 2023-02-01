import { DatePipe } from '@angular/common';
import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { CaptureaopModel } from 'app/shared/models/capture-aop';
import { ExcelService } from 'app/shared/services/excel.service';
import { PermissionService } from 'app/shared/services/permission-service';
import { ProductionTrackerStorageService } from 'app/shared/services/production-tracker-storage-service.service';
import { SpinnerService } from 'app/shared/services/progress-spinner-configurable.service';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { CaptureaopService } from './captureaop.service';

@Component({
  selector: 'capture-aop',
  templateUrl: './captureaop.component.html',
  styleUrls: ['./captureaop.component.css']
})
export class CaptureaopComponent implements OnInit {
  columnList = ["superPackage", "productCode", "productDesc", "planCaseQuantity", "action"];
  List: any
  plantlist: any;
  linelist: any;
  planbmodeldata: any;
  dataSource: MatTableDataSource<CaptureaopModel>;
  plantTypeData: any;
  linesDataByPlant: any;
  selectedplant: any;
  selectedyear: any;
  selectedmonth:any;
  isChecked: boolean
  disablesavebtn: boolean = true;
  disableCheckbox: boolean = true;
  disableAddbtn: boolean = true;
  inputboxError: boolean;
  element: any;
  isAutoFillChecked:boolean;
  @ViewChild('checkbox') checkbox: ElementRef;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  isYearEndChangeModel: any
  getLineId: any;
  getPlantId:any;
  addView:boolean;
  noDataForLastYr:string;
  isNoDataForLastyr:boolean
  model = { casePerHour: null };
  public casePerHour: any = {};
  // Add new sku section
  @ViewChild('addeditModal', { static: false }) addeditModal: ModalDirective;
  validationForm: FormGroup;
  Form: FormGroup;
  showSelectedAop:boolean;
  submitted = false;
  searchedSuperPackageData:any=[];
  searchedAopVolumeData:any=[];
  timeout: any = null;
  plantName:string;
  plantDesc:string;
  monthName:string;
  isSuperPackageVisible:string='none';
  isProductCodeVisible:string='none';
  selectedSuperPackageVal:any;
  selectedProduct:any
  selectedProductId:any
  isSuperPackageContainerVisible:string='none';
  isProductCodeContainerVisible:string='none';
  showSkuDetail:boolean
  panelOpenState = false;
  norecords:boolean
  permissiondata: any
  canInsert: boolean
  canUpdate: boolean
  disableSearch:boolean
  showValidationMessage:boolean
  yearListData:any=[];
  saveParams:any;
  AopViewHeading:string;
  productID:any;
  isAddNewRecord:boolean;
  datenow:any
  enableExcelImport:boolean
  exportData:any
  allowEditing:boolean=true;
  plantTypeDataList:any=[]
  monthMaxAllowed:boolean
  monthList:any= [
    { monthName: 'JAN', monthValue: '1'},
    { monthName: 'FEB', monthValue: '2'},
    { monthName: 'MAR', monthValue: '3'},
    { monthName: 'APR', monthValue: '4'},
    { monthName: 'MAY', monthValue: '5'},
    { monthName: 'JUN', monthValue: '6'},
    { monthName: 'JUL', monthValue: '7'},
    { monthName: 'AUG', monthValue: '8'},
    { monthName: 'SEP', monthValue: '9'},
    { monthName: 'OCT', monthValue: '10'},
    { monthName: 'NOV', monthValue: '11'},
    { monthName: 'DEC', monthValue: '12'}
]
  @ViewChild('resetbtn') resetbtn:ElementRef;
  filterValueModel:any=''
  constructor(private excelService:ExcelService,public datepipe: DatePipe,public storageService: ProductionTrackerStorageService,private router:Router,public permissionService: PermissionService,public dialog: MatDialog,private changeRef: ChangeDetectorRef, private cdref: ChangeDetectorRef, private formBuilder: FormBuilder, private spinnerService: SpinnerService, private captureaopService: CaptureaopService) {
    this.getPermission();
    this.spinnerService.hide();
    this.isYearEndChangeModel = false
    this.getDefaultPlant()
    this.getPlantList();
    this.datenow=this.datepipe.transform(new Date(), 'yyyy/MM/dd');
    this.validationForm = this.formBuilder.group({            
      'displayAopVolume': new FormControl ('', [Validators.required]),
      'productCode': new FormControl (''),
      'productDesc': new FormControl (''),
      'productId': new FormControl (''),
      'superPackage': new FormControl (''),
      'jan': new FormControl (null, [Validators.required,Validators.max(99999999), Validators.min(0)]),
      'feb': new FormControl ('', [Validators.required,Validators.max(99999999), Validators.min(0)]),
      'mar': new FormControl ('', [Validators.required,Validators.max(99999999), Validators.min(0)]),
      'apr': new FormControl ('', [Validators.required,Validators.max(99999999), Validators.min(0)]),
      'may': new FormControl ('', [Validators.required,Validators.max(99999999), Validators.min(0)]),
      'jun': new FormControl ('', [Validators.required,Validators.max(99999999), Validators.min(0)]),
      'jul': new FormControl ('', [Validators.required,Validators.max(99999999), Validators.min(0)]),
      'aug': new FormControl ('', [Validators.required,Validators.max(99999999), Validators.min(0)]),
      'sep': new FormControl ('', [Validators.required,Validators.max(99999999), Validators.min(0)]),
      'oct': new FormControl ('', [Validators.required,Validators.max(99999999), Validators.min(0)]),
      'nov': new FormControl ('', [Validators.required,Validators.max(99999999), Validators.min(0)]),
      'dec': new FormControl ('', [Validators.required,Validators.max(99999999), Validators.min(0)])
        
    });
  }
  ngOnInit() {
    this.yearList();
  }
  getCurrentYearMonth()
  {
   const currentYear=new Date().getFullYear().toString()
   const currentmonth=new Date().getMonth()+1
   if(this.selectedyear < currentYear || ((this.selectedyear==currentYear) && currentmonth >1))
   {
     this.allowEditing=false;
   }
   else
   {
    this.allowEditing=true;
   }
  }
  getDefaultPlant()
  {
    let plantlist = this.storageService.getLocalStorage('LoggedInUserInfo').userPlants;
    let defaultplant=plantlist.filter(item=>item.isDefaultPlant);
    if(defaultplant.length!=0)
    {
      this.selectedplant=defaultplant[0].plantId
    }
  }
  getPermission()
  {
    this.permissiondata=this.permissionService.getPermission(this.router.url)
    this.canInsert = this.permissiondata[0].canI;
    this.canUpdate = this.permissiondata[0].canU;
  }
  changeValue(event: any) {
    this.element = event;
  }
  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  yearList() {
    let curYear = new Date().getFullYear();
    this.selectedyear=curYear;
    for (let i = curYear - 5; i <= curYear + 1; i++) {
      this.yearListData.push(i);
    }
  }
  getAlldata() {
    
    if(this.selectedplant!=undefined && this.selectedyear!=undefined &&this.selectedmonth!=undefined)
    {
    this.disableAddbtn=false;
    this.spinnerService.show();
    this.captureaopService.GetAllAOP(this.selectedplant, this.selectedyear,this.selectedmonth)
      .subscribe(data => {
        this.disableAddbtn= false;
        const Listdata: CaptureaopModel[] = data;
        if(Listdata.length>0)
        {
          this.enableExcelImport=true;
        }
        this.dataSource = new MatTableDataSource(Listdata);
        this.applyFilter(this.filterValueModel)
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.getCurrentYearMonth()
        this.spinnerService.hide();
      }, error => console.log(error));

  }
}
  ngAfterContentChecked() {
    this.cdref.detectChanges();

  }
  getPlantList() {
    this.captureaopService.getPlant()
      .subscribe(data => {
        this.plantlist = data;
        this.plantTypeDataList=data
      }, error => console.log(error));
  }
  AddUpdateAOP(params:any) {
     params.plantId=this.selectedplant;
     let plantName=this.plantlist.filter(item=>item.plantId==this.selectedplant);
     if(plantName.length!=0)
     {
      params.plant=plantName[0].plantName;
     }
     else
     {
      params.plant=''
     }
     
     params.year=this.selectedyear;
     params.productId=this.selectedProductId!=undefined?this.selectedProductId:params.productId
      params.planCases=
      [
        {month:1,planCaseQuantity:params.jan},
        {month:2,planCaseQuantity:params.feb},
        {month:3,planCaseQuantity:params.mar},
        {month:4,planCaseQuantity:params.apr},
        {month:5,planCaseQuantity:params.may},
        {month:6,planCaseQuantity:params.jun},
        {month:7,planCaseQuantity:params.jul},
        {month:8,planCaseQuantity:params.aug},
        {month:9,planCaseQuantity:params.sep},
        {month:10,planCaseQuantity:params.oct},
        {month:11,planCaseQuantity:params.nov},
        {month:12,planCaseQuantity:params.dec}
      ]
    let inputParams={
      plantId:params.plantId,
      plant:params.plant,
      year:params.year,
      productId:params.productId,
      productCode:params.productCode,
      planCases:params.planCases,
      superPackage:params.superPackage
    }
    this.captureaopService.addAOP(inputParams)
      .subscribe(() => {
        this.cancelModal();
        this.getAlldata();
      },
        error => console.log('save products log', error)
      );
  }
  resetAddControls(){
    this.validationForm.reset();
    this.submitted=false;
    this.checkbox['checked'] = false;
    this.disableCheckbox=true;
    this.isNoDataForLastyr=true;
   }
   resetEditControls(){
    this.validationForm.get('jan').reset();
    this.validationForm.get('feb').reset();
    this.validationForm.get('mar').reset();
    this.validationForm.get('apr').reset();
    this.validationForm.get('may').reset();
    this.validationForm.get('jun').reset();
    this.validationForm.get('jul').reset();
    this.validationForm.get('aug').reset();
    this.validationForm.get('sep').reset();
    this.validationForm.get('oct').reset();
    this.validationForm.get('nov').reset();
    this.validationForm.get('dec').reset();
    this.submitted=false;
   }
  cancelModal(){
    this.addeditModal.hide();
    this.resetEditControls();
    this.resetAddControls();
    this.resetbtn.nativeElement.disabled = false;
    this.isProductCodeContainerVisible='none';
    this.isNoDataForLastyr = true;
}
addAOP(element:any, action:any) {
  let selectedPlant=this.plantlist.filter(item=>item.plantId==this.selectedplant);
  if(selectedPlant.lenth!=0)
  {
    this.plantName=selectedPlant[0].plantName;
    this.plantDesc=selectedPlant[0].plantDesc
  }
  else
  {
    {
      this.plantName='';
      this.plantDesc=''
    }
  }
  
  this.monthName=this.selectedmonth;
  if(action=='addAOP')
  {
    this.checkbox['checked'] = false;
    this.showSelectedAop=true
    this.addView=true;
    this.AopViewHeading='ADD'
    this.disableSearch=false;
    this.disableCheckbox= true;
  this.searchedAopVolumeData=[]
  this.isSuperPackageContainerVisible='none';
  this.validationForm.get('displayAopVolume').enable();
    this.addeditModal.show();
  }
  else{
    this.addView=false;
    this.showSelectedAop=false
    this.isAddNewRecord=false;
    this.AopViewHeading='EDIT'
    this.disableSearch=true;
    this.searchedAopVolumeData=[]
    this.captureaopService.getAopVolume(this.selectedplant,this.selectedyear,element.superPackage, element.productCode,false).subscribe(data=>{
      this.validationForm.get('productId').setValue(data.productId);
      this.validationForm.get('productCode').setValue(data.productCode);
      this.validationForm.get('productDesc').setValue(data.productDesc);
      this.validationForm.get('superPackage').setValue(data.superPackage);
      this.validationFormForMonth(data);
      } )
     
    this.isSuperPackageContainerVisible='none';
    this.validationForm.get('displayAopVolume').disable();
      this.addeditModal.show();
  }
}

validationFormForMonth(data:any)
{
  this.validationForm.get('jan').setValue(data.planCaseQnaitities[0].planCaseQuantity);
  this.validationForm.get('feb').setValue(data.planCaseQnaitities[1].planCaseQuantity);
  this.validationForm.get('mar').setValue(data.planCaseQnaitities[2].planCaseQuantity);
  this.validationForm.get('apr').setValue(data.planCaseQnaitities[3].planCaseQuantity);
  this.validationForm.get('may').setValue(data.planCaseQnaitities[4].planCaseQuantity);
  this.validationForm.get('jun').setValue(data.planCaseQnaitities[5].planCaseQuantity);
  this.validationForm.get('jul').setValue(data.planCaseQnaitities[6].planCaseQuantity);
  this.validationForm.get('aug').setValue(data.planCaseQnaitities[7].planCaseQuantity);
  this.validationForm.get('sep').setValue(data.planCaseQnaitities[8].planCaseQuantity);
  this.validationForm.get('oct').setValue(data.planCaseQnaitities[9].planCaseQuantity);
  this.validationForm.get('nov').setValue(data.planCaseQnaitities[10].planCaseQuantity);
  this.validationForm.get('dec').setValue(data.planCaseQnaitities[11].planCaseQuantity);
}
    searchAopVolume(){
      this.isAddNewRecord=true;
      this.submitted=false;
      this.norecords=false;
        let searchKeyword: string = this.validationForm.get('displayAopVolume').value;
        if(searchKeyword!==''){
            this.isProductCodeVisible='inline-block';
              this.captureaopService.searchAopVolume(this.selectedplant,this.selectedyear,searchKeyword).subscribe(data=>{
            this.searchedAopVolumeData = data;
            if(this.searchedAopVolumeData.length>0)
            {
              this.disableCheckbox=false;
            }
            if(this.searchedAopVolumeData.length==0)
            {
              this.norecords=true;
            }   
            this.isProductCodeVisible='none';
            this.isProductCodeContainerVisible='inline-block';
            } )
          }       
      }
      autoFill(event:any)
      {
      if(event)
      {
        this.captureaopService.getAopVolume(this.selectedplant,this.selectedyear,this.selectedSuperPackageVal, this.selectedProduct,event).subscribe(data=>{
          if(data.planCaseQnaitities.length!=0)
          {
          this.isNoDataForLastyr=true;
          this.validationFormForMonth(data);
          }
          else{
            this.isNoDataForLastyr=false;
            this.noDataForLastYr="No Data available for this Product Code for Last year!"
          }
        })
      }
      else
      {
        this.isNoDataForLastyr=true;
      }
    }
    selectedSuperPackage(selData:any){
        this.selectedSuperPackageVal=selData;
       this.validationForm.get('superPackage').setValue(selData);
       this.isSuperPackageContainerVisible='none';
       this.showSkuDetail=true
      }
      selectedAopVolume(selData:any){
          this.showSelectedAop=false
          this.selectedProduct=selData.productCode;
          this.selectedProductId=selData.productId;
          this.selectedSuperPackageVal=selData.superPackage;
          const productCodeAndDesc= selData.productCode + ' ('+selData.productDesc+')'
          this.validationForm.get('superPackage').setValue(selData.superPackage);
          this.validationForm.get('displayAopVolume').setValue(productCodeAndDesc);
         this.validationForm.get('productCode').setValue(selData.productCode);
        this.validationForm.get('productDesc').setValue(selData.productDesc);
         this.isProductCodeContainerVisible='none';
         this.showSkuDetail=true
        }
      aopVolume_select_cross(){
        this.isProductCodeContainerVisible='none';
      }
    exportAsXLSX():void {
      this.spinnerService.show();
      this.captureaopService.GetAOPVolumeForExport(this.selectedyear)
      .subscribe(data => {
        const apidata= data;
        const date = this.datepipe;
        let exportData
        if(apidata!=null)
        {
          exportData=apidata.map(function(elem) {
            return {
              'Plant':elem.plant,
              'Plant_Id': elem.plant_Id,
              'Super_Package':elem.super_Package,
              'Product_Id': elem.product_Id,
              'Product_Code':elem.product_Code,
              'Date': date.transform(elem.date,'dd/MM/yyyy'),
              'Plan_Case_Qty':elem.plan_Case_Qty
            }});
        }
        else
        {
          exportData=[{
            'Plant':'No data available for year '+this.selectedyear,
            'Plant_Id': '',
            'Super_Package':'',
            'Product_Id': '',
            'Product_Code':'',
            'Date': '',
            'Plan_Case_Qty':''
          }]
        }

       this.excelService.exportAsExcelFile(exportData, 'Capture AOP');
        this.spinnerService.hide();
      }, error => console.log(error));

  }
      
}
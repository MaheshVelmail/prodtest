import { Component, Inject, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatOption } from '@angular/material/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSelect } from '@angular/material/select';
import { Router } from '@angular/router';
import { LineMasterModel } from 'app/shared/models/line-master';
import { LineTypeDownTimeReasonModel } from 'app/shared/models/lineType-downtime-reason';
import { LineTypeDowntimeReasonService } from '../linetype-downtimereason.service';

@Component({
  selector: 'add-update-linetype-downtimereason-dialog',
  styleUrls: ['add-update-linetype-downtimereason-dialog.component.css'],
  templateUrl: 'add-update-linetype-downtimereason-dialog.component.html'

})
export class AddUpdatelineTypeDowntimeReasonDialogComponent {
  @ViewChild('matSelect') child: MatSelect; 
  formGroup: FormGroup;
  lineTypeData: any;
  downtimeReasonTypeData: any;
  btnText: string
  titleText: string
  statusDiv: boolean;
  downtimeReasonTypeDataList:any=[]
  lineTypeDataList:any=[]
  editdownTimeReasonTypeIdData:any
  @ViewChild('allSelected') private allSelected: MatOption;
  constructor(public dialog: MatDialog, private router: Router, private formBuilder: FormBuilder, private lineTypeDowntimeReasonService: LineTypeDowntimeReasonService,
    public dialogRef: MatDialogRef<AddUpdatelineTypeDowntimeReasonDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: LineTypeDownTimeReasonModel) {
    this.getLineTypeList();
    this.getDowntimeReasonTypes();
    this.formGroup = this.formBuilder.group({
      'id':data.id,
      'lineType': new FormControl(data.lineType, [Validators.required]),
      'downTimeReasonTypeIds': new FormControl('', [Validators.required]),
      'active': new FormControl(data.active == 'Active' ? true : false),

    });
    if (data.id != undefined) {
      this.btnText = 'update'
      this.titleText = 'Edit'
      this.statusDiv = true;
    }
    else {
      this.btnText = 'add'
      this.titleText = 'Add'
      this.statusDiv = false;
    }
  }
  ngAfterViewInit(){
   
  }
  selectAllReasonType(){
    if (this.data.id != undefined) {
       let downtimeReasonTypeIdsList = this.data.downTimeReasonTypeIds.map(function (element) {
        return {
          downTimeReasonTypeId: element
        }
      })
      const values = downtimeReasonTypeIdsList.map(item => parseInt(item.downTimeReasonTypeId))
      const sets = new Set([].concat(...values))
      const array = Array.from(sets)
      this.formGroup.get('downTimeReasonTypeIds').setValue(array);
    }
    else
    {
      const values = this.downtimeReasonTypeData.map(item => (item.downtimeReasonTypeId))
      const sets = new Set([].concat(...values))
      const array = Array.from(sets)
      this.formGroup.get('downTimeReasonTypeIds').setValue('');
    }
  }
  public isFiltered(downtimeReasonType) {
    return this.downtimeReasonTypeDataList.find(item => item.downtimeReasonTypeId === downtimeReasonType.downtimeReasonTypeId)
  }
  getLineTypeList() {
    this.lineTypeDowntimeReasonService.getLineType()
      .subscribe(data => {
        this.lineTypeData = data;
        this.lineTypeDataList=data;
      }, error => console.log(error));
  }
  getDowntimeReasonTypes() {
    this.lineTypeDowntimeReasonService.getDowntimeReasonTypes()
      .subscribe(data => {
        this.downtimeReasonTypeData = data;
        this.downtimeReasonTypeDataList=this.downtimeReasonTypeData.slice();
        this.selectAllReasonType()
      }, error => console.log(error));
  }
  InsertUpdateLine(data: any) {
    let downTimeReasonTypeIdsList=data.downTimeReasonTypeIds.filter(item=>item!=0)
   let downtimeReasonTypeIdList = downTimeReasonTypeIdsList.map(function (element) {
    return {
      downTimeReasonTypeId: element
    }
  })
  data.downTimeReasonTypeIds=downtimeReasonTypeIdList;
    if (!this.statusDiv) {
      data.active = true;
    }
    if (data.active == null) {
      data.active = false;
    }
    if (data.id > 0) {
      let action='Update'
      this.lineTypeDowntimeReasonService.upInsertDelete(action,data)
        .subscribe();
    }
    else {
      let action='Add'
      data.id = 0;
      this.lineTypeDowntimeReasonService.upInsertDelete(action,data)
      .subscribe();
    }

  }
  onNoClick(): void {
    this.dialogRef.close();
    this.dialog.closeAll()
  }
  // toggle all reasontype option selection
  tosslePerOne(){ 
    if (this.allSelected.selected) {  
     this.allSelected.deselect();
     return false;
 }
   if(this.formGroup.controls.downTimeReasonTypeIds.value.length==this.downtimeReasonTypeData.length)
     this.allSelected.select();
 
 }
   toggleAllSelection() {
     if (this.allSelected.selected) {
      this.formGroup.controls.downTimeReasonTypeIds
         .patchValue([...this.downtimeReasonTypeData.map(item => item.downtimeReasonTypeId), 0]);
     } else {
       this.formGroup.controls.downTimeReasonTypeIds.patchValue([]);
     }
   }

}

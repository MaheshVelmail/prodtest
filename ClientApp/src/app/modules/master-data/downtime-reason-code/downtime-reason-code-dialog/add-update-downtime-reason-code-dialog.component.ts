import { Component, Inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { DownTimeReasonCodeModel } from 'app/shared/models/downtime-reason-code';
import { SpinnerService } from 'app/shared/services/progress-spinner-configurable.service';
import { DowntimeReasonCodeService } from '../downtime-reason-code.service';

@Component({
  selector: 'add-update-downtime-reason-code-dialog',
  styleUrls: ['add-update-downtime-reason-code-dialog.component.css'],
  templateUrl: 'add-update-downtime-reason-code-dialog.component.html'

})
export class AddUpdateDowntimeReasonCodeDialogComponent {
  formGroup: FormGroup;
  downTimeReasonCodeListData: DownTimeReasonCodeModel;
  downTimeReasonCodeListDataList:any=[]
  btnText: string
  titleText: string
  statusDiv : boolean
  constructor(private spinnerService:SpinnerService,public dialog: MatDialog,private router:Router,private formBuilder: FormBuilder, private downtimeReasonCodeService: DowntimeReasonCodeService,
    public dialogRef: MatDialogRef<AddUpdateDowntimeReasonCodeDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DownTimeReasonCodeModel) {
    this.getDowntimeReasonTypeList();
    this.formGroup = this.formBuilder.group({
      'downtimeReasonCodeId': new FormControl (data.downtimeReasonCodeId),
      'downtimeReasonCodeDesc': new FormControl (data.downtimeReasonCodeDesc, [Validators.required,Validators.maxLength(50)]),
      'downtimeReasonTypeId': new FormControl (data.downtimeReasonTypeId, [Validators.required]),
      'downtimeReasonTypeDesc': new FormControl (data.downtimeReasonTypeDesc),
      'active': new FormControl (data.active=='Active'?true:false)
    });
    if (data.downtimeReasonCodeId != undefined) {
      this.btnText = 'update'
      this.titleText = 'Edit Downtime Reason Code'
      this.statusDiv = true;  
    }
    else {
      this.btnText = 'add'
      this.titleText = 'Add New Downtime Reason Code'
      this.statusDiv = false;
    }
  }
  getDowntimeReasonTypeList() {
    this.downtimeReasonCodeService.getDowntimeReasonTypes()
      .subscribe(data => {
        this.downTimeReasonCodeListData = data;
        this.downTimeReasonCodeListDataList=data;
      }, error => console.log(error));
  }
  InsertUpdate(data: any) {
    if(!this.statusDiv){
      data.active=true;
    }
    if(data.active==null)
    {
      data.active=false;
    }
    if (data.downtimeReasonCodeId!=null) {
      
      this.downtimeReasonCodeService.update(data)
        .subscribe(() => {
          this.spinnerService.hide();
        },
          error => console.log('update line log',error)
        );
    }
    else {
      data.downtimeReasonCodeId=0;
      this.downtimeReasonCodeService.insert(data)
        .subscribe(() => {
          this.spinnerService.hide();
          
        },
          error => console.log('insert line log',error)
        );
    }

  }
  onNoClick(): void {
    this.dialogRef.close();
    this.dialog.closeAll()
  }

}

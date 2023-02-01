import { Component, Inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { DownTimeReasonDetailModel } from 'app/shared/models/downtime-reason-detail';
import { SpinnerService } from 'app/shared/services/progress-spinner-configurable.service';
import { DowntimeReasonDetailService } from '../downtime-reason-detail.service';


@Component({
  selector: 'add-update-downtime-reason-detail-dialog',
  styleUrls: ['add-update-downtime-reason-detail-dialog.component.css'],
  templateUrl: 'add-update-downtime-reason-detail-dialog.component.html'

})
export class AddUpdateDowntimeReasonDetailDialogComponent {
  formGroup: FormGroup;
  downTimeReasonDetailListData: DownTimeReasonDetailModel;
  downTimeReasonDetailListDataList:any=[]
  btnText: string
  titleText: string
  loadingData: boolean
  statusDiv: boolean
  constructor(private spinnerService:SpinnerService,public dialog: MatDialog, private router: Router, private formBuilder: FormBuilder, private downtimeReasonDetailService: DowntimeReasonDetailService,
    public dialogRef: MatDialogRef<AddUpdateDowntimeReasonDetailDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DownTimeReasonDetailModel) {
    this.getDowntimeReasonTypeList();
    this.formGroup = this.formBuilder.group({
      'downtimeReasonDetailId': new FormControl(data.downtimeReasonDetailId),
      'downtimeReasonDetailDesc': new FormControl(data.downtimeReasonDetailDesc, [Validators.required,Validators.maxLength(50)]),
      'downtimeReasonCodeId': new FormControl(data.downtimeReasonCodeId),
      'downtimeReasonCodeDesc': new FormControl(data.downtimeReasonCodeDesc),
      'active': new FormControl(data.active == 'Active' ? true : false),
    });
    if (data.downtimeReasonDetailId != undefined) {
      this.btnText = 'update'
      this.titleText = 'Edit Downtime Reason Detail'
      this.statusDiv = true;
    }
    else {
      this.btnText = 'add'
      this.titleText = 'Add New Downtime Reason Detail'
      this.statusDiv = false;
    }
  }
  getDowntimeReasonTypeList() {
    this.downtimeReasonDetailService.getAll()
      .subscribe(data => {
        let prepare_downtimeTypeList = data.map(function (elem) {
          return {
            active:elem.active,
            downtimeReasonCodeDesc: elem.downtimeReasonCodeDesc,
            downtimeReasonCodeId: elem.downtimeReasonCodeId,
            //downtimeReasonTypeDesc: this.appendDowntimeType(elem.downtimeReasonTypeDesc),
            downtimeReasonTypeDesc: elem.downtimeReasonTypeDesc,
            downtimeReasonTypeId: elem.downtimeReasonTypeId
          }
        },this);
        this.downTimeReasonDetailListData = prepare_downtimeTypeList;
        this.downTimeReasonDetailListDataList=prepare_downtimeTypeList;
      }, error => console.log(error));
  }
  appendDowntimeType(value)
  {
    let the_string = value;
    let parts = the_string.split('-', 3);
    if(parts[0]!=undefined && parts[2]!=undefined){
      let disaplyString= (parts[0]!=undefined?parts[0]:'')+'-'+(parts[2]!=undefined?parts[2]:'')
      return disaplyString;	
    }
    else if(parts[2]==undefined)
    {
      let disaplyString= (parts[0]!=undefined?parts[0]:'')
      return disaplyString;	
    } 
  }
  InsertUpdate(data: any) {
    if (!this.statusDiv) {
      data.active = true;
    }
    if (data.active == null) {
      data.active = false;
    }
    if (data.downtimeReasonDetailId > 0) {

      this.downtimeReasonDetailService.update(data)
        .subscribe(() => {
          this.spinnerService.hide();
        },
          error => console.log('update line log', error)
        );
    }
    else {
      data.downtimeReasonDetailId = 0;
      this.downtimeReasonDetailService.insert(data)
        .subscribe(() => {
          this.spinnerService.hide();
        },
          error => console.log('insert line log', error)
        );
    }

  }
  onNoClick(): void {
    this.dialogRef.close();
    this.dialog.closeAll()
  }

}

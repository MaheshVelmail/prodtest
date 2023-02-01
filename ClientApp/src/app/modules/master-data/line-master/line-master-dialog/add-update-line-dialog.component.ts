import { Component, Inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { LineMasterModel } from 'app/shared/models/line-master';
import { LineMasterService } from '../line-master.service';

@Component({
  selector: 'add-update-line-dialog',
  styleUrls: ['add-update-line-dialog.component.css'],
  templateUrl: 'add-update-line-dialog.component.html'

})
export class AddUpdateLineDialogComponent {
  formGroup: FormGroup;
  lineTypeData: LineMasterModel;
  fillerTypeData: LineMasterModel;
  plantTypeData: LineMasterModel;
  lineTypeDataList: any=[];
  fillerTypeDataList: any=[];;
  plantTypeDataList: any=[];;
  btnText: string
  titleText: string
  statusDiv: boolean;
  constructor(public dialog: MatDialog, private router: Router, private formBuilder: FormBuilder, private lineMasterService: LineMasterService,
    public dialogRef: MatDialogRef<AddUpdateLineDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: LineMasterModel) {
    this.getLineTypeList();
    this.getFillerTypeList();
    this.getPlantList();
    this.formGroup = this.formBuilder.group({
      'lineId': data.lineId,
      'lineName': new FormControl(data.lineName, [Validators.required, Validators.maxLength(50)]),
      'lineType': new FormControl(data.lineType, [Validators.required]),
      'plantId': new FormControl(data.plantId, [Validators.required]),
      'fillerType': new FormControl(data.fillerType, [Validators.required]),
      'active': new FormControl(data.active == 'Active' ? true : false),

    });
    if (data.lineName != undefined) {
      this.btnText = 'update'
      this.titleText = 'Edit Line'
      this.statusDiv = true;
    }
    else {
      this.btnText = 'add'
      this.titleText = 'Add Line'
      this.statusDiv = false;
    }
  }
  getLineTypeList() {
    this.lineMasterService.getLineType()
      .subscribe(data => {
        this.lineTypeData = data;
        this.lineTypeDataList = data;
      }, error => console.log(error));
  }
  getPlantList() {
    this.lineMasterService.getPlant()
      .subscribe(data => {
        this.plantTypeData = data;
        this.plantTypeDataList = data;
      }, error => console.log(error));
  }
  getFillerTypeList() {
    this.lineMasterService.getFillerType()
      .subscribe(data => {
        this.fillerTypeData = data;
        this.fillerTypeDataList = data;
      }, error => console.log(error));
  }
  InsertUpdateLine(data: any) {
    if (!this.statusDiv) {
      data.active = true;
    }
    if (data.active == null) {
      data.active = false;
    }
    if (data.lineId > 0) {

      this.lineMasterService.update(data)
        .subscribe(() => undefined
        );
    }
    else {
      data.lineId = 0;
      this.lineMasterService.insert(data)
        .subscribe(() => undefined
        );
    }

  }
  onNoClick(): void {
    this.dialogRef.close();
    this.dialog.closeAll()
  }

}

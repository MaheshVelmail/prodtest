import { Component, Inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ShiftMasterModel } from 'app/shared/models/shift-master';
import { ShiftMasterService } from '../shift-master.service';
import * as moment from 'moment';

@Component({
  selector: 'add-shift-dialog',
  styleUrls: ['add-shift-dialog.component.css'],
  templateUrl: 'add-shift-dialog.component.html'

})
export class AddShiftDialogComponent {
  validationForm: FormGroup;
  btnText: string
  titleText: string
  plantListData: any
  shiftListData: any
  plantListDataList: any=[]
  shiftListDataList: any=[]
  linesDataByPlantList: any=[]
  sratttime: any
  endtime: any
  CurrentTime: any;
  rowData: any
  plantTimeZone: any;
  diplayplantTimeZone: any;
  allPlantShiftData: any
  isShifttimeExist: any;
  isDisable: boolean;
  statusDiv: boolean;
  timeFormatFlag: boolean = false;
  timeFormatEndFlag: boolean = false;
  hourFlag: boolean = false;
  timeCompareFlag: boolean = false;
  btnFlag: boolean = true;
  btnEndFlag: boolean = true;
  linesDataByPlant: any;
  selectedline: any;
  timezone: any;
  timezonemessage: boolean;
  endTimeDay: string;
  hour: any;
  minute: any;
  hourStartTime: string;
  hourEndTime: string;
  minuteValMessage: string;
  constructor(public dialog: MatDialog, private router: Router, private formBuilder: FormBuilder, private shiftMasterService: ShiftMasterService,
    public dialogRef: MatDialogRef<AddShiftDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ShiftMasterModel) {
    this.timezonemessage = false;
    this.rowData = data;
    this.getPlantList();
    if (this.rowData.length != 0) {
      this.getLinesByPlant(data.plantId);
      this.lineSelectionChange(data.lineId,true);
      this.timeFormatOfDay(data.startTime, data.endTime);
    }
    this.CurrentTime = new Date().getHours() + ':' + new Date().getMinutes();
    this.sratttime = data.startTime
    this.endtime = data.endTime
    let hourStartTime = moment(moment(data.startTime, "hh:mm").format("LT"), "hh:mm a");
    let hourEndTime = moment(moment(data.endTime, "hh:mm").format("LT"), "hh:mm a");
    this.hour = parseInt(moment.utc(hourEndTime.diff(hourStartTime)).format("HH"));
    if (hourStartTime.toLocaleString() == hourEndTime.toLocaleString()) {
      this.hour = 24;//this is done for 24hour shift case
      this.timeFormatOfDay(data.startTime, data.endTime);
    }
    this.minute = parseInt(moment.utc(hourEndTime.diff(hourStartTime)).format("mm"));
    this.validationForm = this.formBuilder.group({
      'plantShiftId': data.plantShiftId,
      'plantName': data.plantName,
      'shiftName': data.shiftName,
      'plantId': new FormControl(data.plantId, [Validators.required]),
      'lineId': new FormControl(data.lineId, [Validators.required]),
      'shiftId': new FormControl(data.shiftId, [Validators.required]),
      'startTime': new FormControl((this.rowData.length != 0 ? this.sratttime : this.CurrentTime), [Validators.required]),
      'endTime': new FormControl((data.endTime)),
      'shiftDisplayTime': new FormControl(''),
      'active': new FormControl(data.active == 'Active' ? true : false),
      'hours': new FormControl(this.hour, [Validators.required]),
      'minutes': new FormControl(this.minute)

    });
    if (data.plantName != undefined) {
      this.btnText = 'update'
      this.titleText = 'Edit Shift'
      this.plantTimeZone = data.timeZone
      if (this.plantTimeZone == null) {
        this.timezonemessage = true;
      }
      this.diplayplantTimeZone = data.timeZone + ' '
      this.validationForm.get('plantId').disable();
      this.validationForm.get('lineId').disable();
      this.validationForm.get('shiftId').disable();
      this.statusDiv = true;
      console.log(data);
    }
    else {
      this.btnText = 'add'
      this.titleText = 'Add Shift'
      this.statusDiv = false;
      this.validationForm.get('hours').reset();
    }
  }
  lineSelectionChange(lineId:any,includeinactive:any) {
    this.shiftListData=[]                                    
      this.shiftMasterService.getShiftbyLineId(lineId,includeinactive)
    .subscribe(data => {
      this.shiftListData = data;
      this.shiftListDataList = data;
    }, error => console.log(error));
  }
  getPlantList() {
    this.shiftMasterService.getPlantList()
      .subscribe(data => {
        this.plantListData = data;
        this.plantListDataList = data;
      }, error => console.log(error));
  }
  plantSelectionChange(data: any) {
    const plantTimeZone = this.plantListData.filter(item => item.plantId == data)
    this.plantTimeZone = plantTimeZone[0].timezone
    if (this.plantTimeZone == null) {
      this.timezonemessage = true;
    }
    else {
      this.timezonemessage = false;
    }
    this.diplayplantTimeZone = plantTimeZone[0].timezone + ' '
    this.getLinesByPlant(data);
  }
  InsertUpdate(data: any) {

    data.timeZone = this.plantTimeZone
    if (!this.statusDiv) {
      data.active = true;
    }
    if (data.active == null) {
      data.active = false;
    }
    if (data.plantShiftId > 0) {
      this.shiftMasterService.updatePlantShift(data)
        .subscribe();
    }
    else {
      data.plantShiftId = 0;
      this.shiftMasterService.addPlantShift(data)
        .subscribe();
    }

  }
  onNoClick(): void {
    this.dialogRef.close();
    this.dialog.closeAll()
  }
  timeFormatStart(time: any) {

    let isValid = /^\d{2}:\d{2}$/.test(time)
    if (isValid) {
      this.timeFormatFlag = false;
      this.btnFlag = false;
      let hour = this.validationForm.controls['hours'].value;
      let minute = this.validationForm.controls['minutes'].value;
      if ((hour != null && !Number.isNaN(hour))) {
        this.validationForm.get('endTime').setValue(moment(time, "HH:mm").add(hour, "hours").add(minute, "minutes").format("HH:mm").toString());
        let endTime = moment(time, "HH:mm").add(hour, "hours").add(minute, "minutes").format("HH:mm").toString();
        this.timeFormatOfDay(time, endTime);
      }
    }
    else { this.timeFormatFlag = true; this.btnFlag = true; }
  }

  timeFormatEnd(time: any) {

    let isValid = /^\d{2}:\d{2}$/.test(time)

    if (isValid) {
      this.timeFormatEndFlag = false;
      this.btnEndFlag = false;
      if (this.compareTime(this.validationForm.controls['startTime'].value, time)) {
        this.timeCompareFlag = true; this.btnEndFlag = true; this.btnFlag = true;
      }
      else {
        this.timeCompareFlag = false; this.btnEndFlag = false; this.btnFlag = false;
      }
    }
    else { this.timeFormatEndFlag = true; this.btnEndFlag = true; }
  }

  compareTime(startTime: any, endTime: any) {

    if (startTime === endTime) {
      return true;
    }
    var time1 = startTime.split(':');
    var time2 = endTime.split(':');
    if (parseInt(time1[0]) > parseInt(time2[0])) {
      return true;
    }
     if (parseInt(time1[0]) == parseInt(time2[0]) && parseInt(time1[1]) > parseInt(time2[1])) {
      return true;
    } 
    else {
      return false;
    }
  }

  getLinesByPlant(id: any) {
    this.shiftMasterService.getLinesByPlant(id)
      .subscribe(data => {
        this.linesDataByPlant = data;
        this.linesDataByPlantList=data;
      }, error => console.log(error));
  }
  hoursSelectionChange(hoursTime: any) {
    this.minuteValMessage = "";
    let val = this.validationForm.controls['hours'].value
    let minutes = this.validationForm.controls['minutes'].value;
    if ((hoursTime == null || Number.isNaN(hoursTime) || hoursTime == undefined) && Number.isNaN(val)) {
      this.hourFlag = true;
      this.btnFlag = true;
    }
    else if (val == 24 && minutes > 0) { // show alert if shift duration > 24hours
      this.btnFlag = true;
      this.minuteValMessage = "Max shift duration can be 24hrs";
    }
    else {
      
      this.hourFlag = false;
      this.btnFlag = false;
      let time = this.validationForm.controls['startTime'].value;
      hoursTime = hoursTime == undefined ? val : hoursTime;
      this.validationForm.get('endTime').setValue(moment(time, "HH:mm").add(hoursTime, "hours").add(minutes, "minutes").format("HH:mm").toString());
      this.timeFormatOfDay(time, moment(time, "HH:mm").add(hoursTime, "hours").add(minutes, "minutes").format("HH:mm").toString());
    }
  }
  minutesSelectionChange(minutes: any) {
    this.minuteValMessage = "";
    let time = this.validationForm.controls['startTime'].value;
    let hour = this.validationForm.controls['hours'].value;
    if (hour == 24 && minutes > 0) { // show alert if shift duration > 24hours
      this.btnFlag = true;
      this.minuteValMessage = "Max shift duration can be 24hrs";
    }
    else {
      this.btnFlag = false;
    }
    this.validationForm.get('endTime').setValue(moment(time, "HH:mm").add(hour, "hours").add(minutes, "minutes").format("HH:mm").toString());
    this.timeFormatOfDay(time, moment(time, "HH:mm").add(hour, "hours").add(minutes, "minutes").format("HH:mm").toString());
  }
  timeFormatOfDay(start: any, end: any) {
    let endTimeFormat = moment(end, "hh:mm").format("HH:mm A").split(" ");
    let startTimeFormat = moment(start, "hh:mm").format("HH:mm A").split(" ");
    let currentHour = this.validationForm?.controls['hours'].value;
    if (startTimeFormat[1] == "PM" && endTimeFormat[1] == "AM") {
      this.endTimeDay = " next day";
    }
    else if (this.hour == 24 || currentHour==24) { // show next day if shift duration is equal to 24hours
      this.endTimeDay = " next day";
    }
    else {
      this.endTimeDay = " same day";
    }
  }
}

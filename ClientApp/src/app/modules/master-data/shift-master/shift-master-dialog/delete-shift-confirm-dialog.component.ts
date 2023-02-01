import { Component, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ShiftMasterModel } from 'app/shared/models/shift-master';
import { ShiftMasterService } from '../shift-master.service';
@Component({
    selector: 'confirm-dialog',
    templateUrl: 'delete-shift-confirm-dialog.component.html',
  })
  export class DeleteShiftConfirmDialogComponent {

    constructor(public dialog: MatDialog,private shiftMasterService: ShiftMasterService,
      public dialogRef: MatDialogRef<DeleteShiftConfirmDialogComponent>,
      @Inject(MAT_DIALOG_DATA) public data: ShiftMasterModel){

      }

      deleteShift() {
        this.shiftMasterService.delete(this.data.plantShiftId)
          .subscribe(()=>undefined
          );
      }
      onNoClick(): void {
        this.dialogRef.close();
        this.dialog.closeAll()
      }
  }
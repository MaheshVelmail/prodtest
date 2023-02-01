import { Component, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { LineTypeDownTimeReasonModel } from 'app/shared/models/lineType-downtime-reason';
import { LineTypeDowntimeReasonService } from '../linetype-downtimereason.service';
@Component({
    selector: 'confirm-dialog',
    templateUrl: 'delete-linetype-downtimereason-confirm-dialog.component.html',
  })
  export class DeleteLineTypeDownTypeReasonConfirmDialogComponent {

    constructor(public dialog: MatDialog,private LineTypeDowntimeReasonService :LineTypeDowntimeReasonService,
      public dialogRef: MatDialogRef<DeleteLineTypeDownTypeReasonConfirmDialogComponent>,
      @Inject(MAT_DIALOG_DATA) public data: LineTypeDownTimeReasonModel){


      }

      deleteLine() {
        let downtimeReasonTypeIdList = this.data.downTimeReasonTypeIds.map(function (element) {
          return {
            downTimeReasonTypeId: element
          }
        })
        this.data.downTimeReasonTypeIds=downtimeReasonTypeIdList
        this.data.active=false;
        let action='Delete'
        this.LineTypeDowntimeReasonService.upInsertDelete(action,this.data,)
        .subscribe();
      }
      onNoClick(): void {
        this.dialogRef.close();
        this.dialog.closeAll()
      }
  }
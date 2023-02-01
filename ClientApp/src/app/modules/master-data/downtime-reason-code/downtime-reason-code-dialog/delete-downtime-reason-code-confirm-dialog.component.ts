import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Component, Inject} from '@angular/core';
import { DowntimeReasonCodeService } from '../downtime-reason-code.service';
import { DownTimeReasonCodeModel } from 'app/shared/models/downtime-reason-code';

@Component({
    selector: 'confirm-dialog',
    templateUrl: 'delete-downtime-reason-code-confirm-dialog.component.html',
  })
  export class DeleteDowntimeReasonCodeConfirmDialogComponent {

    constructor(public dialog: MatDialog,private downtimeReasonCodeService :DowntimeReasonCodeService,
      public dialogRef: MatDialogRef<DeleteDowntimeReasonCodeConfirmDialogComponent>,
      @Inject(MAT_DIALOG_DATA) public data: DownTimeReasonCodeModel){

      }

      deleteRegion() {
        this.downtimeReasonCodeService.delete(this.data.downtimeReasonCodeId)
          .subscribe(() => undefined
          );
      }
      onNoClick(): void {
        this.dialogRef.close();
        this.dialog.closeAll()
      }
  }
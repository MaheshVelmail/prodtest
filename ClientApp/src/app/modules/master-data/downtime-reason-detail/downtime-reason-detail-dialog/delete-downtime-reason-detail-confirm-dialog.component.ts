import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Component, Inject } from '@angular/core';
import { DowntimeReasonDetailService } from '../downtime-reason-detail.service';
import { DownTimeReasonDetailModel } from 'app/shared/models/downtime-reason-detail';

@Component({
  selector: 'confirm-dialog',
  templateUrl: 'delete-downtime-reason-detail-confirm-dialog.component.html',
})
export class DeleteDowntimeReasonDetailConfirmDialogComponent {

  constructor(public dialog: MatDialog, private downtimeReasonDetailService: DowntimeReasonDetailService,
    public dialogRef: MatDialogRef<DeleteDowntimeReasonDetailConfirmDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DownTimeReasonDetailModel) {

  }

  deleteRegion() {
    this.downtimeReasonDetailService.delete(this.data.downtimeReasonDetailId)
      .subscribe(() => undefined
      );
  }
  onNoClick(): void {
    this.dialogRef.close();
    this.dialog.closeAll()

  }
}
import { Component, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { LineMasterModel } from 'app/shared/models/line-master';
import { LineMasterService } from '../line-master.service';
@Component({
    selector: 'confirm-dialog',
    templateUrl: 'delete-line-confirm-dialog.component.html',
  })
  export class DeleteLineConfirmDialogComponent {

    constructor(public dialog: MatDialog,private lineMasterService :LineMasterService,
      public dialogRef: MatDialogRef<DeleteLineConfirmDialogComponent>,
      @Inject(MAT_DIALOG_DATA) public data: LineMasterModel){

      }

      deleteLine() {
        this.lineMasterService.delete(this.data.lineId)
          .subscribe(() => undefined
          );
      }
      onNoClick(): void {
        this.dialogRef.close();
        this.dialog.closeAll()
      }
  }
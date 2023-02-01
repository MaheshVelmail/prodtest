import { Component, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PlantMasterModel } from 'app/shared/models/plant-master';
import { PlantMasterService } from '../plant-master.service';
@Component({
  selector: 'confirm-dialog',
  templateUrl: 'plant-confirm-dialog.component.html',
  styles: ['plant-confirm-dialog.component.css']
})
export class PlantConfirmDialogComponent {

  constructor(public dialog: MatDialog,
    public dialogRef: MatDialogRef<PlantConfirmDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: PlantMasterModel, private plantService: PlantMasterService) {

  }

  deleteLine() {
    this.plantService.deletePlant(this.data.plantId)
      .subscribe(() => undefined
      );
  }
  onNoClick(): void {
    this.dialogRef.close();
    this.dialog.closeAll()
  }
  
}
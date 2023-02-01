import {Injectable} from '@angular/core';
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';

@Injectable({
    providedIn: 'root'
  })
export class MessageService {
  public appDrawer: any;
  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'top';
  constructor(private _snackBar: MatSnackBar) {
  }
  displaySuccessMessage(message: string) {
    this._snackBar.open(message, 'X', {
      duration: 5000,  //in 5 seconds
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
      panelClass: ['success-message']
    });
  }
  displayFailedMessage(message: string) {
    this._snackBar.open(message, 'X', {
      duration: 5000,  //in 5 seconds
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
      panelClass: ['failed-message']
    });
  }
}
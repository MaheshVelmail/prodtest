import { Component } from '@angular/core';
import { ProgressSpinnerMode } from '@angular/material/progress-spinner';
import { SpinnerService } from 'app/shared/services/progress-spinner-configurable.service';
@Component({
  selector: 'progress-spinner-configurable',
  templateUrl: 'progress-spinner-configurable.html',
  styleUrls: ['progress-spinner-configurable.css'],
})
export class ProgressSpinnerConfigurableExample {  
  mode: ProgressSpinnerMode = 'indeterminate';
  value = 50;
  constructor(public spinnerService: SpinnerService){

  }
}
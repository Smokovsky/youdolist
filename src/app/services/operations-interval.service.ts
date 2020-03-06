import { Injectable } from '@angular/core';
import { SnackBarProviderService } from './snack-bar-provider.service';

@Injectable({
  providedIn: 'root'
})
export class OperationsIntervalService {

  operationAllowed = true;

  constructor(private snackbarService: SnackBarProviderService) { }

  longInterval(): boolean {
    return this.getSetInterval(800);
  }

  shortInterval(): boolean {
    return this.getSetInterval(500);
  }

  private getSetInterval(ms: number): boolean {
    if (this.operationAllowed) {
      this.operationAllowed = false;
      setTimeout(() => { this.operationAllowed = true; }, ms);
      return true;
    } else {
      this.snackbarService.openSnack('Please wait a second');
      return false;
    }
  }
}

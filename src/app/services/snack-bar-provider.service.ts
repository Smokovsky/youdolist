import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class SnackBarProviderService {

  constructor(private snackBar: MatSnackBar) { }

  openSnack(message: string): void {
    this.snackBar.open(message, 'dismiss', { duration: 2500 });
  }
}

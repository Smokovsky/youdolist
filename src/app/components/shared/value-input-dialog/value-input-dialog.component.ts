import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-value-input-dialog',
  templateUrl: './value-input-dialog.component.html',
  styleUrls: ['./value-input-dialog.component.css']
})
export class ValueInputDialogComponent implements OnInit {

  private value = 0;

  constructor(public dialogRef: MatDialogRef<ValueInputDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public message: string) { }

  ngOnInit() {
  }

  onClickSubmit(): void {
    this.dialogRef.close(this.value);
  }

  onClickCancel(): void {
    this.dialogRef.close();
  }

}

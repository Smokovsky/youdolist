import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-number-input-dialog',
  templateUrl: './number-input-dialog.component.html',
  styleUrls: ['./number-input-dialog.component.css']
})
export class NumberInputDialogComponent implements OnInit {

  private value: number;

  constructor(public dialogRef: MatDialogRef<NumberInputDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public message: string) { }

  ngOnInit() { }

  onClickSubmit(): void {
    this.dialogRef.close(this.value);
  }

  onClickCancel(): void {
    this.dialogRef.close();
  }

}

import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-string-input-dialog',
  templateUrl: './string-input-dialog.component.html',
  styleUrls: ['./string-input-dialog.component.css']
})
export class StringInputDialogComponent implements OnInit {

  private value = '';

  constructor(public dialogRef: MatDialogRef<StringInputDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public message: string) { }

  ngOnInit() { }

  onClickSubmit(): void {
    this.dialogRef.close(this.value);
  }

  onClickCancel(): void {
    this.dialogRef.close();
  }

}

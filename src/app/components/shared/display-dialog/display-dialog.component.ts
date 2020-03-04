import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-display-dialog',
  templateUrl: './display-dialog.component.html',
  styleUrls: ['./display-dialog.component.css']
})
export class DisplayDialogComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<DisplayDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public message: string) { }

  ngOnInit() { }

  onClickCancel(): void {
    this.dialogRef.close();
  }

}

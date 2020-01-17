import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Task } from 'src/app/models/task.model';

@Component({
  selector: 'app-undo-options',
  templateUrl: './undo-options.component.html',
  styleUrls: ['./undo-options.component.css']
})
export class UndoOptionsComponent implements OnInit {

  task?: Task = this.data.task;
  taskName: string;
  taskPoints: number;
  taskCompletitor: string;


  constructor(public dialog: MatDialog,
              public dialogRef: MatDialogRef<UndoOptionsComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) {

    this.taskName = this.task.name;
    this.taskPoints = this.task.points;
    this.taskCompletitor = this.task.completitorId;
  }

  ngOnInit() { }

  onClickSubstractPointsButton(): void {
    this.dialogRef.close('changePoints');
  }

  onClickLeavePointsButton(): void {
    this.dialogRef.close('leavePoints');
  }

  onClickCancelButton(): void {
    this.dialogRef.close('closed');
  }

}

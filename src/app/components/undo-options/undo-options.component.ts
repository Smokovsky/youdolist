import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Task } from 'src/app/models/task.model';
import { UsersDetailProviderService } from 'src/app/services/users-detail-provider.service';

@Component({
  selector: 'app-undo-options',
  templateUrl: './undo-options.component.html',
  styleUrls: ['./undo-options.component.css']
})
export class UndoOptionsComponent implements OnInit {

  detailsService?: UsersDetailProviderService = this.data.detailsService;

  task?: Task = this.data.document;
  taskName: string;
  taskPoints: number;
  taskCompletitor: string;

  constructor(public dialog: MatDialog,
              public dialogRef: MatDialogRef<UndoOptionsComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) {

    if (this.task) {
      this.taskName = this.task.name;
      this.taskPoints = this.task.points;
      this.taskCompletitor = this.task.completitorId;
    }
  }

  ngOnInit() { }

  onClickSubstractPointsButton(): void {
    this.dialogRef.close('changePoints');
  }

  onClickLeavePointsButton(): void {
    this.dialogRef.close('leavePoints');
  }

  onClickCancelButton(): void {
    this.dialogRef.close();
  }

}

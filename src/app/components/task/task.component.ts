import { Component, OnInit, Input } from '@angular/core';
import { EditTaskComponent } from '../edit-task/edit-task.component';
import { MatDialog } from '@angular/material/dialog';
import { Task } from 'src/app/models/task.model';
import { DoneTasksProviderService } from 'src/app/services/done-tasks-provider.service';
import { ConfirmationDialogComponent } from '../shared/confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.css']
})
export class TaskComponent implements OnInit {

  @Input()
  taskList: Array<Task>;
  doneTasksList: Array<Task>;

  constructor(public dialog: MatDialog,
              private doneTasksProviderService: DoneTasksProviderService) {
                this.doneTasksProviderService.getDoneTasksObs().subscribe((doneTasks: Array<Task>) => {
                  this.doneTasksList = doneTasks;
               });
              }

  ngOnInit() {
  }

  onClickTaskDelete(i: number): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '350px',
      data: 'Are you sure you want to delete task? You won\'t be able to get it back'
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.taskList.splice(i, 1);
      }
    });
  }

  onClickTaskSettings(task: Task): void {
    const dialogRef = this.dialog.open(EditTaskComponent, {
      data: { task }
    });
    dialogRef.afterClosed().subscribe(data => { });
  }

  onClickTaskDone(i: number) {
    this.doneTasksProviderService.add(this.taskList[i]);
    this.taskList.splice(i, 1);
  }

}

import { Component, OnInit, Input } from '@angular/core';
import { EditTaskComponent } from '../edit-task/edit-task.component';
import { MatDialog } from '@angular/material/dialog';
import { Task } from 'src/app/models/task.model';

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.css']
})
export class TaskComponent implements OnInit {

  @Input()
  tasks: Array<Task>;

  constructor(public dialog: MatDialog) { }

  ngOnInit() {
  }

  onClickTaskSettings(task: Task): void {
    const dialogRef = this.dialog.open(EditTaskComponent, {
      data: { task }
    });
    dialogRef.afterClosed().subscribe(data => {
    });
  }

  onClickTaskDone(task: Task) {
    console.log('Task "' + task.name + '" done button clicked!');
  }

  onClickTaskDelete(index: number) {
    this.tasks.splice(index);
  }

}

import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { Task } from 'src/app/models/task.model';
import { Todo } from 'src/app/models/todo.model';
import { ConfirmationDialogComponent } from '../shared/confirmation-dialog/confirmation-dialog.component';
import { BoardUserProviderService } from 'src/app/services/board-user-provider.service';
import { SnackBarProviderService } from 'src/app/services/snack-bar-provider.service';

@Component({
  selector: 'app-edit-task',
  templateUrl: './edit-task.component.html',
  styleUrls: ['./edit-task.component.css']
})
export class EditTaskComponent implements OnInit {

  boardUserProviderService: BoardUserProviderService = this.data.boardUserProviderService;
  userId: string;
  userAccessLevel: number;

  task?: Task = this.data.task;
  taskAuthorId: string;
  taskEditorId: string;
  taskName: string ;
  taskDescription: string;
  taskTodoList = new Array<Todo>();
  taskCreationDate: Date;
  taskEditDate: Date;
  taskDueDate?: Date;
  taskCompletitionDate?: Date;
  taskCompletitorId?: string;
  taskPoints: number;

  newTodoName: string;
  datepicker: Date;
  action: string;

  constructor(public dialog: MatDialog,
              public dialogRef: MatDialogRef<EditTaskComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any,
              private snackbarService: SnackBarProviderService) {

    this.boardUserProviderService.getUserAccessLevelObs().subscribe((accessLevel: number) => {
      this.userAccessLevel = accessLevel;
    });

  }

  ngOnInit() {
    this.userId = this.boardUserProviderService.getUserId();

    if (!this.task) {
      this.task = new Task('', '', this.userId, new Array<Todo>(), 0, false);
      this.action = 'new';
    }
    this.taskEditorId = this.task.lastEditorId;
    this.taskAuthorId = this.task.authorId;
    this.taskName = this.task.name;
    this.taskDescription = this.task.description;
    this.taskTodoList = Object.assign([], this.task.todoList);
    this.taskCreationDate = this.task.creationDate;
    this.taskEditDate = this.task.lastEditDate;
    this.taskDueDate = this.task.dueDate;
    this.taskPoints = this.task.points;
    this.taskCompletitionDate = this.task.completitionDate;
    this.taskCompletitorId = this.task.completitorId;
  }

  // TODO: FIX: checking todos of existing indexes result in live editing without approval
  onTodoCheck(todo: Todo): void {
    todo.isDone = !todo.isDone;
  }

  onClickTaskDelete(): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '350px',
      data: 'Are you sure you want to delete this task? You won\'t be able to get it back.'
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.snackbarService.openSnack('Task deleted');
        this.dialogRef.close({task: this.task, action: 'delete'});
      }
    });
  }

  onClickAddTodo(): void {
    this.taskTodoList.push(new Todo(this.newTodoName));
    this.newTodoName = '';
  }

  onClickDeleteTodo(i: number): void {
    this.taskTodoList.splice(i, 1);
  }

  onClickCancelDueDate(): void {
    this.taskDueDate = null;
  }

  onClickCancelButton(): void {
    this.dialogRef.close();
    delete this.task;
  }

  onClickSaveButton(): void {
    if (this.action !== 'new') {
      this.task.lastEditorId = this.userId;
      this.task.lastEditDate = new Date();
      this.snackbarService.openSnack('Task saved');
    } else {
      this.snackbarService.openSnack('New task created');
    }
    if (this.userAccessLevel >= 3) {
      this.task.isApproved = true;
    }
    this.task.name = this.taskName;
    this.task.description = this.taskDescription;
    this.task.todoList = this.taskTodoList;
    this.task.dueDate = this.taskDueDate;
    this.task.points = this.taskPoints;
    this.dialogRef.close({task: this.task, action: this.action});
  }

}

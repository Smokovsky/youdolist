import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { Task } from 'src/app/models/task.model';
import { Todo } from 'src/app/models/todo.model';
import { ConfirmationDialogComponent } from '../shared/confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-edit-task',
  templateUrl: './edit-task.component.html',
  styleUrls: ['./edit-task.component.css']
})
export class EditTaskComponent implements OnInit {
  userId: string;
  // categoryId: string;

  task?: Task = this.data.task;
  taskAuthorId: string;
  taskEditorId: string;
  taskName: string ;
  taskDescription: string;
  taskTodoList: Array<Todo>;
  taskCreationDate: Date;
  taskEditDate: Date;
  taskDueDate?: Date;
  taskPoints: number;

  newTodoName: string;
  datepicker: Date;
  action: string;

  constructor(public dialog: MatDialog,
              public dialogRef: MatDialogRef<EditTaskComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
    this.userId = 'XQAA';
    if (!this.task) {
      this.task = new Task('', '', this.userId, new Array<Todo>(), 0);
      this.action = 'new';
    }
    // this.categoryId = this.task.categoryId;
    this.taskEditorId = this.task.lastEditorId;
    this.taskAuthorId = this.task.authorId;
    this.taskName = this.task.name;
    this.taskDescription = this.task.description;
    this.taskTodoList = this.task.todoList;
    this.taskCreationDate = this.task.creationDate;
    this.taskEditDate = this.task.lastEditDate;
    this.taskDueDate = this.task.dueDate;
    this.taskPoints = this.task.points;
  }

  onTodoCheck(todo: Todo) {
    todo.isDone = !todo.isDone;
  }

  onClickTaskDelete(): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '350px',
      data: 'Are you sure you want to delete this task? You won\'t be able to get it back.'
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.dialogRef.close({task: this.task, action: 'delete'});
      }
    });
  }

  onClickAddTodo() {
    this.task.todoList.push(new Todo(this.newTodoName));
    this.newTodoName = '';
  }

  onClickDeleteTodo(i: number) {
    this.task.todoList.splice(i, 1);
  }

  onClickCancelDueDate() {
    this.taskDueDate = null;
  }

  onClickCancelButton() {
    this.dialogRef.close();
    delete this.task;
  }

  onClickSaveButton() {
    if (this.action !== 'new') {
      this.task.lastEditorId = this.userId;
      this.task.lastEditDate = new Date();
    }
    this.task.name = this.taskName;
    this.task.description = this.taskDescription;
    this.task.todoList = this.taskTodoList;
    this.task.dueDate = this.taskDueDate;
    this.task.points = this.taskPoints;
    this.dialogRef.close({task: this.task, action: this.action});
  }

}

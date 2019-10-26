import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Task } from 'src/app/models/task.model';
import { Todo } from 'src/app/models/todo.model';

@Component({
  selector: 'app-edit-task',
  templateUrl: './edit-task.component.html',
  styleUrls: ['./edit-task.component.css']
})
export class EditTaskComponent implements OnInit {
  task?: Task = this.data.task;
  taskName: string ;
  taskDescription: string;
  taskTodoList: Array<Todo>;
  newTodoName: string;

  constructor(public dialogRef: MatDialogRef<EditTaskComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
    if (!this.task) {
      this.task = new Task('', new Array<Todo>());
    }
    this.taskName = this.task.name;
    this.taskDescription = this.task.description;
    this.taskTodoList = this.task.todoList;
  }

  onTodoCheck(todo: Todo) {
    todo.isDone = !todo.isDone;
  }

  onClickAddTodo() {
    this.task.todoList.push(new Todo(this.newTodoName));
    this.newTodoName = '';
  }

  onClickDeleteTodo(i: number) {
    this.task.todoList.splice(i, 1);
  }

  onClickCancelButton() {
    this.dialogRef.close();
    delete this.task;
  }

  onClickSaveButton() {
    this.task.name = this.taskName;
    this.task.description = this.taskDescription;
    this.task.todoList = this.taskTodoList;
    this.dialogRef.close(this.task);
  }

}

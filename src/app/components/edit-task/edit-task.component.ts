import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { Task } from 'src/app/models/task.model';
import { Todo } from 'src/app/models/todo.model';
import { ConfirmationDialogComponent } from '../shared/confirmation-dialog/confirmation-dialog.component';
import { SnackBarProviderService } from 'src/app/services/snack-bar-provider.service';
import { AngularFirestore } from 'angularfire2/firestore';
import { User } from 'src/app/models/user.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-edit-task',
  templateUrl: './edit-task.component.html',
  styleUrls: ['./edit-task.component.css']
})
export class EditTaskComponent implements OnInit, OnDestroy {

  boardId?: string = this.data.boardId;

  userId: string;
  userSubscription: Subscription;
  userAccessLevel: number;

  task?: Task = this.data.task;
  taskId: string;
  taskAuthorId: string;
  taskEditorId: string;
  taskName: string ;
  taskDescription: string;
  taskTodoList = Array<Todo>();
  taskCreationDate: Date;
  taskEditDate: Date;
  taskDueDate?: any;
  taskCompletitionDate?: Date;
  taskCompletitorId?: string;
  taskPoints: number;

  newTodoName: string;
  datepicker: Date;
  action: string;

  constructor(public dialog: MatDialog,
              public dialogRef: MatDialogRef<EditTaskComponent>,
              private afs: AngularFirestore,
              @Inject(MAT_DIALOG_DATA) public data: any,
              private snackbarService: SnackBarProviderService) {

    this.userId = 'XQAA';

    this.userSubscription = this.afs.collection('boards').doc(this.boardId)
    .collection<User>('userList').doc(this.userId)
    .valueChanges().subscribe((user: User) => {
      this.userAccessLevel = user.accessLevel;
    });
  }

  ngOnInit() {
    if (!this.task) {
      this.task = {};
      this.action = 'new';
    } else {
      this.action = 'edit';
      this.taskId = this.task.id;
      this.taskEditorId = this.task.lastEditorId;
      this.taskAuthorId = this.task.authorId;
      this.taskName = this.task.name;
      this.taskDescription = this.task.description;
      this.taskTodoList = Object.assign([], this.task.todoList);
      this.taskCreationDate = this.task.creationDate.toDate();
      if (this.task.lastEditDate) {
        this.taskEditDate = this.task.lastEditDate.toDate();
      }
      if (this.task.dueDate) {
        this.taskDueDate = this.task.dueDate;
      }
      this.taskPoints = this.task.points;
      this.taskCompletitionDate = this.task.completitionDate;
      this.taskCompletitorId = this.task.completitorId;
    }
  }

  ngOnDestroy() {
    this.userSubscription.unsubscribe();
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

  onClickAddTodo(): void {
    this.taskTodoList.push({name: this.newTodoName, isDone: false});
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

  onTodoCheck(i: number): void {
    this.taskTodoList[i].isDone = !this.taskTodoList[i].isDone;
  }

  onClickSaveButton(): void {
    this.task.todoList = this.taskTodoList;
    if (this.userAccessLevel >= 3) {
      this.task.isApproved = true;
    } else {
      this.task.isApproved = false;
    }
    if (this.taskName) {
      this.task.name = this.taskName;
    } else {
      this.task.name = 'Unnamed';
    }
    if (this.taskDescription) {
      this.task.description = this.taskDescription;
    } else {
      this.task.description = '';
    }
    if (this.taskCompletitionDate) {
      this.task.completitionDate = this.taskCompletitionDate;
      this.task.completitorId = this.taskCompletitorId;
    } else {
      this.task.completitionDate = null;
      this.task.completitorId = null;
    }
    if (this.taskEditDate) {
      this.task.lastEditDate = this.taskEditDate;
      this.task.lastEditorId = this.taskEditorId;
    } else {
      this.task.lastEditDate = null;
      this.task.lastEditorId = null;
    }
    if (this.taskDueDate) {
      this.task.dueDate = this.taskDueDate;
    } else {
      this.task.dueDate = null;
    }
    if (this.taskPoints) {
      this.task.points = this.taskPoints;
    } else {
      this.task.points = 0;
    }

    if (this.action !== 'new') {
      this.task.lastEditorId = this.userId;
      this.task.lastEditDate = new Date();
      this.snackbarService.openSnack('Task saved');
    } else {
      this.task.creationDate = new Date();
      this.task.authorId = this.userId;
    }

    this.dialogRef.close({task: this.task, action: this.action});
  }

}

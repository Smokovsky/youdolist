import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { Task } from 'src/app/models/task.model';
import { Todo } from 'src/app/models/todo.model';
import { ConfirmationDialogComponent } from '../shared/confirmation-dialog/confirmation-dialog.component';
import { SnackBarProviderService } from 'src/app/services/snack-bar-provider.service';
import { AngularFirestore } from 'angularfire2/firestore';
import { BoardUser } from 'src/app/models/boardUser.model';
import { Subscription } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/auth';
import { UsersDetailProviderService } from 'src/app/services/users-detail-provider.service';
import { moveItemInArray, CdkDragDrop } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-edit-task',
  templateUrl: './edit-task.component.html',
  styleUrls: ['./edit-task.component.css']
})
export class EditTaskComponent implements OnInit, OnDestroy {

  detailsService?: UsersDetailProviderService = this.data.detailsService;

  boardId?: string = this.data.boardId;

  userId: string;
  userSubscription: Subscription;
  boardUserSubscription: Subscription;
  userAccessLevel: number;

  task?: Task = this.data.task;
  taskId: string;
  taskAuthorId: string;
  taskEditorId: string;
  taskName = '';
  taskDescription = '';
  taskTodoList = Array<Todo>();
  taskCreationDate?: Date;
  taskEditDate?: Date;
  taskDueDate?: Date;
  taskCompletitionDate?: Date;
  taskCompletitorId?: string;
  taskPoints: number;

  newTodoName = '';
  datepicker: Date;
  action: string;

  constructor(public dialog: MatDialog,
              public dialogRef: MatDialogRef<EditTaskComponent>,
              private afAuth: AngularFireAuth,
              private afs: AngularFirestore,
              @Inject(MAT_DIALOG_DATA) public data: any,
              private snackbarService: SnackBarProviderService) {

    this.userSubscription = this.afAuth.user.subscribe(user => {
      if (user) {
        this.userId = user.uid;

        this.boardUserSubscription = this.afs.collection('boards').doc(this.boardId)
        .collection<BoardUser>('userList').doc(this.userId)
        .valueChanges().subscribe((boardUser: BoardUser) => {
          this.userAccessLevel = boardUser.accessLevel;
        });
      }
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
      this.taskPoints = this.task.points;
      this.taskDescription = this.task.description;
      this.taskTodoList = Object.assign([], this.task.todoList);
      this.taskCreationDate = this.task.creationDate.toDate();
      if (this.task.lastEditDate) {
        this.taskEditDate = this.task.lastEditDate.toDate();
      }
      if (this.task.dueDate) {
        this.taskDueDate = this.task.dueDate.toDate();
      }
      if (this.task.completitionDate) {
        this.taskCompletitionDate = this.task.completitionDate.toDate();
        this.taskCompletitorId = this.task.completitorId;
      }
    }
  }

  ngOnDestroy() {
    this.boardUserSubscription.unsubscribe();
    this.userSubscription.unsubscribe();
  }

  onClickTaskDelete(): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '350px',
      panelClass: 'confirmationBackground',
      data: 'Are you sure you want to delete this task? You won\'t be able to get it back.'
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.dialogRef.close({task: this.task, action: 'delete'});
      }
    });
  }

  onClickAddTodo(): void {
    if (this.newTodoName.length > 0) {
      if (this.taskTodoList.length < 10) {
        if (this.newTodoName.length < 50) {
          this.taskTodoList.push({name: this.newTodoName, isDone: false});
          this.newTodoName = '';

        } else {
          this.snackbarService.openSnack('Todo can be maximum 50 characters long');
        }
      } else {
        this.snackbarService.openSnack('Task can have maximum of 10 todos');
      }
    } else {
      this.snackbarService.openSnack('Please enter reward name');
    }
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
    if (this.taskName.length > 0) {
      if (this.taskName.length < 100) {
        if (this.taskDescription.length < 300) {
          this.task.todoList = this.taskTodoList;
          if (this.userAccessLevel >= 3) {
            this.task.isApproved = true;
          } else {
            this.task.isApproved = false;
          }
          this.task.name = this.taskName;
          this.task.description = this.taskDescription;
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
          if (this.taskPoints) {
            this.task.points = this.taskPoints;
          } else {
            this.task.points = 0;
          }
          if (this.taskDueDate) {
            this.task.dueDate = this.taskDueDate;
          } else {
            this.task.dueDate = null;
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

        } else {
          this.snackbarService.openSnack('Task description can be maximum 300 characters long');
        }
      } else {
        this.snackbarService.openSnack('Task name can be maximum 100 characters long');
      }
    } else {
      this.snackbarService.openSnack('Please enter task name');
    }
  }

  onDrop(event: CdkDragDrop<string[]>): void {
    moveItemInArray(event.container.data,
                    event.previousIndex,
                    event.currentIndex);
  }

}

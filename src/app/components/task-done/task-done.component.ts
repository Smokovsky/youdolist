import { Component, OnInit, OnDestroy } from '@angular/core';
import { EditTaskComponent } from '../edit-task/edit-task.component';
import { MatDialog } from '@angular/material/dialog';
import { Task } from 'src/app/models/task.model';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Category } from 'src/app/models/category.model';
import { UndoOptionsComponent } from '../undo-options/undo-options.component';
import { SnackBarProviderService } from 'src/app/services/snack-bar-provider.service';
import { ConfirmationDialogComponent } from '../shared/confirmation-dialog/confirmation-dialog.component';
import { AngularFirestore } from 'angularfire2/firestore';
import { BoardUser } from 'src/app/models/boardUser.model';
import { ActivatedRoute } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthService } from 'src/app/services/auth.service';
import { UsersDetailProviderService } from 'src/app/services/users-detail-provider.service';
import { Todo } from 'src/app/models/todo.model';
import * as firebase from 'firebase/app';
import { OperationsIntervalService } from 'src/app/services/operations-interval.service';

@Component({
  selector: 'app-task-done',
  templateUrl: './task-done.component.html',
  styleUrls: ['./task-done.component.css']
})
export class TaskDoneComponent implements OnInit, OnDestroy {

  boardId: string;

  categoryId = 'doneList';

  categoryListSubscription: Subscription;
  categoryIdList = new Array<string>();

  userId: string;
  userSubscription: Subscription;
  boardUserSubscription: Subscription;
  userAccessLevel: number;

  doneTaskListSubscription: Subscription;
  doneTaskList = Array<Task>();

  constructor(public dialog: MatDialog,
              private afs: AngularFirestore,
              private auth: AuthService,
              private activatedRoute: ActivatedRoute,
              private operationsInterval: OperationsIntervalService,
              private usersDetailProvider: UsersDetailProviderService,
              private snackbarService: SnackBarProviderService) {

    this.boardId = this.activatedRoute.snapshot.paramMap.get('id');
    this.userSubscription = this.auth.user$.subscribe(user => {
      if (user) {
        this.userId = user.uid;

        this.boardUserSubscription = this.afs.collection('boards').doc(this.boardId)
        .collection<BoardUser>('userList').doc(this.userId)
        .valueChanges().subscribe((boardUser: BoardUser) => {
          this.userAccessLevel = boardUser.accessLevel;
        });
      }
    });

    this.categoryListSubscription = this.afs.collection('boards').doc(this.boardId)
    .collection<Category>('categoryList').snapshotChanges().pipe(
      map(actions => {
        return actions.map(action => {
          return action.payload.doc.id;
        });
      })).subscribe(categories => {
      categories.forEach(category => {
        this.categoryIdList.push('cdk-task-drop-list-' + category);
      });
    });

  }

  ngOnInit() {
    this.doneTaskListSubscription = this.afs.collection('boards').doc(this.boardId)
    .collection('categoryList').doc('doneList')
    .collection<Task>('taskList', ref => ref.orderBy('position', 'desc'))
    .snapshotChanges().pipe(
      map(actions => {
        return actions.map(action => {
          const data = action.payload.doc.data() as Task;
          const id = action.payload.doc.id;
          return {id, ...data};
        });
      })).subscribe(doneTasks => {
      this.doneTaskList = doneTasks;
    });
  }

  ngOnDestroy() {
    this.doneTaskListSubscription.unsubscribe();
    this.categoryListSubscription.unsubscribe();
    this.boardUserSubscription.unsubscribe();
    this.userSubscription.unsubscribe();
  }

  onTodoCheck(todos: Array<Todo>, taskId: string, i: number): void {
    todos[i].isDone = !todos[i].isDone;
    this.afs.collection('boards').doc(this.boardId)
    .collection('categoryList').doc(this.categoryId)
    .collection('taskList').doc(taskId).update({todoList: todos});
  }

  onClickTaskUndo(task: Task): void {
    if (this.operationsInterval.shortInterval()) {
      if (task.completitorId === this.userId || this.userAccessLevel >= 3) {
        if (this.userAccessLevel >= 3) {
          const dialogRef = this.dialog.open(UndoOptionsComponent, {
            maxWidth: '90vw',
            width: '400px',
            panelClass: 'confirmationBackground',
            data: { document: task, detailsService: this.usersDetailProvider }
          });
          dialogRef.afterClosed().subscribe(result => {
            const subscription = this.afs.collection('boards').doc(this.boardId)
            .collection('categoryList', ref =>
            ref.where(firebase.firestore.FieldPath.documentId(), '==', task.categoryId))
            .snapshotChanges().subscribe(res => {
              if (res.length > 0) {
                if (result === 'changePoints') {
                  this.afs.collection('boards').doc(this.boardId)
                  .collection<BoardUser>('userList').doc(task.completitorId)
                  .ref.get().then(user => {
                    if (user.exists) {
                      this.afs.collection('boards').doc(this.boardId)
                      .collection('userList').doc(task.completitorId)
                      .update({points: user.data().points - task.points});
                    }
                  });
                  this.undoTask(task);
                } else if (result === 'leavePoints') {
                  this.undoTask(task);
                }
              } else {
                this.snackbarService.openSnack('Task\'s category no longer exists');
              }
              subscription.unsubscribe();
            });
          });
        }
      }
    }
  }

  onClickTaskSettings(task: Task): void {
    if (this.operationsInterval.longInterval()) {
      const dialogRef = this.dialog.open(EditTaskComponent, {
        width: '450px',
        maxWidth: '96vw',
        panelClass: 'editTaskBackground',
        data: { boardId: this.boardId, task, detailsService: this.usersDetailProvider }
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result && result.action === 'delete') {
          this.doneTaskList.splice(this.doneTaskList.indexOf(result.task), 1);
          this.afs.collection('boards').doc(this.boardId)
          .collection('categoryList').doc(this.categoryId)
          .collection<Task>('taskList').doc(result.task.id)
          .delete();
          this.updateTaskPositions();
          this.snackbarService.openSnack('Task deleted');
        } else if (result && result.action === 'edit') {
          this.afs.collection('boards').doc(this.boardId)
          .collection('categoryList').doc(this.categoryId)
          .collection<Task>('taskList').doc(result.task.id)
          .update(result.task);
        }
      });
    }
  }

  onClickApprove(task: Task): void {
    this.afs.collection('boards').doc(this.boardId)
    .collection('categoryList').doc('doneList')
    .collection('taskList').doc(task.id)
    .update({isApproved: true});
    this.afs.collection('boards').doc(this.boardId)
    .collection<BoardUser>('userList').doc(task.completitorId)
    .ref.get().then(user => {
      if (user.exists) {
        this.afs.collection('boards').doc(this.boardId)
        .collection('userList').doc(task.completitorId)
        .update({points: user.data().points + task.points});
      }
    });
    this.snackbarService.openSnack('Task approved');
  }

  onClickUnapprovedTaskUndo(document: Task): void {
    if (this.userAccessLevel >= 3 || document.completitorId === this.userId && !document.isApproved) {
      this.undoTask(document);
    } else {
      this.snackbarService.openSnack('Cannot undo this task');
    }
  }

  onClickUnapprovedTaskDelete(id: string): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '350px',
      panelClass: 'confirmationBackground',
      data: 'Are you sure you want to delete this task? You won\'t be able to get it back.'
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.doneTaskList.splice(this.doneTaskList.indexOf(result.task), 1);
        this.afs.collection('boards').doc(this.boardId)
        .collection('categoryList').doc('doneList')
        .collection<Task>('taskList').doc(id)
        .delete();
        this.snackbarService.openSnack('Task deleted');
        this.updateTaskPositions();
      }
    });
  }

  onDrop(event: CdkDragDrop<string[]>): void {
    if (this.operationsInterval.shortInterval()) {

      // Case (1 of 2): change position on done list
      if (event.previousContainer === event.container) {
        if (this.userAccessLevel >= 3) {
          moveItemInArray(event.container.data,
                          event.previousIndex,
                          event.currentIndex);
          this.updateTaskPositions();
        } else {
          this.snackbarService.openSnack('You cannot reorganize items');
        }

      // Case (2 of 2): task dropped on done list
      } else {
        const document: any = event.previousContainer.data[event.previousIndex];
        if (document.isApproved) {
          transferArrayItem(event.previousContainer.data,
            event.container.data,
            event.previousIndex,
            event.currentIndex);
          if (this.userAccessLevel >= 3) {
            this.afs.collection('boards').doc(this.boardId)
            .collection<BoardUser>('userList').doc(this.userId)
            .ref.get().then(user => {
              if (user.exists) {
                this.afs.collection('boards').doc(this.boardId)
                .collection('userList').doc(this.userId)
                .update({points: user.data().points + document.points});
              }
            });
          }
          this.doTask(document, event.currentIndex);
        } else {
          this.snackbarService.openSnack('You cannot complete unapproved task');
        }
      }
    }
  }

  doTask(document: Task, currentIndex: number): void {
    let approved = false;
    if (this.userAccessLevel >= 3) {
      approved = true;
    }
    const taskSubscription = this.afs.collection('boards').doc(this.boardId)
    .collection('categoryList').doc(document.categoryId)
    .collection('taskList').doc(document.id)
    .valueChanges().subscribe((task: Task) => {
      if (task) {
        this.updateTaskPositionsAfterDrop(currentIndex);
        this.addTaskAfterDrop(task, currentIndex);
        this.afs.collection('boards').doc(this.boardId)
        .collection('categoryList').doc(document.categoryId)
        .collection('taskList').doc(document.id).delete();
        this.updatePositionsAtCategory(document.categoryId);
      }
      this.snackbarService.openSnack('Task completed');
      return taskSubscription.unsubscribe();
    });
  }

  addTaskAfterDrop(task: Task, currentIndex: number): void {
    let newPosition = this.doneTaskList.length - currentIndex;
    let approved = false;
    if (this.userAccessLevel >= 3) {
      approved = true;
    }
    if (currentIndex === 0) {
      newPosition += 1;
    }
    this.afs.collection('boards').doc(this.boardId)
    .collection('categoryList').doc('doneList')
    .collection('taskList').doc(this.afs.createId())
    .set({categoryId: task.categoryId, name: task.name, description: task.description,
      authorId: task.authorId, creationDate: task.creationDate, lastEditorId: task.lastEditorId,
      lastEditDate: task.lastEditDate, dueDate: task.dueDate, isApproved: approved, todoList: task.todoList,
      points: task.points, completitorId: this.userId, completitionDate: new Date(),
      position: newPosition});
}

  undoTask(task: Task): void {
    this.afs.collection('boards').doc(this.boardId)
    .collection('categoryList').doc(task.categoryId)
    .collection('taskList').ref.get().then(snap => {
      this.afs.collection('boards').doc(this.boardId)
      .collection('categoryList').doc(task.categoryId)
      .collection('taskList').doc(this.afs.createId())
      .set({categoryId: task.categoryId, name: task.name, description: task.description,
            authorId: task.authorId, creationDate: task.creationDate, lastEditorId: task.lastEditorId,
            lastEditDate: task.lastEditDate, isApproved: true, todoList: task.todoList, dueDate: task.dueDate,
            points: task.points, completitorId: null, completitionDate: null, position: snap.size + 1});
      this.doneTaskList.splice(this.doneTaskList.indexOf(task), 1);
      this.afs.collection('boards').doc(this.boardId)
      .collection('categoryList').doc('doneList')
      .collection('taskList').doc(task.id).delete();
      this.snackbarService.openSnack('Task undone');
      this.updateTaskPositions();
    });
  }

  updateTaskPositions(): void {
    let count = this.doneTaskList.length;
    this.doneTaskList.forEach((task: Task) => {
      if (task) {
        this.afs.collection('boards').doc(this.boardId)
        .collection('categoryList').doc(this.categoryId)
        .collection<Task>('taskList').doc(task.id)
        .update({position: count});
        count--;
      }
    });
  }

  updateTaskPositionsAfterDrop(i: number): void {
    const subscription = this.afs.collection('boards').doc(this.boardId)
    .collection('categoryList').doc(this.categoryId)
    .collection<Task>('taskList', ref => ref.orderBy('position', 'desc'))
    .snapshotChanges().pipe(
      map(actions => {
        return actions.map( a => {
          const data = a.payload.doc.data() as Task;
          const id = a.payload.doc.id;
          return {id, ...data};
        });
      })
    ).subscribe(taskList => {
      taskList.forEach((task: Task, index) => {
        if (i > index) {
          this.afs.collection('boards').doc(this.boardId)
          .collection('categoryList').doc(this.categoryId)
          .collection<Task>('taskList').doc(task.id)
          .update({position: task.position + 1});
        }
      });
      return subscription.unsubscribe();
    });
  }

  updatePositionsAtCategory(categoryId: string): void {
    this.afs.collection('boards').doc(this.boardId)
    .collection('categoryList').doc(categoryId)
    .collection('taskList').ref.get().then(oldCatSnap => {
      let count = oldCatSnap.size;
      const previousCatObs = this.afs.collection('boards').doc(this.boardId)
      .collection('categoryList').doc(categoryId)
      .collection<Task>('taskList', ref => ref.orderBy('position', 'desc'))
      .snapshotChanges().pipe(
        map(actions => {
          return actions.map(action => {
            return action.payload.doc.id;
          });
        })) as Observable<string[]>;
      const categorySubscription = previousCatObs.subscribe(previousTasks => {
        previousTasks.forEach(tid => {
          if (count > 0) {
            this.afs.collection('boards').doc(this.boardId)
            .collection('categoryList').doc(categoryId)
            .collection<Task>('taskList').doc(tid)
            .update({position: count});
            count--;
          }
        });
        categorySubscription.unsubscribe();
      });
    });
  }

}

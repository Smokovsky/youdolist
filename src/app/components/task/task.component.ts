import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { EditTaskComponent } from '../edit-task/edit-task.component';
import { MatDialog } from '@angular/material/dialog';
import { Task } from 'src/app/models/task.model';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Category } from 'src/app/models/category.model';
import { UndoOptionsComponent } from '../undo-options/undo-options.component';
import { SnackBarProviderService } from 'src/app/services/snack-bar-provider.service';
import { AngularFirestore } from 'angularfire2/firestore';
import { Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { BoardUser } from 'src/app/models/boardUser.model';
import { ActivatedRoute } from '@angular/router';
import { Todo } from 'src/app/models/todo.model';
import { ConfirmationDialogComponent } from '../shared/confirmation-dialog/confirmation-dialog.component';
import { AuthService } from 'src/app/services/auth.service';
import { UsersDetailProviderService } from 'src/app/services/users-detail-provider.service';
import { OperationsIntervalService } from 'src/app/services/operations-interval.service';

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.css']
})
export class TaskComponent implements OnInit, OnDestroy {

  boardId: string;
  datenow: Date = new Date();

  @Input()
  categoryId: string;

  categoryListSubscription: Subscription;
  categoryIdList = new Array<string>();

  userId: string;
  userSubscription: Subscription;
  boardUserSubscription: Subscription;
  userAccessLevel: number;

  taskListSubscription: Subscription;
  taskList: Array<Task>;

  constructor(public dialog: MatDialog,
              private afs: AngularFirestore,
              private auth: AuthService,
              private activatedRoute: ActivatedRoute,
              private operationsInterval: OperationsIntervalService,
              private snackbarService: SnackBarProviderService,
              private usersDetailProvider: UsersDetailProviderService) {

    this.boardId = this.activatedRoute.snapshot.paramMap.get('id');
    
    if (this.boardId) {
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
            const id = action.payload.doc.id;
            return id;
          });
        })).subscribe(categories => {
        categories.forEach(category => {
          this.categoryIdList.push('cdk-task-drop-list-' + category);
        });
      });
    }

  }

  ngOnInit() {
    if (this.boardId) {
      this.taskListSubscription = this.afs.collection('boards').doc(this.boardId)
      .collection('categoryList').doc(this.categoryId)
      .collection<Task>('taskList', ref => ref.orderBy('position', 'desc'))
      .snapshotChanges().pipe(
        map(actions => {
          return actions.map(action => {
            const data = action.payload.doc.data() as Task;
            const id = action.payload.doc.id;
            return {id, ...data};
          });
        })).subscribe(tasks => {
        this.taskList = tasks;
      });
    }
  }

  ngOnDestroy() {
    if (this.taskListSubscription) {
      this.taskListSubscription.unsubscribe();
    }
    if (this.categoryListSubscription) {
      this.categoryListSubscription.unsubscribe();
    }
    if (this.boardUserSubscription) {
      this.boardUserSubscription.unsubscribe();
    }
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
  }

  onClickTaskApprove(id: string): void {
    this.afs.collection('boards').doc(this.boardId)
    .collection('categoryList').doc(this.categoryId)
    .collection('taskList').doc(id)
    .update({isApproved: true});
    this.snackbarService.openSnack('Task approved');
  }

  onClickTaskDelete(id: string): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '350px',
      panelClass: 'confirmationBackground',
      data: 'Are you sure you want to delete this task? You won\'t be able to get it back.'
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.taskList.splice(this.taskList.indexOf(result.task), 1);
        this.afs.collection('boards').doc(this.boardId)
        .collection('categoryList').doc(this.categoryId)
        .collection<Task>('taskList').doc(id)
        .delete();
        this.updateTaskPositions();
        this.snackbarService.openSnack('Task deleted');
      }
    });
  }

  onTodoCheck(todos: Array<Todo>, taskId: string, i: number): void {
    todos[i].isDone = !todos[i].isDone;
    this.afs.collection('boards').doc(this.boardId)
    .collection('categoryList').doc(this.categoryId)
    .collection('taskList').doc(taskId).update({todoList: todos});
  }

  onClickTaskDone(task: Task): void {
    if (this.operationsInterval.shortInterval()) {
      if (this.userAccessLevel >= 3) {
        this.afs.collection('boards').doc(this.boardId)
        .collection<BoardUser>('userList').doc(this.userId)
        .ref.get().then(user => {
          if (user.exists) {
            this.afs.collection('boards').doc(this.boardId)
            .collection('userList').doc(this.userId)
            .update({points: user.data().points + task.points});
          }
        });
      }
      this.doTask(task);
    }
  }

  onClickTaskSettings(task: Task): void {
    if (this.operationsInterval.shortInterval()) {
      const dialogRef = this.dialog.open(EditTaskComponent, {
        width: '450px',
        maxWidth: '96vw',
        panelClass: 'editTaskBackground',
        data: { boardId: this.boardId, task, detailsService: this.usersDetailProvider }
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result && result.action === 'delete') {
          this.taskList.splice(this.taskList.indexOf(result.task), 1);
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

  onDrop(event: CdkDragDrop<string[]>): void {
    if (this.operationsInterval.shortInterval()) {
      let document: any;

      // Case (1 of 3): undoing task
      if (event.previousContainer.id === 'cdk-task-drop-list-doneList') {
        document = event.previousContainer.data[event.previousIndex];
        if (this.userAccessLevel >= 3) {
          const dialogRef = this.dialog.open(UndoOptionsComponent, {
            maxWidth: '90vw',
            width: '400px',
            data: { document, detailsService: this.usersDetailProvider }
          });
          dialogRef.afterClosed().subscribe(result => {
            if (result === 'changePoints') {
              this.afs.collection('boards').doc(this.boardId)
              .collection<BoardUser>('userList').doc(document.completitorId)
              .ref.get().then(user => {
                if (user.exists) {
                  this.afs.collection('boards').doc(this.boardId)
                  .collection('userList').doc(document.completitorId)
                  .update({points: user.data().points - document.points});
                }
              });
              this.undoTask(document, event);
            } else if (result === 'leavePoints') {
              this.undoTask(document, event);
            }
          });
        } else if (document.completitorId === this.userId) {
          if (!document.isApproved) {
            this.undoTask(document, event);
          }
        } else {
          this.snackbarService.openSnack('You cannot undo this task');
        }

      // Case (2 of 3): position in category change
      } else if (event.previousContainer === event.container) {
        if (this.userAccessLevel >= 3) {
          moveItemInArray(event.container.data,
                          event.previousIndex,
                          event.currentIndex);
          this.updateTaskPositions();
        } else {
          if (event.previousIndex !== event.currentIndex) {
            this.snackbarService.openSnack('You cannot reorganize tasks');
          }
        }

      // Case (3 of 3): category change
      } else {
        if (this.userAccessLevel >= 3) {
          document = event.previousContainer.data[event.previousIndex];
          transferArrayItem(event.previousContainer.data,
            event.container.data,
            event.previousIndex,
            event.currentIndex);
          const taskSubscription = this.afs.collection('boards').doc(this.boardId)
          .collection('categoryList').doc(document.categoryId)
          .collection('taskList').doc(document.id)
          .valueChanges().subscribe((task: Task) => {
            if (task) {
              this.updateTaskPositionsAfterDrop(event.currentIndex);
              this.addTaskAfterDrop(task, event.currentIndex);
              this.afs.collection('boards').doc(this.boardId)
              .collection('categoryList').doc(document.categoryId)
              .collection('taskList').doc(document.id).delete();

              this.updatePositionsAtCategory(document.categoryId);
            }
            return taskSubscription.unsubscribe();
          });
        } else {
          this.snackbarService.openSnack('You cannot reorganize tasks');
        }
      }
    }

  }

  doTask(task: Task): void {
    let taskApproved = false;
    if (this.userAccessLevel >= 3) {
      taskApproved = true;
    }
    const taskSubscription = this.afs.collection('boards').doc(this.boardId)
    .collection('categoryList').doc(this.categoryId)
    .collection('taskList').doc(task.id)
    .valueChanges().subscribe((tsk: Task) => {
      if (tsk) {
        this.afs.collection('boards').doc(this.boardId)
        .collection('categoryList').doc('doneList')
        .collection('taskList').ref.get().then(doneSnap => {
          this.afs.collection('boards').doc(this.boardId)
          .collection('categoryList').doc('doneList')
          .collection('taskList').doc(task.id)
          .set({categoryId: tsk.categoryId, name: tsk.name, description: tsk.description,
                authorId: tsk.authorId, creationDate: tsk.creationDate, lastEditorId: tsk.lastEditorId,
                lastEditDate: tsk.lastEditDate, isApproved: taskApproved, todoList: tsk.todoList, dueDate: tsk.dueDate,
                points: tsk.points, completitorId: this.userId, completitionDate: new Date(), position: doneSnap.size + 1});
          this.updateTaskPositions();
        });
        this.afs.collection('boards').doc(this.boardId)
        .collection('categoryList').doc(this.categoryId)
        .collection('taskList').doc(task.id).delete();
      }
      this.snackbarService.openSnack('Task completed');
      return taskSubscription.unsubscribe();
    });
  }

  undoTask(document: Task, event: CdkDragDrop<string[]>): void {
    const taskSubscription = this.afs.collection('boards').doc(this.boardId)
    .collection('categoryList').doc('doneList')
    .collection('taskList').doc(document.id)
    .valueChanges().subscribe((task: Task) => {
      if (task) {
        task.isApproved = true;
        if (task.categoryId === this.categoryId || this.userAccessLevel >= 3) {
          task.isApproved = true;
          this.updateTaskPositionsAfterDrop(event.currentIndex);
          this.addTaskAfterDrop(task, event.currentIndex);
          this.afs.collection('boards').doc(this.boardId)
          .collection('categoryList').doc('doneList')
          .collection('taskList').doc(document.id).delete();
          this.updatePositionsAtCategory('doneList');
          this.snackbarService.openSnack('Task undone');
          transferArrayItem(event.previousContainer.data,
                            event.container.data,
                            event.previousIndex,
                            event.currentIndex);
        } else {
          this.snackbarService.openSnack('You cannot undo this task');
        }
      }
      return taskSubscription.unsubscribe();
    });
  }

  updateTaskPositions(): void {
    let count = this.taskList.length;
    this.taskList.forEach((task: Task) => {
      if (task) {
        this.afs.collection('boards').doc(this.boardId)
        .collection('categoryList').doc(this.categoryId)
        .collection<Task>('taskList').doc(task.id)
        .update({position: count});
        count--;
      }
    });
  }

  addTaskAfterDrop(task: Task, currentIndex: number): void {
      let newPosition = this.taskList.length - currentIndex;
      if (currentIndex === 0) {
        newPosition += 1;
      }
      this.afs.collection('boards').doc(this.boardId)
      .collection('categoryList').doc(this.categoryId)
      .collection('taskList').doc(this.afs.createId())
      .set({categoryId: this.categoryId, name: task.name, description: task.description,
            authorId: task.authorId, creationDate: task.creationDate, lastEditorId: task.lastEditorId,
            lastEditDate: task.lastEditDate, dueDate: task.dueDate, isApproved: task.isApproved, todoList: task.todoList,
            points: task.points, completitorId: null, completitionDate: null,
            position: newPosition});
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
    .collection('taskList').ref.get().then(doneSnap => {
      let count = doneSnap.size;
      const previousCategorySubscription = this.afs.collection('boards').doc(this.boardId)
      .collection('categoryList').doc(categoryId)
      .collection<Task>('taskList', ref => ref.orderBy('position', 'desc'))
      .snapshotChanges().pipe(
        map(actions => {
          return actions.map(action => {
            return action.payload.doc.id;
          });
        })).subscribe(previousTasks => {
        previousTasks.forEach(tid => {
            this.afs.collection('boards').doc(this.boardId)
            .collection('categoryList').doc(categoryId)
            .collection<Task>('taskList').doc(tid)
            .update({position: count});
            count--;
        });
        return previousCategorySubscription.unsubscribe();
      });
    });
  }

}

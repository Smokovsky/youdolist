import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { EditTaskComponent } from '../edit-task/edit-task.component';
import { MatDialog } from '@angular/material/dialog';
import { Task } from 'src/app/models/task.model';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Category } from 'src/app/models/category.model';
import { UndoOptionsComponent } from '../undo-options/undo-options.component';
import { SnackBarProviderService } from 'src/app/services/snack-bar-provider.service';
import { AngularFirestore } from 'angularfire2/firestore';
import { Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { BoardUser } from 'src/app/models/boardUser.model';
import { ActivatedRoute } from '@angular/router';
import { Todo } from 'src/app/models/todo.model';
import { ConfirmationDialogComponent } from '../shared/confirmation-dialog/confirmation-dialog.component';
import { AuthService } from 'src/app/services/auth.service';
import { UsersDetailProviderService } from 'src/app/services/users-detail-provider.service';

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.css']
})
export class TaskComponent implements OnInit, OnDestroy {

  boardId: string;

  @Input()
  categoryId: string;

  categoryListObs: Observable<string[]>;
  categoryListSubscription: Subscription;
  categoryIdList = new Array<string>();

  userId: string;
  userSubscription: Subscription;
  boardUserSubscription: Subscription;
  userAccessLevel: number;

  taskListObs: Observable<Task[]>;
  taskListSubscription: Subscription;
  taskList: Array<Task>;

  constructor(public dialog: MatDialog,
              private afs: AngularFirestore,
              private auth: AuthService,
              private activatedRoute: ActivatedRoute,
              private snackbarService: SnackBarProviderService,
              private usersDetailProvider: UsersDetailProviderService) {

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


    this.categoryListObs = this.afs.collection('boards').doc(this.boardId)
    .collection<Category>('categoryList').snapshotChanges().pipe(
      map(actions => {
        return actions.map(action => {
          const id = action.payload.doc.id;
          return id;
        });
      })) as Observable<string[]>;
    this.categoryListSubscription = this.categoryListObs.subscribe(categories => {
      categories.forEach(category => {
        this.categoryIdList.push('cdk-task-drop-list-' + category);
      });
    });

  }

  ngOnInit() {
    this.taskListObs = this.afs.collection('boards').doc(this.boardId)
    .collection('categoryList').doc(this.categoryId)
    .collection<Task>('taskList', ref => ref.orderBy('position', 'desc'))
    .snapshotChanges().pipe(
      map(actions => {
        return actions.map(action => {
          const data = action.payload.doc.data() as Task;
          const id = action.payload.doc.id;
          return {id, ...data};
        });
      })) as Observable<Task[]>;
    this.taskListSubscription = this.taskListObs.subscribe(tasks => {
      this.taskList = tasks;
    });
  }

  ngOnDestroy() {
    this.taskListSubscription.unsubscribe();
    this.categoryListSubscription.unsubscribe();
    this.boardUserSubscription.unsubscribe();
    this.userSubscription.unsubscribe();
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
    let taskApproved = false;
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
      taskApproved = true;
    }
    // Subscribing to original document to get data
    this.afs.collection('boards').doc(this.boardId)
    .collection('categoryList').doc(this.categoryId)
    .collection('taskList').doc(task.id)
    .valueChanges().subscribe((tsk: Task) => {
      if (tsk) {
        // Getting snap for category collection size value to use as position field
        this.afs.collection('boards').doc(this.boardId)
        .collection('categoryList').doc('doneList')
        .collection('taskList').ref.get().then(doneSnap => {
          // Adding a copy of document into desired category
          this.afs.collection('boards').doc(this.boardId)
          .collection('categoryList').doc('doneList')
          .collection('taskList').doc(task.id)
          .set({categoryId: tsk.categoryId, name: tsk.name, description: tsk.description,
                authorId: tsk.authorId, creationDate: tsk.creationDate, lastEditorId: tsk.lastEditorId,
                lastEditDate: tsk.lastEditDate, isApproved: taskApproved, todoList: tsk.todoList, dueDate: tsk.dueDate,
                points: tsk.points, completitorId: this.userId, completitionDate: new Date(), position: doneSnap.size + 1});
          // Getting snap for doneTasks collection size value to use as position field
          this.afs.collection('boards').doc(this.boardId)
          .collection('categoryList').doc(this.categoryId)
          .collection('taskList').ref.get().then(catSnap => {
            let count = catSnap.size;
            this.taskList.forEach((t: Task) => {
              if (t) {
                // Updating tasks positions
                this.afs.collection('boards').doc(this.boardId)
                .collection('categoryList').doc(this.categoryId)
                .collection<Task>('taskList').doc(t.id)
                .update({position: count});
                count--;
              }
            });
          });
        });
        // Deleting task in original category
        this.afs.collection('boards').doc(this.boardId)
        .collection('categoryList').doc(this.categoryId)
        .collection('taskList').doc(task.id).delete();
      }
    });
    this.snackbarService.openSnack('Task completed');
  }

  onClickTaskSettings(task: Task): void {
    const boardId = this.boardId;
    const dialogRef = this.dialog.open(EditTaskComponent, {
      data: { boardId, task, detailsService: this.usersDetailProvider }
    });
    dialogRef.afterClosed().subscribe(result => {

      if (result && result.action === 'delete') {
        this.afs.collection('boards').doc(this.boardId)
        .collection('categoryList').doc(this.categoryId)
        .collection<Task>('taskList').doc(result.task.id)
        .delete();
        this.taskList.splice(this.taskList.indexOf(result.task), 1);
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

  onDrop(event: CdkDragDrop<string[]>): void {
    let document: any;

    // Case undoing task
    if (event.previousContainer.id === 'cdk-task-drop-list-doneList') {
      document = event.previousContainer.data[event.previousIndex];
      if (this.userAccessLevel >= 3) {
        const dialogRef = this.dialog.open(UndoOptionsComponent, {
          data: { document, detailsService: this.usersDetailProvider }
        });
        dialogRef.afterClosed().subscribe(result => {
          if (result === 'changePoints' || result === 'leavePoints') {
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
            }
            this.undoTask(event);
          }
        });
      } else if (document.completitorId === this.userId) {
        if (!document.isApproved) {
          this.undoTask(event);
        }
      }

    // Case position in category change
    } else if (event.previousContainer === event.container) {
      if (this.userAccessLevel >= 3) {
        moveItemInArray(event.container.data,
                        event.previousIndex,
                        event.currentIndex);
        this.updateTaskPositions();
      } else {
        this.snackbarService.openSnack('You cannot reorganize items');
      }

    // Case category change
    } else {
      if (this.userAccessLevel >= 3) {
        document = event.previousContainer.data[event.previousIndex];
        transferArrayItem(event.previousContainer.data,
                          event.container.data,
                          event.previousIndex,
                          event.currentIndex);
        const previousCategoryId = document.categoryId;
        this.afs.collection('boards').doc(this.boardId)
        .collection('categoryList').doc(previousCategoryId)
        .collection('taskList').doc(document.id)
        .valueChanges().subscribe((task: Task) => {

        if (task) {
          this.afs.collection('boards').doc(this.boardId)
          .collection('categoryList').doc(this.categoryId)
          .collection('taskList').ref.get().then(catSnap => {

            this.afs.collection('boards').doc(this.boardId)
            .collection('categoryList').doc(this.categoryId)
            .collection('taskList').doc(this.afs.createId())
            .set({categoryId: this.categoryId, name: task.name, description: task.description,
                  authorId: task.authorId, creationDate: task.creationDate, lastEditorId: task.lastEditorId,
                  lastEditDate: task.lastEditDate, dueDate: task.dueDate, isApproved: task.isApproved, todoList: task.todoList,
                  points: task.points, completitorId: null, completitionDate: null,
                  position: catSnap.size - event.currentIndex + 1});

            this.taskList.forEach((tsk: Task, index) => {

              if (index < event.currentIndex) {
                this.afs.collection('boards').doc(this.boardId)
                .collection('categoryList').doc(this.categoryId)
                .collection<Task>('taskList').doc(tsk.id)
                .update({position: tsk.position + 1});
              }
            });
          });
          this.afs.collection('boards').doc(this.boardId)
          .collection('categoryList').doc(previousCategoryId)
          .collection('taskList').doc(document.id).delete();
          this.updatePositionsAtCategory(previousCategoryId);
        }
      });
      } else {
        this.snackbarService.openSnack('You cannot reorganize items');
      }
    }
  }

  undoTask(event: CdkDragDrop<string[]>): void {
    const document: any = event.previousContainer.data[event.previousIndex];
    this.afs.collection('boards').doc(this.boardId)
    .collection('categoryList').doc('doneList')
    .collection('taskList').doc(document.id)
    .valueChanges().subscribe((task: Task) => {
      if (task) {
        if (task.categoryId === this.categoryId || this.userAccessLevel >= 3) {
          transferArrayItem(event.previousContainer.data,
                            event.container.data,
                            event.previousIndex,
                            event.currentIndex);
          const id = this.afs.createId();
          this.afs.collection('boards').doc(this.boardId)
          .collection('categoryList').doc(this.categoryId)
          .collection('taskList').ref.get().then(catSnap => {

            this.afs.collection('boards').doc(this.boardId)
            .collection('categoryList').doc(this.categoryId)
            .collection('taskList').doc(id)
            .set({categoryId: this.categoryId, name: task.name, description: task.description, authorId: task.authorId,
                  creationDate: task.creationDate, lastEditorId: task.lastEditorId, lastEditDate: task.lastEditDate,
                  dueDate: task.dueDate, isApproved: true, todoList: task.todoList, points: task.points, completitorId: null,
                  completitionDate: null, position: catSnap.size - event.currentIndex + 1});

            this.taskList.forEach((tsk: Task, index) => {
              if (index < event.currentIndex) {
                this.afs.collection('boards').doc(this.boardId)
                .collection('categoryList').doc(this.categoryId)
                .collection<Task>('taskList').doc(tsk.id)
                .update({position: tsk.position + 1});
              }
            });
          });
          this.afs.collection('boards').doc(this.boardId)
          .collection('categoryList').doc('doneList')
          .collection('taskList').doc(document.id).delete();
          this.updatePositionsAtCategory('doneList');
          this.snackbarService.openSnack('Task undone');
        } else {
          this.snackbarService.openSnack('You cannot reorganize items');
        }
      }
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

  updatePositionsAtCategory(categoryId: string): void {
    let previousCategorySubscription: Subscription;
    this.afs.collection('boards').doc(this.boardId)
    .collection('categoryList').doc(categoryId)
    .collection('taskList').ref.get().then(doneSnap => {
      let count = doneSnap.size;
      const previousCatObs = this.afs.collection('boards').doc(this.boardId)
      .collection('categoryList').doc(categoryId)
      .collection<Task>('taskList', ref => ref.orderBy('position', 'desc'))
      .snapshotChanges().pipe(
        map(actions => {
          return actions.map(action => {
            const id = action.payload.doc.id;
            return id;
          });
        })) as Observable<string[]>;
      previousCategorySubscription = previousCatObs.subscribe(previousTasks => {
        previousTasks.forEach(tid => {
          if (count > 0) {
            this.afs.collection('boards').doc(this.boardId)
            .collection('categoryList').doc(categoryId)
            .collection<Task>('taskList').doc(tid)
            .update({position: count});
            count--;
          }
        });
      });
    });
    if (previousCategorySubscription) {
      previousCategorySubscription.unsubscribe();
    }
  }

}

import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { EditTaskComponent } from '../edit-task/edit-task.component';
import { Category } from 'src/app/models/category.model';
import { ConfirmationDialogComponent } from '../shared/confirmation-dialog/confirmation-dialog.component';
import { SnackBarProviderService } from 'src/app/services/snack-bar-provider.service';
import { AngularFirestore } from 'angularfire2/firestore';
import { BoardUser } from 'src/app/models/boardUser.model';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthService } from 'src/app/services/auth.service';
import { moveItemInArray, CdkDragDrop } from '@angular/cdk/drag-drop';
import { typeWithParameters } from '@angular/compiler/src/render3/util';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css']
})
export class CategoryComponent implements OnInit, OnDestroy {

  boardId: string;
  userId: string;

  userSubscription: Subscription;
  boardUserSubscription: Subscription;
  userAccessLevel: number;

  categoryListSubscription: Subscription;
  categoryList: Category[] = Array<Category>();
  editCategoryName: string;
  editCategoryIdActive = -1;
  tempNewCategoryName: string;

  constructor(public dialog: MatDialog,
              private afs: AngularFirestore,
              private auth: AuthService,
              private activatedRoute: ActivatedRoute,
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

        this.categoryListSubscription = this.afs.collection('boards').doc(this.boardId)
        .collection<Category>('categoryList', ref => ref.orderBy('position', 'asc'))
        .snapshotChanges().pipe(
          map(actions => {
            return actions.map(action => {
              const data = action.payload.doc.data() as Category;
              const id = action.payload.doc.id;
              return {id, ...data};
            });
        })).subscribe(categoryList => {
          this.categoryList = categoryList;
        });
      }
    });

  }

  ngOnInit() {  }

  ngOnDestroy() {
    this.categoryListSubscription.unsubscribe();
    this.boardUserSubscription.unsubscribe();
    this.userSubscription.unsubscribe();
  }

  onClickDelete(category: Category): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '350px',
      panelClass: 'confirmationBackground',
      data: 'Are you sure you want to delete this category with all tasks? You won\'t be able to get it back.'
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.deleteCategory(category);
        this.snackbarService.openSnack('Category deleted');
      }
    });
  }

  deleteCategory(category: Category) {
    const subscription = this.afs.collection('boards').doc(this.boardId)
    .collection('categoryList').doc(category.id).collection('taskList')
    .snapshotChanges().pipe(
      map(actions => {
        return actions.map(action => {
          return action.payload.doc.id;
        });
      })
    ).subscribe(taskList => {
      taskList.forEach((taskId: string) => {
        this.afs.collection('boards').doc(this.boardId).collection('categoryList')
        .doc(category.id).collection('taskList').doc(taskId).delete();
      });
      this.categoryList.splice(this.categoryList.indexOf(category), 1);
      this.updateCategoryPositions();
      this.afs.collection('boards').doc(this.boardId).collection('categoryList').doc(category.id).delete();
      return subscription.unsubscribe();
    });
  }

  onClickEdit(i: number): void {
    this.tempNewCategoryName = this.categoryList[i].name;
    this.editCategoryIdActive = i;
  }

  onClickSubmitEdit(id: string): void {
    let categoryName: string;
    if (this.tempNewCategoryName !== '') {
      categoryName = this.tempNewCategoryName;
    } else {
      categoryName = 'Unnamed';
    }
    this.afs.collection('boards').doc(this.boardId)
    .collection<Category>('categoryList').doc(id)
    .update({name: categoryName});
    this.editCategoryIdActive = -1;
    this.snackbarService.openSnack('Category saved');
  }

  onClickCancelEdit(): void {
    this.editCategoryIdActive = -1;
  }

  onClickAddNewTask(id: string): void {
    const boardId = this.boardId;
    const dialogRef = this.dialog.open(EditTaskComponent, {
      width: '450px',
      maxWidth: '96vw',
      panelClass: 'editTaskBackground',
      data: { boardId }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result && result.action === 'new') {
        this.afs.collection('boards').doc(this.boardId)
        .collection('categoryList').doc(id)
        .collection('taskList').ref.get().then(snap => {
          const pushkey = this.afs.createId();
          result.task.categoryId = id;
          result.task.position = snap.size + 1;
          const newDoc = { ...result.task };
          this.afs.collection('boards').doc(this.boardId)
          .collection('categoryList').doc(id)
          .collection('taskList').doc(pushkey)
          .set(newDoc);
        });
        this.snackbarService.openSnack('New task created');
      }
    });
  }

  onDrop(event: CdkDragDrop<string[]>): void {
    if (this.userAccessLevel >= 3) {
      moveItemInArray(event.container.data,
        event.previousIndex,
        event.currentIndex);
      if (this.editCategoryIdActive >= 0) {
        if (!(this.editCategoryIdActive > event.previousIndex && this.editCategoryIdActive > event.currentIndex)) {
          if (this.editCategoryIdActive > event.previousIndex) {
            this.editCategoryIdActive -= 1;
          } else if (!(this.editCategoryIdActive < event.previousIndex && this.editCategoryIdActive < event.currentIndex)) {
            if (this.editCategoryIdActive < event.previousIndex) {
              this.editCategoryIdActive += 1;
            }
          }
        }
      }
      this.updateCategoryPositions();
    } else {
      this.snackbarService.openSnack('You cannot reorganize categories');
    }

  }

  updateCategoryPositions(): void {
    let count = 1;
    this.categoryList.forEach((category: Category) => {
      if (category) {
        this.afs.collection('boards').doc(this.boardId)
        .collection('categoryList').doc(category.id)
        .update({position: count});
        count++;
      }
    });
  }

}

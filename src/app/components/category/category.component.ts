import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { EditTaskComponent } from '../edit-task/edit-task.component';
import { Category } from 'src/app/models/category.model';
import { ConfirmationDialogComponent } from '../shared/confirmation-dialog/confirmation-dialog.component';
import { SnackBarProviderService } from 'src/app/services/snack-bar-provider.service';
import { AngularFirestore } from 'angularfire2/firestore';
import { User } from 'src/app/models/user.model';
import { ActivatedRoute } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css']
})
export class CategoryComponent implements OnInit, OnDestroy {
  boardId: string;
  userId: string;
  userSubscription: Subscription;
  userAccessLevel: number;

  categoryListObs: Observable<Category[]>;
  categoryListSubscription: Subscription;
  categoryList: Category[];
  editCategoryName: string;
  editCategoryIdActive = -1;
  tempNewCategoryName: string;

  constructor(public dialog: MatDialog,
              private afs: AngularFirestore,
              private activatedRoute: ActivatedRoute,
              private snackbarService: SnackBarProviderService) {

    // TODO: get user id
    this.userId = 'XQAA';

    this.boardId = this.activatedRoute.snapshot.paramMap.get('id');

    this.userSubscription = this.afs.collection('boards').doc(this.boardId)
    .collection<User>('userList').doc(this.userId)
    .valueChanges().subscribe((user: User) => {
      this.userAccessLevel = user.accessLevel;
    });

    this.categoryListObs = this.afs.collection('boards').doc(this.boardId)
    .collection<Category>('categoryList', ref => ref.orderBy('timeStamp', 'asc'))
    .snapshotChanges().pipe(
      map(actions => {
        return actions.map(action => {
          const data = action.payload.doc.data() as Category;
          const id = action.payload.doc.id;
          return {id, ...data};
        });
    })) as Observable<Category[]>;
    this.categoryListSubscription = this.categoryListObs.subscribe(categoryList => {
      this.categoryList = categoryList;
    });

  }

  ngOnInit() {  }

  ngOnDestroy() {
    this.categoryListSubscription.unsubscribe();
    this.userSubscription.unsubscribe();
  }

  onClickDelete(id: string): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '350px',
      data: 'Are you sure you want to delete this category with all tasks? You won\'t be able to get it back.'
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.afs.collection('boards').doc(this.boardId).collection('categoryList').doc(id).delete();
        this.snackbarService.openSnack('Category deleted');
      }
    });
  }

  onClickEdit(i: number): void {
    this.tempNewCategoryName = this.categoryList[i].name;
    this.editCategoryIdActive = i;
  }

  onClickSubmitEdit(id: string): void {
    this.afs.collection('boards').doc(this.boardId)
    .collection<Category>('categoryList').doc(id)
    .update({name: this.tempNewCategoryName});
    this.editCategoryIdActive = -1;
    this.snackbarService.openSnack('Category saved');
  }

  onClickCancelEdit(): void {
    this.editCategoryIdActive = -1;
  }

  onClickAddNewTask(id: string): void {
    const boardId = this.boardId;
    const dialogRef = this.dialog.open(EditTaskComponent, {
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

}

import { Component, OnInit, OnDestroy } from '@angular/core';
import { Board } from 'src/app/models/board.model';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { EditBoardComponent } from '../edit-board/edit-board.component';
import { ConfirmationDialogComponent } from '../shared/confirmation-dialog/confirmation-dialog.component';
import { SnackBarProviderService } from 'src/app/services/snack-bar-provider.service';
import { AngularFirestore } from 'angularfire2/firestore';
import { Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-boards',
  templateUrl: './boards.component.html',
  styleUrls: ['./boards.component.css']
})
export class BoardsComponent implements OnInit, OnDestroy {

  userSubscription: Subscription;
  userId: string;
  userPhotoURL: string;

  userBoardsObs: Observable<Board[]>;
  userBoardsSubscription: Subscription;
  userBoards: Board[];

  friendsBoardsObs: Observable<Board[]>;
  friendsBoardsSubscription: Subscription;
  friendsBoards: Board[] = [];


  constructor(public dialog: MatDialog,
              private router: Router,
              private afs: AngularFirestore,
              private auth: AuthService,
              private snackbarService: SnackBarProviderService) {

    this.userSubscription = this.auth.user$.subscribe(user => {
      if (user) {
        this.userId = user.uid;
        this.userPhotoURL = user.photoURL;

        this.userBoardsObs = this.afs.collection('boards', ref => ref.where('ownerId', '==', user.uid))
        .snapshotChanges().pipe(
          map(actions => {
            return actions.map(action => {
              const data = action.payload.doc.data() as Board;
              const id = action.payload.doc.id;
              return {id, ...data};
            });
          })) as Observable<Board[]>;
        this.userBoardsSubscription = this.userBoardsObs.subscribe(userBoards => {
          this.userBoards = userBoards;
        });

        this.friendsBoardsObs = this.afs.collection('boards', ref => ref.where('guestsId', 'array-contains', user.uid))
          .snapshotChanges().pipe(
            map(actions => {
              return actions.map(action => {
                const data = action.payload.doc.data() as Board;
                const id = action.payload.doc.id;
                return {id, ...data};
              });
            })) as Observable<Board[]>;
        this.friendsBoardsSubscription = this.friendsBoardsObs.subscribe(friendsBoards => {
          this.friendsBoards = friendsBoards;
        });
      }
    });
  }

  ngOnInit() {

  }

  ngOnDestroy() {
    this.friendsBoardsSubscription.unsubscribe();
    this.userBoardsSubscription.unsubscribe();
    this.userSubscription.unsubscribe();
  }

  onClickBoard(board: Board): void {
    this.router.navigate(['/board', board.id]);
  }

  onClickNewBoard(): void {
    const dialogRef = this.dialog.open(EditBoardComponent, {
      data: { }
    });
    dialogRef.afterClosed().subscribe((board: Board) => {
      if (board) {
        board.ownerId = this.userId;
        const pushkey = this.afs.createId();
        const newDoc = { ...board };
        this.afs.collection('boards').doc(pushkey)
        .set(newDoc);

        this.afs.collection('boards').doc(pushkey)
        .collection('userList').doc(this.userId)
        .set({accessLevel: 4, points: 0});

        this.afs.collection('boards').doc(pushkey)
        .collection('categoryList').doc('doneList')
        .set({name: 'Done list'});

        this.snackbarService.openSnack('New board created');
      }
    });
  }

  onClickDelete(id: string): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '350px',
      data: 'Are you sure you want to delete this board? You won\'t be able to get it back.'
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.afs.collection('boards').doc(id)
        .delete();
        this.snackbarService.openSnack('Board deleted');
      }
    });
  }

  onClickEdit(board: Board): void {
    const dialogRef = this.dialog.open(EditBoardComponent, {
      data: { board }
    });
    dialogRef.afterClosed().subscribe((b: Board) => {
      if (b) {
        this.afs.collection('boards').doc<Board>(b.id)
        .update(b);
        this.snackbarService.openSnack('Board saved');
      }
    });
  }

}

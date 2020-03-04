import { Component, OnInit, OnDestroy } from '@angular/core';
import { Board } from 'src/app/models/board.model';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { EditBoardComponent } from '../edit-board/edit-board.component';
import { ConfirmationDialogComponent } from '../shared/confirmation-dialog/confirmation-dialog.component';
import { SnackBarProviderService } from 'src/app/services/snack-bar-provider.service';
import { AngularFirestore } from 'angularfire2/firestore';
import { Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthService } from 'src/app/services/auth.service';
import { User } from 'src/app/models/user.model';
import { DisplayDialogComponent } from '../shared/display-dialog/display-dialog.component';
import { moveItemInArray, CdkDragDrop } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-boards',
  templateUrl: './boards.component.html',
  styleUrls: ['./boards.component.css']
})
export class BoardsComponent implements OnInit, OnDestroy {

  userSubscription: Subscription;
  userId: string;
  userPhotoURL: string;

  userBoardsSubscription: Subscription;
  userBoards = Array<Board>();

  friendsBoardsSubscription: Subscription;
  friendsBoards: Board[] = Array<Board>();

  firendsDetailsSubscription: Subscription;

  friendsIds: string[] = [''];
  friendsDetails: User[] = [];

  constructor(public dialog: MatDialog,
              private router: Router,
              private afs: AngularFirestore,
              private auth: AuthService,
              private snackbarService: SnackBarProviderService) {

    this.userSubscription = this.auth.user$.subscribe(user => {
      if (user) {
        this.userId = user.uid;
        this.userPhotoURL = user.photoURL;

        this.userBoardsSubscription = this.afs.collection('boards', ref => ref.where('ownerId', '==', user.uid).orderBy('position', 'asc'))
        .snapshotChanges().pipe(
          map(actions => {
            return actions.map(action => {
              const data = action.payload.doc.data() as Board;
              const id = action.payload.doc.id;
              return {id, ...data};
            });
          })).subscribe(userBoards => {
          this.userBoards = userBoards;
        });

        this.friendsBoardsSubscription = this.afs.collection('boards', ref => ref.where('guestsId', 'array-contains', user.uid))
          .snapshotChanges().pipe(
            map(actions => {
              return actions.map(action => {
                const data = action.payload.doc.data() as Board;
                const id = action.payload.doc.id;
                return {id, ...data};
              });
            })).subscribe(friendsBoards => {
          this.friendsBoards = friendsBoards;
          friendsBoards.forEach(board => {
            this.friendsIds.push(board.ownerId);
          });

          this.firendsDetailsSubscription = this.afs.collection('users', ref => ref.where('uid', 'in', this.friendsIds))
          .snapshotChanges().pipe(
            map(actions => {
              return actions.map(action => {
                const id = action.payload.doc.data() as User;
                return id;
              });
            })).subscribe(friends => {
              this.friendsDetails = friends;
          });
        });

      }
    });
  }

  ngOnInit() { }

  ngOnDestroy() {
    this.friendsBoardsSubscription.unsubscribe();
    this.userBoardsSubscription.unsubscribe();
    if (this.firendsDetailsSubscription) {
      this.firendsDetailsSubscription.unsubscribe();
    }
    this.userSubscription.unsubscribe();
  }

  updateBoardPositions(): void {
    let count = 1;
    this.userBoards.forEach((board: Board) => {
      if (board) {
        this.afs.collection('boards').doc(board.id)
        .update({position: count});
        count++;
      }
    });
  }

  onClickShowId(): void {
    this.dialog.open(DisplayDialogComponent, {
      width: '450px',
      maxWidth: '80vw',
      panelClass: 'showUid',
      data: 'Your ID: ' + this.userId
    });
  }

  onClickLeaveBoard(id: string): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '350px',
      panelClass: 'confirmationBackground',
      data: 'Are you sure you want to leave this board? Your data will be lost.'
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const subscription = this.afs.collection('boards').doc(id)
        .valueChanges().subscribe((board: Board) => {
          const guestList: Array<string> = board.guestsId;
          guestList.forEach((guestId: string, index) => {
            if (guestId === this.userId) {
              guestList.splice(index, 1);
              this.afs.collection('boards').doc(id).update({guestsId: guestList});
              this.afs.collection('boards').doc(id)
              .collection('userList').doc(this.userId)
              .delete();
            }
          });
          return subscription.unsubscribe();
        });
      }
    });

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
        board.position = this.userBoards.length + 1;
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

  onDrop(event: CdkDragDrop<string[]>): void {
    moveItemInArray(event.container.data,
                    event.previousIndex,
                    event.currentIndex);
    this.updateBoardPositions();
  }

  onClickDelete(board: Board): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '350px',
      panelClass: 'confirmationBackground',
      data: 'Are you sure you want to delete this board? You won\'t be able to get it back.'
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.deleteBoard(board);
        this.snackbarService.openSnack('Board deleted');
      }
    });
  }

  deleteBoard(board: Board) {
    this.deleteTaskLists(board.id);
    this.deleteCategoryList(board.id);
    this.deleteRewardList(board.id);
    this.deleteRewardHistoryList(board.id);
    this.deleteUserList(board.id);
    this.userBoards.splice(this.userBoards.indexOf(board), 1);
    this.updateBoardPositions();
    this.afs.collection('boards').doc(board.id).delete();
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

  getBoardAuthorName(id: string): string {
    const user = this.friendsDetails.find(u => u.uid === id);
    if (user) {
      return user.displayName;
    }
    return;
  }

  deleteTaskLists(id: string): void {
    const subscription = this.afs.collection('boards').doc(id).collection('categoryList')
    .snapshotChanges().pipe(
      map(actions => {
        return actions.map(action => {
          return action.payload.doc.id;
        });
      })
    ).subscribe(categoryList => {
      categoryList.forEach((categoryId: string) => {
        const categorySubscription = this.afs.collection('boards').doc(id)
        .collection('categoryList').doc(categoryId).collection('taskList')
        .snapshotChanges().pipe(
          map(actions => {
            return actions.map(action => {
              return action.payload.doc.id;
            });
          })
        ).subscribe(taskList => {
          taskList.forEach(taskId => {
            this.afs.collection('boards').doc(id).collection('categoryList')
            .doc(categoryId).collection('taskList').doc(taskId).delete();
          });
          return categorySubscription.unsubscribe();
        });
      });
      return subscription.unsubscribe();
    });
  }

  deleteCategoryList(id: string): void {
    const subscription = this.afs.collection('boards').doc(id).collection('categoryList')
    .snapshotChanges().pipe(
      map(actions => {
        return actions.map(action => {
          return action.payload.doc.id;
        });
      })
    ).subscribe(categoryList => {
      categoryList.forEach((categoryId: string) => {
        this.afs.collection('boards').doc(id).collection('categoryList')
        .doc(categoryId).delete();
      });
      return subscription.unsubscribe();
    });
  }

  deleteRewardList(id: string): void {
    const subscription = this.afs.collection('boards').doc(id).collection('rewardList')
    .snapshotChanges().pipe(
      map(actions => {
        return actions.map(action => {
          return action.payload.doc.id;
        });
      })
    ).subscribe(rewardList => {
      rewardList.forEach((rewardId: string) => {
        this.afs.collection('boards').doc(id).collection('rewardList')
        .doc(rewardId).delete();
      });
      return subscription.unsubscribe();
    });
  }

  deleteRewardHistoryList(id: string): void {
    const subscription = this.afs.collection('boards').doc(id).collection('rewardHistoryList')
    .snapshotChanges().pipe(
      map(actions => {
        return actions.map(action => {
          return action.payload.doc.id;
        });
      })
    ).subscribe(rewardHistoryList => {
      rewardHistoryList.forEach((rewardId: string) => {
        this.afs.collection('boards').doc(id).collection('rewardHistoryList')
        .doc(rewardId).delete();
      });
      return subscription.unsubscribe();
    });
  }

  deleteUserList(id: string): void {
    const subscription = this.afs.collection('boards').doc(id).collection('userList')
    .snapshotChanges().pipe(
      map(actions => {
        return actions.map(action => {
          return action.payload.doc.id;
        });
      })
    ).subscribe(userCollection => {
      userCollection.forEach((userId: string) => {
        this.afs.collection('boards').doc(id).collection('userList').doc(userId).delete();
      });
      return subscription.unsubscribe();
    });
  }
}

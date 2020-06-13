import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BoardUser } from 'src/app/models/boardUser.model';
import { NumberInputDialogComponent } from '../shared/number-input-dialog/number-input-dialog.component';
import { ConfirmationDialogComponent } from '../shared/confirmation-dialog/confirmation-dialog.component';
import { SnackBarProviderService } from 'src/app/services/snack-bar-provider.service';
import { AngularFirestore } from 'angularfire2/firestore';
import { Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthService } from 'src/app/services/auth.service';
import { UsersDetailProviderService } from 'src/app/services/users-detail-provider.service';
import { Board } from 'src/app/models/board.model';
import { StringInputDialogComponent } from '../shared/string-input-dialog/string-input-dialog.component';
import { User } from 'firebase';


@Component({
  selector: 'app-user-options',
  templateUrl: './user-options.component.html',
  styleUrls: ['./user-options.component.css']
})
export class UserOptionsComponent implements OnInit, OnDestroy {

  usersDetailProvider: UsersDetailProviderService = this.data.usersDetailProvider;

  boardId?: string = this.data.boardId;

  userId: string;
  userSubscription: Subscription;
  boardUserSubscription: Subscription;
  userAccessLevel: number;

  userListSubscription: Subscription;
  userList: Array<BoardUser>;

  constructor(private afs: AngularFirestore,
              public dialog: MatDialog,
              public dialogRef: MatDialogRef<UserOptionsComponent>,
              private auth: AuthService,
              @Inject(MAT_DIALOG_DATA) public data: any,
              private snackbarService: SnackBarProviderService) {

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
    }

  }

  ngOnInit() {
    if (this.boardId) {
      this.userListSubscription = this.afs.collection('boards').doc(this.boardId)
      .collection('userList', ref => ref.orderBy('accessLevel', 'desc'))
      .snapshotChanges().pipe(
        map(actions => {
          return actions.map(action => {
            const data = action.payload.doc.data() as BoardUser;
            const id = action.payload.doc.id;
            return {id, ...data};
          });
        })).subscribe(userList => {
        this.userList = userList;
      });
    }
  }

  ngOnDestroy() {
    if (this.userListSubscription) {
      this.userListSubscription.unsubscribe();
    }
    if (this.boardUserSubscription) {
      this.boardUserSubscription.unsubscribe();
    }
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
  }

  onClickInvite(): void {
    const dialogRef = this.dialog.open(StringInputDialogComponent, {
      width: '350px',
      panelClass: 'positiveBackground',
      data: ''
    });
    dialogRef.afterClosed().subscribe((value: string) => {
      if (value) {
        this.afs.collection('boards').doc(this.boardId)
        .collection('userList').doc(value).ref.get().then((doc: any) => {
          if (!doc.exists) {
            const userSubsription = this.afs.collection('users', ref => ref.where('uid', '==', value))
            .valueChanges().subscribe(users => {
              if (users.length > 0) {
                this.afs.collection('boards').doc(this.boardId).collection('userList').doc(value).set({accessLevel: 1, points: 0});
                const boardSubscription = this.afs.collection('boards').doc(this.boardId)
                .valueChanges().subscribe((board: Board) => {
                  const guests: Array<string> = board.guestsId;
                  guests.push(value);
                  this.afs.collection('boards').doc(this.boardId).update({guestsId: guests});
                  this.snackbarService.openSnack('Friend added to board');
                  return boardSubscription.unsubscribe();
                });
              } else {
                const userMailSubsription = this.afs.collection('users', ref => ref.where('email', '==', value))
                .valueChanges().subscribe(users2 => {
                  if (users2.length > 0) {
                    users2.forEach((user: User) => {
                      this.afs.collection('boards').doc(this.boardId)
                      .collection('userList').doc(user.uid).ref.get().then((doc2: any) => {
                        if (!doc2.exists) {
                          this.afs.collection('boards').doc(this.boardId).collection('userList')
                          .doc(user.uid).set({accessLevel: 1, points: 0});
                          const boardSubscription2 = this.afs.collection('boards').doc(this.boardId)
                          .valueChanges().subscribe((board: Board) => {
                            const guests: Array<string> = board.guestsId;
                            guests.push(user.uid);
                            this.afs.collection('boards').doc(this.boardId).update({guestsId: guests});
                            this.snackbarService.openSnack('Friend added to board');
                            return boardSubscription2.unsubscribe();
                          });
                        } else {
                          this.snackbarService.openSnack('This user is already member of this board');
                        }
                      });
                    });
                  } else {
                    this.snackbarService.openSnack('Such user does not exist');
                  }
                  return userMailSubsription.unsubscribe();
                });
              }
              return userSubsription.unsubscribe();
            });
          } else {
            this.snackbarService.openSnack('This user is already member of this board');
          }
        });
      }
    });
  }

  onAddUserPoints(id: string): void {
    const dialogRef = this.dialog.open(NumberInputDialogComponent, {
      width: '350px',
      panelClass: 'positiveBackground',
      data: 'Enter amount of points to be added'
    });
    dialogRef.afterClosed().subscribe((value: number) => {
      if (value) {
        this.afs.collection('boards').doc(this.boardId)
        .collection('userList').doc(id).ref.get().then((doc: any) => {
          if (doc.exists) {
            this.afs.collection('boards').doc(this.boardId)
            .collection('userList').doc(id)
            .update({points: doc.data().points + value});
          }
        });
        this.snackbarService.openSnack('Added points to user');
      }
    });
  }

  onSubUserPoints(id: string): void {
    const dialogRef = this.dialog.open(NumberInputDialogComponent, {
      width: '350px',
      panelClass: 'negativeBackground',
      data: 'Enter amount of points to be substracted'
    });
    dialogRef.afterClosed().subscribe((value: number) => {
      if (value) {
        this.afs.collection('boards').doc(this.boardId)
        .collection('userList').doc(id).ref.get().then((doc: any) => {
          if (doc.exists) {
            this.afs.collection('boards').doc(this.boardId)
            .collection('userList').doc(id)
            .update({points: doc.data().points - value});
          }
        });
        this.snackbarService.openSnack('Substracted points from user');
      }
    });
  }

  onIncreaseUserLevel(id: string): void {
    this.afs.collection('boards').doc(this.boardId)
                .collection('userList').doc(id).ref.get().then((doc: any) => {
      if (doc.exists) {
        if (this.userAccessLevel > doc.data().accessLevel + 1) {
          this.afs.collection('boards').doc(this.boardId)
          .collection('userList').doc(id)
          .update({accessLevel: doc.data().accessLevel + 1});
          this.snackbarService.openSnack('User access level increased');
        } else {
          this.snackbarService.openSnack('User access level cannot be further increased');
        }
      }
     });
  }

  onDecreaseUserLevel(id: string): void {
    this.afs.collection('boards').doc(this.boardId)
                .collection('userList').doc(id).ref.get().then((doc: any) => {
      if (doc.exists) {
        if (this.userAccessLevel > doc.data().accessLevel && doc.data().accessLevel > 1) {
          this.afs.collection('boards').doc(this.boardId)
          .collection('userList').doc(id)
          .update({accessLevel: (doc.data().accessLevel - 1)});
          this.snackbarService.openSnack('User access level decreased');
        } else {
          this.snackbarService.openSnack('User access level cannot be further decreased');
        }
      }
     });
  }

  onClickDeleteUser(id: string): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '350px',
      panelClass: 'confirmationBackground',
      data: 'Are you sure you want to delete this user? This cannot be undone.'
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.deleteUser(id);
        this.snackbarService.openSnack('User deleted');
      }
    });
  }

  deleteUser(id: string): void {
    this.afs.collection('boards').doc(this.boardId)
    .collection('userList').doc(id)
    .delete();

    const subscription = this.afs.collection('boards').doc(this.boardId)
    .valueChanges().subscribe((board: Board) => {
      const guestList: Array<string> = board.guestsId;
      guestList.forEach((guestId: string, index) => {
        if (guestId === id) {
          return guestList.splice(index, 1);
        }
      });
      this.afs.collection('boards').doc(this.boardId).update({guestsId: guestList});
      subscription.unsubscribe();
    });
  }

  onClickClose(): void {
    this.dialogRef.close();
  }
}

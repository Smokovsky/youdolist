import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BoardUser } from 'src/app/models/boardUser.model';
import { ValueInputDialogComponent } from '../shared/value-input-dialog/value-input-dialog.component';
import { ConfirmationDialogComponent } from '../shared/confirmation-dialog/confirmation-dialog.component';
import { SnackBarProviderService } from 'src/app/services/snack-bar-provider.service';
import { AngularFirestore } from 'angularfire2/firestore';
import { Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthService } from 'src/app/services/auth.service';
import { UsersDetailProviderService } from 'src/app/services/users-detail-provider.service';


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

  userListObs: Observable<BoardUser[]>;
  userListSubscription: Subscription;
  userList: Array<BoardUser>;

  constructor(private afs: AngularFirestore,
              public dialog: MatDialog,
              public dialogRef: MatDialogRef<UserOptionsComponent>,
              private auth: AuthService,
              @Inject(MAT_DIALOG_DATA) public data: any,
              private snackbarService: SnackBarProviderService) {

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

  ngOnInit() {
    this.userListObs = this.afs.collection('boards').doc(this.boardId)
    .collection('userList')
    .snapshotChanges().pipe(
      map(actions => {
        return actions.map(action => {
          const data = action.payload.doc.data() as BoardUser;
          const id = action.payload.doc.id;
          return {id, ...data};
        });
      })) as Observable<BoardUser[]>;
    this.userListSubscription = this.userListObs.subscribe(userList => {
      this.userList = userList;
    });
  }

  ngOnDestroy() {
    this.userListSubscription.unsubscribe();
    this.boardUserSubscription.unsubscribe();
    this.userSubscription.unsubscribe();
  }


  onAddUserPoints(id: string): void {
    const dialogRef = this.dialog.open(ValueInputDialogComponent, {
      width: '350px',
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
    const dialogRef = this.dialog.open(ValueInputDialogComponent, {
      width: '350px',
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
      data: 'Are you sure you want to delete this user? This cannot be undone.'
    });
    dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.afs.collection('boards').doc(this.boardId)
          .collection('userList').doc(id)
          .delete();
          this.snackbarService.openSnack('User deleted');
        }
      });
  }

  onClickClose(): void {
    this.dialogRef.close();
  }
}

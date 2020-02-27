import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SnackBarProviderService } from 'src/app/services/snack-bar-provider.service';
import { ConfirmationDialogComponent } from '../shared/confirmation-dialog/confirmation-dialog.component';
import { AngularFirestore } from 'angularfire2/firestore';
import { BoardUser } from 'src/app/models/boardUser.model';
import { Subscription } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/auth';

@Component({
  selector: 'app-edit-reward',
  templateUrl: './edit-reward.component.html',
  styleUrls: ['./edit-reward.component.css']
})
export class EditRewardComponent implements OnInit, OnDestroy {

  boardId?: string = this.data.boardId;

  userId: string;
  userSubscription: Subscription;
  boardUserSubscription: Subscription;
  userAccessLevel: number;

  reward?: any = this.data.reward;
  rewardName: string;
  rewardDescription: string;
  rewardPoints: number;
  authorId?: string;
  creationDate?: any;
  lastEditorId?: string;
  lastEditDate?: any;
  completitorId?: string;
  completitionDate?: any;

  action: string;

  constructor(private afs: AngularFirestore,
              private afAuth: AngularFireAuth,
              public dialog: MatDialog,
              public dialogRef: MatDialogRef<EditRewardComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any,
              private snackbarService: SnackBarProviderService) {

    this.userId = 'XQAA';

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
    if (!this.reward) {
      this.reward = {};
      this.action = 'new';
    } else {
      this.action = 'edit';
      this.rewardName = this.reward.name;
      this.rewardDescription = this.reward.description;
      this.rewardPoints = this.reward.points;
      this.authorId = this.reward.authorId;
      this.creationDate = this.reward.creationDate;
      if (this.reward.lastEditorId) {
        this.lastEditorId = this.reward.lastEditorId;
        this.lastEditDate = this.reward.lastEditDate;
      } else {
        this.lastEditorId = this.reward.lastEditorId;
        this.lastEditDate = this.reward.lastEditDate;
      }
      if (this.reward.completitorId) {
        this.completitorId = this.reward.completitorId;
        this.completitionDate = this.reward.completitionDate;
      } else {
        this.completitorId = null;
        this.completitionDate = null;
      }
    }
  }

  ngOnDestroy() {
    this.boardUserSubscription.unsubscribe();
    this.userSubscription.unsubscribe();
  }

  onClickRewardDelete(): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '350px',
      data: 'Are you sure you want to delete this reward? You won\'t be able to get it back.'
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.snackbarService.openSnack('Reward deleted');
        this.dialogRef.close({reward: this.reward, action: 'delete'});
      }
    });
  }

  onClickCancelButton(): void {
    this.dialogRef.close();
    delete this.reward;
  }

  onClickSaveButton(): void {
    if (this.userAccessLevel >= 3) {
      this.reward.isApproved = true;
    } else {
      this.reward.isApproved = false;
    }
    if (this.rewardName) {
      this.reward.name = this.rewardName;
    } else {
      this.reward.name = 'Unnamed';
    }
    if (this.rewardDescription) {
      this.reward.description = this.rewardDescription;
    } else {
      this.reward.description = '';
    }
    if (this.rewardPoints) {
      this.reward.points = this.rewardPoints;
    } else {
      this.reward.points = 0;
    }
    if (this.lastEditorId) {
      this.reward.lastEditorId = this.lastEditorId;
      this.reward.lastEditDate = this.lastEditDate;
    } else {
      this.reward.lastEditorId = null;
      this.reward.lastEditDate = null;
    }
    if (this.completitorId) {
      this.reward.completitorId = this.completitorId;
      this.reward.completitionDate = this.completitionDate;
    } else {
      this.reward.completitorId = null;
      this.reward.completitionDate = null;
    }
    if (this.action !== 'new') {
      this.reward.lastEditorId = this.userId;
      this.reward.lastEditDate = new Date();
      this.snackbarService.openSnack('Reward saved');
    } else {
      this.reward.authorId = this.userId;
      this.reward.creationDate = new Date();
      this.snackbarService.openSnack('New reward created');
    }
    this.dialogRef.close({reward: this.reward, action: this.action});
  }

}

import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Reward } from 'src/app/models/reward.model';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { SnackBarProviderService } from 'src/app/services/snack-bar-provider.service';
import { EditRewardComponent } from '../edit-reward/edit-reward.component';
import { ConfirmationDialogComponent } from '../shared/confirmation-dialog/confirmation-dialog.component';
import { AngularFirestore } from 'angularfire2/firestore';
import { BoardUser } from 'src/app/models/boardUser.model';
import { map } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { UsersDetailProviderService } from 'src/app/services/users-detail-provider.service';
import { OperationsIntervalService } from 'src/app/services/operations-interval.service';

@Component({
  selector: 'app-reward-list',
  templateUrl: './reward-list.component.html',
  styleUrls: ['./reward-list.component.css']
})
export class RewardListComponent implements OnInit, OnDestroy {

  detailsService: UsersDetailProviderService = this.data.detailsService;

  boardId = this.data.boardId;
  userId: string;
  userSubscription: Subscription;
  boardUserSubscription: Subscription;
  userAccessLevel: number;
  userPoints: number;

  rewardListSubscribtion: Subscription;
  rewardList: Array<Reward>;

  rewardHistoryListSubscription: Subscription;
  rewardHistoryList: Array<Reward>;

  historyMode = false;

  constructor(private afs: AngularFirestore,
              private auth: AuthService,
              @Inject(MAT_DIALOG_DATA) public data: any,
              public dialog: MatDialog,
              public dialogRef: MatDialogRef<RewardListComponent>,
              private operationsInterval: OperationsIntervalService,
              private snackbarService: SnackBarProviderService) {

    this.userSubscription = this.auth.user$.subscribe(user => {
      if (user) {
        this.userId = user.uid;

        this.boardUserSubscription = this.afs.collection('boards').doc(this.boardId)
        .collection<BoardUser>('userList').doc(this.userId)
        .valueChanges().subscribe((boardUser: BoardUser) => {
          this.userAccessLevel = boardUser.accessLevel;
          this.userPoints = boardUser.points;
        });
      }
    });

    this.rewardListSubscribtion = this.afs.collection('boards').doc(this.boardId)
    .collection<Reward>('rewardList', ref => ref.orderBy('position', 'desc'))
    .snapshotChanges().pipe(
      map(actions => {
        return actions.map(action => {
          const d = action.payload.doc.data() as Reward;
          const id = action.payload.doc.id;
          return {id, ...d};
        });
      })).subscribe(rewardList => {
      this.rewardList = rewardList;
    });

    this.rewardHistoryListSubscription = this.afs.collection('boards').doc(this.boardId)
    .collection<Reward>('rewardHistoryList', ref => ref.orderBy('position', 'desc'))
    .snapshotChanges().pipe(
      map(actions => {
        return actions.map(action => {
          const d = action.payload.doc.data() as Reward;
          const id = action.payload.doc.id;
          return {id, ...d};
        });
      })).subscribe(rewardHistoryList => {
      this.rewardHistoryList = rewardHistoryList;
    });

  }

  ngOnInit() { }

  ngOnDestroy() {
    this.rewardHistoryListSubscription.unsubscribe();
    this.rewardListSubscribtion.unsubscribe();
    this.boardUserSubscription.unsubscribe();
    this.userSubscription.unsubscribe();
  }

  onClickAddReward(): void {
    if (this.operationsInterval.longInterval()) {
      const dialogRef = this.dialog.open(EditRewardComponent, {
        maxWidth: '92vw',
        width: '380px',
        panelClass: 'editRewardBackground',
        data: { boardId: this.boardId }
      });
      dialogRef.afterClosed().subscribe(result => {
      if (result && result.action === 'new') {
        this.afs.collection('boards').doc(this.boardId)
        .collection('rewardList').ref.get().then(snap => {
          result.reward.position = snap.size + 1;
          this.afs.collection('boards').doc(this.boardId)
          .collection('rewardList').doc(this.afs.createId())
          .set(result.reward);
        });
      }});
    }
  }

  onClickRewardSettings(reward: Reward, inHistory: boolean): void {
    if (this.operationsInterval.longInterval()) {
      const dialogRef = this.dialog.open(EditRewardComponent, {
        maxWidth: '92vw',
        width: '380px',
        panelClass: 'editRewardBackground',
        data: { boardId: this.boardId, reward, detailsService: this.detailsService }
      });
      dialogRef.afterClosed().subscribe(result => {
        let to: string;
        if (inHistory) {
          to = 'rewardHistoryList';
        } else {
          to = 'rewardList';
        }
        if (result && result.action === 'delete') {
          if (to === 'rewardList') {
            this.rewardList.splice(this.rewardList.indexOf(result.reward), 1);
          } else {
            this.rewardHistoryList.splice(this.rewardList.indexOf(result.reward), 1);
          }
          this.afs.collection('boards').doc(this.boardId)
          .collection<Reward>(to).doc(result.reward.id)
          .delete();
          this.snackbarService.openSnack('Reward deleted');
        } else if (result && result.action === 'edit') {
          this.afs.collection('boards').doc(this.boardId)
          .collection<Reward>(to).doc(result.reward.id)
          .update(result.reward);
        }
        this.updatePositions(to);
      });
    }
  }

  onClickRewardDelete(reward: Reward): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '350px',
      panelClass: 'confirmationBackground',
      data: 'Are you sure you want to delete this reward? You won\'t be able to get it back.'
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.rewardList.splice(this.rewardList.indexOf(reward), 1);
        this.afs.collection('boards').doc(this.boardId)
        .collection('rewardList').doc(reward.id)
        .delete();
        this.updatePositions('rewardList');
        this.snackbarService.openSnack('Task deleted');
      }
    });
  }

  onClickRewardHistoryDelete(reward: Reward): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '350px',
      panelClass: 'confirmationBackground',
      data: 'Are you sure you want to delete this reward? You won\'t be able to get it back.'
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.rewardHistoryList.splice(this.rewardHistoryList.indexOf(reward), 1);
        this.afs.collection('boards').doc(this.boardId)
        .collection('rewardHistoryList').doc(reward.id)
        .delete();
        this.updatePositions('rewardHistoryList');
        this.snackbarService.openSnack('Reward deleted');
      }
    });
  }

  onClickRewardApprove(id: string): void {
    this.afs.collection('boards').doc(this.boardId)
    .collection('rewardList').doc(id)
    .update({isApproved: true});
    this.snackbarService.openSnack('Reward approved');
  }

  onClickRewardHistoryApprove(id: string): void {
    this.afs.collection('boards').doc(this.boardId)
    .collection('rewardHistoryList').doc(id)
    .update({isApproved: true});
    this.snackbarService.openSnack('Reward approved');
  }

  onClickGetReward(reward: Reward): void {
    if (this.operationsInterval.shortInterval()) {
      if (this.userPoints >= reward.points) {
        this.transferRewardFrom(reward.id, 'rewardList');
        const user = this.afs.collection('boards').doc(this.boardId)
        .collection('userList').doc(this.userId);
        user.update({points: this.userPoints - reward.points});
        this.snackbarService.openSnack('Reward collected');
      }
    }
  }

  onClickUndoReward(reward: Reward): void {
    if (this.operationsInterval.shortInterval()) {
      this.transferRewardFrom(reward.id, 'rewardHistoryList');
      this.afs.collection('boards').doc(this.boardId)
      .collection<BoardUser>('userList').doc(reward.completitorId)
      .ref.get().then(user => {
        if (user.exists) {
          this.afs.collection('boards').doc(this.boardId)
          .collection('userList').doc(reward.completitorId)
          .update({points: user.data().points + reward.points});
        }
      });
      this.snackbarService.openSnack('Reward undone');
    }
  }

  onClickHistory(): void {
    this.historyMode = !this.historyMode;
  }

  onClickClose(): void {
    this.dialogRef.close();
  }

  onDrop(event: CdkDragDrop<string[]>): void {
    if (this.operationsInterval.shortInterval()) {
      if (this.userAccessLevel >= 3) {
        moveItemInArray(event.container.data,
                        event.previousIndex,
                        event.currentIndex);
        if (event.previousContainer.id === 'cdk-reward-drop-list') {
          this.updatePositions('rewardList');
        } else {
          this.updatePositions('rewardHistoryList');
        }
      } else {
        if (event.previousIndex !== event.currentIndex) {
          this.snackbarService.openSnack('Sorry, you cannot reorganize rewards');
        }
      }
    }
  }

  transferRewardFrom(id: string, from: string): void {
    let to: string;
    let approved = false;
    let compId = null;
    let compDate = null;
    if (from === 'rewardList') {
      to = 'rewardHistoryList';
      compId = this.userId;
      compDate = new Date();
    } else if (from === 'rewardHistoryList') {
      to = 'rewardList';
      approved = true;
    }

    if (to) {
      const rewardSubscription = this.afs.collection('boards').doc(this.boardId)
      .collection<Reward>(from).doc(id)
      .valueChanges().subscribe((reward: Reward) => {
        if (reward) {
          this.afs.collection('boards').doc(this.boardId)
          .collection(to).ref.get().then(doneSnap => {
            this.afs.collection('boards').doc(this.boardId)
            .collection(to).doc(this.afs.createId())
            .set({name: reward.name, description: reward.description,
                  authorId: reward.authorId, creationDate: reward.creationDate, lastEditorId: reward.lastEditorId,
                  lastEditDate: reward.lastEditDate, isApproved: approved,
                  points: reward.points, completitorId: compId, completitionDate: compDate, position: doneSnap.size + 1});

            this.updatePositions(from);
          });
          this.afs.collection('boards').doc(this.boardId)
          .collection(from).doc(id).delete();
        }
        rewardSubscription.unsubscribe();
      });
    }
  }

  updatePositions(listId: string): void {
    let count: number;
    let list: Array<Reward>;
    if (listId === 'rewardList') {
      list = this.rewardList;
      count  = this.rewardList.length;
    } else if (listId === 'rewardHistoryList') {
      list = this.rewardHistoryList;
      count = this.rewardHistoryList.length;
    }
    if (list) {
      list.forEach((reward: Reward) => {
        if (reward) {
          this.afs.collection('boards').doc(this.boardId)
          .collection<Reward>(listId).doc(reward.id)
          .update({position: count});
          count--;
        }
      });
    }
  }

}

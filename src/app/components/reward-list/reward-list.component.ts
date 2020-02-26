import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Reward } from 'src/app/models/reward.model';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { SnackBarProviderService } from 'src/app/services/snack-bar-provider.service';
import { EditRewardComponent } from '../edit-reward/edit-reward.component';
import { ConfirmationDialogComponent } from '../shared/confirmation-dialog/confirmation-dialog.component';
import { AngularFirestore } from 'angularfire2/firestore';
import { User } from 'src/app/models/user.model';
import { map } from 'rxjs/operators';
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'app-reward-list',
  templateUrl: './reward-list.component.html',
  styleUrls: ['./reward-list.component.css']
})
export class RewardListComponent implements OnInit, OnDestroy {

  boardId = this.data.boardId;
  userId: string;
  userSubscribtion: Subscription;
  userAccessLevel: number;
  userPoints: number;

  rewardListObs: Observable<Reward[]>;
  rewardListSubscribtion: Subscription;
  rewardList: Array<Reward>;

  rewardHistoryListObs: Observable<Reward[]>;
  rewardHistoryListSubscription: Subscription;
  rewardHistoryList: Array<Reward>;

  historyMode = false;

  constructor(private afs: AngularFirestore,
              @Inject(MAT_DIALOG_DATA) public data: any,
              public dialog: MatDialog,
              public dialogRef: MatDialogRef<RewardListComponent>,
              private snackbarService: SnackBarProviderService) {

    this.userId = 'XQAA';

    this.userSubscribtion = this.afs.collection('boards').doc(this.boardId)
    .collection<User>('userList').doc(this.userId)
    .valueChanges().subscribe((user: User) => {
      this.userAccessLevel = user.accessLevel;
      this.userPoints = user.points;
    });

    this.rewardListObs = this.afs.collection('boards').doc(this.boardId)
    .collection<Reward>('rewardList', ref => ref.orderBy('position', 'desc'))
    .snapshotChanges().pipe(
      map(actions => {
        return actions.map(action => {
          const d = action.payload.doc.data() as Reward;
          const id = action.payload.doc.id;
          return {id, ...d};
        });
      })) as Observable<Reward[]>;
    this.rewardListSubscribtion = this.rewardListObs.subscribe(rewardList => {
      this.rewardList = rewardList;
    });

    this.rewardHistoryListObs = this.afs.collection('boards').doc(this.boardId)
    .collection<Reward>('rewardHistoryList', ref => ref.orderBy('position', 'desc'))
    .snapshotChanges().pipe(
      map(actions => {
        return actions.map(action => {
          const d = action.payload.doc.data() as Reward;
          const id = action.payload.doc.id;
          return {id, ...d};
        });
      })) as Observable<Reward[]>;
    this.rewardHistoryListSubscription = this.rewardHistoryListObs.subscribe(rewardHistoryList => {
      this.rewardHistoryList = rewardHistoryList;
    });

  }

  ngOnInit() { }

  ngOnDestroy() {
    this.rewardHistoryListSubscription.unsubscribe();
    this.rewardListSubscribtion.unsubscribe();
    this.userSubscribtion.unsubscribe();
  }

  onClickAddReward(): void {
    const dialogRef = this.dialog.open(EditRewardComponent, {
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

  onClickRewardSettings(reward: Reward): void {
    const dialogRef = this.dialog.open(EditRewardComponent, {
      data: { boardId: this.boardId, reward }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result && result.action === 'delete') {
        this.afs.collection('boards').doc(this.boardId)
        .collection<Reward>('rewardList').doc(result.reward.id)
        .delete();
        this.rewardList.splice(this.rewardList.indexOf(result.reward), 1);
        this.updatePositions('rewardList');
        this.snackbarService.openSnack('Reward deleted');
      } else if (result && result.action === 'edit') {
        this.afs.collection('boards').doc(this.boardId)
        .collection<Reward>('rewardList').doc(result.reward.id)
        .update(result.reward);
      }
    });
  }

  onClickRewardDelete(id: string): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '350px',
      data: 'Are you sure you want to delete this reward? You won\'t be able to get it back.'
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.rewardList.splice(this.rewardList.indexOf(result.task), 1);
        this.snackbarService.openSnack('Task deleted');
        this.afs.collection('boards').doc(this.boardId)
        .collection<Reward>('rewardList').doc(id)
        .delete();
        this.updatePositions('rewardList');
      }
    });
  }

  onClickRewardHistoryDelete(id: string): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '350px',
      data: 'Are you sure you want to delete this reward? You won\'t be able to get it back.'
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.rewardHistoryList.splice(this.rewardHistoryList.indexOf(result.reward), 1);
        this.afs.collection('boards').doc(this.boardId)
        .collection<Reward>('rewardHistoryList').doc(id)
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
    if (this.userPoints >= reward.points) {
      this.transferRewardFrom(reward.id, 'rewardList');
      const user = this.afs.collection('boards').doc(this.boardId)
      .collection('userList').doc(this.userId);
      user.update({points: this.userPoints - reward.points});
      this.snackbarService.openSnack('Reward collected');
    }
  }

  onClickUndoReward(reward: Reward): void {
    this.transferRewardFrom(reward.id, 'rewardHistoryList');
    this.afs.collection('boards').doc(this.boardId)
    .collection<User>('userList').doc(reward.completitorId)
    .ref.get().then(user => {
      if (user.exists) {
        this.afs.collection('boards').doc(this.boardId)
        .collection('userList').doc(reward.completitorId)
        .update({points: user.data().points + reward.points});
      }
    });
    this.snackbarService.openSnack('Reward undone');
  }

  onClickHistory(): void {
    this.historyMode = !this.historyMode;
  }

  onClickClose(): void {
    this.dialogRef.close();
  }

  onDrop(event: CdkDragDrop<string[]>): void {
    if (this.userAccessLevel >= 3) {
      moveItemInArray(event.container.data,
                      event.previousIndex,
                      event.currentIndex);
    } else {
      this.snackbarService.openSnack('Sorry, you cannot reorganize items');
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
      this.afs.collection('boards').doc(this.boardId)
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
      });
    }
  }

  updatePositions(listId: string): void {
    let count = this.rewardList.length;
    let list: Array<Reward>;
    if (listId === 'rewardList') {
      list = this.rewardList;
    } else if (listId === 'rewardHistoryList') {
      list = this.rewardHistoryList;
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

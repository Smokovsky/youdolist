import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BoardUserProviderService } from 'src/app/services/board-user-provider.service';
import { Reward } from 'src/app/models/reward.model';
import { RewardListProviderService } from 'src/app/services/reward-list-provider.service';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { UserOptionsProviderService } from 'src/app/services/user-options-provider.service';
import { SnackBarProviderService } from 'src/app/services/snack-bar-provider.service';
import { EditRewardComponent } from '../edit-reward/edit-reward.component';
import { ConfirmationDialogComponent } from '../shared/confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-reward-list',
  templateUrl: './reward-list.component.html',
  styleUrls: ['./reward-list.component.css']
})
export class RewardListComponent implements OnInit {

  boardUserProviderService: BoardUserProviderService = this.data.boardUserProviderService;
  rewardListProviderService: RewardListProviderService = this.data.rewardListProviderService;
  userOptionsProviderService: UserOptionsProviderService = this.data.userOptionsProviderService;

  userId: string;
  userAccessLevel: number;
  userPoints: number;
  rewardList: Array<Reward>;
  rewardHistoryList: Array<Reward>;
  historyMode = false;


  constructor(public dialog: MatDialog,
              public dialogRef: MatDialogRef<RewardListComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any,
              private snackbarService: SnackBarProviderService) {

    this.boardUserProviderService.getPointsObs().subscribe((points: number) => {
      this.userPoints = points;
    });

    this.boardUserProviderService.getUserAccessLevelObs().subscribe((accessLevel: number) => {
      this.userAccessLevel = accessLevel;
    });

    this.rewardListProviderService.getRewardListObs().subscribe((rewardList: Array<Reward>) => {
      this.rewardList = rewardList;
    });

    this.rewardListProviderService.getRewardHistoryListObs().subscribe((rewardHistoryList: Array<Reward>) => {
      this.rewardHistoryList = rewardHistoryList;
    });

    this.userId = this.boardUserProviderService.getUserId();

  }

  ngOnInit() { }

  onClickAddReward(): void {
    const boardUserProviderService = this.boardUserProviderService;
    const dialogRef = this.dialog.open(EditRewardComponent, {
      data: { boardUserProviderService }
    });
    dialogRef.afterClosed().subscribe(result => {
    if (result && result.action === 'new') {
      this.rewardListProviderService.add(result.reward);
    }});
  }

  onClickRewardSettings(reward: Reward): void {
    const boardUserProviderService = this.boardUserProviderService;
    const dialogRef = this.dialog.open(EditRewardComponent, {
      data: { reward, boardUserProviderService }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result && result.action === 'delete') {
        this.rewardList.splice(this.rewardList.indexOf(result.reward), 1);
        this.snackbarService.openSnack('Reward deleted');
      }
    });
  }

  onClickRewardDelete(i: number): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '350px',
      data: 'Are you sure you want to delete this reward? You won\'t be able to get it back.'
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.rewardList.splice(i, 1);
        this.snackbarService.openSnack('Reward deleted');
      }
    });
  }

  onClickRewardHistoryDelete(i: number): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '350px',
      data: 'Are you sure you want to delete this reward? You won\'t be able to get it back.'
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.rewardHistoryList.splice(i, 1);
        this.snackbarService.openSnack('Reward deleted');
      }
    });
  }

  onClickRewardApprove(i: number): void {
    this.rewardList[i].isApproved = true;
    this.snackbarService.openSnack('Reward approved');
  }

  onClickRewardHistoryApprove(i: number) {
    this.rewardHistoryList[i].isApproved = true;
    this.snackbarService.openSnack('Reward approved');
  }

  onClickGetReward(i: number): void {
    if (this.userPoints >= this.rewardList[i].cost) {
      this.boardUserProviderService.subPoints(this.rewardList[i].cost);
      this.rewardList[i].collected = new Date();
      this.rewardList[i].collectorId = this.userId;
      this.rewardListProviderService.getReward(i);
    }
    this.snackbarService.openSnack('Reward collected');
  }

  onClickUndoReward(i: number): void {
    this.userOptionsProviderService.addUserPoints(this.rewardHistoryList[i].collectorId,
                                                  this.rewardHistoryList[i].cost);
    this.rewardHistoryList[i].collected = null;
    this.rewardHistoryList[i].collectorId = null;
    this.rewardListProviderService.undoReward(i);
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

}

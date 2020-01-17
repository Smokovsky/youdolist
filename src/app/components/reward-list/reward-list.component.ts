import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BoardUserProviderService } from 'src/app/services/board-user-provider.service';
import { Reward } from 'src/app/models/reward.model';
import { RewardListProviderService } from 'src/app/services/reward-list-provider.service';

@Component({
  selector: 'app-reward-list',
  templateUrl: './reward-list.component.html',
  styleUrls: ['./reward-list.component.css']
})
export class RewardListComponent implements OnInit {

  boardUserProviderService: BoardUserProviderService = this.data.boardUserProviderService;
  rewardListProviderService: RewardListProviderService = this.data.rewardListProviderService;

  userId: string;
  userAccessLevel: number;
  points: number;
  rewardList: Array<Reward>;
  rewardHistoryList: Array<Reward>;
  historyMode = false;

  constructor(public dialog: MatDialog,
              public dialogRef: MatDialogRef<RewardListComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) {

    this.boardUserProviderService.getPointsObs().subscribe((points: number) => {
      this.points = points;
    });

    this.boardUserProviderService.getUserAccessLevelObs().subscribe((accessLevel: number) => {
      this.userAccessLevel = accessLevel;
    });

    this.rewardListProviderService.getRewardListObs().subscribe((rewardList: Array<Reward>) => {
      this.rewardList = rewardList;
    });

    this.userId = this.boardUserProviderService.getUserId();

  }

  ngOnInit() { }

  onClickAddReward(): void {

  }

  onClickEditReward(): void {

  }

  onClickDeleteReward(): void {

  }

  onClickApprove(): void {

  }

  onClickGetReward(): void {

  }

  onClickClose(): void {
    this.dialogRef.close();
  }
}

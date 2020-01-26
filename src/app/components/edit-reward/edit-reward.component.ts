import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SnackBarProviderService } from 'src/app/services/snack-bar-provider.service';
import { BoardUserProviderService } from 'src/app/services/board-user-provider.service';
import { Reward } from 'src/app/models/reward.model';
import { ConfirmationDialogComponent } from '../shared/confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-edit-reward',
  templateUrl: './edit-reward.component.html',
  styleUrls: ['./edit-reward.component.css']
})
export class EditRewardComponent implements OnInit {

  boardUserProviderService: BoardUserProviderService = this.data.boardUserProviderService;
  userId: string;
  userAccessLevel: number;

  reward?: Reward = this.data.reward;
  rewardName: string;
  rewardDescription: string;
  rewardCost: number;
  rewardAuthorId: string;
  rewardCreated: Date;
  rewardEditorId?: string;
  rewardEdited?: Date;
  rewardCollectorId?: string;
  rewardCollected?: Date;

  action: string;

  constructor(public dialog: MatDialog,
              public dialogRef: MatDialogRef<EditRewardComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any,
              private snackbarService: SnackBarProviderService) {

    this.boardUserProviderService.getUserAccessLevelObs().subscribe((accessLevel: number) => {
      this.userAccessLevel = accessLevel;
    });

  }

  ngOnInit() {
    this.userId = this.boardUserProviderService.getUserId();

    if (!this.reward) {
      this.reward = new Reward('', 0, false, this.userId);
      this.action = 'new';
    }
    this.rewardName = this.reward.name;
    this.rewardDescription = this.reward.description;
    this.rewardCost = this.reward.cost;
    this.rewardAuthorId = this.reward.authorId;
    this.rewardCreated = this.reward.created;
    this.rewardEditorId = this.reward.editorId;
    this.rewardEdited = this.reward.edited;
    this.rewardCollectorId = this.reward.collectorId;
    this.rewardCollected = this.reward.collected;
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
    if (this.action !== 'new') {
      this.reward.editorId = this.userId;
      this.reward.edited = new Date();
      this.snackbarService.openSnack('Reward saved');
    } else {
      this.snackbarService.openSnack('New reward created');
    }
    if (this.userAccessLevel >= 3) {
      this.reward.isApproved = true;
    }
    this.reward.name = this.rewardName;
    this.reward.description = this.rewardDescription;
    this.reward.cost = this.rewardCost;
    this.dialogRef.close({reward: this.reward, action: this.action});
  }

}

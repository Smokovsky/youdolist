import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Board } from 'src/app/models/board.model';
import { Task } from 'src/app/models/task.model';
import { Category } from 'src/app/models/category.model';
import { User } from 'src/app/models/user.model';
import { Reward } from 'src/app/models/reward.model';
import { SnackBarProviderService } from 'src/app/services/snack-bar-provider.service';

@Component({
  selector: 'app-edit-board',
  templateUrl: './edit-board.component.html',
  styleUrls: ['./edit-board.component.css']
})
export class EditBoardComponent implements OnInit {
  userId: string;

  board?: Board = this.data.board;

  boardName: string;
  isNew = false;
  ownerId: string;

  constructor(public dialog: MatDialog,
              public dialogRef: MatDialogRef<EditBoardComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any,
              private snackbarService: SnackBarProviderService) { }

  ngOnInit() {
    // TODO: get user id from firebase service
    this.userId = 'XQAA';

    if (!this.board) {
      this.isNew = true;
      this.board = {name: '', ownerId: this.userId, guestsId: []};
    }
    this.boardName = this.board.name;
  }

  onClickCancelButton(): void {
    this.dialogRef.close();
  }

  onClickSaveButton(): void {
    this.board.name = this.boardName;
    this.dialogRef.close(this.board);
  }

}

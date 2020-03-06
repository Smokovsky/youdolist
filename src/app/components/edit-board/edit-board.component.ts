import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Board } from 'src/app/models/board.model';
import { SnackBarProviderService } from 'src/app/services/snack-bar-provider.service';

@Component({
  selector: 'app-edit-board',
  templateUrl: './edit-board.component.html',
  styleUrls: ['./edit-board.component.css']
})
export class EditBoardComponent implements OnInit {

  board?: Board = this.data.board;

  boardName: string;
  isNew = false;
  ownerId: string;

  constructor(public dialog: MatDialog,
              public dialogRef: MatDialogRef<EditBoardComponent>,
              private snackbarService: SnackBarProviderService,
              @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
    if (!this.board) {
      this.isNew = true;
      this.board = {name: '', guestsId: []};
    }
    this.boardName = this.board.name;
  }

  onClickCancelButton(): void {
    this.dialogRef.close();
  }

  onClickSaveButton(): void {
    if (this.boardName.length < 150) {
      if (this.boardName !== '') {
        this.board.name = this.boardName;
        this.dialogRef.close(this.board);

      } else {
        this.snackbarService.openSnack('Please enter board name');
      }
    } else {
      this.snackbarService.openSnack('Board name can be maximum 150 characters long');
    }
  }

}

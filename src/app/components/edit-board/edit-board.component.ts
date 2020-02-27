import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Board } from 'src/app/models/board.model';

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
    this.board.name = this.boardName;
    this.dialogRef.close(this.board);
  }

}

import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Board } from 'src/app/models/board.model';
import { Task } from 'src/app/models/task.model';
import { Category } from 'src/app/models/category.model';

@Component({
  selector: 'app-edit-board',
  templateUrl: './edit-board.component.html',
  styleUrls: ['./edit-board.component.css']
})
export class EditBoardComponent implements OnInit {
  userId: string;

  board?: Board = this.data.board;

  boardName: string;
  ownerId: string;
  guestsId: Array<string>;
  // categories: Array<Category>;
  // doneList: Array<Task>;

  constructor(public dialog: MatDialog,
              public dialogRef: MatDialogRef<EditBoardComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
    // TODO: get userId from user service
    this.userId = 'XQAA';
    if (!this.board) {
      this.board = new Board('ABCDEFGH', '', this.userId, new Array<string>(), new Array<Category>(), new Array<Task>());
    }
    this.boardName = this.board.name;
    this.ownerId = this.board.ownerId;
    this.guestsId = this.board.guestsId;
    // this.categories = this.board.categories;
    // this.doneList = this.board.doneList;
  }

  onClickCancelButton(): void {
    this.dialogRef.close();
    delete this.board;
  }

  onClickSaveButton(): void {
    this.board.name = this.boardName;
    this.board.ownerId = this.ownerId;
    this.board.guestsId = this.guestsId;
    this.dialogRef.close(this.board);
  }

}

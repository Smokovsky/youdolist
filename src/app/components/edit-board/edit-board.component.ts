import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Board } from 'src/app/models/board.model';
import { Task } from 'src/app/models/task.model';
import { Category } from 'src/app/models/category.model';
import { User } from 'src/app/models/user.model';

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
  userList: Array<User>;

  constructor(public dialog: MatDialog,
              public dialogRef: MatDialogRef<EditBoardComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
    // TODO: get user id from firebase service
    this.userId = 'XQAA';

    if (!this.board) {
      this.board = new Board('', new Array<User>(new User(this.userId, 4)), new Array<Category>(), new Array<Task>());
    }
    this.boardName = this.board.name;
    this.userList = this.board.userList;
  }

  onClickCancelButton(): void {
    this.dialogRef.close();
    delete this.board;
  }

  onClickSaveButton(): void {
    this.board.name = this.boardName;
    this.board.userList = this.userList;
    this.dialogRef.close(this.board);
  }

}

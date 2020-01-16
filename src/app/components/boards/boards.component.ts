import { Component, OnInit } from '@angular/core';
import { BoardsProviderService } from 'src/app/services/boards-provider.service';
import { Board } from 'src/app/models/board.model';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { EditBoardComponent } from '../edit-board/edit-board.component';
import { ConfirmationDialogComponent } from '../shared/confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-boards',
  templateUrl: './boards.component.html',
  styleUrls: ['./boards.component.css']
})
export class BoardsComponent implements OnInit {

  boardList: Array<Board>;
  userId: string;
  userBoards: Array<Board>;
  friendsBoards: Array<Board>;

  constructor(public dialog: MatDialog,
              private router: Router,
              private boardsProviderService: BoardsProviderService) {

    this.boardsProviderService.getBoardListObs().subscribe((boardList: Array<Board>) => {
      this.boardList = boardList;
    });
  }

  ngOnInit() {
    // TODO: get user id from firebase service
    this.userId = 'XQAA';

    this.findUserBoards();
  }

  findUserBoards(): void {
    this.userBoards = new Array<Board>();
    this.friendsBoards = new Array<Board>();
    this.boardList.forEach(board => {
      for (let i = 0, len = board.userList.length; i < len; i++) {
        if (board.userList[i].id === this.userId) {
          if (board.userList[i].accessLevel === 4) {
            this.userBoards.push(board);
            break;
          } else {
            this.friendsBoards.push(board);
            break;
          }
        }
      }
    });
  }

  onClickBoard(board: Board): void {
    this.router.navigate(['/board', board.id]);
  }

  onClickNewBoard(): void {
    const dialogRef = this.dialog.open(EditBoardComponent, {
      data: { }
    });
    dialogRef.afterClosed().subscribe((result: Board) => {
      if (result) {
        this.boardsProviderService.addBoard(result);
        this.findUserBoards();
      }
    });
  }

  onClickDelete(id: string): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '350px',
      data: 'Are you sure you want to delete this board? You won\'t be able to get it back.'
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.boardsProviderService.deleteBoard(id);
        this.findUserBoards();
      }
    });
  }

  onClickEdit(board: Board): void {
    this.dialog.open(EditBoardComponent, {
      data: { board }
    });
  }

}

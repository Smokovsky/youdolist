import { Component, OnInit } from '@angular/core';
import { BoardsProviderService } from 'src/app/services/boards-provider.service';
import { Board } from 'src/app/models/board.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-boards',
  templateUrl: './boards.component.html',
  styleUrls: ['./boards.component.css']
})
export class BoardsComponent implements OnInit {

  boardList: Array<Board>;

  constructor(private router: Router, private boardsProviderService: BoardsProviderService) {
    this.boardsProviderService.getBoardListObs().subscribe((boardList: Array<Board>) => {
      this.boardList = boardList;
    });
  }

  ngOnInit() {
  }

  onClickBoard(board: Board) {
    this.router.navigate(['/board', board.id]);
  }
  onClickNewBoard() {
    console.log('New board clicked');
  }
}

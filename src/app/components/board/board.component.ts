import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BoardsProviderService } from 'src/app/services/boards-provider.service';
import { Board } from 'src/app/models/board.model';
import { CategoryProviderService } from 'src/app/services/category-provider.service';
import { DoneTasksProviderService } from 'src/app/services/done-tasks-provider.service';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.css']
})
export class BoardComponent implements OnInit {

  public boardId: string;
  private boardList: Array<Board>;
  private board: Board; // not very useful

  constructor(private router: Router,
              private activatedRoute: ActivatedRoute,
              private boardsProviderService: BoardsProviderService,
              private categoryProviderService: CategoryProviderService,
              private doneTasksProviderService: DoneTasksProviderService) {
                this.boardsProviderService.getBoardListObs().subscribe((boardList: Array<Board>) => {
                  this.boardList = boardList;
                });
              }

  ngOnInit() {
    this.boardId = this.activatedRoute.snapshot.paramMap.get('id');
    for (const board of this.boardList) {
      if ( board.id === this.boardId ) {
        this.board = board;
        this.categoryProviderService.setCategoryList(this.boardId);
        this.doneTasksProviderService.setDoneList(this.boardId);
      }
    }
    if (!this.board) {
      this.router.navigate(['/not-found']);
    }
  }

}

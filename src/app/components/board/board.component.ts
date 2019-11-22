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

  private boardId: string;
  private userId: string;
  private boardList: Array<Board>;
  private boardSet = false;

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
    this.userId = 'XQAA';
    this.boardId = this.activatedRoute.snapshot.paramMap.get('id');

    for (const board of this.boardList) {
      if ( board.id === this.boardId && (board.ownerId === this.userId || board.guestsId.includes(this.userId))) {
        this.boardSet = true;
        this.categoryProviderService.setCategoryList(this.boardId);
        this.doneTasksProviderService.setDoneList(this.boardId);
      }
    }
    if (!this.boardSet) {
      this.router.navigate(['/not-found']);
    }
  }

}

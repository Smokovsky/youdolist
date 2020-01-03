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

  boardId: string;
  userId: string;
  boardList: Array<Board>;
  boardExist = false;
  boardAuth = false;
  isAdmin = false;

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
    // TODO: get userId from user service
    this.userId = 'XQAA';
    this.boardId = this.activatedRoute.snapshot.paramMap.get('id');

    for (const board of this.boardList) {
      if ( board.id === this.boardId) {
        this.boardExist = true;
        if (board.ownerId === this.userId) {
          this.isAdmin = true;
          this.loadBoard();
        } else if (board.guestsId.includes(this.userId)) {
          this.loadBoard();
        } else {
          this.router.navigate(['/access-denied']);
        }
      }
    }
    if (!this.boardAuth) {
      if (this.boardExist) {
        this.router.navigate(['/access-denied']);
      } else {
      this.router.navigate(['/not-found']);
      }
    }
  }

  loadBoard(): void {
    this.boardAuth = true;
    this.categoryProviderService.setCategoryList(this.boardId);
    this.doneTasksProviderService.setDoneList(this.boardId);
    // TODO: setRewardList();
  }
}

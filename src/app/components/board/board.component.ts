import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BoardsProviderService } from 'src/app/services/boards-provider.service';
import { Board } from 'src/app/models/board.model';
import { CategoryListProviderService } from 'src/app/services/category-list-provider.service';
import { DoneTasksProviderService } from 'src/app/services/done-tasks-provider.service';
import { BoardUserProviderService } from 'src/app/services/board-user-provider.service';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.css'],
  providers: [CategoryListProviderService,
              DoneTasksProviderService,
              BoardUserProviderService]
})
export class BoardComponent implements OnInit {

  boardId: string;
  userId: string;
  boardList: Array<Board>;
  boardExist = false;
  boardAuth = false;
  isAdmin = false;
  userPoints: number;

  constructor(private router: Router,
              private activatedRoute: ActivatedRoute,
              private boardsProviderService: BoardsProviderService,
              private categoryListProviderService: CategoryListProviderService,
              private doneTasksProviderService: DoneTasksProviderService,
              private boardUserProviderService: BoardUserProviderService) {

    this.boardsProviderService.getBoardListObs().subscribe((boardList: Array<Board>) => {
      this.boardList = boardList;
    });

    this.boardUserProviderService.getPointsObs().subscribe((userPoints: number) => {
      this.userPoints = userPoints;
    });

  }

  ngOnInit() {
    this.userId = this.boardUserProviderService.getUserId();
    this.boardId = this.activatedRoute.snapshot.paramMap.get('id');

    this.boardList.forEach(board => {
      if ( board.id === this.boardId) {
        this.boardExist = true;
        if (board.ownerId === this.userId) {
          this.isAdmin = true;
          this.loadBoard();
        } else {
          board.userList.forEach(user => {
            if (user.id === this.userId) {
              this.loadBoard();
            }
          });
        }
      }
    });

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
    this.categoryListProviderService.setCategoryList(this.boardId);
    this.doneTasksProviderService.setDoneList(this.boardId);
    // TODO: setRewardList();
  }
}

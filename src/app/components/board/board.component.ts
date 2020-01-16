import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BoardsProviderService } from 'src/app/services/boards-provider.service';
import { Board } from 'src/app/models/board.model';
import { CategoryListProviderService } from 'src/app/services/category-list-provider.service';
import { DoneTasksProviderService } from 'src/app/services/done-tasks-provider.service';
import { BoardUserProviderService } from 'src/app/services/board-user-provider.service';
import { UserOptionsComponent } from '../user-options/user-options.component';
import { MatDialog } from '@angular/material/dialog';
import { UserOptionsProviderService } from 'src/app/services/user-options-provider.service';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.css'],
  providers: [CategoryListProviderService,
              DoneTasksProviderService,
              BoardUserProviderService,
              UserOptionsProviderService]
})
export class BoardComponent implements OnInit {
  // private categoryListProviderService: CategoryListProviderService;

  boardId: string;
  userId: string;
  boardExist = false;
  boardAuth = false;
  userAccessLevel: number;
  userPoints: number;

  constructor(public dialog: MatDialog,
              private router: Router,
              private activatedRoute: ActivatedRoute,
              private boardsProviderService: BoardsProviderService,
              private doneTasksProviderService: DoneTasksProviderService,
              private boardUserProviderService: BoardUserProviderService,
              private categoryListProviderService: CategoryListProviderService,
              private userOptionsProviderService: UserOptionsProviderService) {

    this.boardUserProviderService.getPointsObs().subscribe((userPoints: number) => {
      this.userPoints = userPoints;
    });

    this.boardUserProviderService.getUserAccessLevelObs().subscribe((accessLevel: number) => {
      this.userAccessLevel = accessLevel;
    });

  }

  ngOnInit() {
    this.userId = this.boardUserProviderService.getUserId();
    this.boardId = this.activatedRoute.snapshot.paramMap.get('id');
    // this.categoryListProviderService = new CategoryListProviderService(this.boardsProviderService, this.boardId);

    // TODO: This (from here) sould be rerunned when admin is doing changes to userList
    // aswell as user points nextObs should be provided with each points action
    if (this.boardsProviderService.getBoard(this.boardId)) {
      this.boardExist = true;
      const userList = this.boardsProviderService.getBoard(this.boardId).userList;
      for (let i = 0, len = userList.length; i < len; i++) {
        if (userList[i].id === this.userId) {
          this.loadBoard();
          break;
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

  onClickUserOptions(): void {
    const userOptionsProviderService = this.userOptionsProviderService;
    this.dialog.open(UserOptionsComponent, {
      data: {userOptionsProviderService}
    });
  }

  onClickRewardList(): void {
    // TODO
  }

  loadBoard(): void {
    this.boardAuth = true;
    this.categoryListProviderService.setCategoryList(this.boardId);
    this.doneTasksProviderService.setDoneList(this.boardId);
    this.userOptionsProviderService.setUserList(this.boardId);
    // TODO: setRewardList();
  }
}

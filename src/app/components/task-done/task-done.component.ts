import { Component, OnInit, Input } from '@angular/core';
import { EditTaskComponent } from '../edit-task/edit-task.component';
import { MatDialog } from '@angular/material/dialog';
import { Task } from 'src/app/models/task.model';
import { DoneTasksProviderService } from 'src/app/services/done-tasks-provider.service';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Category } from 'src/app/models/category.model';
import { CategoryListProviderService } from 'src/app/services/category-list-provider.service';
import { BoardUserProviderService } from 'src/app/services/board-user-provider.service';
import { UndoOptionsComponent } from '../undo-options/undo-options.component';
import { UserOptionsProviderService } from 'src/app/services/user-options-provider.service';

@Component({
  selector: 'app-task-done',
  templateUrl: './task-done.component.html',
  styleUrls: ['./task-done.component.css']
})
export class TaskDoneComponent implements OnInit {

  userId: string;
  userAccessLevel: number;

  @Input()
  taskList: Array<Task>;
  @Input()
  categoryId: string;

  categoryIds = new Array<string>('cdk-task-drop-list-doneTaskList');
  doneTasksList: Array<Task>;

  constructor(public dialog: MatDialog,
              private categoryListProviderService: CategoryListProviderService,
              private doneTasksProviderService: DoneTasksProviderService,
              private boardUserProviderService: BoardUserProviderService,
              private userOptionsProviderService: UserOptionsProviderService) {

    // TODO: get userId from user service
    this.doneTasksProviderService.getDoneTasksObs().subscribe((doneTasks: Array<Task>) => {
      this.doneTasksList = doneTasks;
    });

    this.categoryListProviderService.getCategoryListObs().subscribe((categoryList: Array<Category>) => {
      if (categoryList) {
        categoryList.forEach(category => {
          this.categoryIds.push('cdk-task-drop-list-' + category.id);
        });
      }
    });

    this.boardUserProviderService.getUserAccessLevelObs().subscribe((accessLevel: number) => {
      this.userAccessLevel = accessLevel;
    });

    this.userId = this.boardUserProviderService.getUserId();

  }

  ngOnInit() {  }

  onClickTaskUndo(i: number): void {
    if (this.taskList[i].completitorId === this.userId || this.userAccessLevel >= 3) {
      const previousCategory: string = this.taskList[i].categoryId;

      if (this.userAccessLevel >= 3) {
        const task = this.taskList[i];
        const dialogRef = this.dialog.open(UndoOptionsComponent, {
          data: { task }
        });
        dialogRef.afterClosed().subscribe(result => {
          if (result) {
            const completitorId = this.taskList[i].completitorId;
            const completitionDate = this.taskList[i].completitionDate;
            const points = this.taskList[i].points;
            this.taskList[i].completitorId = null;
            this.taskList[i].completitionDate = null;
            if (this.categoryListProviderService.addTaskToCategory(this.taskList[i], previousCategory)) {
              if (result === 'changePoints') {
                this.userOptionsProviderService.substractUserPoints(completitorId,
                                                                    points);
              }
              this.taskList.splice(i, 1);
            } else {
              this.taskList[i].completitorId = completitorId;
              this.taskList[i].completitionDate = completitionDate;
            }
          }
        });
      } else {
        this.taskList[i].isApproved = true;
        if (this.categoryListProviderService.addTaskToCategory(this.taskList[i], previousCategory)) {
          this.taskList.splice(i, 1);
        } else {
          this.taskList[i].isApproved = false;
        }
      }
    }
  }

  onClickTaskSettings(task: Task): void {
    const boardUserProviderService = this.boardUserProviderService;
    const dialogRef = this.dialog.open(EditTaskComponent, {
      data: { task, boardUserProviderService }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result && result.action === 'delete') {
        this.taskList.splice(this.taskList.indexOf(result.task), 1);
      }
    });
  }

  onClickApprove(i: number): void {
    this.taskList[i].isApproved = true;
    this.userOptionsProviderService.addUserPoints(this.taskList[i].completitorId, this.taskList[i].points);
  }

  onClickUnapprovedTaskUndo(i: number): void {
    const previousCategory: string = this.taskList[i].categoryId;
    this.taskList[i].isApproved = true;
    if (this.categoryListProviderService.addTaskToCategory(this.taskList[i], previousCategory)) {
      this.taskList.splice(i, 1);
    } else {
      this.taskList[i].isApproved = false;
    }
  }

  onClickUnapprovedTaskDelete(i: number): void {
    this.taskList.splice(i, 1);
  }

  onDrop(event: CdkDragDrop<string[]>): void {
    if (event.previousContainer === event.container) {
      if (this.userAccessLevel >= 3) {
      moveItemInArray(event.container.data,
                      event.previousIndex,
                      event.currentIndex);
      }
    } else {
      const task: any = event.previousContainer.data[event.previousIndex];
      if (task.isApproved) {
        transferArrayItem(event.previousContainer.data,
          event.container.data,
          event.previousIndex,
          event.currentIndex);
        if (this.userAccessLevel < 3) {
          this.taskList[event.currentIndex].isApproved = false;
        } else {
          this.userOptionsProviderService.addUserPoints(this.userId, this.taskList[event.currentIndex].points);
        }
        this.taskList[event.currentIndex].completitionDate = new Date();
        this.taskList[event.currentIndex].completitorId = this.userId;
      }
    }
  }

}

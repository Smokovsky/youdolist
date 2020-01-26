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
import { SnackBarProviderService } from 'src/app/services/snack-bar-provider.service';
import { ConfirmationDialogComponent } from '../shared/confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.css']
})
export class TaskComponent implements OnInit {
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
              private userOptionsProviderService: UserOptionsProviderService,
              private snackbarService: SnackBarProviderService) {

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

  onClickTaskApprove(i: number): void {
    this.taskList[i].isApproved = true;
    this.snackbarService.openSnack('Task approved');
  }

  onClickTaskDelete(i: number): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '350px',
      data: 'Are you sure you want to delete this task? You won\'t be able to get it back.'
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.taskList.splice(i, 1);
        this.snackbarService.openSnack('Task deleted');
      }
    });
  }

  onClickTaskDone(i: number): void {
    if (this.userAccessLevel < 3) {
      this.taskList[i].isApproved = false;
    } else {
      this.userOptionsProviderService.addUserPoints(this.userId, this.taskList[i].points);
    }
    this.taskList[i].completitorId = this.userId;
    this.taskList[i].completitionDate = new Date();
    this.doneTasksProviderService.add(this.taskList[i]);
    this.taskList.splice(i, 1);
    this.snackbarService.openSnack('Task completed');
  }

  onClickTaskSettings(task: Task): void {
    const boardUserProviderService = this.boardUserProviderService;
    const dialogRef = this.dialog.open(EditTaskComponent, {
      data: { task, boardUserProviderService }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result && result.action === 'delete') {
        this.taskList.splice(this.taskList.indexOf(result.task), 1);
        this.snackbarService.openSnack('Task deleted');
      }
    });
  }

  onDrop(event: CdkDragDrop<string[]>): void {
    // Case undoing task
    if (event.previousContainer.id === 'cdk-task-drop-list-doneTaskList') {
      if (this.boardUserProviderService.getUserAccessLevel() >= 3) {
        const task: any = event.previousContainer.data[0];
        if (task.isApproved) {
          const dialogRef = this.dialog.open(UndoOptionsComponent, {
            data: { task }
          });
          dialogRef.afterClosed().subscribe(result => {
              if (result === 'changePoints' || result === 'leavePoints') {
                transferArrayItem(event.previousContainer.data,
                                  event.container.data,
                                  event.previousIndex,
                                  event.currentIndex);
                this.taskList[event.currentIndex].isApproved = true;
                if (result === 'changePoints') {
                  this.userOptionsProviderService.substractUserPoints(this.taskList[event.currentIndex].completitorId,
                                                                      this.taskList[event.currentIndex].points);
                }
                this.taskList[event.currentIndex].completitionDate = null;
                this.taskList[event.currentIndex].completitorId = null;
                this.taskList[event.currentIndex].categoryId = this.categoryId;
                this.snackbarService.openSnack('Task undone');
              }
            });
        } else {
          transferArrayItem(event.previousContainer.data,
                            event.container.data,
                            event.previousIndex,
                            event.currentIndex);
          this.taskList[event.currentIndex].isApproved = true;
          this.taskList[event.currentIndex].completitionDate = null;
          this.taskList[event.currentIndex].completitorId = null;
          this.taskList[event.currentIndex].categoryId = this.categoryId;
          this.snackbarService.openSnack('Task undone');
        }
      } else {
        const task: any = event.previousContainer.data[event.previousIndex];
        if (!task.isApproved && task.categoryId === this.categoryId && task.completitorId === this.userId) {
          transferArrayItem(event.previousContainer.data,
                            event.container.data,
                            event.previousIndex,
                            event.currentIndex);
          this.taskList[event.currentIndex].completitionDate = null;
          this.taskList[event.currentIndex].completitorId = null;
          this.taskList[event.currentIndex].isApproved = true;
          this.snackbarService.openSnack('Task undone');
        } else {
          this.snackbarService.openSnack('You cannot undo this task');
        }
      }

    // Case position in category change
    } else if (event.previousContainer === event.container) {
      if (this.userAccessLevel >= 3) {
        moveItemInArray(event.container.data,
                        event.previousIndex,
                        event.currentIndex);
      } else {
        this.snackbarService.openSnack('You cannot reorganize items');
      }

    // Case category change
    } else {
      if (this.userAccessLevel >= 3) {
        transferArrayItem(event.previousContainer.data,
                          event.container.data,
                          event.previousIndex,
                          event.currentIndex);
        this.taskList[event.currentIndex].categoryId = this.categoryId;
      } else {
        this.snackbarService.openSnack('You cannot reorganize items');
      }
    }
  }

}

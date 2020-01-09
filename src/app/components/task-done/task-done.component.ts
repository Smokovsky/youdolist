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

@Component({
  selector: 'app-task-done',
  templateUrl: './task-done.component.html',
  styleUrls: ['./task-done.component.css']
})
export class TaskDoneComponent implements OnInit {

  userId: string;

  @Input()
  taskList: Array<Task>;
  @Input()
  categoryId: string;

  categoryIds = new Array<string>('cdk-task-drop-list-doneTaskList');
  doneTasksList: Array<Task>;

  constructor(public dialog: MatDialog,
              private categoryListProviderService: CategoryListProviderService,
              private doneTasksProviderService: DoneTasksProviderService,
              private boardUserProviderService: BoardUserProviderService) {

    // TODO: get userId from user service
    this.userId = this.boardUserProviderService.getUserId();

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

  }

  ngOnInit() {  }

  onClickTaskUndo(i: number): void {
    if (this.taskList[i].completitorId === this.userId || this.boardUserProviderService.isAdmin()) {
      const previousCategory: string = this.taskList[i].categoryId;

      if (this.boardUserProviderService.isAdmin()) {
        const task = this.taskList[i];
        const dialogRef = this.dialog.open(UndoOptionsComponent, {
          data: { task }
        });
        dialogRef.afterClosed().subscribe(result => {
          if (result) {
            if (this.categoryListProviderService.addTaskToCategory(this.taskList[i], previousCategory)) {
              if (result === 'changePoints') {
                // TODO: Substract user points using points manipulation service
                this.boardUserProviderService.subPoints(this.taskList[i].points);
              }
              this.taskList.splice(i, 1);
            }
          }
        });
      } else {
        if (this.categoryListProviderService.addTaskToCategory(this.taskList[i], previousCategory)) {
          this.boardUserProviderService.subPoints(this.taskList[i].points);
          this.taskList.splice(i, 1);
        }
      }
    }
  }

  onClickTaskSettings(task: Task): void {
    const dialogRef = this.dialog.open(EditTaskComponent, {
      data: { task }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result && result.action === 'delete') {
        this.taskList.splice(this.taskList.indexOf(result.task), 1);
      }
    });
  }

  onDrop(event: CdkDragDrop<string[]>): void {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data,
                      event.previousIndex,
                      event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data,
                        event.container.data,
                        event.previousIndex,
                        event.currentIndex);
      this.taskList[event.currentIndex].completitionDate = new Date();
      this.taskList[event.currentIndex].completitorId = this.userId;
      this.boardUserProviderService.addPoints(this.taskList[event.currentIndex].points);
    }
  }

}

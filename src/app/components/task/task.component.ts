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
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.css']
})
export class TaskComponent implements OnInit {

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

  onClickTaskDone(i: number): void {
    this.doneTasksProviderService.add(this.taskList[i]);
    this.boardUserProviderService.addPoints(this.taskList[i].points);
    this.taskList.splice(i, 1);
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
    // Case undoing task
    if (event.previousContainer.id === 'cdk-task-drop-list-doneTaskList') {
      if (this.boardUserProviderService.isAdmin()) {
        const task = event.previousContainer.data[0];
        const dialogRef = this.dialog.open(UndoOptionsComponent, {
          data: { task }
        });
        dialogRef.afterClosed().subscribe(result => {
            if (result) {
              transferArrayItem(event.previousContainer.data,
                event.container.data,
                event.previousIndex,
                event.currentIndex);
              if (result === 'changePoints') {
                // TODO: Substract user points using points manipulation service
                this.boardUserProviderService.subPoints(this.taskList[event.currentIndex].points);
              }
            }
          });
      } else {
        transferArrayItem(event.previousContainer.data,
                          event.container.data,
                          event.previousIndex,
                          event.currentIndex);
        this.boardUserProviderService.subPoints(this.taskList[event.currentIndex].points);
      }

    // Case position in category change
    } else if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data,
                      event.previousIndex,
                      event.currentIndex);

    // Case category change
    } else {
      transferArrayItem(event.previousContainer.data,
                        event.container.data,
                        event.previousIndex,
                        event.currentIndex);
      this.taskList[event.currentIndex].categoryId = this.categoryId;
    }
  }

}

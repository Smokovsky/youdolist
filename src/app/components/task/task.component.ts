import { Component, OnInit, Input } from '@angular/core';
import { EditTaskComponent } from '../edit-task/edit-task.component';
import { MatDialog } from '@angular/material/dialog';
import { Task } from 'src/app/models/task.model';
import { DoneTasksProviderService } from 'src/app/services/done-tasks-provider.service';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Category } from 'src/app/models/category.model';
import { CategoryProviderService } from 'src/app/services/category-provider.service';

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

  categoryIds = new Array<string>();
  doneTasksList: Array<Task>;

  constructor(public dialog: MatDialog,
              private categoryProviderService: CategoryProviderService,
              private doneTasksProviderService: DoneTasksProviderService) {
                this.categoryIds.push('cdk-drop-list-9999');
                this.doneTasksProviderService.getDoneTasksObs().subscribe((doneTasks: Array<Task>) => {
                  this.doneTasksList = doneTasks;
                });
                this.categoryProviderService.getCategoryListObs().subscribe((categoryList: Array<Category>) => {
                  if (categoryList) {
                    categoryList.forEach(category => {
                      this.categoryIds.push('cdk-drop-list-' + category.id);
                    });
                 }
                });
              }

  ngOnInit() { }

  onClickTaskDone(i: number) {
    this.doneTasksProviderService.add(this.taskList[i]);
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

  // onClickTaskDelete(i: number): void {
  //   const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
  //     width: '350px',
  //     data: 'Are you sure you want to delete this task? You won\'t be able to get it back.'
  //   });
  //   dialogRef.afterClosed().subscribe(result => {
  //     if (result) {
  //       this.taskList.splice(i, 1);
  //     }
  //   });
  // }

  onDrop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data,
                        event.container.data,
                        event.previousIndex,
                        event.currentIndex);
      // TODO: nie zmieniać id wszystkich tasków, tylko tego co został upuszczony
      if (this.categoryId.toString() !== '9999') {
        this.taskList.forEach(task => {
          task.categoryId = this.categoryId;
        });
      }
    }
  }

}

import { Component, OnInit, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { EditTaskComponent } from '../edit-task/edit-task.component';
import { Category } from 'src/app/models/category.model';
import { Task } from 'src/app/models/task.model';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css']
})
export class CategoryComponent implements OnInit {

  @Input()
  categories: Array<Category>;

  newCategoryFieldActive = false;
  newCategoryName: string;

  constructor(public dialog: MatDialog) { }

  ngOnInit() {}

  onClickAddNewTask(category: Category): void {
    const dialogRef = this.dialog.open(EditTaskComponent, {
      data: { }
    });
    dialogRef.afterClosed().subscribe(task => {
      if (task) {
        category.taskList.push(task);
      }
    });
  }

  onClickAddNewCategory() {
    this.newCategoryFieldActive = true;
  }

  onClickSubmitNewCategory() {
    this.newCategoryFieldActive = false;
    this.categories.push(new Category(this.newCategoryName, Array<Task>()));
    this.newCategoryName = '';
  }

  onClickCancelNewCategory() {
    this.newCategoryFieldActive = false;
    this.newCategoryName = '';
  }

  onClickDeleteCategory(i: number) {
    this.categories.splice(i);
  }

}

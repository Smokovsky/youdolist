import { Component, OnInit, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { EditTaskComponent } from '../edit-task/edit-task.component';
import { Category } from 'src/app/models/category.model';
import { CategoryProviderService } from 'src/app/services/category-provider.service';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css']
})
export class CategoryComponent implements OnInit {
  categoryList: Array<Category>;
  editCategoryName: string;
  editCategoryIdActive = -1;
  tempNewCategoryName: string;

  constructor(public dialog: MatDialog,
              private categoryProviderService: CategoryProviderService) {
                this.categoryProviderService.getCategoryListObs().subscribe((categories: Array<Category>) => {
                  this.categoryList = categories;
                });
  }

  ngOnInit() {  }

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

  onClickDeleteCategory(i: number) {
    this.categoryProviderService.remove(i);
  }

  onClickEditCategory(i: number) {
    this.tempNewCategoryName = this.categoryList[i].name;
    this.editCategoryIdActive = i;
  }

  onClickSubmitEditCategory(i: number) {
    this.categoryList[i].name = this.tempNewCategoryName;
    this.editCategoryIdActive = -1;
  }

  onClickCancelEditCategory() {
    this.editCategoryIdActive = -1;
  }

}

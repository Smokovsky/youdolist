import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { EditTaskComponent } from '../edit-task/edit-task.component';
import { Category } from 'src/app/models/category.model';
import { CategoryListProviderService } from 'src/app/services/category-list-provider.service';
import { ConfirmationDialogComponent } from '../shared/confirmation-dialog/confirmation-dialog.component';

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
              private categoryListProviderService: CategoryListProviderService) {

    this.categoryListProviderService.getCategoryListObs().subscribe((categories: Array<Category>) => {
      this.categoryList = categories;
    });

  }

  ngOnInit() {  }

  onClickDelete(i: number): void {
  const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '350px',
      data: 'Are you sure you want to delete this category with all tasks? You won\'t be able to get it back.'
    });
  dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.categoryListProviderService.remove(i);
      }
    });
  }

  onClickEdit(i: number): void {
    this.tempNewCategoryName = this.categoryList[i].name;
    this.editCategoryIdActive = i;
  }

  onClickSubmitEdit(i: number): void {
    this.categoryList[i].name = this.tempNewCategoryName;
    this.editCategoryIdActive = -1;
  }

  onClickCancelEdit(): void {
    this.editCategoryIdActive = -1;
  }

  onClickAddNewTask(category: Category): void {
    const dialogRef = this.dialog.open(EditTaskComponent, {
      data: { }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result && result.action === 'new') {
        result.task.categoryId = category.id;
        category.taskList.unshift(result.task);
      }
    });
  }

}

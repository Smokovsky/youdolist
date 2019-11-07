import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { EditTaskComponent } from '../edit-task/edit-task.component';
import { Category } from 'src/app/models/category.model';
import { CategoryProviderService } from 'src/app/services/category-provider.service';
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
              private categoryProviderService: CategoryProviderService) {
                this.categoryProviderService.getCategoryListObs().subscribe((categories: Array<Category>) => {
                  this.categoryList = categories;
                });
  }

  ngOnInit() {  }

  onClickDelete(i: number) {
  const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '350px',
      data: 'Are you sure you want to delete this category with all tasks? You won\'t be able to get it back.'
    });
  dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.categoryProviderService.remove(i);
      }
    });
  }

  onClickEdit(i: number) {
    this.tempNewCategoryName = this.categoryList[i].name;
    this.editCategoryIdActive = i;
  }

  onClickSubmitEdit(i: number) {
    this.categoryList[i].name = this.tempNewCategoryName;
    this.editCategoryIdActive = -1;
  }

  onClickCancelEdit() {
    this.editCategoryIdActive = -1;
  }

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

}

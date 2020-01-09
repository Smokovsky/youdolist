import { Component, OnInit } from '@angular/core';
import { CategoryListProviderService } from 'src/app/services/category-list-provider.service';
import { Category } from 'src/app/models/category.model';
import { Task } from 'src/app/models/task.model';

@Component({
  selector: 'app-new-category',
  templateUrl: './new-category.component.html',
  styleUrls: ['./new-category.component.css']
})
export class NewCategoryComponent implements OnInit {

  categoryList = Array<Category>();
  newCategoryFieldActive = false;
  newCategoryName: string;

  constructor(private categoryListProviderService: CategoryListProviderService) {

    this.categoryListProviderService.getCategoryListObs().subscribe((categories: Array<Category>) => {
      this.categoryList = categories;
    });

  }

  ngOnInit() { }

  onClickAddNewCategory(): void {
    this.newCategoryFieldActive = true;
  }

  onClickSubmitNewCategory(): void {
    this.newCategoryFieldActive = false;
    this.categoryListProviderService.add(new Category(this.newCategoryName, new Array<Task>()));
    this.newCategoryName = '';
  }

  onClickCancelNewCategory(): void {
    this.newCategoryFieldActive = false;
    this.newCategoryName = '';
  }

}

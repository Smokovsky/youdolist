import { Component, OnInit } from '@angular/core';
import { CategoryProviderService } from 'src/app/services/category-provider.service';
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

  constructor(private categoryProviderService: CategoryProviderService) {
    this.categoryProviderService.getCategoryListObs().subscribe((categories: Array<Category>) => {
      this.categoryList = categories;
    });
  }

  ngOnInit() {
  }

  onClickAddNewCategory() {
    this.newCategoryFieldActive = true;
  }

  onClickSubmitNewCategory() {
    this.newCategoryFieldActive = false;
    this.categoryProviderService.add(new Category(this.newCategoryName, Array<Task>()));
    this.newCategoryName = '';
  }

  onClickCancelNewCategory() {
    this.newCategoryFieldActive = false;
    this.newCategoryName = '';
  }

}

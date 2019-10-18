import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css']
})
export class CategoryComponent implements OnInit {

  @Input()
  categories;

  constructor() { }

  ngOnInit() {}

  onClickCategoryOptions(category) {
    console.log('Category "' + category.name + '" options clicked!');
  }
  onClickAddNewTask() {
    console.log('Add new task clicked!');
  }

}

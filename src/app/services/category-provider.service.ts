import { Injectable } from '@angular/core';
import { Category } from '../models/category.model';
import { Task } from '../models/task.model';
import { Todo } from '../models/todo.model';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CategoryProviderService {

  categoryList: Array<Category>;
  doneList: Array<Task>;

  categoryListObs = new BehaviorSubject<Array<Category>>(this.categoryList);
  doneListObs = new BehaviorSubject<Array<Task>>(this.doneList);

  constructor() {
    /* Example data */
    this.categoryList = new Array<Category>(
      new Category('Obowiązki domowe', new Array<Task>(
        new Task('Pozamiatać dom',
          new Array<Todo>(
            new Todo('duży pokój'),
            new Todo('kuchnia'),
            new Todo('łazienka')),
              'Byle dokładnie!'),
        new Task('Zapłacić rachunki',
          new Array<Todo>(
            new Todo('czynsz'),
            new Todo('internet'))),
        new Task('Wynieść śmieci', new Array<Todo>()))),
      new Category('Praca', new Array<Task>(
        new Task('Napisać raport',
          Array<Todo>(
            new Todo('zgromadzić paragony'),
            new Todo('podsumować wydatki'),
            new Todo('porozmawiać z Bartkiem'),
            new Todo('podpisać dokumenty')),
              'Raport z delegacji w Chorwacji 27/10/19'
            )))
    );
    this.categoryListObs.next(this.categoryList);
  }

  getCategoryListObs(): Observable<Array<Category>> {
    return this.categoryListObs.asObservable();
  }

  add(category: Category) {
    this.categoryList.push(category);
    this.categoryListObs.next(this.categoryList);
  }

  remove(i: number) {
    this.categoryList.splice(i, 1);
    this.categoryListObs.next(this.categoryList);
  }

}

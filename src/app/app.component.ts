import { Component, Output } from '@angular/core';
import { Category } from './models/category.model';
import { Task } from './models/task.model';
import { Todo } from './models/todo.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'youdolist';

  /* Example data */
  categoryList = [new Category('Obowiązki domowe', new Array<Task>(
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
                ];
}

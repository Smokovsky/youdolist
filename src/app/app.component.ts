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
                    new Task('Pozamiatać', 'tylko dokładnie!',
                      Array<Todo>(
                        new Todo('duży pokój'),
                        new Todo('kuchnia'))),
                    new Task('Wynieść śmieci'))),

                  new Category('Praca', new Array<Task>(new Task('Napisać raport', 'raport generalny z delegacji',
                  Array<Todo>(new Todo('podsumować wydatki'), new Todo('podpisać papiery'), new Todo('podpisać listy')))))
                ];
}

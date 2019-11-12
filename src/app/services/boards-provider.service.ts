import { Injectable } from '@angular/core';
import { Board } from '../models/board.model';
import { Category } from '../models/category.model';
import { Task } from '../models/task.model';
import { Todo } from '../models/todo.model';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BoardsProviderService {

  boardList = Array<Board>();

  boardListObs = new BehaviorSubject<Array<Board>>(this.boardList);

  /*  example data   */
  id: string;
  name: string;
  ownerId: string;
  guestsId: Array<string>;
  categoryList: Array<Category>;
  doneList: Array<Task>;

  constructor() {
    /*  example data   */
    this.id = 'xyz';
    this.name = 'Board one';
    this.ownerId = 'abc';
    this.guestsId = [];
    this.categoryList = new Array<Category>(
      new Category('Obowiązki domowe', new Array<Task>(
        new Task('Pozamiatać dom',
          new Array<Todo>(
            new Todo('duży pokój'),
            new Todo('kuchnia'),
            new Todo('łazienka')),
              'Byle dokładnie!',
              new Date('Dec 20, 2019')),
        new Task('Zapłacić rachunki',
          new Array<Todo>(
            new Todo('czynsz'),
            new Todo('internet')),
              '', new Date('Nov 10, 2019')),
        new Task('Wynieść śmieci', new Array<Todo>()
        ))),
      new Category('Praca', new Array<Task>(
        new Task('Napisać raport',
          Array<Todo>(
            new Todo('zgromadzić paragony'),
            new Todo('podsumować wydatki'),
            new Todo('porozmawiać z Bartkiem'),
            new Todo('podpisać dokumenty')),
              'Raport z delegacji w Chorwacji 27/10/19',
              new Date('Jan 1, 2020')
            )))
    );
    this.doneList = new Array<Task>(
      new Task('Przykładowe wykonane zadanie',
          new Array<Todo>(
            new Todo('cośtam ten', true),
            new Todo('i jeszcze coś', true)),
              'z opisem...',
              new Date('Dec 31, 2019'))
    );
    this.boardList.push(new Board(this.id, this.name, this.ownerId, this.guestsId, this.categoryList, this.doneList));
    this.boardListObs.next(this.boardList);
  }

  getBoard(id: string) {
    for (const board of this.boardList) {
      if (board.id === id) {
        return board;
      }
    }
  }

  getBoardListObs(): Observable<Array<Board>> {
    return this.boardListObs.asObservable();
  }
}

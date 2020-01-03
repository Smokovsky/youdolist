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

  private boardList = Array<Board>();

  private boardListObs = new BehaviorSubject<Array<Board>>(this.boardList);

  /*  example data   */
  categoryList: Array<Category>;
  doneList: Array<Task>;

  constructor() {
    /*  example data   */
    this.categoryList = new Array<Category>(
      new Category('Obowiązki domowe', new Array<Task>(
        new Task('JXVQU', 'Pozamiatać dom',
        'XQAA',
          new Array<Todo>(
            new Todo('duży pokój'),
            new Todo('kuchnia'),
            new Todo('łazienka')),
          500,
          'Byle dokładnie!',
          new Date('Dec 20, 2019')),
        new Task('JXVQU', 'Zapłacić rachunki',
        'XQAA',
          new Array<Todo>(
            new Todo('czynsz'),
            new Todo('internet')),
          1000,
          '',
          new Date('Nov 10, 2019')),
        new Task('JXVQU', 'Wynieść śmieci',
        'XQAA',
          new Array<Todo>(),
          100
        ))),
      new Category('Praca', new Array<Task>(
        new Task('FITEP', 'Napisać raport',
        'XQAA',
          new Array<Todo>(
            new Todo('zgromadzić paragony'),
            new Todo('podsumować wydatki'),
            new Todo('porozmawiać z Bartkiem'),
            new Todo('podpisać dokumenty')),
          2100,
          'Raport z delegacji w Chorwacji 27/10/19',
          new Date('Jan 1, 2020')
            )))
    );
    this.doneList = new Array<Task>(
      new Task('FITEP', 'Przykładowe wykonane zadanie',
      'XQAA',
          new Array<Todo>(
            new Todo('cośtam ten', true),
            new Todo('i jeszcze coś', true)),
          300,
          'z opisem...',
          new Date('Dec 31, 2019'))
    );
    this.boardList.push(new Board('XYZZXY', 'Board one', 'XQAA', new Array<string>(), this.categoryList, this.doneList));
    this.boardList.push(new Board('QUEEEB', 'Tablica znajomego', 'EEEE', new Array<string>('XQAA'),
                        new Array<Category>(new Category('Kategoria znajomego', new Array<Task>())), new Array<Task>()));
    this.boardList.push(new Board('ALIAXX', 'Tablica nieznajomego', 'FFFF', new Array<string>('YAUE', 'IIGY'),
                        new Array<Category>(), new Array<Task>()));

    this.boardListObs.next(this.boardList);
  }

  getBoard(id: string): Board {
    for (const board of this.boardList) {
      if (board.id === id) {
        return board;
      }
    }
  }

  addBoard(board: Board): void {
    this.boardList.push(board);
    this.boardListObs.next(this.boardList);
  }

  deleteBoard(id: string): void {
    this.boardList.forEach((item, index) => {
      if (item.id === id) {
        this.boardList.splice(index, 1);
        console.log(index);
      }
    });
    this.boardListObs.next(this.boardList);
  }

  getBoardListObs(): Observable<Array<Board>> {
    return this.boardListObs.asObservable();
  }
}
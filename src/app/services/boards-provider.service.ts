import { Injectable } from '@angular/core';
import { Board } from '../models/board.model';
import { Category } from '../models/category.model';
import { Task } from '../models/task.model';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class BoardsProviderService {

  private boardList = Array<Board>();

  private boardListObs = new BehaviorSubject<Array<Board>>(this.boardList);

  constructor() {
    // *** EXAMPLE DATA *** //
    this.boardList.push(new Board('My board',
                                  'XQAA',
                                  new Array<User>(
                                    new User('XQAA')),
                                  new Array<Category>(
                                    new Category('Category 1',
                                      new Array<Task>())
                                  ),
                                  new Array<Task>()));
    this.boardList.push(new Board('Friend board',
                        'EAEA',
                        new Array<User>(
                          new User('EAEA'),
                          new User('XQAA')
                        ),
                        new Array<Category>(),
                        new Array<Task>()));
    this.boardListObs.next(this.boardList);
    // *** EXAMPLE DATA *** //
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
      }
    });
    this.boardListObs.next(this.boardList);
  }

  getBoardListObs(): Observable<Array<Board>> {
    return this.boardListObs.asObservable();
  }
}

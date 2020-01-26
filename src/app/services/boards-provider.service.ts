import { Injectable } from '@angular/core';
import { Board } from '../models/board.model';
import { Category } from '../models/category.model';
import { Task } from '../models/task.model';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from '../models/user.model';
import { Todo } from '../models/todo.model';
import { Reward } from '../models/reward.model';

@Injectable({
  providedIn: 'root'
})
export class BoardsProviderService {

  private boardList = Array<Board>();

  private boardListObs = new BehaviorSubject<Array<Board>>(this.boardList);

  constructor() {
    // *** EXAMPLE DATA *** //
    this.boardList.push(
      new Board('My board',
      new Array<User>(
        new User('XQAA', 4),
        new User('ELON', 1)),
      new Array<Category>(
        new Category('Category 1',
          new Array<Task>()
        )
      ),
      new Array<Task>(),
      new Array<Reward>()
    ));

    this.boardList[0].categories[0].taskList.push(
      new Task(
        this.boardList[0].categories[0].id,
        'Example task',
        'ELON',
        new Array<Todo>(),
        100,
        true,
        'description blah blah'
      )
    );

    this.boardList[0].categories[0].taskList.push(
      new Task(
        this.boardList[0].categories[0].id,
        'Example task 2',
        'ELON',
        new Array<Todo>(),
        100,
        false,
        'description blah blah'
      )
    );

    this.boardList[0].doneList.push(
      new Task(
        this.boardList[0].categories[0].id,
        'Example task',
        'ELON',
        new Array<Todo>(),
        100,
        false,
        'description blah blah'
      )
    );

    this.boardList[0].doneList[0].completitorId = 'ELON';
    this.boardList[0].doneList[0].completitionDate = new Date();

    this.boardList[0].rewardList.push(
      new Reward('Dinner @ McDonald\'s', 250, false, 'XQAA')
    );
    this.boardList[0].rewardList.push(
      new Reward('Small Lego box', 500, true, 'XQAA')
    );

    this.boardList.push(
      new Board('Friend board (lvl 3)',
      new Array<User>(
        new User('EAEA', 4),
        new User('XQAA', 3),
        new User('ELON', 2)
      ),
      new Array<Category>(
        new Category(
          'one real category',
          new Array<Task>()
        ),
        new Category(
          'proposals',
          new Array<Task>()
        )
      ),
      new Array<Task>(),
      new Array<Reward>()
    ));

    this.boardList[1].categories[0].taskList.push(
      new Task(
        this.boardList[1].categories[0].id,
        'Example task',
        'ELON',
        new Array<Todo>(),
        100,
        true,
        'description blah blah'
      )
    );

    this.boardList[1].categories[1].taskList.push(
      new Task(
        this.boardList[1].categories[1].id,
        'Example tasker',
        'ELON',
        new Array<Todo>(),
        100,
        false,
        'description blah blah'
      )
    );

    this.boardList[1].doneList.push(
      new Task(
        this.boardList[1].categories[0].id,
        'Example task 1',
        'XQAA',
        new Array<Todo>(),
        100,
        false,
        'description blah blah'
      )
    );

    this.boardList[1].doneList[0].completitorId = 'ELON';
    this.boardList[1].doneList[0].completitionDate = new Date();

    this.boardList[1].rewardList.push(
      new Reward('Dinner @ McDonald\'s', 10, false, 'XQAA')
    );
    this.boardList[1].rewardList.push(
      new Reward('Small Lego box', 20, true, 'XQAA')
    );

    this.boardList.push(
      new Board('Friend board (lvl 2)',
      new Array<User>(
        new User('EAEA', 4),
        new User('XQAA', 2),
        new User('ELON', 2)
      ),
      new Array<Category>(
        new Category(
          'a real category',
          new Array<Task>()
        ),
        new Category(
          'proposals',
          new Array<Task>()
        )
      ),
      new Array<Task>(),
      new Array<Reward>()
    ));

    this.boardList[2].categories[0].taskList.push(
      new Task(
        this.boardList[2].categories[0].id,
        'Example task',
        'ELON',
        new Array<Todo>(),
        100,
        true,
        'description blah blah'
      )
    );

    this.boardList[2].categories[1].taskList.push(
      new Task(
        this.boardList[2].categories[1].id,
        'Example tasker',
        'ELON',
        new Array<Todo>(),
        100,
        false,
        'description blah blah'
      )
    );

    this.boardList[2].doneList.push(
      new Task(
        this.boardList[2].categories[0].id,
        'Example task',
        'ELON',
        new Array<Todo>(),
        100,
        false,
        'description blah blah'
      )
    );

    this.boardList[2].doneList[0].completitorId = 'ELON';
    this.boardList[2].doneList[0].completitionDate = new Date();

    this.boardList.push(
      new Board('Friend board (lvl 1)',
      new Array<User>(
        new User('ELON', 4),
        new User('XQAA', 1),
        new User('EAEA', 1)
      ),
      new Array<Category>(
        new Category(
          'thy category',
          new Array<Task>()
        ),
        new Category(
          'el proposals',
          new Array<Task>()
        )
      ),
      new Array<Task>(),
      new Array<Reward>()
    ));

    this.boardList[3].categories[0].taskList.push(
      new Task(
        this.boardList[3].categories[0].id,
        'Example task',
        'ELON',
        new Array<Todo>(),
        100,
        true,
        'description blah blah'
      )
    );

    this.boardList[3].categories[1].taskList.push(
      new Task(
        this.boardList[3].categories[1].id,
        'Example tasker',
        'ELON',
        new Array<Todo>(),
        100,
        false,
        'description blah blah'
      )
    );

    this.boardList[3].doneList.push(
      new Task(
        this.boardList[3].categories[0].id,
        'Example task',
        'ELON',
        new Array<Todo>(),
        100,
        false,
        'description blah blah'
      )
    );

    this.boardList[3].doneList[0].completitorId = 'ELON';
    this.boardList[3].doneList[0].completitionDate = new Date();

    this.boardList.push(
      new Board('Not friend board',
      new Array<User>(
        new User('ELON', 4),
        new User('EAEA', 1)
      ),
      new Array<Category>(
        new Category(
          'thy category',
          new Array<Task>()
        ),
        new Category(
          'el proposals',
          new Array<Task>()
        )
      ),
      new Array<Task>(),
      new Array<Reward>()
    ));

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
    for (let i = 0, len = this.boardList.length; i < len; i++) {
      if (this.boardList[i] && this.boardList[i].id === id) {
        this.boardList.splice(i, 1);
        this.boardListObs.next(this.boardList);
        break;
      }
    }
  }

  getBoardListObs(): Observable<Array<Board>> {
    return this.boardListObs.asObservable();
  }
}

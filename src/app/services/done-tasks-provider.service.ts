import { Injectable } from '@angular/core';
import { Task } from '../models/task.model';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { Observable } from 'rxjs';
import { Todo } from '../models/todo.model';

@Injectable({
  providedIn: 'root'
})
export class DoneTasksProviderService {

  doneList: Array<Task>;

  doneTasksObs = new BehaviorSubject<Array<Task>>(this.doneList);

  constructor() {
    /* Example data */
    this.doneList = new Array<Task>(
      new Task('Przykładowe wykonane zadanie',
          new Array<Todo>(
            new Todo('cośtam', true),
            new Todo('i jeszcze coś', true)),
              'z opisem...',
              new Date('Dec 31, 2019'))
    );
    this.doneTasksObs.next(this.doneList);
  }

  getDoneTasksObs(): Observable<Array<Task>> {
    return this.doneTasksObs.asObservable();
  }

  add(task: Task) {
    this.doneList.push(task);
  }

}

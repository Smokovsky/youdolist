import { Injectable } from '@angular/core';
import { Task } from '../models/task.model';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { Category } from '../models/category.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DoneTasksProviderService {

  doneList: Array<Task>;

  doneTasksObs = new BehaviorSubject<Array<Task>>(this.doneList);

  constructor() {
    /* Example data */
    this.doneList = new Array<Task>();
    this.doneTasksObs.next(this.doneList);
  }

  getDoneTasksObs(): Observable<Array<Task>> {
    return this.doneTasksObs.asObservable();
  }

  add(task: Task) {
    this.doneList.push(task);
  }

}

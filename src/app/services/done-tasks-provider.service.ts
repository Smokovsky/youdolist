import { Injectable } from '@angular/core';
import { Task } from '../models/task.model';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { Observable } from 'rxjs';
import { BoardsProviderService } from './boards-provider.service';

@Injectable({
  providedIn: 'root'
})
export class DoneTasksProviderService {

  doneList: Array<Task>;

  doneTasksObs = new BehaviorSubject<Array<Task>>(this.doneList);

  constructor(private boardsProviderService: BoardsProviderService) {  }

  setDoneList(id: string){
    this.doneList = this.boardsProviderService.getBoard(id).doneList;
    this.doneTasksObs.next(this.doneList);
  }

  getDoneTasksObs(): Observable<Array<Task>> {
    return this.doneTasksObs.asObservable();
  }

  add(task: Task) {
    task.completitionDate = new Date();
    this.doneList.push(task);
    this.doneTasksObs.next(this.doneList);
  }

}

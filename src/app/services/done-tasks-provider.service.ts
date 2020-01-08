import { Injectable } from '@angular/core';
import { Task } from '../models/task.model';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { Observable } from 'rxjs';
import { BoardsProviderService } from './boards-provider.service';
import { BoardUserProviderService } from './board-user-provider.service';

@Injectable({
  providedIn: 'root'
})
export class DoneTasksProviderService {

  userId: string;

  private doneList: Array<Task>;

  private doneTasksObs = new BehaviorSubject<Array<Task>>(this.doneList);

  constructor(private boardsProviderService: BoardsProviderService,
              private boardUserProviderService: BoardUserProviderService) {

    // TODO: get userId from user service
    this.userId = this.boardUserProviderService.getUserId();

   }

  setDoneList(id: string): void {
    this.doneList = this.boardsProviderService.getBoard(id).doneList;
    this.doneTasksObs.next(this.doneList);
  }

  getDoneTasksObs(): Observable<Array<Task>> {
    return this.doneTasksObs.asObservable();
  }

  add(task: Task): void {
    task.completitionDate = new Date();
    task.completitorId = this.userId;
    this.doneList.push(task);
    this.doneTasksObs.next(this.doneList);
  }

  remove(i: number): void {
    this.doneList.splice(i, 1);
    this.doneTasksObs.next(this.doneList);
  }

}

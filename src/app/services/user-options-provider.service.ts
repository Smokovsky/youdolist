import { Injectable } from '@angular/core';
import { User } from '../models/user.model';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { Observable } from 'rxjs';
import { BoardsProviderService } from './boards-provider.service';
import { BoardUserProviderService } from './board-user-provider.service';

@Injectable({
  providedIn: 'root'
})
export class UserOptionsProviderService {

  private userList: Array<User> = [];

  private userListObs = new BehaviorSubject<Array<User>>(this.userList);

  constructor(private boardsProviderService: BoardsProviderService,
              private boardUserProviderService: BoardUserProviderService) { }

  setUserList(id: string): void {
    this.userList = this.boardsProviderService.getBoard(id).userList;
    this.userListObs.next(this.userList);
  }

  getUserListObs(): Observable<Array<User>> {
    return this.userListObs.asObservable();
  }

  addUserPoints(userId: string, points: number): void {
    this.userList.forEach(user => {
      if (user.id === userId) {
        user.addPoints(points);
      }
    });
    this.userListObs.next(this.userList);
    this.boardUserProviderService.nextObservable();
  }

  substractUserPoints(userId: string, points: number): void {
    this.userList.forEach(user => {
      if (user.id === userId) {
        user.subPoints(points);
      }
    });
    this.userListObs.next(this.userList);
    this.boardUserProviderService.nextObservable();
  }

  deleteUser(user: User): void {
    this.userList.forEach((u, index) => {
      if (u.id === user.id) {
        this.userList.splice(index, 1);
        this.userListObs.next(this.userList);
      }
    });
  }

}

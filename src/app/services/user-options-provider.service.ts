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

  userId: string;
  isOwner = false;
  private userList: Array<User> = [];

  private userListObs = new BehaviorSubject<Array<User>>(this.userList);

  constructor(private boardsProviderService: BoardsProviderService,
              private boardUserProviderService: BoardUserProviderService) { 
    this.userId = this.boardUserProviderService.getUserId();
    if (this.boardUserProviderService.getUserAccessLevel() > 3) {
      this.isOwner = true;
    }
  }

  setUserList(id: string): void {
    this.userList = this.boardsProviderService.getBoard(id).userList;
    this.userListObs.next(this.userList);
  }

  getUserListObs(): Observable<Array<User>> {
    return this.userListObs.asObservable();
  }

  addUserPoints(userId: string, points: number): void {
    for (let i = 0, len = this.userList.length; i < len; i++) {
      if (this.userList[i].id === userId) {
        this.userList[i].addPoints(points);
        this.userListObs.next(this.userList);
        this.boardUserProviderService.nextObservable();
        break;
      }
    }
  }

  substractUserPoints(userId: string, points: number): void {
    for (let i = 0, len = this.userList.length; i < len; i++) {
      if (this.userList[i].id === userId) {
        this.userList[i].subPoints(points);
        this.userListObs.next(this.userList);
        this.boardUserProviderService.nextObservable();
        break;
      }
    }
  }

  increaseUserLevel(userId: string): void {
    for (let i = 0, len = this.userList.length; i < len; i++) {
      if (this.userList[i].id === userId) {
        if (this.isOwner) {
          if (this.userList[i].accessLevel < 3) {
            this.userList[i].accessLevel += 1;
          }
        } else {
          if (this.userList[i].accessLevel < 2) {
            this.userList[i].accessLevel += 1;
          }
        }
      }
    }
  }

  decreaseUserLevel(userId: string): void {
    for (let i = 0, len = this.userList.length; i < len; i++) {
      if (this.userList[i].id === userId) {
        if (this.userList[i].accessLevel === 3) {
          if (this.isOwner) {
            this.userList[i].accessLevel -= 1;
          }
        } else if (this.userList[i].accessLevel > 1) {
          this.userList[i].accessLevel -= 1;
        }
      }
    }
  }

  deleteUser(user: User): void {
    for (let i = 0, len = this.userList.length; i < len; i++) {
      if (this.userList[i].id === user.id) {
        this.userList.splice(i, 1);
        this.userListObs.next(this.userList);
        break;
      }
    }
  }

}

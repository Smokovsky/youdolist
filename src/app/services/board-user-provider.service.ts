import { Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { BoardsProviderService } from './boards-provider.service';
import { User } from '../models/user.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BoardUserProviderService {

  // TODO: get user id from firebase service
  private userId = 'XQAA';
  private user: User;

  private pointsObs: BehaviorSubject<number>;
  private accessLevelObs: BehaviorSubject<number>;

  constructor(private activatedRoute: ActivatedRoute,
              private boardsProviderService: BoardsProviderService) {

    const board = this.boardsProviderService.getBoard(this.activatedRoute.snapshot.paramMap.get('id'));
    if (board) {
      for (let i = 0, len = board.userList.length; i < len; i++) {
        if (board.userList[i].id === this.userId) {
          this.user = board.userList[i];
          break;
        }
      }
    } else {
      // Prevents breaking on reload
      this.user = new User('empty user', 0);
    }
    this.pointsObs = new BehaviorSubject<number>(this.user.points);
    this.accessLevelObs = new BehaviorSubject<number>(this.user.accessLevel);
  }

  getUserId(): string {
    return this.userId;
  }

  getUserAccessLevel(): number {
    return this.user.accessLevel;
  }

  getUserAccessLevelObs(): Observable<number> {
    return this.accessLevelObs.asObservable();
  }

  getPointsObs(): Observable<number> {
    return this.pointsObs.asObservable();
  }

  nextObservable(): void {
    this.pointsObs.next(this.user.points);
  }

  addPoints(points: number): void {
    this.user.addPoints(points);
    this.pointsObs.next(this.user.points);
  }

  subPoints(points: number): void {
    this.user.subPoints(points);
    this.pointsObs.next(this.user.points);
  }

}

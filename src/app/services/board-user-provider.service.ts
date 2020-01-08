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

  private boardAdmin = false;


  constructor(private activatedRoute: ActivatedRoute,
              private boardsProviderService: BoardsProviderService) {

    const board = this.boardsProviderService.getBoard(this.activatedRoute.snapshot.paramMap.get('id'));
    if (board) {
      board.userList.forEach(user => {
        if (user.id === this.userId) {
          this.user = user;
          if (this.userId === board.ownerId) {
            this.boardAdmin = true;
          }
        }
      });
    } else {
      // Prevents breaking on reload
      this.user = new User('empty user');
    }
    this.pointsObs = new BehaviorSubject<number>(this.user.points);
  }

  getUserId(): string {
    return this.userId;
  }

  isAdmin(): boolean {
    return this.boardAdmin;
  }

  getPointsObs(): Observable<number> {
    return this.pointsObs.asObservable();
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

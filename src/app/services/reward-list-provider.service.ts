import { Injectable } from '@angular/core';
import { Reward } from '../models/reward.model';
import { BehaviorSubject, Observable } from 'rxjs';
import { BoardsProviderService } from './boards-provider.service';

@Injectable({
  providedIn: 'root'
})
export class RewardListProviderService {

  private rewardList: Array<Reward>;

  private rewardListObs = new BehaviorSubject<Array<Reward>>(this.rewardList);

  constructor(private boardsProviderService: BoardsProviderService) { }

  setRewardList(id: string): void {
    this.rewardList = this.boardsProviderService.getBoard(id).rewardList;
    this.rewardListObs.next(this.rewardList);
  }

  getRewardListObs(): Observable<Array<Reward>> {
    return this.rewardListObs.asObservable();
  }

  add(reward: Reward): void {
    this.rewardList.push(reward);
    this.rewardListObs.next(this.rewardList);
  }

  remove(i: number): void {
    this.rewardList.splice(i, 1);
    this.rewardListObs.next(this.rewardList);
  }

}

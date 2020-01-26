import { Injectable } from '@angular/core';
import { Reward } from '../models/reward.model';
import { BehaviorSubject, Observable } from 'rxjs';
import { BoardsProviderService } from './boards-provider.service';

@Injectable({
  providedIn: 'root'
})
export class RewardListProviderService {

  private rewardList: Array<Reward>;
  private rewardHistoryList: Array<Reward>;

  private rewardListObs = new BehaviorSubject<Array<Reward>>(this.rewardList);
  private rewardHistoryListObs = new BehaviorSubject<Array<Reward>>(this.rewardHistoryList);

  constructor(private boardsProviderService: BoardsProviderService) { }

  setRewardList(id: string): void {
    this.rewardList = this.boardsProviderService.getBoard(id).rewardList;
    this.rewardListObs.next(this.rewardList);
    this.rewardHistoryList = this.boardsProviderService.getBoard(id).rewardHistoryList;
    this.rewardHistoryListObs.next(this.rewardHistoryList);
  }

  getRewardListObs(): Observable<Array<Reward>> {
    return this.rewardListObs.asObservable();
  }

  getRewardHistoryListObs(): Observable<Array<Reward>> {
    return this.rewardHistoryListObs.asObservable();
  }

  add(reward: Reward): void {
    this.rewardList.push(reward);
    this.rewardListObs.next(this.rewardList);
  }

  getReward(i: number): void {
    this.rewardList[i].isApproved = false;
    this.rewardHistoryList.push(this.rewardList[i]);
    this.rewardList.splice(i, 1);
    this.rewardListObs.next(this.rewardList);
    this.rewardHistoryListObs.next(this.rewardHistoryList);
  }

  undoReward(i: number): void {
    this.rewardHistoryList[i].isApproved = true;
    this.rewardList.push(this.rewardHistoryList[i]);
    this.rewardHistoryList.splice(i, 1);
    this.rewardHistoryListObs.next(this.rewardHistoryList);
    this.rewardListObs.next(this.rewardList);
   }

  remove(i: number): void {
    this.rewardList.splice(i, 1);
    this.rewardListObs.next(this.rewardList);
  }

}

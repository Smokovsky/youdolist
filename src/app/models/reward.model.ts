export class RewardService {
  name: string;
  cost: number;
  quantity: number;
  isRepeatable: boolean;
  isApproved: boolean;
  userId: string;
  created: Date;
  collected: Date;

  constructor(name: string, cost: number, isRepeatable: boolean, isApproved: boolean, userId: string) {
    this.name = name;
    this.cost = cost;
    this.isRepeatable = isRepeatable;
    this.isApproved = isApproved;
    this.userId = userId;
    this.created = new Date();
  }
}

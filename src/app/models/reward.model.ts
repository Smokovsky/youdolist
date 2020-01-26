export class Reward {
  name: string;
  description: string;
  cost: number;
  isApproved: boolean;
  created: Date;
  authorId: string;
  edited?: Date;
  editorId?: string;
  collected?: Date;
  collectorId?: string;

  constructor(name: string, cost: number, isApproved: boolean, authorId: string, description?: string) {
    this.name = name;
    this.description = description;
    this.cost = cost;
    this.isApproved = isApproved;
    this.authorId = authorId;
    this.created = new Date();
  }
}

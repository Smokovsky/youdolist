import { Category } from './category.model';
import { Task } from './task.model';
import { User } from './user.model';
import { Reward } from './reward.model';

export class Board {
    id: string;
    name: string;
    userList: Array<User>;
    categories: Array<Category>;
    doneList: Array<Task>;
    rewardList: Array<Reward>;
    rewardHistoryList: Array<Reward>;

    constructor(name: string, userList: Array<User>, categories: Array<Category>,
                doneList: Array<Task>, rewardList: Array<Reward>) {
        this.id = this.getRandomId();
        this.name = name;
        this.userList = userList;
        this.categories = categories;
        this.doneList = doneList;
        this.rewardList = rewardList;
        this.rewardHistoryList = new Array<Reward>();
    }

    // TODO: avoid duplicates
    getRandomId(): string {
        return Math.floor((Math.random() * 999999) + 1).toString();
    }
}

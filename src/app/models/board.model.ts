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

    constructor(name: string, userList: Array<User>, categories: Array<Category>,
                doneList: Array<Task>, rewardList: Array<Reward>) {
        this.id = this.getRandomId();
        // this.id = id;
        this.name = name;
        this.userList = userList;
        this.categories = categories;
        this.doneList = doneList;
        this.rewardList = rewardList;
    }

    // TODO: avoid duplicates
    getRandomId(): string {
        return Math.floor((Math.random() * 999999) + 1).toString();
    }
}

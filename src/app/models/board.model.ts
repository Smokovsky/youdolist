import { Category } from './category.model';
import { Task } from './task.model';
import { User } from './user.model';

export class Board {
    id: string;
    name: string;
    ownerId: string;
    userList: Array<User>;
    categories: Array<Category>;
    doneList: Array<Task>;

    constructor(name: string, ownerId: string, userList: Array<User>,
                categories: Array<Category>, doneList: Array<Task>) {
        this.id = this.getRandomId();
        // this.id = id;
        this.name = name;
        this.ownerId = ownerId;
        this.userList = userList;
        this.categories = categories;
        this.doneList = doneList;
    }

    // TODO: avoid duplicates
    getRandomId(): string {
        return Math.floor((Math.random() * 999999) + 1).toString();
    }
}

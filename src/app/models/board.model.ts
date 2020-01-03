import { Category } from './category.model';
import { Task } from './task.model';

export class Board {
    id: string;
    name: string;
    ownerId: string;
    guestsId: Array<string>;
    categories: Array<Category>;
    doneList: Array<Task>;

    constructor(id: string, name: string, ownerId: string, guestsId: Array<string>, categories: Array<Category>, doneList: Array<Task>) {
        this.id = this.getRandomId();
        // this.id = id;
        this.name = name;
        this.ownerId = ownerId;
        this.guestsId = guestsId;
        this.categories = categories;
        this.doneList = doneList;
    }

    // TODO: avoid duplicates
    getRandomId(): string {
        return Math.floor((Math.random() * 999999) + 1).toString();
    }
}

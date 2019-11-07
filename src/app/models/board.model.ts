import { Category } from './category.model';

export class Board {
    id: string;
    name: string;
    ownerId: string;
    guestsId: Array<string>;
    categories: Array<Category>;

    constructor(id: string, name: string, ownerId: string, guestsId: Array<string>, categories: Array<Category>) {
        this.id = id;
        this.name = name;
        this.ownerId = ownerId;
        this.guestsId = guestsId;
        this.categories = this.categories;
    }
}

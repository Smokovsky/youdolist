import { Task } from './task.model';

export class Category {
    id: string;
    name: string;
    taskList: Array<Task>;

    constructor(name: string, taskList?: Array<Task>) {
        this.id = this.getRandomId();
        this.name = name;
        this.taskList = taskList;
    }

    // TODO: avoid duplicates
    getRandomId(): string {
        return Math.floor((Math.random() * 99999) + 1).toString();
    }
}

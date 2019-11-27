import { Task } from './task.model';

export class Category {
    id: string;
    name: string;
    taskList: Array<Task>;

    constructor(id: string, name: string, taskList?: Array<Task>) {
        this.id = this.getRandomId();
        this.name = name;
        this.taskList = taskList;
    }

    getRandomId() {
        return Math.floor((Math.random() * 99999) + 1).toString();
    }
}

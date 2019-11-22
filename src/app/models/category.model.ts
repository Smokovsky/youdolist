import { Task } from './task.model';

export class Category {
    id: string;
    name: string;
    taskList: Array<Task>;

    constructor(id: string, name: string, taskList?: Array<Task>) {
        this.id = id;
        this.name = name;
        this.taskList = taskList;
    }
}

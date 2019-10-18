import { Task } from './task.model';

export class Category {
    name: string;
    taskList: Array<Task>;

    constructor(name: string, taskList?: Array<Task>){
        this.name = name;
        this.taskList = taskList;
    }
}

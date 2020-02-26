import { Task } from './task.model';

export interface Category {
    id?: string;
    name?: string;
    timeStamp?: Date;
    taskList?: Task[];
}

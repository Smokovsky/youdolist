import { Task } from './task.model';

export interface Category {
    id: string;
    name: string;
    position?: number;
    taskList?: Task[];
}

import { Todo } from './todo.model';

export class Task {
    name: string;
    description?: string;
    todoList?: Array<Todo>;
    isDone: boolean;
    creationDate: Date;
    dueDate?: Date;
    completitionDate?: Date;

    constructor(name: string, todoList: Array<Todo>, description?: string, dueDate?: Date) {
        this.name = name;
        this.todoList = todoList;
        this.description = description;
        this.isDone = false;
        this.creationDate = new Date();
        this.dueDate = dueDate;
    }
}


import { Todo } from './todo.model';

export class Task {
    name: string;
    description?: string;
    todoList?: Array<Todo>;
    isDone: boolean;

    constructor(name: string, todoList: Array<Todo>, description?: string) {
        this.name = name;
        this.todoList = todoList;
        this.description = description;
        this.isDone = false;
    }
}


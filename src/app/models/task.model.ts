import { Todo } from './todo.model';

export class Task {
    name: string;
    description?: string;
    todoList?: Array<Todo>;
    isDone: boolean;

    constructor(name: string, description?: string, todoList?: Array<Todo>){
        this.name = name;
        this.description = description;
        this.todoList = todoList;
        this.isDone = false;
    }
}


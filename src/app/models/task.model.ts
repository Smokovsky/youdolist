import { Todo } from './todo.model';

export class Task {
    categoryId: string;
    name: string;
    description?: string;
    todoList?: Array<Todo>;
    // isDone: boolean;
    authorId: string;
    lastEditorId?: string;
    completitorId?: string;

    creationDate: Date;
    dueDate?: Date;
    lastEditDate?: Date;
    completitionDate?: Date;

    points: number;

    constructor(categoryId: string, name: string, authorId: string, todoList: Array<Todo>,
                points: number, description?: string, dueDate?: Date) {
        this.categoryId = categoryId;
        this.name = name;
        this.authorId = authorId;
        this.todoList = todoList;
        this.description = description;
        // this.isDone = false;
        this.points = points;
        this.creationDate = new Date();
        this.dueDate = dueDate;
    }
}


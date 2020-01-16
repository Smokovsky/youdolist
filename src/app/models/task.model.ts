import { Todo } from './todo.model';

export class Task {
    categoryId: string;
    name: string;
    description?: string;
    todoList?: Array<Todo>;
    isApproved: boolean;
    authorId: string;
    lastEditorId?: string;
    completitorId?: string;

    creationDate: Date;
    dueDate?: Date;
    lastEditDate?: Date;
    completitionDate?: Date;

    points: number;

    constructor(categoryId: string, name: string, authorId: string, todoList: Array<Todo>,
                points: number, isApproved: boolean, description?: string, dueDate?: Date) {
        this.categoryId = categoryId;
        this.name = name;
        this.authorId = authorId;
        this.todoList = todoList;
        this.isApproved = isApproved;
        this.description = description;
        this.points = points;
        this.creationDate = new Date();
        this.dueDate = dueDate;
        if (!todoList) {
            this.todoList = new Array<Todo>();
         }
    }
}


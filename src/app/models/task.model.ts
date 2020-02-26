import { Todo } from './todo.model';

export interface Task {
    id?: string;
    categoryId?: string;
    name?: string;
    description?: string;
    todoList?: Todo[];
    dueDate?: any;
    points?: number;
    isApproved?: boolean;
    position?: number;

    authorId?: string;
    creationDate?: any;
    lastEditorId?: string;
    lastEditDate?: any;
    completitorId?: string;
    completitionDate?: any;
}


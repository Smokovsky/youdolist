import { Todo } from './todo.model';

export class Task {
    name: string;
    description?: string;
    todoList?: Array<Todo>;
    isDone: boolean;
}

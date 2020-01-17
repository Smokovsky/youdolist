export class Todo {
    name: string;
    isDone = false;

    constructor(name: string, isDone?: boolean) {
        this.name = name;
        this.isDone = isDone;
    }
}
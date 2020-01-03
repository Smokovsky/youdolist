import { Component, OnInit, Input } from '@angular/core';
import { Todo } from 'src/app/models/todo.model';

@Component({
  selector: 'app-todo',
  templateUrl: './todo.component.html',
  styleUrls: ['./todo.component.css']
})
export class TodoComponent implements OnInit {

  @Input()
  todos: Array<Todo>;

  constructor() { }

  ngOnInit() { }

  onTodoCheck(todo: Todo): void {
    todo.isDone = !todo.isDone;
  }

}

import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.css']
})
export class TaskComponent implements OnInit {

  @Input()
  tasks;

  constructor() { }

  ngOnInit() {
  }

  onClickTaskDone(task){
    console.log('Task "' + task.name + '" done button clicked!');
  }
  onClickTaskSettings(task){
    console.log('Task "' + task.name + '" settings button clicked!');
  }
}

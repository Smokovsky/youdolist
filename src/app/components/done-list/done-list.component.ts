import { Component, OnInit } from '@angular/core';
import { Task } from 'src/app/models/task.model';
import { DoneTasksProviderService } from 'src/app/services/done-tasks-provider.service';

@Component({
  selector: 'app-done-list',
  templateUrl: './done-list.component.html',
  styleUrls: ['./done-list.component.css']
})
export class DoneListComponent implements OnInit {

  doneTaskList: Array<Task>;
  doneListName = 'Done list';
  editNameActive = false;
  tempNewDoneName = this.doneListName;

  constructor(private doneTasksProviderService: DoneTasksProviderService) {

    this.doneTasksProviderService.getDoneTasksObs().subscribe((doneTasks: Array<Task>) => {
      this.doneTaskList = doneTasks;
    });

  }

  ngOnInit() { }

  onClickEdit(): void {
    this.editNameActive = !this.editNameActive;
  }

  onClickSubmit(): void {
    this.doneListName = this.tempNewDoneName;
    this.editNameActive = false;
  }

  onClickCancel(): void {
    this.editNameActive = false;
    this.tempNewDoneName = this.doneListName;
  }

}

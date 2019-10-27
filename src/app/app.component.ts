import { Component } from '@angular/core';
import { CategoryProviderService } from './services/category-provider.service';
import { DoneTasksProviderService } from './services/done-tasks-provider.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [ CategoryProviderService,
               DoneTasksProviderService ]
})
export class AppComponent {
  title = 'youdolist';
}

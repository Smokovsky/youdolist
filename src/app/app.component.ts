import { Component } from '@angular/core';
import { BoardsProviderService } from './services/boards-provider.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [ BoardsProviderService ]
})
export class AppComponent {
  title = 'youdolist';
}

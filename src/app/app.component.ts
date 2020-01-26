import { Component, ViewEncapsulation } from '@angular/core';
import { BoardsProviderService } from './services/boards-provider.service';
import { SnackBarProviderService } from './services/snack-bar-provider.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  encapsulation: ViewEncapsulation.None,
  providers: [ BoardsProviderService,
               SnackBarProviderService ]
})
export class AppComponent {
  title = 'Youdolist';
}

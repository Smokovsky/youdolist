import { Component, ViewEncapsulation } from '@angular/core';
import { SnackBarProviderService } from './services/snack-bar-provider.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  encapsulation: ViewEncapsulation.None,
  providers: [ SnackBarProviderService ]
})
export class AppComponent {
  title = 'Youdolist';
}

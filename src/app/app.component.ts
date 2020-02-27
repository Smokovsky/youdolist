import { Component, ViewEncapsulation } from '@angular/core';
import { SnackBarProviderService } from './services/snack-bar-provider.service';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  encapsulation: ViewEncapsulation.None,
  providers: [ AuthService,
              SnackBarProviderService ]
})
export class AppComponent {
  title = 'Youdolist';
}

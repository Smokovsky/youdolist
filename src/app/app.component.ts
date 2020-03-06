import { Component, ViewEncapsulation } from '@angular/core';
import { SnackBarProviderService } from './services/snack-bar-provider.service';
import { AuthService } from './services/auth.service';
import { OperationsIntervalService } from './services/operations-interval.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  encapsulation: ViewEncapsulation.None,
  providers: [ AuthService,
              OperationsIntervalService,
              SnackBarProviderService ]
})
export class AppComponent {
  title = 'Youdolist';
}

import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  constructor(private auth: AuthService,
              private router: Router) {
    // if (this.auth.user$) {
    //   this.router.navigate(['/boards']);
    // }
  }

  ngOnInit() {
  }

}

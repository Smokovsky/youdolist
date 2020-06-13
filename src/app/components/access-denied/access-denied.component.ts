import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-access-denied',
  templateUrl: './access-denied.component.html',
  styleUrls: ['./access-denied.component.css']
})
export class AccessDeniedComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() { return 0; }

  onClickBackBtn(): void {
    this.router.navigate(['/']);
  }

}

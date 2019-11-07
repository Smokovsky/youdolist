import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-boards',
  templateUrl: './boards.component.html',
  styleUrls: ['./boards.component.css']
})
export class BoardsComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  onClickBoard() {
    console.log('Board clicked');
  }
  onClickNewBoard() {
    console.log('New board clicked');
  }
}

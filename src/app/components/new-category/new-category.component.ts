import { Component, OnInit } from '@angular/core';
import { Category } from 'src/app/models/category.model';
import { SnackBarProviderService } from 'src/app/services/snack-bar-provider.service';
import { AngularFirestore } from 'angularfire2/firestore';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-new-category',
  templateUrl: './new-category.component.html',
  styleUrls: ['./new-category.component.css']
})
export class NewCategoryComponent implements OnInit {

  categoryList = Array<Category>();
  newCategoryFieldActive = false;
  newCategoryName: string;

  boardId: string;

  constructor(private afs: AngularFirestore,
              private activatedRoute: ActivatedRoute,
              private snackbarService: SnackBarProviderService) {

    this.boardId = this.activatedRoute.snapshot.paramMap.get('id');
  }

  ngOnInit() { }

  onClickAddNewCategory(): void {
    this.newCategoryFieldActive = true;
  }

  onClickSubmitNewCategory(): void {
    this.newCategoryFieldActive = false;
    // this.categoryListProviderService.add(new Category(this.newCategoryName, new Array<Task>()));
    this.afs.collection('boards').doc(this.boardId).collection<Category>('categoryList')
    .doc(this.afs.createId()).set({name: this.newCategoryName, timeStamp: new Date()});
    this.newCategoryName = '';
    this.snackbarService.openSnack('New category created');
  }

  onClickCancelNewCategory(): void {
    this.newCategoryFieldActive = false;
    this.newCategoryName = '';
  }

}

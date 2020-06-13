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
  newCategoryName = '';

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
    if (this.newCategoryName.length <= 120) {
      if (this.newCategoryName !== '') {
        this.afs.collection('boards').doc(this.boardId).collection('categoryList').ref.get().then(snap => {
          const pos = snap.size;
          this.afs.collection('boards').doc(this.boardId).collection('categoryList')
          .doc(this.afs.createId()).set({name: this.newCategoryName, position: pos});
          this.newCategoryName = '';
          this.snackbarService.openSnack('New category created');
        });
      } else {
        this.snackbarService.openSnack('Please enter category name');
      }
    } else {
      this.snackbarService.openSnack('Category name can be maximum 120 characters long');
    }


  }

  onClickCancelNewCategory(): void {
    this.newCategoryFieldActive = false;
    this.newCategoryName = '';
  }

}

import { Component, OnInit, OnDestroy } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { ActivatedRoute } from '@angular/router';
import { BoardUser } from 'src/app/models/boardUser.model';
import { Category } from 'src/app/models/category.model';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { SnackBarProviderService } from 'src/app/services/snack-bar-provider.service';

@Component({
  selector: 'app-done-list',
  templateUrl: './done-list.component.html',
  styleUrls: ['./done-list.component.css']
})
export class DoneListComponent implements OnInit, OnDestroy {

  boardId: string;
  userId: string;
  userSubscription: Subscription;
  boardUserSubscription: Subscription;
  userAccessLevel: number;

  doneListNameSubscription: Subscription;
  doneListName: string;
  editNameActive = false;
  tempNewDoneName = this.doneListName;

  constructor(private afs: AngularFirestore,
              private auth: AuthService,
              private activatedRoute: ActivatedRoute,
              private snackbarService: SnackBarProviderService) {

    this.boardId = this.activatedRoute.snapshot.paramMap.get('id');

    this.userSubscription = this.auth.user$.subscribe(user => {
      if (user) {
        this.userId = user.uid;

        this.boardUserSubscription = this.afs.collection('boards').doc(this.boardId)
        .collection<BoardUser>('userList').doc(this.userId)
        .valueChanges().subscribe((boardUser: BoardUser) => {
          this.userAccessLevel = boardUser.accessLevel;
        });
      }
    });

    this.doneListNameSubscription = this.afs.collection('boards').doc(this.boardId)
    .collection('categoryList').doc('doneList')
    .valueChanges().subscribe((doneList: Category) => {
      this.doneListName = doneList.name;
    });

  }

  ngOnInit() { }

  ngOnDestroy() {
    this.doneListNameSubscription.unsubscribe();
    this.boardUserSubscription.unsubscribe();
    this.userSubscription.unsubscribe();
  }

  onClickEdit(): void {
    this.tempNewDoneName = this.doneListName;
    this.editNameActive = true;
  }

  onClickSubmit(): void {
    if (this.tempNewDoneName.length <= 140) {
      if (this.tempNewDoneName !== '') {
        this.afs.collection('boards').doc(this.boardId)
        .collection('categoryList').doc('doneList')
        .update({name: this.tempNewDoneName});
        this.editNameActive = false;
      } else {
        this.snackbarService.openSnack('Please enter done list name');
      }
    } else {
      this.snackbarService.openSnack('Done list name can be maximum 140 characters long');
    }
  }

  onClickCancel(): void {
    this.editNameActive = false;
    this.tempNewDoneName = this.doneListName;
  }

}

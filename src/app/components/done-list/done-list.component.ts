import { Component, OnInit, OnDestroy } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { ActivatedRoute } from '@angular/router';
import { User } from 'src/app/models/user.model';
import { Category } from 'src/app/models/category.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-done-list',
  templateUrl: './done-list.component.html',
  styleUrls: ['./done-list.component.css']
})
export class DoneListComponent implements OnInit, OnDestroy {

  boardId: string;
  userId: string;
  userSubscription: Subscription;
  userAccessLevel: number;

  doneListNameSubscription: Subscription;
  doneListName: string;
  editNameActive = false;
  tempNewDoneName = this.doneListName;

  constructor(private afs: AngularFirestore,
              private activatedRoute: ActivatedRoute) {

    this.userId = 'XQAA';

    this.boardId = this.activatedRoute.snapshot.paramMap.get('id');

    this.userSubscription = this.afs.collection('boards').doc(this.boardId)
    .collection<User>('userList').doc(this.userId)
    .valueChanges().subscribe((user: User) => {
      this.userAccessLevel = user.accessLevel;
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
    this.userSubscription.unsubscribe();
  }

  onClickEdit(): void {
    this.tempNewDoneName = this.doneListName;
    this.editNameActive = true;
  }

  onClickSubmit(): void {
    this.afs.collection('boards').doc(this.boardId)
    .collection('categoryList').doc('doneList')
    .update({name: this.tempNewDoneName});
    this.editNameActive = false;
  }

  onClickCancel(): void {
    this.editNameActive = false;
    this.tempNewDoneName = this.doneListName;
  }

}

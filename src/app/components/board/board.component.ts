import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserOptionsComponent } from '../user-options/user-options.component';
import { MatDialog } from '@angular/material/dialog';
import { RewardListComponent } from '../reward-list/reward-list.component';

import { AngularFirestore } from 'angularfire2/firestore';
import { User } from 'src/app/models/user.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.css'],
  providers: []
})
export class BoardComponent implements OnInit, OnDestroy {

  boardId: string;
  boardName: string;
  boardAuth = false;

  userId: string;
  userSubscription: Subscription;
  userAccessLevel: number;
  userPoints: number;

  constructor(public dialog: MatDialog,
              private router: Router,
              private activatedRoute: ActivatedRoute,
              private afs: AngularFirestore) {

    this.boardId = this.activatedRoute.snapshot.paramMap.get('id');

    this.userId = 'XQAA';

    this.afs.collection('boards').doc(this.boardId).ref.get().then(doc => {
      if (doc.exists) {
        if (doc.data().ownerId === this.userId) {
          this.boardAuth = true;
        } else {
          doc.data().guestsId.forEach((element: any) => {
            if (this.userId === element) {
              this.boardAuth = true;
            } else {
              this.router.navigate(['/access-denied']);
            }
          });
        }
      } else {
        this.router.navigate(['/not-found']);
      }
    }).catch(error => {
      console.log('Error :', error);
    });

    this.userSubscription = this.afs.collection('boards').doc(this.boardId)
    .collection<User>('userList').doc(this.userId)
    .valueChanges().subscribe((user: User) => {
      this.userPoints = user.points;
      this.userAccessLevel = user.accessLevel;
    });

  }

  ngOnInit() { }

  ngOnDestroy() {
    this.userSubscription.unsubscribe();
  }

  onClickUserOptions(): void {
    this.dialog.open(UserOptionsComponent, {
      data: { boardId: this.boardId }
    });
  }

  onClickRewardList(): void {
    this.dialog.open(RewardListComponent, {
      data: {boardId: this.boardId}
    });
  }

}

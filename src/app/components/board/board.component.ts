import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserOptionsComponent } from '../user-options/user-options.component';
import { MatDialog } from '@angular/material/dialog';
import { RewardListComponent } from '../reward-list/reward-list.component';

import { AngularFirestore } from 'angularfire2/firestore';
import { BoardUser } from 'src/app/models/boardUser.model';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { UsersDetailProviderService } from 'src/app/services/users-detail-provider.service';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.css'],
  providers: [UsersDetailProviderService]
})
export class BoardComponent implements OnInit, OnDestroy {

  boardId: string;
  boardName: string;
  boardAuth = false;

  userId: string;
  userSubscription: Subscription;
  boardUserSubscription: Subscription;
  userAccessLevel: number;
  userPoints: number;
  userPhotoURL: string;

  constructor(public dialog: MatDialog,
              private router: Router,
              private activatedRoute: ActivatedRoute,
              private auth: AuthService,
              private afs: AngularFirestore,
              private usersDetailProvider: UsersDetailProviderService) {

    this.boardId = this.activatedRoute.snapshot.paramMap.get('id');

    this.userSubscription = this.auth.user$.subscribe(user => {
      if (user) {
        this.userId = user.uid;
        this.userPhotoURL = user.photoURL;

        this.afs.collection('boards').doc(this.boardId).ref.get().then(doc => {
          if (doc.exists) {
            if (doc.data().ownerId === this.userId) {
              this.authorized();
            } else {
              doc.data().guestsId.forEach((element: any) => {
                if (this.userId === element) {
                  this.authorized();
                }
              });
              if (!this.boardAuth) { this.router.navigate(['/access-denied']); }
            }
          } else { this.router.navigate(['/not-found']); }
        }).catch(error => {
          this.router.navigate(['/access-denied']);
          // console.log('Error :', error);
        });
      }
    });

  }

  authorized(): void {
    this.boardAuth = true;
    this.usersDetailProvider.init(this.boardId);
    this.boardUserSubscription = this.afs.collection('boards').doc(this.boardId)
    .collection<BoardUser>('userList').doc(this.userId)
    .valueChanges().subscribe((boardUser: BoardUser) => {
      this.userPoints = boardUser.points;
      this.userAccessLevel = boardUser.accessLevel;
    });
  }

  ngOnInit() { }

  ngOnDestroy() {
    if (this.boardUserSubscription) {
      this.boardUserSubscription.unsubscribe();
    }
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
  }

  onClickUserOptions(): void {
    this.dialog.open(UserOptionsComponent, {
      data: { boardId: this.boardId, usersDetailProvider: this.usersDetailProvider }
    });
  }

  onClickRewardList(): void {
    this.dialog.open(RewardListComponent, {
      data: {boardId: this.boardId}
    });
  }

  onClickBack(): void {
    this.router.navigate(['/boards']);
  }

  onClickLogout(): void {
    this.auth.signOut();
  }

}

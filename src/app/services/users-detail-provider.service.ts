import { Injectable, Optional, Inject, OnDestroy } from '@angular/core';
import { BoardUser } from '../models/boardUser.model';
import { Observable, Subscription } from 'rxjs';
import { AngularFirestore } from 'angularfire2/firestore';
import { map } from 'rxjs/operators';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UsersDetailProviderService implements OnDestroy{
  boardId: string;

  boardUserListObs: Observable<string[]>;
  boardUserListSubscription: Subscription;

  userListSubscription: Subscription;

  userList: User[];

  constructor(private afs: AngularFirestore) { }

  init(boardId: string): void {
    this.boardUserListObs = this.afs.collection('boards').doc(boardId)
    .collection('userList')
    .snapshotChanges().pipe(
      map(actions => {
        return actions.map(action => {
          const id = action.payload.doc.id as string;
          return id;
        });
      })) as Observable<string[]>;
    this.boardUserListSubscription = this.boardUserListObs.subscribe(boardUserList => {
      const userListObs = this.afs.collection('users', ref => ref.where('uid', 'in', boardUserList))
      .snapshotChanges().pipe(
        map(actions => {
          return actions.map(action => {
            const data = action.payload.doc.data() as User;
            const id = action.payload.doc.id;
            return {id, ...data};
          });
        })) as Observable<User[]>;
      this.userListSubscription = userListObs.subscribe(userList => {
        this.userList = userList;
      });
    });
  }

  ngOnDestroy() {
    this.userListSubscription.unsubscribe();
    this.boardUserListSubscription.unsubscribe();
  }

  getDisplayName(id: string): string {
    const user = this.userList.find(u => u.uid === id);
    if (user) {
      return user.displayName;
    }
    return;
  }

}


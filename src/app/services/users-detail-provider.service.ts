import { Injectable, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { AngularFirestore } from 'angularfire2/firestore';
import { map } from 'rxjs/operators';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UsersDetailProviderService implements OnDestroy {
  boardId: string;

  boardUserListSubscription: Subscription;

  userListSubscription: Subscription;

  userList: User[] = [];

  constructor(private afs: AngularFirestore) { }

  init(boardId: string): void {
    this.boardUserListSubscription = this.afs.collection('boards').doc(boardId)
    .collection('userList')
    .snapshotChanges().pipe(
      map(actions => {
        return actions.map(action => {
          const id = action.payload.doc.id as string;
          return id;
        });
      })).subscribe(boardUserList => {
      this.userListSubscription = this.afs.collection('users', ref => ref.where('uid', 'in', boardUserList))
      .snapshotChanges().pipe(
        map(actions => {
          return actions.map(action => {
            const data = action.payload.doc.data() as User;
            const id = action.payload.doc.id;
            return {id, ...data};
          });
        })).subscribe(userList => {
        this.userList = userList;
      });
    });
  }

  ngOnDestroy() {
    if (this.userListSubscription) {
      this.userListSubscription.unsubscribe();
    }
    if (this.boardUserListSubscription) {
      this.boardUserListSubscription.unsubscribe();
    }
  }

  getDisplayName(id: string): string {
    const user = this.userList.find(u => u.uid === id);
    if (user) {
      return user.displayName;
    }
    return 'Deleted user';
  }

  getPhotoUrl(id: string): string {
    const user = this.userList.find(u => u.uid === id);
    if (user) {
      return user.photoURL;
    }
    return;
  }

}


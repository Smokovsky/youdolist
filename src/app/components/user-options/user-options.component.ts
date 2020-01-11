import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { User } from 'src/app/models/user.model';
import { UserOptionsProviderService } from 'src/app/services/user-options-provider.service';


@Component({
  selector: 'app-user-options',
  templateUrl: './user-options.component.html',
  styleUrls: ['./user-options.component.css']
})
export class UserOptionsComponent implements OnInit {

  userOptionsProviderService: UserOptionsProviderService = this.data.userOptionsProviderService;
  userList: Array<User>;

  constructor(public dialog: MatDialog,
              public dialogRef: MatDialogRef<UserOptionsComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) {  }

  ngOnInit() {
    this.userOptionsProviderService.getUserListObs().subscribe((users: Array<User>) => {
      this.userList = users;
    });
  }


  onAddUserPoints(i: number): void {
    this.userOptionsProviderService.addUserPoints(this.userList[i].id, 100);
  }

  onSubUserPoints(i: number): void {
    this.userOptionsProviderService.substractUserPoints(this.userList[i].id, 100);
  }

  onClickDeleteUser(i: number): void {
    this.userOptionsProviderService.deleteUser(this.userList[i]);
  }

  onClickClose(): void {
    this.dialogRef.close();
  }
}

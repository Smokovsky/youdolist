import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { User } from 'src/app/models/user.model';
import { UserOptionsProviderService } from 'src/app/services/user-options-provider.service';
import { ValueInputDialogComponent } from '../shared/value-input-dialog/value-input-dialog.component';
import { ConfirmationDialogComponent } from '../shared/confirmation-dialog/confirmation-dialog.component';
import { SnackBarProviderService } from 'src/app/services/snack-bar-provider.service';


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
              @Inject(MAT_DIALOG_DATA) public data: any,
              private snackbarService: SnackBarProviderService) {  }

  ngOnInit() {
    this.userOptionsProviderService.getUserListObs().subscribe((users: Array<User>) => {
      this.userList = users;
    });
  }


  onAddUserPoints(i: number): void {
    const dialogRef = this.dialog.open(ValueInputDialogComponent, {
      width: '350px',
      data: 'Enter amount of points to be added'
    });
    dialogRef.afterClosed().subscribe((value: number) => {
      if (value) {
        this.userOptionsProviderService.addUserPoints(this.userList[i].id, value);
        this.snackbarService.openSnack('Added points to user');
      }
    });
  }

  onSubUserPoints(i: number): void {
    const dialogRef = this.dialog.open(ValueInputDialogComponent, {
      width: '350px',
      data: 'Enter amount of points to be substracted'
    });
    dialogRef.afterClosed().subscribe((value: number) => {
      if (value) {
        this.userOptionsProviderService.substractUserPoints(this.userList[i].id, value);
        this.snackbarService.openSnack('Substracted points from user');
      }
    });
  }

  onIncreaseUserLevel(i: number): void {
    this.userOptionsProviderService.increaseUserLevel(this.userList[i].id);
  }

  onDecreaseUserLevel(i: number): void {
    this.userOptionsProviderService.decreaseUserLevel(this.userList[i].id);
  }

  onClickDeleteUser(i: number): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '350px',
      data: 'Are you sure you want to delete this user? This cannot be undone.'
    });
    dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.userOptionsProviderService.deleteUser(this.userList[i]);
          this.snackbarService.openSnack('User deleted');
        }
      });
  }

  onClickClose(): void {
    this.dialogRef.close();
  }
}

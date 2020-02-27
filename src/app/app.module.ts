import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DragDropModule } from '@angular/cdk/drag-drop';

import { AppComponent } from './app.component';
import { CategoryComponent } from './components/category/category.component';
import { TaskComponent } from './components/task/task.component';
import { EditTaskComponent } from './components/edit-task/edit-task.component';
import { NewCategoryComponent } from './components/new-category/new-category.component';
import { DoneListComponent } from './components/done-list/done-list.component';
import { ConfirmationDialogComponent } from './components/shared/confirmation-dialog/confirmation-dialog.component';
import { BoardComponent } from './components/board/board.component';
import { BoardsComponent } from './components/boards/boards.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { EditBoardComponent } from './components/edit-board/edit-board.component';
import { AccessDeniedComponent } from './components/access-denied/access-denied.component';
import { TaskDoneComponent } from './components/task-done/task-done.component';
import { UndoOptionsComponent } from './components/undo-options/undo-options.component';
import { UserOptionsComponent } from './components/user-options/user-options.component';
import { ValueInputDialogComponent } from './components/shared/value-input-dialog/value-input-dialog.component';
import { RewardListComponent } from './components/reward-list/reward-list.component';
import { EditRewardComponent } from './components/edit-reward/edit-reward.component';

import { AngularFireModule } from 'angularfire2';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { environment } from '../environments/environment';
import { LoginComponent } from './components/login/login.component';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireAuthModule } from '@angular/fire/auth';

@NgModule({
  declarations: [
    AppComponent,
    CategoryComponent,
    TaskComponent,
    EditTaskComponent,
    NewCategoryComponent,
    DoneListComponent,
    ConfirmationDialogComponent,
    BoardComponent,
    BoardsComponent,
    NotFoundComponent,
    EditBoardComponent,
    AccessDeniedComponent,
    TaskDoneComponent,
    UndoOptionsComponent,
    UserOptionsComponent,
    ValueInputDialogComponent,
    RewardListComponent,
    EditRewardComponent,
    LoginComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    BrowserAnimationsModule,
    MatDialogModule,
    MatButtonModule,
    MatSnackBarModule,
    MatDatepickerModule,
    MatNativeDateModule,
    NgbModule,
    DragDropModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireDatabaseModule,
    AngularFireAuthModule,
    AngularFirestoreModule
  ],
  entryComponents: [
    EditTaskComponent,
    EditBoardComponent,
    UndoOptionsComponent,
    UserOptionsComponent,
    ConfirmationDialogComponent,
    ValueInputDialogComponent,
    RewardListComponent,
    EditRewardComponent
  ],
  providers: [],
  bootstrap: [AppComponent]
})

export class AppModule { }

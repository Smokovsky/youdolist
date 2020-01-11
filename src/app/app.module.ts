import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DragDropModule } from '@angular/cdk/drag-drop';

import { AppComponent } from './app.component';
import { CategoryComponent } from './components/category/category.component';
import { TaskComponent } from './components/task/task.component';
import { TodoComponent } from './components/todo/todo.component';
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

@NgModule({
  declarations: [
    AppComponent,
    CategoryComponent,
    TaskComponent,
    TodoComponent,
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
    UserOptionsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    BrowserAnimationsModule,
    MatDialogModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    NgbModule,
    DragDropModule
  ],
  entryComponents: [
    EditTaskComponent,
    EditBoardComponent,
    UndoOptionsComponent,
    UserOptionsComponent,
    ConfirmationDialogComponent
  ],
  providers: [],
  bootstrap: [AppComponent]
})

export class AppModule { }

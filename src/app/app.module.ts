import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { CategoryComponent } from './components/category/category.component';
import { TaskComponent } from './components/task/task.component';
import { TodoComponent } from './components/todo/todo.component';
import { EditTaskComponent } from './components/edit-task/edit-task.component';
import { NewCategoryComponent } from './components/new-category/new-category.component';
import { DoneListComponent } from './components/done-list/done-list.component';

@NgModule({
  declarations: [
    AppComponent,
    CategoryComponent,
    TaskComponent,
    TodoComponent,
    EditTaskComponent,
    NewCategoryComponent,
    DoneListComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    BrowserAnimationsModule,
    MatDialogModule,
    NgbModule
  ],
  entryComponents: [
    EditTaskComponent
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

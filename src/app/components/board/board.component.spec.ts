import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { BoardComponent } from './board.component';
import { CategoryComponent } from '../category/category.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { TaskComponent } from '../task/task.component';
import { NewCategoryComponent } from '../new-category/new-category.component';
import { DoneListComponent } from '../done-list/done-list.component';
import { FormsModule } from '@angular/forms';
import { TaskDoneComponent } from '../task-done/task-done.component';
import { AngularFireModule } from 'angularfire2';
import { environment } from 'src/environments/environment';
import { MatDialogModule } from '@angular/material/dialog';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { AngularFireAuthModule } from '@angular/fire/auth';

describe('BoardComponent', () => {
  let component: BoardComponent;
  let fixture: ComponentFixture<BoardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BoardComponent, CategoryComponent, TaskComponent,
        TaskDoneComponent, NewCategoryComponent, DoneListComponent ],
      imports: [ RouterTestingModule, DragDropModule, FormsModule,
        AngularFirestoreModule, AngularFireAuthModule,
        AngularFireModule.initializeApp(environment.firebaseConfig), MatDialogModule ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BoardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

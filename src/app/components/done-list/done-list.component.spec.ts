import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { DoneListComponent } from './done-list.component';
import { TaskComponent } from '../task/task.component';
import { NewCategoryComponent } from '../new-category/new-category.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { FormsModule } from '@angular/forms';
import { TaskDoneComponent } from '../task-done/task-done.component';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { AngularFireModule } from 'angularfire2';
import { environment } from 'src/environments/environment';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { MatSnackBarModule } from '@angular/material/snack-bar';



describe('DoneListComponent', () => {
  let component: DoneListComponent;
  let fixture: ComponentFixture<DoneListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [   DoneListComponent,
                        TaskComponent,
                        TaskDoneComponent,
                        NewCategoryComponent,
                        DoneListComponent ],
      imports: [    RouterTestingModule, AngularFireModule.initializeApp(environment.firebaseConfig),
                    DragDropModule, MatDialogModule, AngularFirestoreModule, AngularFireAuthModule,
                    MatSnackBarModule, FormsModule ],
      providers: [  MatDialogModule, MatDialog ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DoneListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

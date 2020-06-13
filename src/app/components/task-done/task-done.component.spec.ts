import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { TaskDoneComponent } from './task-done.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatDialogModule } from '@angular/material/dialog';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { AngularFireModule } from 'angularfire2';
import { environment } from 'src/environments/environment';
import {  } from 'src/app/services/auth.service';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { MatSnackBarModule } from '@angular/material/snack-bar';

describe('TaskDoneComponent', () => {
  let component: TaskDoneComponent;
  let fixture: ComponentFixture<TaskDoneComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TaskDoneComponent ],
      imports: [ RouterTestingModule, DragDropModule,
        MatDialogModule, AngularFireModule.initializeApp(environment.firebaseConfig),
        AngularFirestoreModule, AngularFireAuthModule, MatSnackBarModule ],
        providers: [  ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TaskDoneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

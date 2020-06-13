import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { RewardListComponent } from './reward-list.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatDialogModule, MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { AngularFireModule } from 'angularfire2';
import { environment } from 'src/environments/environment';
import {  } from 'src/app/services/auth.service';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { MatSnackBarModule } from '@angular/material/snack-bar';

describe('RewardListComponent', () => {
  let component: RewardListComponent;
  let fixture: ComponentFixture<RewardListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RewardListComponent ],
      imports: [ RouterTestingModule, DragDropModule,
        MatDialogModule, AngularFireModule.initializeApp(environment.firebaseConfig),
        AngularFirestoreModule, AngularFireAuthModule, MatSnackBarModule ],
        providers: [ RewardListComponent,
                    {provide: MAT_DIALOG_DATA, useValue: {}},
                    {provide: MatDialogRef, useValue: {}} ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RewardListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { EditRewardComponent } from './edit-reward.component';
import { FormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { AngularFireModule } from 'angularfire2';
import { environment } from 'src/environments/environment';
import { AngularFireAuthModule } from '@angular/fire/auth';


describe('EditRewardComponent', () => {
  let component: EditRewardComponent;
  let fixture: ComponentFixture<EditRewardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditRewardComponent ],
      imports: [ RouterTestingModule, FormsModule, MatDialogModule, MatSnackBarModule,
    AngularFirestoreModule, AngularFireModule.initializeApp(environment.firebaseConfig),
AngularFireAuthModule ],
      providers: [ {provide: MAT_DIALOG_DATA, useValue: {}},
                    {provide: MatDialogRef, useValue: {}}]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditRewardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

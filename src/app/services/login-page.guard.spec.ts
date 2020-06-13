import { TestBed } from '@angular/core/testing';

import { LoginPageGuard } from './login-page.guard';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { environment } from 'src/environments/environment';
import { AngularFireModule } from 'angularfire2';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { RouterTestingModule } from '@angular/router/testing';

describe('LoginPageGuard', () => {
  beforeEach(() => TestBed.configureTestingModule({
      imports: [ RouterTestingModule, AngularFireAuthModule, AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFirestoreModule ]
  }));

  it('should be created', () => {
    const service: LoginPageGuard = TestBed.get(LoginPageGuard);
    expect(service).toBeTruthy();
  });
});

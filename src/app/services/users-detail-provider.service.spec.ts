import { TestBed } from '@angular/core/testing';

import { UsersDetailProviderService } from './users-detail-provider.service';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { environment } from 'src/environments/environment';
import { AngularFireModule } from 'angularfire2';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { RouterTestingModule } from '@angular/router/testing';

describe('UserDetailProviderService', () => {
  beforeEach(() => TestBed.configureTestingModule({
      imports: [ RouterTestingModule, AngularFireAuthModule, AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFirestoreModule ]
  }));

  it('should be created', () => {
    const service: UsersDetailProviderService = TestBed.get(UsersDetailProviderService);
    expect(service).toBeTruthy();
  });
});

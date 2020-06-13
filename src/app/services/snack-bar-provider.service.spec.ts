import { TestBed } from '@angular/core/testing';

import { SnackBarProviderService } from './snack-bar-provider.service';
import { MatSnackBarModule } from '@angular/material/snack-bar';

describe('SnackBarProviderService', () => {
  beforeEach(() => TestBed.configureTestingModule({
      imports: [ MatSnackBarModule ]
  }));

  it('should be created', () => {
    const service: SnackBarProviderService = TestBed.get(SnackBarProviderService);
    expect(service).toBeTruthy();
  });
});

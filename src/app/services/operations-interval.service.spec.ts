import { TestBed } from '@angular/core/testing';

import { OperationsIntervalService } from './operations-interval.service';
import { MatSnackBarModule } from '@angular/material/snack-bar';

describe('OperationsIntervalService', () => {
  beforeEach(() => TestBed.configureTestingModule({
      imports: [ MatSnackBarModule ]
  }));

  it('should be created', () => {
    const service: OperationsIntervalService = TestBed.get(OperationsIntervalService);
    expect(service).toBeTruthy();
  });
});

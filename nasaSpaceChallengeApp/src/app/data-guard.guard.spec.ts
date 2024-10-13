import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { dataGuardGuard } from './data-guard.guard';

describe('dataGuardGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => dataGuardGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});

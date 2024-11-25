import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { memberauthGuard } from './memberauth.guard';

describe('memberauthGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => memberauthGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});

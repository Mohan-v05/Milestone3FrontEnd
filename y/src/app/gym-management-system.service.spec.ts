import { TestBed } from '@angular/core/testing';

import { GymManagementSystemService } from './gym-management-system.service';

describe('GymManagementSystemService', () => {
  let service: GymManagementSystemService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GymManagementSystemService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

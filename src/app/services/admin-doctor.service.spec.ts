import { TestBed } from '@angular/core/testing';

import { DoctorService } from './admin-doctor.service';

describe('AdminDoctorService', () => {
  let service: DoctorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DoctorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

import { TestBed } from '@angular/core/testing';

import { FqaService } from './fqa.service';

describe('FqaService', () => {
  let service: FqaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FqaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

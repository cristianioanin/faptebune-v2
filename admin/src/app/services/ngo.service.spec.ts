import { TestBed } from '@angular/core/testing';

import { NgoService } from './ngo.service';

describe('NgoService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: NgoService = TestBed.get(NgoService);
    expect(service).toBeTruthy();
  });
});

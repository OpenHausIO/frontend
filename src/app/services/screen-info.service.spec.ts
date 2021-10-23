import { TestBed } from '@angular/core/testing';

import { ScreenInfoService } from './screen-info.service';

describe('ScreenInfoService', () => {
  let service: ScreenInfoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ScreenInfoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

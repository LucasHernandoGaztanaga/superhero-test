import { TestBed } from '@angular/core/testing';

import { HeroStoreService } from './hero.store.service';

describe('HeroStoreService', () => {
  let service: HeroStoreService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HeroStoreService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

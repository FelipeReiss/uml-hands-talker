import { TestBed } from '@angular/core/testing';

import { FavoritesWordsService } from './favoritesWords.service';

describe('FavoritesWordsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: FavoritesWordsService = TestBed.get(FavoritesWordsService);
    expect(service).toBeTruthy();
  });
});

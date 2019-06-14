import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WordSavePage } from './word-save.page';

describe('WordSavePage', () => {
  let component: WordSavePage;
  let fixture: ComponentFixture<WordSavePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WordSavePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WordSavePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WordShowPage } from './word-show.page';

describe('WordShowPage', () => {
  let component: WordShowPage;
  let fixture: ComponentFixture<WordShowPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WordShowPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WordShowPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

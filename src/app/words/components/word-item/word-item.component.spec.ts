import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WordItemComponent } from './word-item.component';

describe('WordItemComponent', () => {
  let component: WordItemComponent;
  let fixture: ComponentFixture<WordItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WordItemComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WordItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

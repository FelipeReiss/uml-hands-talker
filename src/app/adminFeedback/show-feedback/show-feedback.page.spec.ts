import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowFeedbackPage } from './show-feedback.page';

describe('ShowFeedbackPage', () => {
  let component: ShowFeedbackPage;
  let fixture: ComponentFixture<ShowFeedbackPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShowFeedbackPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowFeedbackPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminFeedbackPage } from './adminFeedback.page';

describe('AdminFeedbackPage', () => {
  let component: AdminFeedbackPage;
  let fixture: ComponentFixture<AdminFeedbackPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AdminFeedbackPage],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminFeedbackPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

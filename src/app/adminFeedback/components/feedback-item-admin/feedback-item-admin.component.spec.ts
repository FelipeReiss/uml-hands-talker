import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FeedbackItemAdminComponent } from './feedback-item-admin.component';

describe('FeedbackItemAdminComponent', () => {
  let component: FeedbackItemAdminComponent;
  let fixture: ComponentFixture<FeedbackItemAdminComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FeedbackItemAdminComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FeedbackItemAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminSettingsPage } from './adminSettings.page';

describe('AdminSettingsPage', () => {
  let component: AdminSettingsPage;
  let fixture: ComponentFixture<AdminSettingsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AdminSettingsPage],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminSettingsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

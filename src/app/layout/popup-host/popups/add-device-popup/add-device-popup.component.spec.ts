import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddDevicePopupComponent } from './add-device-popup.component';

describe('AddDevicePopupComponent', () => {
  let component: AddDevicePopupComponent;
  let fixture: ComponentFixture<AddDevicePopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddDevicePopupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddDevicePopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

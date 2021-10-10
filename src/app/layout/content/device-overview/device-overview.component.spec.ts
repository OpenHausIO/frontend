import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceOverviewComponent } from './device-overview.component';

describe('DeviceOverviewComponent', () => {
  let component: DeviceOverviewComponent;
  let fixture: ComponentFixture<DeviceOverviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeviceOverviewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

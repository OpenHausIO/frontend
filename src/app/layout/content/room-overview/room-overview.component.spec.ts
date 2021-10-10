import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoomOverviewComponent } from './room-overview.component';

describe('RoomOverviewComponent', () => {
  let component: RoomOverviewComponent;
  let fixture: ComponentFixture<RoomOverviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RoomOverviewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RoomOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SidebarRouteComponent } from './sidebar-route.component';

describe('SidebarRouteComponent', () => {
  let component: SidebarRouteComponent;
  let fixture: ComponentFixture<SidebarRouteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SidebarRouteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SidebarRouteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

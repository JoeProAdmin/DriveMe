import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DriverView } from './driver-view';

describe('DriverView', () => {
  let component: DriverView;
  let fixture: ComponentFixture<DriverView>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DriverView],
    }).compileComponents();

    fixture = TestBed.createComponent(DriverView);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

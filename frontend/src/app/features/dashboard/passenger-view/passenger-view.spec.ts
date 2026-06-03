import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PassengerView } from './passenger-view';

describe('PassengerView', () => {
  let component: PassengerView;
  let fixture: ComponentFixture<PassengerView>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PassengerView],
    }).compileComponents();

    fixture = TestBed.createComponent(PassengerView);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

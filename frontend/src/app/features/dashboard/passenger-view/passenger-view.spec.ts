import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PassengerViewComponent } from './passenger-view';

describe('PassengerViewComponent', () => {

  let component: PassengerViewComponent;
  let fixture: ComponentFixture<PassengerViewComponent>;

  beforeEach(async () => {

    await TestBed.configureTestingModule({
      imports: [PassengerViewComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(PassengerViewComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

});

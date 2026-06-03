import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdminViewComponent } from './admin-view';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('AdminViewComponent', () => {
  let component: AdminViewComponent;
  let fixture: ComponentFixture<AdminViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminViewComponent, HttpClientTestingModule],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

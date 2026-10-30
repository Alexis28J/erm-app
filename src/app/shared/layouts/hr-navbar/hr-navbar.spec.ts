import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HrNavbar } from './hr-navbar';

describe('HrNavbar', () => {
  let component: HrNavbar;
  let fixture: ComponentFixture<HrNavbar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HrNavbar],
    }).compileComponents();

    fixture = TestBed.createComponent(HrNavbar);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

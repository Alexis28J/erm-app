import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HrLayout } from './hr-layout';

describe('HrLayout', () => {
  let component: HrLayout;
  let fixture: ComponentFixture<HrLayout>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HrLayout],
    }).compileComponents();

    fixture = TestBed.createComponent(HrLayout);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ExpenseLimitsSettings } from './expense-limits-settings';

describe('ExpenseLimitsSettings', () => {
  let component: ExpenseLimitsSettings;
  let fixture: ComponentFixture<ExpenseLimitsSettings>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExpenseLimitsSettings],
    }).compileComponents();

    fixture = TestBed.createComponent(ExpenseLimitsSettings);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

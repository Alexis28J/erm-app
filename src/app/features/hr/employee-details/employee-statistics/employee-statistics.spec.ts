import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EmployeeStatistics } from './employee-statistics';

describe('EmployeeStatistics', () => {
  let component: EmployeeStatistics;
  let fixture: ComponentFixture<EmployeeStatistics>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmployeeStatistics],
    }).compileComponents();

    fixture = TestBed.createComponent(EmployeeStatistics);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

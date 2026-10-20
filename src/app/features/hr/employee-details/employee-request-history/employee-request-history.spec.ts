import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EmployeeRequestHistory } from './employee-request-history';

describe('EmployeeRequestHistory', () => {
  let component: EmployeeRequestHistory;
  let fixture: ComponentFixture<EmployeeRequestHistory>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmployeeRequestHistory],
    }).compileComponents();

    fixture = TestBed.createComponent(EmployeeRequestHistory);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

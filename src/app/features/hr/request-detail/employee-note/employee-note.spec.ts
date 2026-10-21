import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EmployeeNote } from './employee-note';

describe('EmployeeNote', () => {
  let component: EmployeeNote;
  let fixture: ComponentFixture<EmployeeNote>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmployeeNote],
    }).compileComponents();

    fixture = TestBed.createComponent(EmployeeNote);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

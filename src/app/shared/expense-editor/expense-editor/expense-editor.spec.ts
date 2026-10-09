import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ExpenseEditor } from './expense-editor';

describe('ExpenseEditor', () => {
  let component: ExpenseEditor;
  let fixture: ComponentFixture<ExpenseEditor>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExpenseEditor],
    }).compileComponents();

    fixture = TestBed.createComponent(ExpenseEditor);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

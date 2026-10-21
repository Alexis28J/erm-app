import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HrNotes } from './hr-notes';

describe('HrNotes', () => {
  let component: HrNotes;
  let fixture: ComponentFixture<HrNotes>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HrNotes],
    }).compileComponents();

    fixture = TestBed.createComponent(HrNotes);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

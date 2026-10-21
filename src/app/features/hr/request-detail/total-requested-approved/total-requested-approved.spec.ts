import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TotalRequestedApproved } from './total-requested-approved';

describe('TotalRequestedApproved', () => {
  let component: TotalRequestedApproved;
  let fixture: ComponentFixture<TotalRequestedApproved>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TotalRequestedApproved],
    }).compileComponents();

    fixture = TestBed.createComponent(TotalRequestedApproved);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReviewActions } from './review-actions';

describe('ReviewActions', () => {
  let component: ReviewActions;
  let fixture: ComponentFixture<ReviewActions>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReviewActions],
    }).compileComponents();

    fixture = TestBed.createComponent(ReviewActions);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

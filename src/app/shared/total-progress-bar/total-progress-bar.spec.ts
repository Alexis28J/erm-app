import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TotalProgressBar } from './total-progress-bar';

describe('TotalProgressBar', () => {
  let component: TotalProgressBar;
  let fixture: ComponentFixture<TotalProgressBar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TotalProgressBar],
    }).compileComponents();

    fixture = TestBed.createComponent(TotalProgressBar);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RequestDetailsCard } from './request-details-card';

describe('RequestDetailsCard', () => {
  let component: RequestDetailsCard;
  let fixture: ComponentFixture<RequestDetailsCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RequestDetailsCard],
    }).compileComponents();

    fixture = TestBed.createComponent(RequestDetailsCard);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

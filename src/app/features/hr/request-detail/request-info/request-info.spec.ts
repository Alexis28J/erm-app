import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RequestInfo } from './request-info';

describe('RequestInfo', () => {
  let component: RequestInfo;
  let fixture: ComponentFixture<RequestInfo>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RequestInfo],
    }).compileComponents();

    fixture = TestBed.createComponent(RequestInfo);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

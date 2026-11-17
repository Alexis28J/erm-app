import { TestBed } from '@angular/core/testing';
import { RequestFormFacade } from './request-form.facade';

describe('RequestFormFacade', () => {
  let service: RequestFormFacade;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RequestFormFacade);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

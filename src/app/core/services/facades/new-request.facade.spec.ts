import { TestBed } from '@angular/core/testing';
import { NewRequestFacade } from './new-request.facade';

describe('NewRequestFacade', () => {
  let service: NewRequestFacade;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NewRequestFacade);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

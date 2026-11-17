import { TestBed } from '@angular/core/testing';
import { EditRequestFacade } from './edit-request.facade';

describe('EditRequestFacade', () => {
  let service: EditRequestFacade;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EditRequestFacade);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

import { TestBed } from '@angular/core/testing';
import { NewRequestFacade } from './new-request.facade';
import { of } from 'rxjs';
import { RequestFormFacade } from './request-form.facade';
import { AuthService } from '../auth.service';
import { RefundRequestService } from '../refund-request.service';

describe('NewRequestFacade', () => {

  let facade: NewRequestFacade;

  // Mock per RequestFormFacade
  const requestFormFacadeMock = {
    requestForm: {
      value: {
        referenceMonth: '2026-11',
        noteEmployee: 'Test note',
        expenses: []
      }
    },

    totalRequestedAmount: vi.fn(
      () => 100
    ),

    validateForm: vi.fn(
      () => null
    )
  };


  // Mock per AuthService
  const authServiceMock = {
    getCurrentUser: vi.fn(() => {
      id: 'user-1'
    })
  };


  // Mock per RefundRequestService
  const refundRequestServiceMock = {
    createRequest: vi.fn(() =>
      of({}))
  };
  

  // MODULO DI TEST E INIEZIONE DEL FACADE PRIMA DI OGNI TEST
  beforeEach(() => {

    vi.clearAllMocks();

    TestBed.configureTestingModule({
      providers: [
        NewRequestFacade,
        { provide: RequestFormFacade, useValue: requestFormFacadeMock },
        { provide: AuthService, useValue: authServiceMock },
        { provide: RefundRequestService, useValue: refundRequestServiceMock }
      ]
    });
    facade = TestBed.inject(
      NewRequestFacade
    );

  });


  it('should be created', () => {

  });

});

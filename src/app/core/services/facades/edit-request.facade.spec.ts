// import { TestBed } from '@angular/core/testing';
// import { EditRequestFacade } from './edit-request.facade';
// import { of } from 'rxjs';
// import { RequestFormFacade } from './request-form.facade';
// import { AuthService } from '../auth.service';
// import { RefundRequestService } from '../refund-request.service';
// import { ActivatedRoute } from '@angular/router';

// describe('EditRequestFacade', () => {

//   let facade: EditRequestFacade;  // Instanza del facade da testare


//   // MOCK PER IL REQUEST FORM FACADE (simula il comportamento del RequestFormFacade)
//   const requestFormFacadeMock = {
//     requestForm: {
//       value: {
//         referenceMonth: '2026-11',
//         noteEmployee: 'note',
//         expenses: []
//       },
//       patchValue: vi.fn()
//     },
//     populateExpenses: vi.fn(),
//     validateForm: vi.fn(),
//     totalRequestedAmount: vi.fn()
//   };


//   // MOCK PER IL AUTH SERVICE (simula il comportamento del AuthService)
//   const authServiceMock = {
//     getCurrentUser: vi.fn()
//   };


//   // MOCK PER IL REFUND REQUEST SERVICE (simula il comportamento del RefundRequestService)
//   const refundRequestServiceMock = {
//     getRequestedById: vi.fn(),
//     updateRequest: vi.fn()
//   };


//   // 
//   beforeEach(() => {

//     refundRequestServiceMock.getRequestedById.mockReturnValue(
//       of({
//         id: '1',
//         referenceMonth: '2026-11',
//         noteEmployee: 'note',
//         expenses: []
//       })
//     );

//     TestBed.configureTestingModule(
//       {
//         providers: [EditRequestFacade,
//           {provide: RequestFormFacade, useValue: requestFormFacadeMock},
//           {provide: AuthService, useValue: authServiceMock},
//           {provide: RefundRequestService, useValue: refundRequestServiceMock},
//           {provide: ActivatedRoute, 
//             useValue: {
//               snapshot: {
//                 paramMap: {
//                   get: vi.fn().mockReturnValue('1')
//                 }
//               }
//             }
//           }
//         ],
//       }
//     )

    

//   });



// });

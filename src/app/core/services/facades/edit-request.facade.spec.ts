import { TestBed } from '@angular/core/testing';
import { EditRequestFacade } from './edit-request.facade';
import { of } from 'rxjs';
import { RequestFormFacade } from './request-form.facade';
import { AuthService } from '../auth.service';
import { RefundRequestService } from '../refund-request.service';
import { RequestStatus } from '../../interfaces/enum';
import { RefundRequest } from '../../interfaces/refund-request';

describe('EditRequestFacade', () => {

    let facade: EditRequestFacade;

    // MOCK PER IL REQUEST FORM FACADE (simula il comportamento del RequestFormFacade)
    const requestFormFacadeMock = {
        requestForm: {
            value: {
                referenceMonth: '2026-11',
                noteEmployee: 'Test note',
                expenses: []
            },

            patchValue: vi.fn(),
            reset: vi.fn()
        },

        populateExpenses: vi.fn(),
        totalRequestedAmount: vi.fn(
            () => 100
        ),

        validateForm: vi.fn<
            () => string | null
        >(() => null)
    };


    // MOCK PER IL AUTH SERVICE (simula il comportamento del AuthService)
    const authServiceMock = {
        getCurrentUser: vi.fn<
            () => { id: string } | null
        >(() => ({
            id: 'user-1'
        }))
    };


    // MOCK PER IL REFUND REQUEST SERVICE (simula il comportamento del RefundRequestService)
    const refundRequestServiceMock = {
        updateRequest: vi.fn(() =>
            of({})
        )
    };


    // MOCK PER IL REQUEST (simula un oggetto request)
    const requestMock: RefundRequest = {
        id: '1',
        referenceMonth: '2026-11',
        noteEmployee: 'My note',
        expenses: [],
        totalRequestedAmount: 0,
        totalApprovedAmount: 0,
        status: RequestStatus.DRAFT,
        creationDate: '',
        lastUpdateDate: '',
        userId: 'user-1',
        noteHr: ''
    };


    // CONFIGURAZIONE INIZIALE DEI MOCK E DEL TEST BED
    beforeEach(() => {

        vi.clearAllMocks();

        TestBed.configureTestingModule({
            providers: [

                EditRequestFacade,

                { provide: RequestFormFacade, useValue: requestFormFacadeMock },
                { provide: AuthService, useValue: authServiceMock },
                { provide: RefundRequestService, useValue: refundRequestServiceMock }

            ]
        });

        facade = TestBed.inject(EditRequestFacade);

    });


    // TEST PER L'INIZIALIZZAZIONE DEL FORM CON I DATI DEL REQUEST
    it('should populate expenses during initialization', async () => {

        facade.initialize(requestMock);

        await Promise.resolve();

        expect(
            requestFormFacadeMock.populateExpenses
        ).toHaveBeenCalledWith(
            requestMock.expenses
        );

    });


    // TEST PER IL SALVATAGGIO DELLA BOZZA
    it('should save draft', () => {

        facade.initialize(requestMock);

        facade.saveDraft().subscribe();

        expect(
            refundRequestServiceMock.updateRequest
        ).toHaveBeenCalled();

    })


    // TEST PER LO STATUS DRAFT
    it('should update request with DRAFT status', () => {

        facade.initialize(requestMock);

        facade.saveDraft()
            .subscribe();

        expect(
            refundRequestServiceMock.updateRequest
        ).toHaveBeenCalledWith(
            '1', expect.objectContaining({
                status: RequestStatus.DRAFT
            })
        );

    });


    // TEST PER INVIARE LA RICHIESTA (STATUS PENDING)
    it('should update request with PENDING status', () => {

        facade.initialize(requestMock);

        facade.submitRequest().
            subscribe();

        expect(
            refundRequestServiceMock.updateRequest
        ).toHaveBeenCalledWith(
            '1', expect.objectContaining({
                status: RequestStatus.PENDING
            })
        );
    });


    // TEST PER LA VALIDAZIONE
    it('should return validation error', () => {

        facade.initialize(requestMock);

        requestFormFacadeMock
            .validateForm
            .mockReturnValueOnce(
                'Form invalid'
            );

        facade.submitRequest()
            .subscribe({
                next: () => {
                    throw new Error(
                        'Expected validation error'
                    );
                },
                error: error => {
                    expect(error.message)
                        .toBe('Form invalid');
                }
            });
    })


    // TEST PER NON CHIAMARE UPDATE REQUEST QUANDO LA VALIDAZIONE FALLISCE
    it('should not call updateRequest when validation fails', () => {

        facade.initialize(requestMock);

        requestFormFacadeMock.validateForm
            .mockReturnValueOnce(
                'Form invalid'
            );

        facade.submitRequest()
            .subscribe({
                error: () => {

                    expect(
                        refundRequestServiceMock.updateRequest
                    ).not.toHaveBeenCalled();

                }
            });

    });


    // TEST PER RICHIESTA NON INIZIALIZZATA
    it('should throw when request is not loaded', () => {
        expect(() => {
            facade.saveDraft();
        }).toThrow(
            'Request not loaded'
        );
    });


    // TEST UTENTE NON TROVATO
    it('should return user not found error', () => {

        facade.initialize(requestMock);

        authServiceMock
            .getCurrentUser
            .mockReturnValueOnce(null);

        facade.submitRequest()
            .subscribe({

                next: () => {
                    throw new Error(
                        'Expected error'
                    );
                },
                error: error => {
                    expect(error.message)
                        .toBe('User not found');
                }

            });

    })

});



// VS Code Counter: 166 code lines (23/11/2026)



// TEST VERIFICATI (23/11/2026): 
// 1. 'should populate expenses during initialization' (Popolamento del form) (avvenuto con successo)
// 2. 'should save draft' (Salvataggio come bozza) (avvenuto con successo)
// 3. 'should update request with DRAFT status' 
// (Salvataggio con stato DRAFT) (avvenuto con successo)
// 4. 'should update request with PENDING status' 
// (Salvataggio con stato PENDING) (avvenuto con successo)
// 5. 'should return validation error' (Errore di validazione) (avvenuto con successo)
// 6. 'should not call updateRequest when validation fails' 
// (Non chiamare updateRequest quando la validazione fallisce) (avvenuto con successo)
// 7. 'should throw when request is not loaded' (Richiesta non caricata) (avvenuto con successo)
// 8. 'should return user not found error' (Utente non trovato) (avvenuto con successo)
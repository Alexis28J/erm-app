import { TestBed } from '@angular/core/testing';
import { NewRequestFacade } from './new-request.facade';
import { of, Observable } from 'rxjs';
import type { RefundRequest } from '../../interfaces/refund-request';
import { RequestFormFacade } from './request-form.facade';
import { AuthService } from '../auth.service';
import { RefundRequestService } from '../refund-request.service';
import { vi, describe, beforeEach, it, expect } from 'vitest';
import { RequestStatus } from '../../interfaces/enum';

describe('NewRequestFacade', () => {

  let facade: NewRequestFacade;

  // MOCK PER RequestFormFacade
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

    validateForm: vi.fn<() => string | null>(
      () => null
    )

  };


  // MOCK PER AuthService
  const authServiceMock = {
    getCurrentUser: vi.fn<() => { id: string } | null>(() => ({
      id: 'user-1'
    }))
  };


  // MOCK PER RefundRequestService
  const refundRequestServiceMock = {
    createRequest: vi.fn<(request: RefundRequest) => Observable<any>>(() =>
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


  ///// TEST PER METODO "SALVARE COME BOZZA" /////

  // TEST PER LA CHIAMATA AL SERVIZIO QUANDO SI SALVA COME BOZZA
  it('should save draft request', () => {

    // Esecuzione dell'azione (Act)
    facade.saveDraft()
      .subscribe();

    // Verifica del risultato (Assert)
    expect(
      refundRequestServiceMock.createRequest
    ).toHaveBeenCalled();

  });


  // TEST PER LA CREAZIONE DELLA BOZZA CON STATUS "DRAFT"
  it('should create draft request with DRAFT status', () => {

    // Esecuzione dell'azione (Act)
    facade.saveDraft()
      .subscribe();


    // // Cattura dell'argomento inviato (Spy)
    // // Durante l'esecuzione di saveDraft(), la Facade chiama internamente refundRequestService.createRequest(payload).
    // // Essendo createRequest una funzione simulata (mockata con vi.fn()), Vitest registra tutto ciò che le viene passato.
    // // .mock.calls[0][0]: estrae il primo argomento (indice [0]) della prima chiamata (indice [0]). 
    // // In pratica, cattura l'oggetto payload (i dati della richiesta) che la Facade ha costruito e passato al servizio, salvandolo nella costante request.
    // const request = refundRequestServiceMock
    //   .createRequest
    //   .mock.calls[0][0];


    // // Verifica del risultato (Assert)
    // // Controlla che all'interno dell'oggetto request appena intercettato, 
    // // la proprietà .status sia esattamente uguale al valore dell'enum RequestStatus.DRAFT.  
    // // Se la Facade ha costruito correttamente l'oggetto con quello stato, il test passa (verde); altrimenti fallisce (rosso).
    // expect(request.status)
    //   .toBe(RequestStatus.DRAFT)

    // FORMA ALTERNATIVA
    expect(
      refundRequestServiceMock.createRequest
    ).toHaveBeenCalledWith(
      expect.objectContaining({
        status: RequestStatus.DRAFT
      })
    );

  })


  ///// TEST PER METODO "INVIARE RICHIESTA" /////
  it('should submit request with PENDING status', () => {

    // Esecuzione dell'azione (Act)
    facade.submitRequest()
      .subscribe();

    // // Cattura dell'argomento inviato (Spy)
    // const request = refundRequestServiceMock
    //   .createRequest
    //   .mock.calls[0][0];

    // // Verifica del risultato (Assert)
    // expect(request.status)
    //   .toBe(RequestStatus.PENDING);

    // FORMA ALTERNATIVA
    expect(
      refundRequestServiceMock.createRequest
    ).toHaveBeenCalledWith(
      expect.objectContaining({
        status: RequestStatus.PENDING
      })
    );

  });


  // TEST PER LA VALIDAZIONE DEL FORM
  it('should return validation error', async () => {

    // Arrange: preparo il mock della validazione del form per restituire un errore
    requestFormFacadeMock
      .validateForm
      .mockReturnValueOnce('Form invalid');

    // Act: eseguo la submit della richiesta e gestisco il risultato asincrono tramite subscribe
    await new Promise<void>((resolve) => {

      facade.submitRequest().subscribe({

        next: () => {
          throw new Error('Expected validation error');
        },

        error: error => {

          // Assert: verifico che l'errore catturato corrisponda a quello atteso
          expect(error.message)
            .toBe('Form invalid');

          resolve();
        }

      });

    });

  });


  // TEST DI NON CHIAMATA A CREATE REQUEST IN CASO DI ERRORE
  it('should not call createRequest when validation fails', done => {

    // Arrange: preparo il mock della validazione del form per restituire un errore
    requestFormFacadeMock
      .validateForm
      .mockReturnValueOnce('Form invalid');

    // Act: eseguo la submit della richiesta
    facade.submitRequest()
      .subscribe({
        error: () => {
          // Assert: verifico che createRequest non sia stato chiamato a causa dell'errore di validazione
          expect(
            refundRequestServiceMock
              .createRequest
          ).not.toHaveBeenCalled();

          done;

        }
      })
  })


  // TEST PER CASO DI USER NON TROVATO
  it('should throw when user is not found', () => {


    // Arrange: preparo il mock del servizio di autenticazione per restituire null come utente corrente
    authServiceMock
      .getCurrentUser
      .mockReturnValueOnce(null);

    // Act & Assert: verifico che il metodo lanci l'errore atteso quando l'utente non è trovato
    expect(() => {
      facade.saveDraft();
    }).toThrow('User not found');

  });


  // TEST DI VERIFICA DEL PAYLOAD (DATI DELLA RICHIESTA) 
  it('should build request correctly', () => {

    // Act: eseguo il salvataggio della bozza della richiesta
    facade.saveDraft()
      .subscribe();

    // Spy: intercetto la chiamata al servizio di creazione della richiesta per verificare i dati passati
    const request = refundRequestServiceMock
      .createRequest
      .mock.calls[0][0];

    // Assert: verifico che i dati passati al servizio siano corretti
    expect(request.userId).toBe('user-1');
    expect(request.referenceMonth).toBe('2026-11');
    expect(request.noteEmployee).toBe('Test note');
    expect(request.totalRequestedAmount).toBe(100);
    expect(request.status).toBe(RequestStatus.DRAFT);

  })
});



// VS Code Counter: 131 code lines (23/11/2026)



// TEST VERIFICATI (23/11/2026): 
// 1. 'should save draft request' (Salvare bozza di richiesta)  (avvenuto con successo)
// 2. 'should create draft request with DRAFT status' (Inviare richiesta con stato "DRAFT")  (avvenuto con successo)
// 3. 'should submit request with PENDING status' (Inviare richiesta con stato "PENDING")  (avvenuto con successo)
// 4. 'should return validation error' (Deve essere errore di validazione)  (avvenuto con successo)
// 5. 'should not call createRequest when validation fails' 
// (createRequest non viene chiamata quando c'è errore di validazione) (avvenuto con successo)
// 6. 'should throw when user is not found' 
// (Lancia errore quando l'utente non è loggato) (avvenuto con successo)
// 7. 'should build request correctly' (Dati della richiesta)  (avvenuto con successo)
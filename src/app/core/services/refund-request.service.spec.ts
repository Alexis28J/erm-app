import { TestBed } from '@angular/core/testing';
import { RefundRequestService } from './refund-request.service';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';

describe('RefundRequestService', () => {

  let service: RefundRequestService;
  let httpMock: HttpTestingController;


  // MOCK DEL MODELLO RefundRequest
  const mockRequest = {
    id: '1',
    userId: '10',
    status: 'PENDING',
    totalRequestedAmount: 100,
    totalApprovedAmount: 0
  };


  // MOCK DI ARRAY DI RefundRequest
  const mockRequests = [
    mockRequest
  ];


  // CONFIGURAZIONE DEL TESTBED E INIEZIONE DEI SERVIZI 
  beforeEach(() => {

    TestBed.configureTestingModule({
      providers: [
        RefundRequestService,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });

    service = TestBed.inject(RefundRequestService);
    httpMock = TestBed.inject(HttpTestingController);

  });


  // PULIZIA DOPO OGNI TEST
  afterEach(() => {
    httpMock.verify();
  });


  // PRENDERE LE RICHIESTE
  it('should get all requests', () => {

    // 1. Chiamata al metodo getRequests del servizio
    service.getRequests()
      .subscribe(requests => {
        expect(requests).toEqual(mockRequests)
      });

    // 2. Verifica che sia stata effettuata una richiesta HTTP all'endpoint corretto
    const req = httpMock.expectOne(
      service['apiUrl']
    );

    // 3. Verifica che il metodo della richiesta sia corretto
    expect(req.request.method)
      .toBe('GET');


    // 4. Simula la risposta del server con i dati forniti 
    // e completa la richiesta HTTP in sospeso
    req.flush(mockRequests);

  });


  // PRENDERE RICHIESTA PER ID 
  it('should get requested by id', () => {

    // 1. Chiamata al metodo getRequestById del servizio con l'ID specificato
    service.getRequestById('1')
      .subscribe(request => {

        // 2. Verifica che la richiesta restituisca l'oggetto corretto
        expect(request).toEqual(mockRequest);

      });

    // 3. Verifica che sia stata effettuata una richiesta HTTP all'endpoint corretto
    const req = httpMock.expectOne(
      `${service['apiUrl']}/1`
    );

    // 4. Verifica che il metodo della richiesta sia corretto
    expect(req.request.method)
      .toBe('GET');

    // 5. Simula la risposta del server con i dati forniti 
    // e completa la richiesta HTTP in sospeso
    req.flush(mockRequest);

  });


  // PRENDERE RICHIESTE PER ID DELL'UTENTE
  it('should get requests by user id', () => {

    // 1. Chiamata al metodo getRequestsByUserId del servizio con l'ID dell'utente specificato
    service.getRequestsByUserId('10')
      .subscribe(requests => {

        // 2. Verifica che la richiesta restituisca l'array corretto di richieste
        expect(requests).toEqual(mockRequests);

      });

    // 3. Verifica che sia stata effettuata una richiesta HTTP all'endpoint corretto con query parameter
    const req = httpMock.expectOne(
      `${service['apiUrl']}?userId=10`
    );

    // 4. Verifica che il metodo della richiesta sia corretto
    expect(req.request.method)
      .toBe('GET');

    // 5. Simula la risposta del server con i dati forniti e completa la richiesta HTTP in sospeso
    req.flush(mockRequests);

  });


  // CREARE UNA RICHIESTA
  it('should create request', () => {

    // 1. Chiamata al metodo createRequest del servizio con i dati della richiesta
    service.createRequest(mockRequest as never)
      .subscribe(request => {
        // 2. Verifica che la richiesta restituisca l'oggetto corretto
        expect(request).toEqual(mockRequest);
      });

    // 3. Verifica che sia stata effettuata una richiesta HTTP all'endpoint corretto
    const req = httpMock.expectOne(
      service['apiUrl']
    );

    // 4. Verifica che il metodo della richiesta sia corretto
    expect(req.request.method)
      .toBe('POST');

    // 5. Verifica che il body della richiesta sia corretto
    expect(req.request.body)
      .toEqual(mockRequest);

    // 6. Simula la risposta del server con i dati forniti e completa la richiesta HTTP in sospeso
    req.flush(mockRequest);

  });


  // AGGIORNA RICHIESTA
  it('should update request', () => {

    // 1. Chiamata al metodo updateRequest del servizio con l'ID e i dati della richiesta
    service.updateRequest(
      '1',
      mockRequest as never
    ).subscribe(request => {

      // 2. Verifica che la risposta restituisca l'oggetto corretto
      expect(request)
        .toEqual(mockRequest);

    });

    // 3. Verifica che sia stata effettuata una richiesta HTTP all'endpoint corretto con l'ID
    const req = httpMock.expectOne(
      `${service['apiUrl']}/1`
    );

    // 4. Verifica che il metodo della richiesta sia corretto
    expect(req.request.method)
      .toBe('PUT');

    // 5. Verifica che il body della richiesta sia corretto
    expect(req.request.body)
      .toEqual(mockRequest);

    // 6. Simula la risposta del server con i dati forniti e completa la richiesta HTTP in sospeso
    req.flush(mockRequest);

  });


  // ELIMINARE RICHIESTA 
  it('should delete request', () => {

    // 1. Chiamata al metodo deleteRequest del servizio con l'ID della richiesta da eliminare
    service.deleteRequest('1')
      .subscribe();

    // 2. Verifica che sia stata effettuata una richiesta HTTP all'endpoint corretto con l'ID
    const req = httpMock.expectOne(
      `${service['apiUrl']}/1`
    );

    // 3. Verifica che il metodo della richiesta sia corretto
    expect(req.request.method)
      .toBe('DELETE');

    // 4. Simula la risposta del server con null per completare la richiesta HTTP in sospeso
    req.flush(null);

  });


  // GESTIONE ERRORE HTTP
  it('should handle http error', () => {

    // 1. Chiamata al metodo getRequests del servizio per ottenere le richieste
    service.getRequests().subscribe({

      // 2. Gestione dell'errore HTTP
      next: () => expect.fail('should fail'),
      error: error => {
        // 3. Verifica che lo status dell'errore sia corretto
        expect(error.status)
          .toBe(500);
      }

    });

    // 4. Verifica che sia stata effettuata una richiesta HTTP all'endpoint corretto
    const req = httpMock.expectOne(
      service['apiUrl']
    );

    // 5. Simula la risposta del server con un errore HTTP 500
    req.flush('Server error',
      {
        status: 500,
        statusText: 'Server Error'
      }
    );

  });

});



// VS Code Counter: 127 code lines (27/11/2026)



// TEST VERIFICATI (27/11/2026):
// - 'should get all requests' (Prendere tutte le richieste)  (Avvenuto con successo)
// - 'should get requested by id' (Prendere richiesta per ID)  (Avvenuto con successo)
// - 'should get requests by user id' (Prendere richieste per ID utente)  (Avvenuto con successo)
// - 'should create request' (Creare una nuova richiesta)  (Avvenuto con successo)
// - 'should update request' (Aggiornare una richiesta esistente)  (Avvenuto con successo)
// - 'should delete request' (Eliminare una richiesta)  (Avvenuto con successo)
// - 'should handle http error' (Gestione errore HTTP)  (Avvenuto con successo)

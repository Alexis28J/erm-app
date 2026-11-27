# COMMENTI

I file .spec.ts sono i file di test in cui vengono verificati i comportamenti dei componenti,servizi o facade dell'applicazione Angular.

## COMANDO PER ESEGUIRE I TEST DI UN FILE SPECIFICO
ng test --include="path del file"


```TYPESCRIPT
import { TestBed } from '@angular/core/testing';
import { RefundRequestService } from './refund-request.service';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';

describe('RefundRequestService', () => {

  let service: RefundRequestService;   // Servizio da testare
  let httpMock: HttpTestingController;  // Mock per le richieste HTTP  
  // Questo permette di intercettare e simulare le risposte HTTP durante i test


  // MOCK DEL MODELLO RefundRequest
  const mockRequest = {
    id: '1',
    userId: '10',
    status: 'PENDING',
    totalRequestedAmount: 100,
    totalApprovedAmount: 0
  };

  
  // MOCK DI ARRAY DI RefundRequest
  // Questo array contiene più richieste di rimborso simulate per i test
  const mockRequests = [
    mockRequest  // Aggiunta la richiesta mock all'array di richieste simulate
  ];


  // CONFIGURAZIONE DEL TESTBED E INIEZIONE DEI SERVIZI (Prima di ogni test)
  beforeEach(() => {

    TestBed.configureTestingModule({   // Configurazione del modulo di test con i provider necessari
      providers: [
        RefundRequestService,
        provideHttpClient(),
        provideHttpClientTesting()  // Provider per il testing delle richieste HTTP offerto da Angular
      ]
    });

    service = TestBed.inject(RefundRequestService);
    httpMock = TestBed.inject(HttpTestingController);

  });


  // PULIZIA DOPO OGNI TEST
  // afterEach è un hook che viene eseguito dopo ogni test per pulire eventuali risorse o verificare condizioni finali
  afterEach(() => {
    httpMock.verify();  // Verifica che non ci siano richieste HTTP in sospeso dopo ogni test
  });


  // PRENDERE LE RICHIESTE
  // Verifica:
  // metodo GET
  // endpoint corretto
  // risposta corretta

  it('should get all requests', () => {

    // 1. Chiamata al metodo getRequests del servizio
    service.getRequests()  
      .subscribe(requests => {
        expect(requests).toEqual(mockRequests)
      });

    // 2. Verifica che sia stata effettuata una richiesta HTTP all'endpoint corretto
    const req = httpMock.expectOne(
      service['apiUrl']  // Endpoint corretto per ottenere tutte le richieste
    );

    // 3. Verifica che il metodo della richiesta sia corretto e che la risposta sia simulata correttamente
    expect(req.request.method)
      .toBe('GET');


    // 4. Simula la risposta del server con i dati forniti e completa la richiesta HTTP in sospeso
    req.flush(mockRequests);  // flush è un metodo che simula la risposta del server con i dati forniti 
    // e completa la richiesta HTTP in sospeso

  });


  // PRENDERE RICHIESTA PER ID 
  // Verifica endpoint dinamico
  it('should get requested by id', () => {

    // 1. Chiamata al metodo getRequestById del servizio con l'ID specificato
    service.getRequestById('1')
      .subscribe(request => {

        // 2. Verifica che la richiesta restituisca l'oggetto corretto
        expect(request).toEqual(mockRequest);

      });

    // 3. Verifica che sia stata effettuata una richiesta HTTP all'endpoint corretto
    const req = httpMock.expectOne(
      `${service['apiUrl']}/1`  // Endpoint corretto con ID della richiesta
    );

    // 4. Verifica che il metodo della richiesta sia corretto
    expect(req.request.method)
      .toBe('GET');

    // 5. Simula la risposta del server con i dati forniti e completa la richiesta HTTP in sospeso
    req.flush(mockRequest);

  });


  // PRENDERE RICHIESTE PER ID DELL'UTENTE
  // Verifica endpoint dinamico con query parameter
  it('should get requests by user id', () => {

    // 1. Chiamata al metodo getRequestsByUserId del servizio con l'ID dell'utente specificato
    service.getRequestsByUserId('10')   // Chiamata al metodo con ID utente specificato
      .subscribe(requests => {

        // 2. Verifica che la richiesta restituisca l'array corretto di richieste
        expect(requests).toEqual(mockRequests);

      });


    // 3. Verifica che sia stata effettuata una richiesta HTTP all'endpoint corretto con query parameter
    const req = httpMock.expectOne(
      `${service['apiUrl']}?userId=10`  // Endpoint corretto con query parameter per l'ID dell'utente
    ); // Il query parameter è l'ID dell'utente specificato e si usa per filtrare le richieste dell'utente


    // 4. Verifica che il metodo della richiesta sia corretto
    expect(req.request.method)
      .toBe('GET');


    // 5. Simula la risposta del server con i dati forniti e completa la richiesta HTTP in sospeso
    req.flush(mockRequests);

  });


  // CREARE UNA RICHIESTA
  // Verifica:
  // metodo POST
  // endpoint corretto
  // body corretto 
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
  // Verifica: 
  // metodo PUT
  // endpoint corretto con id
  // payload corretto
  it('should update request', () => {

    // 1. Chiamata al metodo updateRequest del servizio con l'ID e i dati della richiesta
    service.updateRequest(
      '1',  // ID della richiesta da aggiornare
      mockRequest as never  // Dati della richiesta da aggiornare
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
  // Verifica:
  // metodo DELETE
  // endpoint corretto con id
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

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  // NON PIù NECESSARIO TESTARE getAllRequests() PERCHé DUPLICA getRequests()
  // getAllRequests() è stato rimosso perché duplicava la logica di getRequests()

  // // PRENDERE TUTTE LE RICHIESTE PER HR (IDENTICO AL PRIMO TEST)
  // it('should get all requests for HR', () => {

  //   // 1. Chiamata al metodo getAllRequests del servizio per ottenere tutte le richieste
  //   service.getAllRequests()
  //     .subscribe(requests => {

  //       // 2. Verifica che la risposta restituisca l'array corretto di richieste
  //       expect(requests).toEqual(mockRequests);

  //     });

  //   // 3. Verifica che sia stata effettuata una richiesta HTTP all'endpoint corretto
  //   const req = httpMock.expectOne(
  //     service['apiUrl']
  //   );

  //   // 4. Verifica che il metodo della richiesta sia corretto
  //   expect(req.request.method)
  //     .toBe('GET');

  //   // 5. Simula la risposta del server con l'array di richieste
  //   req.flush(mockRequests);

  // });

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

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
```

- vi.fn è una funzione di Vitest che crea un mock function, utile per intercettare e verificare le chiamate ai metodi durante i test.

Come funziona? 
Quando viene chiamata una funzione mockata con vi.fn, Vitest registra le chiamate e i parametri passati.
Questo permette di verificare se la funzione è stata chiamata, quante volte e con quali argomenti.


- it(...): è la funzione di Vitest che definisce un singolo unit test.
La stringa passata a it(...) descrive il comportamento atteso dal test.

- expect(...): è la funzione di Vitest che verifica che una condizione sia vera.

- toHaveBeenCalled(): è un matcher di Vitest che verifica che un mock sia stato chiamato almeno una volta.

- toBe(...): è un matcher di Vitest che verifica che il valore atteso sia uguale al valore ricevuto.

- Pattern AAA è un approccio comune nei test unitari che suddivide il test in tre fasi distinte: Arrange, Act e Assert.

1. Arrange: prepara l'ambiente di test, inizializza mock e dati necessari.

2. Act: esegue l'azione da testare (ad esempio chiamata a facade.saveDraft() o facade.submitRequest()).

3. Assert: verifica che il risultato sia quello atteso, utilizzando expect(...) e matcher come toBe(...) o toHaveBeenCalled().

Non sempre è necessario utilizzare tutti e tre i passaggi del pattern AAA, soprattutto nei test più semplici, ma è una buona pratica mantenerli separati per chiarezza e manutenzione del test.

- Quando il metodo delega a un altro servizio, è utile intercettare le chiamate ai mock per verificare che i dati passati siano corretti.
Quindi è necessario usare un mock per "spiare" (spy) le chiamate al servizio e verificare i dati passati, tramite .mock.calls (o toHaveBeenCalledWith).
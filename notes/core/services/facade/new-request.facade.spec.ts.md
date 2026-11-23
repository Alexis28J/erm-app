# COMMENTI

I file .spec.ts sono i file di test in cui vengono verificati i comportamenti dei componenti,servizi o facade dell'applicazione Angular.

## COMANDO PER ESEGUIRE I TEST DI UN FILE SPECIFICO
ng test --include="path del file"


```TYPESCRIPT
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
  // Qui definiamo il mock per il RequestFormFacade, simulando il comportamento del form 
  // e dei metodi associati.
  const requestFormFacadeMock = {
    requestForm: {   // Simula il form della richiesta con i valori iniziali
      value: {
        referenceMonth: '2026-11',
        noteEmployee: 'Test note',
        expenses: []
      }
    },

    totalRequestedAmount: vi.fn(  // Simula il calcolo dell'importo totale richiesto, restituendo sempre 100
      () => 100
    ),

    validateForm: vi.fn<() => string | null>( // Simula la validazione del form, restituendo sempre null (nessun errore)
      () => null
    )
  };


  // MOCK PER AuthService
  const authServiceMock = {
    getCurrentUser: vi.fn<() => { id: string } | null>(() => ({
      id: 'user-1'
    }))   
  };  // => { id: string } | null indica il tipo di ritorno della funzione mockata, cioè un oggetto con id string o null
  // () prima della freccia indica che la funzione non riceve (e non si aspetta) argomenti.


  // MOCK PER RefundRequestService
  const refundRequestServiceMock = {
    createRequest: vi.fn<(request: RefundRequest) => Observable<any>>(() =>
      of({}))
  };  // <(request: RefundRequest) => Observable<any>> indica il tipo di ritorno della funzione mockata, cioè un Observable che emette un qualsiasi valore
  // of ({}) crea un Observable che emette un oggetto vuoto (cioè una risposta fittizia), simulando la risposta del servizio senza dipendere da implementazioni reali


  // MODULO DI TEST E INIEZIONE DEL FACADE PRIMA DI OGNI TEST
  beforeEach(() => {

    vi.clearAllMocks();  // Pulisce tutti i mock prima di ogni test per evitare interferenze tra test successivi

    TestBed.configureTestingModule({  // Configura il modulo di test con i provider necessari per il facade e i mock dei servizi
      providers: [
        NewRequestFacade,  // Facade da testare, fornita come provider nel modulo di test
        // Questi oggetti servono a sostituire i servizi reali con i mock definiti sopra, 
        // in modo da poter testare il comportamento del facade senza dipendere da implementazioni esterne.
        { provide: RequestFormFacade, useValue: requestFormFacadeMock },
        { provide: AuthService, useValue: authServiceMock },
        { provide: RefundRequestService, useValue: refundRequestServiceMock }
      ]
    });
    facade = TestBed.inject(
      NewRequestFacade  // Inietta il facade da testare, ottenendo un'istanza pronta all'uso per i test
    );

  });


  ///// TEST PER METODO "SALVARE COME BOZZA" /////

  // TEST PER LA CHIAMATA AL SERVIZIO QUANDO SI SALVA COME BOZZA
  it('should save draft request', () => {

    // Esecuzione dell'azione (Act)
    facade.saveDraft()  // Chiamata al metodo per salvare la richiesta come bozza
      .subscribe();  // Sottoscrizione per eseguire l'osservabile

    // Verifica del risultato (Assert)
    expect( // Verifica che il servizio sia stato chiamato
      refundRequestServiceMock.createRequest  // Metodo del servizio che dovrebbe essere chiamato
    ).toHaveBeenCalled();  // toHaveBeenCalled verifica che il metodo sia stato effettivamente chiamato

  });


  // TEST PER LA CREAZIONE DELLA BOZZA CON STATUS "DRAFT"
  // Non basta verificare la chiamata al servizio, bisogna anche controllare lo status della richiesta
  it('should create draft request with DRAFT status', () => {

    // Esecuzione dell'azione (Act)
    facade.saveDraft()  // chiama il metodo sulla Facade (il livello intermedio che gestisce la logica di stato/chiamate in Angular).
      .subscribe(); // fondamentale in RxJS/Angular. Poiché gli Observable sono lazy (pigri), senza .subscribe() il flusso non partirebbe e la chiamata al servizio sottostante non verrebbe mai eseguita.


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

    // FORMA ALTERNATIVA: invece di catturare l'argomento e verificarne lo status, 
    // si può usare toHaveBeenCalledWith con expect.objectContaining per controllare direttamente 
    // che il servizio sia stato chiamato con un oggetto contenente lo status DRAFT.
    //Questo approccio evita di dover catturare manualmente l'argomento e rende il test più leggibile e diretto.
    // L'approccio precedente di catturare manualmente l'argomento è più dettagliato ma meno leggibile.
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

    // FORMA ALTERNATIVA: invece di catturare l'argomento e verificarne lo status, 
    // si può usare toHaveBeenCalledWith con expect.objectContaining per controllare direttamente 
    // che il servizio sia stato chiamato con un oggetto contenente lo status PENDING.
    expect(
      refundRequestServiceMock.createRequest
    ).toHaveBeenCalledWith(
      expect.objectContaining({
        status: RequestStatus.PENDING
      })
    );

  });


  // TEST PER LA VALIDAZIONE DEL FORM
  // Questo test verifica che venga restituito un errore di validazione quando il form non è valido
  // Quindi ci si aspetta che la submit della richiesta generi un errore di validazione
  it('should return validation error', async () => { // async indica che la funzione di test è asincrona e può usare await

    // Arrange: preparo il mock della validazione del form per restituire un errore
    requestFormFacadeMock 
      .validateForm
      .mockReturnValueOnce('Form invalid');  // Simula il ritorno di un errore di validazione del form

    // Act: eseguo la submit della richiesta e gestisco il risultato asincrono tramite subscribe
    await new Promise<void>((resolve) => {  // Creo una promessa che verrà risolta (completata) quando il test asincrono sarà completato

      facade.submitRequest().subscribe({  // Eseguo la richiesta e gestisco i callback next ed error

        next: () => { // Se viene chiamato il callback next significa che ci si aspettava un errore
          throw new Error('Expected validation error');  // next viene chiamato solo se non si verifica l'errore atteso
          // Questo commento indica che il flusso non dovrebbe mai arrivare qui se l'errore di validazione è corretto
        },

        error: error => {  // Se viene chiamato il callback error significa che l'errore di validazione è stato catturato correttamente

          // Assert: verifico che l'errore catturato corrisponda a quello atteso
          expect(error.message)  // Verifico che il messaggio di errore corrisponda a quello atteso
            .toBe('Form invalid'); // Controllo che il messaggio di errore sia quello previsto per un form non valido

          resolve();  // Risolvo (completo) la promessa per indicare che il test asincrono è completato
        }

      });

    });

  });


  // TEST DI NON CHIAMATA A CREATE REQUEST IN CASO DI ERRORE
  it('should not call createRequest when validation fails', done => { // done è il callback da chiamare quando il test asincrono è completato

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

          done; // Chiamo il callback done per indicare che il test asincrono è completato

        }
      })
  })


  // TEST PER CASO DI USER NON TROVATO
  // Questo test verifica che venga lanciato un errore quando l'utente corrente non viene trovato
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
  // Verifico che il payload costruito per la richiesta sia corretto
  it('should build request correctly', () => {

    // Act: eseguo il salvataggio della bozza della richiesta
    facade.saveDraft()
    .subscribe();

    // Spy: intercetto la chiamata al servizio di creazione della richiesta per verificare i dati passati
    const request = refundRequestServiceMock
    .createRequest
    .mock.calls[0][0];  // Recupero il primo argomento passato alla prima chiamata del mock, 
    // che rappresenta il payload della richiesta. In questo modo posso verificare 
    // che i dati siano corretti prima che vengano inviati al servizio.

    // Assert: verifico che i dati passati al servizio siano corretti
    expect(request.userId).toBe('user-1');
    expect(request.referenceMonth).toBe('2026-11');
    expect(request.noteEmployee).toBe('Test note');
    expect(request.totalRequestedAmount).toBe(100);
    expect(request.status).toBe(RequestStatus.DRAFT);

  })
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
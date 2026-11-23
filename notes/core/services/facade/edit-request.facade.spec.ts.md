# COMMENTI

I file .spec.ts sono i file di test in cui vengono verificati i comportamenti dei componenti,servizi o facade dell'applicazione Angular.

## COMANDO PER ESEGUIRE I TEST DI UN FILE SPECIFICO
ng test --include="path del file"


```TYPESCRIPT
import { TestBed } from '@angular/core/testing';
import { EditRequestFacade } from './edit-request.facade';
import { of } from 'rxjs';
import { RequestFormFacade } from './request-form.facade';
import { AuthService } from '../auth.service';
import { RefundRequestService } from '../refund-request.service';
import { RequestStatus } from '../../interfaces/enum';
import { RefundRequest } from '../../interfaces/refund-request';

describe('EditRequestFacade', () => {

    let facade: EditRequestFacade;  // Instanza del facade da testare


    // MOCK PER IL REQUEST FORM FACADE (simula il comportamento del RequestFormFacade)
    const requestFormFacadeMock = {
        requestForm: {
            value: {
                referenceMonth: '2026-11',
                noteEmployee: 'Test note',
                expenses: []
            },

            patchValue: vi.fn(), // vi.fn simula l'aggiornamento dei valori del form (patchValue)
            reset: vi.fn() // vi.fn simula il reset del form
        },

        populateExpenses: vi.fn(),  // vi.fn simula la popolazione delle spese nel form
        totalRequestedAmount: vi.fn(  // vi.fn simula il calcolo dell'importo totale richiesto
            () => 100
        ),

        validateForm: vi.fn<  // vi.fn simula il comportamento del metodo validateForm
            () => string | null
        >(() => null)
    };


    // MOCK PER IL AUTH SERVICE (simula il comportamento del AuthService)
    const authServiceMock = {
        getCurrentUser: vi.fn<  // vi.fn simula il comportamento del metodo getCurrentUser
            () => { id: string } | null
        >(() => ({
            id: 'user-1'
        }))
    };


    // MOCK PER IL REFUND REQUEST SERVICE (simula il comportamento del RefundRequestService)
    const refundRequestServiceMock = {
        updateRequest: vi.fn(() => // vi.fn simula il comportamento del metodo updateRequest
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

        vi.clearAllMocks();  // Resetta tutti i mock prima di ogni test

        TestBed.configureTestingModule({  // Configuro il modulo di test con i provider necessari
            providers: [

                EditRequestFacade,  // Facade da testare

                { provide: RequestFormFacade, useValue: requestFormFacadeMock },
                { provide: AuthService, useValue: authServiceMock },
                { provide: RefundRequestService, useValue: refundRequestServiceMock }

            ]
        });

        facade = TestBed.inject(EditRequestFacade);  // Inietto la facade da testare

    });


    // TEST PER L'INIZIALIZZAZIONE DEL FORM CON I DATI DEL REQUEST
    it('should populate expenses during initialization', async () => {

        facade.initialize(requestMock);  // Inizializzo la facade con il request mock

        await Promise.resolve();  // Attendo la risoluzione delle promise per garantire che tutte le chiamate asincrone siano completate

        expect(  // Verifico che il metodo populateExpenses del requestFormFacadeMock sia stato chiamato con le spese del request mock
            requestFormFacadeMock.populateExpenses
        ).toHaveBeenCalledWith(
            requestMock.expenses
        );  // toHaveBeenCalledWith verifica che il metodo sia stato chiamato 
        // con i parametri specificati

    });


    // TEST PER IL SALVATAGGIO DELLA BOZZA
    it('should save draft', () => {

        facade.initialize(requestMock); // Inizializzo la facade con il request mock

        facade.saveDraft().subscribe(); // Eseguo il salvataggio della bozza della richiesta

        expect(
            refundRequestServiceMock.updateRequest  // Verifico che il metodo updateRequest del servizio sia stato chiamato
        ).toHaveBeenCalled(); 
        // toHaveBeenCalled verifica che il metodo sia stato effettivamente chiamato

    })


    // TEST PER LO STATUS DRAFT
    it('should update request with DRAFT status', () => {

        facade.initialize(requestMock); // Inizializzo la facade con il request mock

        facade.saveDraft()  // Eseguo il salvataggio della bozza della richiesta
            .subscribe();

        expect(  // Verifico che il metodo updateRequest del servizio sia stato chiamato con lo status DRAFT
            refundRequestServiceMock.updateRequest
        ).toHaveBeenCalledWith(
            '1', expect.objectContaining({  // objectContaining verifica che l'oggetto contenga le proprietà specificate
                status: RequestStatus.DRAFT
            })  // '1' è l'ID della richiesta
            // Quindi ci aspettiamo che l'updateRequest sia stato chiamato con l'ID della richiesta e lo status DRAFT
        );

    });


    // TEST PER INVIARE LA RICHIESTA (STATUS PENDING)
    it('should update request with PENDING status', () => {

        facade.initialize(requestMock);  // Inizializzo la facade con il request mock\

        facade.submitRequest().  // Eseguo l'invio della richiesta
            subscribe();

        expect(   // Verifico che il metodo updateRequest del servizio sia stato chiamato con lo status PENDING
            refundRequestServiceMock.updateRequest
        ).toHaveBeenCalledWith(
            '1', expect.objectContaining({
                status: RequestStatus.PENDING 
            }) 
        );
    });


    // TEST PER LA VALIDAZIONE
    it('should return validation error', () => {

        facade.initialize(requestMock); // Inizializzo la facade con il request mock

        requestFormFacadeMock   // Simulo il ritorno di un errore di validazione del form
            .validateForm
            .mockReturnValueOnce(   //mockReturnValueOnce è un metodo che permette di specificare 
                                    // il valore di ritorno solo per la prossima chiamata
                'Form invalid'
            );

        facade.submitRequest()  // Eseguo l'invio della richiesta
            .subscribe({
                next: () => {    // Se viene chiamato il next significa che non è stato generato 
                // l'errore di validazione, quindi lancio un errore
                    throw new Error(
                        'Expected validation error'
                    );
                },
                error: error => {  // Se viene chiamato l'error significa che è stato generato l'errore di validazione
                    expect(error.message)
                        .toBe('Form invalid');  // Verifico che il messaggio di errore sia quello atteso
                }
            });
    })


    // TEST PER NON CHIAMARE UPDATE REQUEST QUANDO LA VALIDAZIONE FALLISCE
    it('should not call updateRequest when validation fails', () => {

        facade.initialize(requestMock);  // Inizializzo la facade con il request mock

        requestFormFacadeMock.validateForm  // Simulo il ritorno di un errore di validazione del form
            .mockReturnValueOnce(  // mockReturnValueOnce permette di specificare il valore di ritorno 
            // solo per la prossima chiamata
                'Form invalid'
            );

        facade.submitRequest()  // Eseguo l'invio della richiesta
            .subscribe({
                error: () => {  // Se viene chiamato l'error significa che la validazione è fallita

                    expect(  // Verifico che updateRequest non sia stato chiamato
                        refundRequestServiceMock.updateRequest
                    ).not.toHaveBeenCalled();  // not è un matcher che verifica che la funzione non sia stata chiamata
                    // toHaveBeenCalled è un matcher che verifica che la funzione sia stata chiamata almeno una volta
                    // Quindi not.toHaveBeenCalled verifica che la funzione non sia stata chiamata affatto

                }
            });

    });


    // TEST PER RICHIESTA NON INIZIALIZZATA
    it('should throw when request is not loaded', () => {
        expect(() => {  // Verifico che venga generato un errore quando la richiesta non è caricata
            facade.saveDraft();  // Provo a salvare la bozza senza aver inizializzato la richiesta
        }).toThrow(  // Verifico che il messaggio di errore sia quello atteso
            'Request not loaded'
        );
    });


    // TEST UTENTE NON TROVATO
    it('should return user not found error', () => {

        facade.initialize(requestMock);  // Inizializzo la facade con il request mock

        authServiceMock  // Simulo il ritorno di un utente non trovato
            .getCurrentUser
            .mockReturnValueOnce(null);  // Ritorno null per simulare utente non trovato

        facade.submitRequest()  // Eseguo l'invio della richiesta
            .subscribe({

                next: () => {  // Se viene chiamato next significa che non è stato generato un errore, 
                // quindi lancio un errore per fallire il test
                    throw new Error(
                        'Expected error'
                    );
                },
                error: error => {  // Se viene chiamato error significa che è stato generato un errore, 
                // quindi verifico il messaggio di errore atteso
                    expect(error.message)
                        .toBe('User not found');
                }

            });

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
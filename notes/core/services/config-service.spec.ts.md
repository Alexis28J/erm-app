# COMMENTI

I file .spec.ts sono i file di test in cui vengono verificati i comportamenti dei componenti,servizi o facade dell'applicazione Angular.

## COMANDO PER ESEGUIRE I TEST DI UN FILE SPECIFICO
ng test --include="path del file"


```TYPESCRIPT
import { TestBed } from '@angular/core/testing';
import { ConfigService } from './config-service';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { AppConfig } from '../interfaces/app-config';
import { ExpenseCategoryName } from '../interfaces/enum';

// Il focus dei test sarà verificare:
// che venga chiamato l'endpoint corretto
// che venga usato il metodo HTTP corretto
// che la signal venga aggiornata correttamente

describe('ConfigService', () => {

  // Variabili per il servizio e il mock HTTP
  let service: ConfigService;
  let httpMock: HttpTestingController;  // Mock per le chiamate HTTP
  // HttpTestingController è un mock per le chiamate HTTP, 
  // utile per verificare le richieste effettuate dal servizio senza fare chiamate reali al server.


  // OGGETTO DI CONFIGURAZIONE MOCK
  const mockConfig: AppConfig = {  // Mock della configurazione dell'applicazione per i test

    id: "config",  // Identificatore della configurazione dell'applicazione 
    expenseLimits: [
      {
        id: "1",
        name: ExpenseCategoryName.HOTEL,
        maxAmount: 100,
        receiptRequired: true
      },
      {
        id: "2",
        name: ExpenseCategoryName.TAXI,
        maxAmount: 50,
        receiptRequired: true
      }
    ]

  }

  // beforeEach: configurazione del modulo di test e inizializzazione dei servizi
  beforeEach(() => {

    TestBed.configureTestingModule({   
      providers: [
        ConfigService,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });

    // Inizializzazione del servizio e del mock HTTP
    // Anche se abbiamo inizializzatto le variabili, dobbiamo comunque 
    // iniettare i servizi dal TestBed
    // Questo passaggio è necessario per poter utilizzare il servizio e il mock HTTP nei test.
    service = TestBed.inject(ConfigService);
    httpMock = TestBed.inject(HttpTestingController);

  });

  // afterEach: verifica che non ci siano richieste HTTP pendenti
  // Questo serve a garantire che ogni test non lasci richieste HTTP non gestite, 
  // evitando effetti collaterali tra i test.
  afterEach(() => {
    httpMock.verify();
  });
  

  // TEST DELLA CONFIGURAZIONE DELLA CONFIGURAZIONE DEGLI EXPENSE LIMITS
  // Questo test verifica che il servizio aggiorni correttamente la signal della configurazione 
  // quando viene chiamato setConfig.
  it('should set config signal', () => {

    // Arrange: prepara il test impostando la configurazione del servizio con il mockConfig
    service.setConfig(mockConfig);  // Imposta la configurazione del servizio con il mockConfig

    // Act: recupera la configurazione corrente del servizio tramite il signal config()
    expect(
      service.config()  // Recupera la configurazione corrente del servizio cioè quella originariamente impostata con setConfig

    ).toEqual(mockConfig)  // Verifica che la configurazione corrente sia uguale al mockConfig impostato in precedenza

  // config() è il signal che contiene la configurazione corrente del servizio
  // Ricorda che una signal si legge con () e non senza perché è una funzione che restituisce il valore corrente della signal


  // Quindi, in questo test:
  // 1. Imposta la configurazione del servizio con il mockConfig che rappresenta la configurazione dell'applicazione per i test
  // 2. Verifica che la configurazione corrente del servizio sia uguale al mockConfig impostato in precedenza

  }); 

////////////////////////////////////////////////////////////////////////////////////////////////////

  // TEST PER CARICARE LA CONFIGURAZIONE 
  // Questo test verifica che il servizio possa caricare correttamente la configurazione dal server mock.
  it('should load config', () => {

    // Act: chiama il metodo loadConfig per caricare la configurazione dal server mock
    service.loadConfig()
    .subscribe(config => {   // (Subscribe attiva la chiamata)

      // Assert: verifica che la configurazione caricata corrisponda al mockConfig
      expect(config)
      .toEqual(mockConfig);

    });

    // Assert: verifica che sia stata effettuata una richiesta HTTP al corretto endpoint
    const req = httpMock.expectOne(  // expectOne è un metodo che verifica che sia stata effettuata una singola richiesta HTTP all'URL specificato
      service['apiUrl']  // (expectOne intercetta la richiesta)
    );

    // Assert: verifica che il metodo della richiesta HTTP sia 'GET' 
    expect(req.request.method) // req.request.method contiene il metodo HTTP della richiesta
    .toBe('GET');

    // Assert: invia la risposta mock al server per completare la richiesta HTTP
    req.flush(mockConfig); // .flush è un metodo che invia la risposta mock al server per completare la richiesta HTTP
    // (flush() simula la risposta del backend. È come se il json-server avesse risposto.)

    // Quindi questo test: 
    // 1. Effettua una richiesta HTTP al server mock per caricare la configurazione
    // 2. Verifica che la configurazione caricata corrisponda al mockConfig
    // 3. Verifica che il metodo della richiesta HTTP sia 'GET'
    // 4. Invia la risposta mock al server per completare la richiesta HTTP

  });


////////////////////////////////////////////////////////////////////////////////////////////////////

  // TEST PER AGGIORNARE LA CONFIGURAZIONE
  // Questo test verifica che il metodo updateConfig invii una richiesta PUT al server 
  // con il corpo corretto e riceva la configurazione aggiornata.
  it('should update config', () => {

    // Arrange: prepara il test con la configurazione mock da inviare al server
    service.updateConfig(mockConfig)
    .subscribe(config => {

      // Assert: verifica che la configurazione ricevuta dal server corrisponda al mockConfig
      expect(config)
      .toEqual(mockConfig);

    });

    // Assert: verifica che sia stata effettuata una richiesta HTTP al corretto endpoint
    const req = httpMock.expectOne(  // expectedOne si occupa di verificare che ci sia esattamente una richiesta HTTP al URL specificato
      service['apiUrl']
    );

    // Assert: verifica che il metodo della richiesta HTTP sia 'PUT' 
    expect(req.request.method) // req.request.method contiene il metodo HTTP della richiesta
    .toBe('PUT');

    // Assert: verifica che il corpo della richiesta HTTP sia corretto
    expect(req.request.body) // req.request.body contiene il corpo della richiesta HTTP
    .toEqual(mockConfig);

    // Assert: invia la risposta mock al server per completare la richiesta HTTP
    req.flush(mockConfig); // flush invia la risposta mock al server per completare la richiesta HTTP


    // Quindi, questo test: 
    // 1. Verifica che sia stata effettuata una richiesta HTTP al corretto endpoint con il metodo 'PUT'
    // 2. Verifica che il corpo della richiesta HTTP sia corretto
    // 3. Verifica che la configurazione ricevuta dal server corrisponda al mockConfig

  });


  //////////////////////////////////////////////////////////////////////////////////////////////////

  // TEST PER CARICARE LA CONFIGURAZIONE CON L'ENDPOINT CORRETTO
  // Questo test verifica che il metodo loadConfig chiami l'endpoint corretto del server
  it('should call correct endpoint', () => {

    // Act: chiama il metodo loadConfig per verificare l'endpoint utilizzato
    service.loadConfig().subscribe();  // Non interessa il contenuto della risposta, 
    // solo l'endpoint chiamato, perciò non è necessario gestire la risposta.

    // Assert: verifica che sia stata effettuata una richiesta HTTP al corretto endpoint
    const req = httpMock.expectOne( // Intercetta la richiesta HTTP effettuata dal metodo loadConfig
      service['apiUrl']
    );

    // Assert: verifica che l'URL della richiesta HTTP sia corretto
    expect(
      req.request.url  // URL della richiesta HTTP effettuata dal metodo loadConfig
    ).toBe(
      service['apiUrl']  // Deve corrispondere all'URL della richiesta HTTP effettuata dal metodo loadConfig
    );

    // Assert: verifica che il metodo della richiesta HTTP sia 'GET'
    req.flush(mockConfig); 

    // Quindi, questo test:
    // 1. Verifica che il metodo loadConfig chiami l'endpoint corretto del server
    // 2. Verifica che il metodo della richiesta HTTP sia 'GET'

    // In cosa si differenzia dal test 'should load config'?
    // Risposta: il test 'should load config' verifica il caricamento effettivo della configurazione,
    // mentre il test 'should call correct endpoint' si concentra solo sul verificare che venga chiamato
    // l'endpoint corretto del server, senza controllare il contenuto della risposta.

  });

  //////////////////////////////////////////////////////////////////////////////////////////////////

  // TEST PER AGGIORNARE LA CONFIGURAZIONE CON L'ENDPOINT CORRETTO
  // Questo test verifica che l'endpoint corretto venga chiamato 
  // durante l'aggiornamento della configurazione
  it('should call correct endpoint for update', () => {

    // Act: chiama il metodo updateConfig per verificare l'endpoint utilizzato
    service.updateConfig(mockConfig)  // Chiama il metodo per aggiornare la configurazione
    .subscribe();  // Non ci preoccupiamo del risultato della sottoscrizione in questo test

    // Assert: verifica che sia stata effettuata una richiesta HTTP al corretto endpoint
    const req = httpMock.expectOne( 
      service['apiUrl']  // service ci permette di accedere all'URL dell'API privata
    );

    // Assert: verifica che l'URL della richiesta HTTP sia corretto
    expect(
      req.request.url  // URL della richiesta HTTP effettuata
    ).toBe(
      service['apiUrl']
    );

    req.flush(mockConfig);  // Invia la risposta mock al server per completare la richiesta HTTP


    // Quindi, questo test:
    // - verifica che l'endpoint corretto venga chiamato durante l'aggiornamento della configurazione
    // - verifica che l'URL della richiesta HTTP sia corretto
    // - invia la risposta mock al server per completare la richiesta HTTP

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
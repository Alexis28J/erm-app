import { TestBed } from '@angular/core/testing';
import { ConfigService } from './config-service';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { AppConfig } from '../interfaces/app-config';
import { ExpenseCategoryName } from '../interfaces/enum';
import { config } from 'rxjs';

describe('ConfigService', () => {

  // Variabili per il servizio e il mock HTTP
  let service: ConfigService;
  let httpMock: HttpTestingController;


  // OGGETTO DI CONFIGURAZIONE MOCK
  const mockConfig: AppConfig = {

    id: "config",
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
    service = TestBed.inject(ConfigService);
    httpMock = TestBed.inject(HttpTestingController);

  });

  // afterEach: verifica che non ci siano richieste HTTP pendenti
  afterEach(() => {
    httpMock.verify();
  });


  // TEST PER IMPOSTARE LA CONFIGURAZIONE DEGLI EXPENSE LIMITS
  it('should set config signal', () => {

    // Arrange: prepara il test impostando la configurazione del servizio con il mockConfig
    service.setConfig(mockConfig);

    // Act: recupera la configurazione corrente del servizio tramite il signal config()
    expect(
      service.config()
    ).toEqual(mockConfig);

  });


  // TEST PER CARICARE LA CONFIGURAZIONE 
  it('should load config using GET', () => {

    // Act: chiama il metodo loadConfig per caricare la configurazione dal server mock
    service.loadConfig()
      .subscribe(config => {

        // Assert: verifica che la configurazione caricata corrisponda al mockConfig
        expect(config)
          .toEqual(mockConfig);

      });

    // Assert: verifica che sia stata effettuata una richiesta HTTP al corretto endpoint
    const req = httpMock.expectOne(
      service['apiUrl']
    );

    // Assert: verifica che il metodo della richiesta HTTP sia 'GET' 
    expect(req.request.method)
      .toBe('GET');

    // Assert: invia la risposta mock al server per completare la richiesta HTTP
    req.flush(mockConfig);

  });


  // TEST PER AGGIORNARE LA CONFIGURAZIONE
  it('should update config using PUT', () => {

    // Arrange: prepara il test con la configurazione mock da inviare al server
    service.updateConfig(mockConfig)
      .subscribe(config => {

        // Assert: verifica che la configurazione ricevuta dal server corrisponda al mockConfig
        expect(config)
          .toEqual(mockConfig);

      });

    // Assert: verifica che sia stata effettuata una richiesta HTTP al corretto endpoint
    const req = httpMock.expectOne(
      service['apiUrl']
    );

    // Assert: verifica che il metodo della richiesta HTTP sia 'PUT' 
    expect(req.request.method)
      .toBe('PUT');

    // Assert: verifica che il corpo della richiesta HTTP sia corretto
    expect(req.request.body)
      .toEqual(mockConfig);

    // Assert: invia la risposta mock al server per completare la richiesta HTTP
    req.flush(mockConfig);

  });


  // TEST PER CARICARE LA CONFIGURAZIONE CON L'ENDPOINT CORRETTO
  it('should call correct endpoint', () => {

    // Act: chiama il metodo loadConfig per verificare l'endpoint utilizzato
    service.loadConfig().subscribe();

    // Assert: verifica che sia stata effettuata una richiesta HTTP al corretto endpoint
    const req = httpMock.expectOne(
      service['apiUrl']
    );

    // Assert: verifica che l'URL della richiesta HTTP sia corretto
    expect(
      req.request.url
    ).toBe(
      service['apiUrl']
    );

    // Assert: verifica che il metodo della richiesta HTTP sia 'GET'
    req.flush(mockConfig);

  });


  // TEST PER AGGIORNARE LA CONFIGURAZIONE CON L'ENDPOINT CORRETTO
  it('should call correct endpoint for update', () => {

    // Act: chiama il metodo updateConfig per verificare l'endpoint utilizzato
    service.updateConfig(mockConfig)  
    .subscribe();  

    // Assert: verifica che sia stata effettuata una richiesta HTTP al corretto endpoint
    const req = httpMock.expectOne( 
      service['apiUrl']  
    );

    // Assert: verifica che l'URL della richiesta HTTP sia corretto
    expect(
      req.request.url  
    ).toBe(
      service['apiUrl']
    );

    req.flush(mockConfig);  

  });

});



// VS Code Counter: code lines (25/11/2026)



// TEST VERIFICATI (25/11/2026):
// - 'should set config signal' (Impostazione della configurazione degli expense limits) (Avvenuto con successo)
// - 'should load config' (Caricamento della configurazione) (Avvenuto con successo)
// - 'should update config' (Aggiornamento della configurazione) (Avvenuto con successo)
// - 'should call correct endpoint' (Verifica dell'endpoint corretto) (Avvenuto con successo)
// - 'should call correct endpoint for update' (Verifica dell'endpoint corretto per l'aggiornamento) (Avvenuto con successo)


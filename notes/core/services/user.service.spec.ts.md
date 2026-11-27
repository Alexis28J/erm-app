# COMMENTI

I file .spec.ts sono i file di test in cui vengono verificati i comportamenti dei componenti,servizi o facade dell'applicazione Angular.

## COMANDO PER ESEGUIRE I TEST DI UN FILE SPECIFICO
ng test --include="path del file"


```TYPESCRIPT
import { TestBed } from '@angular/core/testing';
import { UserService } from './user.service';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { UserRole } from '../interfaces/enum';
import { environment } from '../../../environments/environment.development';


// MOCK EMPLOYEE USER
const employeeMock = {
  id: '1',
  name: 'Mario',
  surname: 'Rossi',
  email: 'mario@test.it',
  role: UserRole.EMPLOYEE,
  active: true,
  systemConfig: false
};


// MOCK HR USER
const hrMock = {
  id: '2',
  name: 'Paolo',
  surname: 'Guerra',
  email: 'paolo@test.it',
  role: UserRole.HR,
  active: true,
  systemConfig: false
};


// MOCK SYSTEM CONFIG USER
const systemConfigUserMock = {
  id: 'config',
  systemConfig: true
};


// MOCK USERS ARRAY
const usersMock = [
  employeeMock,
  hrMock,
  systemConfigUserMock
];


// MOCK REQUEST
const requestMock = {
  id: '12',
  userId: '1',
  status: 'PENDING'
}


describe('UserService', () => {

  // Ricorda che : indica il tipo della variabile mentre che = indica il valore assegnato
  let service: UserService;
  let httpMock: HttpTestingController;

  beforeEach(() => {

    TestBed.configureTestingModule({
      providers: [
        UserService,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });

    service = TestBed.inject(UserService); // Inietta il servizio UserService per i test
    httpMock = TestBed.inject(HttpTestingController); // Inietta il controller HTTP per i test

  });

  afterEach(() => {
    httpMock.verify();  // Verifica che non ci siano richieste HTTP pendenti dopo ogni test
  });


  // PRENDERE TUTTI GLI UTENTI TRANNE SYSTEM CONFIG
  it('should return users excluding systemConfig', () => {

    // 1. Chiamata al servizio per ottenere tutti gli utenti esclusi quelli di sistema
    service.getUsers()  
      .subscribe(result => {

        // 2. Verifica che il risultato contenga solo gli utenti non di sistema (employee e HR)
        expect(result).toEqual([ 
          employeeMock,
          hrMock
        ]);

      });

    // 3. Aspettiamo la richiesta HTTP corrispondente all'ottenimento degli utenti non di sistema
    const req = httpMock.expectOne(  // expectOne indica che ci aspettiamo una singola richiesta HTTP con l'URL specificato
      service['apiUrl']
    );

    // 4. Verifica che il metodo della richiesta HTTP sia corretto 
    expect(req.request.method)  
      .toBe('GET');

    // 5. Simuliamo la risposta HTTP con l'array di utenti mock
    req.flush(usersMock);  

  });


  // PRENDERE UTENTE PER ID
  it('should get user by id', () => {

    // 1. Chiamata al servizio per ottenere l'utente con ID '1'
    service.getUserById('1')  // '1' indica l'ID dell'utente da recuperare
      .subscribe(user => {
        // 2. Verifica che l'utente recuperato sia quello corretto (employeeMock)
        expect(user).toEqual(employeeMock); // Il risultato dovrebbe essere l'utente con ID '1' (employeeMock)
      });

    // 3. Aspettiamo la richiesta HTTP corrispondente all'ottenimento dell'utente con ID '1'
    const req = httpMock.expectOne(
      //`${service['apiUrl']}/1`
      `${environment.apiUrl}/users/1`  // environment.apiUrl viene utilizzato per costruire l'URL della richiesta HTTP
    );

    // 4. Verifica che il metodo della richiesta HTTP sia corretto
    expect(req.request.method)
      .toBe('GET');   // Verifica che il metodo della richiesta HTTP sia GET 

    // 5. Simuliamo la risposta HTTP con l'utente mock corrispondente all'ID '1'
    req.flush(employeeMock);

  });


  // PRENDERE UTENTE PER EMAIL
  it('should get user by email', () => {

    // 1. Chiamata al servizio per ottenere l'utente con l'email specificata
    service.getUserByEmail(
      'mario@test.it'  // Email dell'utente da recuperare (employeeMock)
    ).subscribe(user => {
      // 2. Verifica che l'utente recuperato sia quello corretto (employeeMock)
      expect(user).toBe(employeeMock);  // Verifica che l'utente recuperato sia employeeMock
    });

    // 3. Aspettiamo la richiesta HTTP corrispondente all'email specificata
    const req = httpMock.expectOne(
      `${service['apiUrl']}?email=mario@test.it`  // URL della richiesta HTTP per ottenere l'utente con l'email specificata
    );

    // 4. Verifica che il metodo della richiesta HTTP sia corretto
    expect(req.request.method).toBe('GET');  // Verifica che il metodo della richiesta HTTP sia GET

    // 5. Simuliamo la risposta HTTP con un array contenente l'utente mock
    req.flush([employeeMock]);  // Simula la risposta HTTP con un array contenente l'utente mock

  });


  // PRENDERE UTENTE PER EMAIL: CASO "UTENTE NON TROVATO"
  it('should return undefined when email is not found', () => {

    // 1. Chiamata al servizio per ottenere l'utente con email non presente nel sistema
    service.getUserByEmail(
      'unknown@test.it'  // Email dell'utente non presente nel sistema
    ).subscribe(user => {
      // 2. Verifica che l'utente non sia stato trovato
      expect(user).toBeUndefined();  // Verifica che il risultato sia undefined quando l'utente non viene trovato
    });

    // 3. Aspettiamo la richiesta HTTP corrispondente all'email non trovata
    const req = httpMock.expectOne(
      `${service['apiUrl']}?email=unknown@test.it`  // URL della richiesta HTTP per ottenere l'utente con l'email specificata
    );

    // 4. Simuliamo la risposta HTTP con un array vuoto per indicare che l'utente non è stato trovato
    req.flush([]);

  });


  // PRENDERE SOLO GLI EMPLOYEE
  it('should return only employees', () => {

    // 1. Chiamata al servizio per ottenere solo gli employee
    service.getEmployees()
      .subscribe(result => {

        // 2. Verifica che il risultato contenga solo gli employee
        expect(result).toEqual([
          employeeMock
        ]);

      });

    // 3. Aspettiamo la richiesta HTTP corrispondente all'ottenimento degli employee
    const req = httpMock.expectOne(
      service['apiUrl']
    );

    // 4. Simuliamo la risposta HTTP con l'array di utenti mock
    req.flush(usersMock);

  });


  // AGGIORNA UTENTE
  it('should update user', () => {

    // 1. Chiamata al servizio per aggiornare l'utente con l'ID specificato
    service.updateUser(
      employeeMock.id,
      employeeMock as never
    ).subscribe(user => {

      // 2. Verifica che l'utente aggiornato sia quello corretto (employeeMock)
      expect(user).toEqual(employeeMock);

    });

    // 3. Aspettiamo la richiesta HTTP corrispondente all'aggiornamento dell'utente
    const req = httpMock.expectOne(
      `${service['apiUrl']}/${employeeMock.id}`
    );

    // 4. Verifica che il metodo della richiesta HTTP sia corretto
    expect(req.request.method).toBe('PUT');

    // 5. Verifica che il corpo della richiesta HTTP contenga i dati corretti dell'utente
    expect(req.request.body).toEqual(employeeMock);

    // 6. Simuliamo la risposta HTTP con l'utente aggiornato
    req.flush(employeeMock);

  });


  // PRENDERE I DETTAGLI DI UNA RICHIESTA CON L'UTENTE
  it('should return request details with user', () => {

    // 1. Chiamata al servizio per ottenere i dettagli della richiesta con l'utente
    service.getRequestDetails('12')
      .subscribe(result => {

        // 2. Verifica che il risultato contenga i dettagli della richiesta con l'utente corretto
        expect(result).toEqual({
          ...requestMock,
          user: employeeMock
        });

      });

    // 3. Aspettiamo la richiesta HTTP corrispondente all'ottenimento dei dettagli della richiesta
    const requestReq = httpMock.expectOne(
      // `${service['apiUrl'].replace('/users', '')}/refundRequests/12`
      `${environment.apiUrl}/refundRequests/12`
    );

    expect(requestReq.request.method).toBe('GET');

    // 4. Simuliamo la risposta HTTP con i dettagli della richiesta
    requestReq.flush(requestMock);

    // 5. Aspettiamo la richiesta HTTP corrispondente all'ottenimento dell'utente
    const userReq = httpMock.expectOne(
      // `${service['apiUrl']}/1`
      `${environment.apiUrl}/users/1`
    );

    expect(userReq.request.method).toBe('GET');

    // 6. Simuliamo la risposta HTTP con l'utente
    userReq.flush(employeeMock);
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
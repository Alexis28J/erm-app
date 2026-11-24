# COMMENTI

I file .spec.ts sono i file di test in cui vengono verificati i comportamenti dei componenti,servizi o facade dell'applicazione Angular.

## COMANDO PER ESEGUIRE I TEST DI UN FILE SPECIFICO
ng test --include="path del file"


```TYPESCRIPT
import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth.service';
import { vi } from 'vitest';
import { UserRole } from '../interfaces/enum';
import { UserService } from './user.service';
import { of } from 'rxjs';

describe('AuthService', () => {

  let service: AuthService;

  // MOCK PER USER SERVICE
  const userServiceMock = {
    getUsers: vi.fn()
  };


  // MOCK PER IL MODELLO USER
  const mockUser = {
    id: '1',
    name: 'Mario Rossi',
    email: 'mario@test.it',
    password: '1234567',
    role: UserRole.EMPLOYEE
  }


  beforeEach(() => {

    localStorage.clear();

    TestBed.configureTestingModule({
      providers: [
        AuthService,
        { provide: UserService, useValue: userServiceMock }
      ]
    });

    service = TestBed.inject(AuthService);

    vi.clearAllMocks();

  });


  // TEST PER LOGIN CORRETTO
  // Questo test verifica che il login funzioni correttamente, che l'utente venga trovato, 
  // restituito e salvato nel localStorage.
  it('should login and save it in localStorage', () => {

    // Arrange: impostiamo il mock del servizio utente per restituire l'utente fittizio
    userServiceMock.getUsers.mockReturnValue(
      of([mockUser]) // of è un operatore di RxJS che crea un Observable a partire da un valore
      // In questo caso, restituiamo un array contenente l'utente fittizio come Observable
    );


    // Act: chiamiamo il metodo di login con le credenziali dell'utente fittizio
    const user = await firstValueFrom(  // Convertiamo l'Observable restituito dal metodo login in una Promise e attendiamo il risultato
      service.login(
        'mario@test.it',
        '1234567'
      )
    ); // await è un operatore che attende il completamento della Promise
      // firstValueFrom converte l'Observable in una Promise e attende il risultato


    // Assert: verifichiamo che l'utente restituito dal login sia uguale all'utente fittizio e che sia salvato correttamente nel localStorage
    expect(user).toEqual(mockUser);  

    expect(
      JSON.parse(  // .parse converte una stringa JSON (che può essere letta dal localStorage) in un oggetto JavaScript (che può essere utilizzato nel codice)

        localStorage.getItem('currentUser')!  // Recuperiamo l'utente salvato nel localStorage come stringa JSON
      )

    ).toEqual(mockUser);

  });


  // TEST PER LE CREDENZIALI ERRATE 
  it('should return undefined when credentials are invalid', async () => {

    // Arrange: impostiamo il mock del servizio utente per restituire l'utente fittizio
    userServiceMock.getUsers.mockReturnValue(  // mockReturnValue è un metodo di Vitest per definire il valore di ritorno di una funzione mock
      of([mockUser])
    );

    // Act: chiamiamo il metodo di login con credenziali errate
    const user = await firstValueFrom(
      service.login(
        'mario@test.it',
        'Wrong password'
      )
    );

    // Assert: verifichiamo che l'utente sia undefined e che il localStorage non contenga l'utente corrente
    expect(user).toBeUndefined();

    expect(
      localStorage.getItem('currentUser')
    ).toBeNull();

  });


  // TEST PER EMAIL CASE INSENSITIVE
  it('should login ignoring email case', async () => {

    // Arrange: impostiamo il mock del servizio utente per restituire l'utente fittizio
    userServiceMock.getUsers.mockReturnValue(
      of([mockUser])
    );

    // Act: chiamiamo il metodo di login con l'email in maiuscolo e la password corretta
    const user = await firstValueFrom(
      service.login(
        'MARIO@TEST.IT',
        '1234567'
      )
    );

    // Assert: verifichiamo che l'utente restituito dal login sia uguale all'utente fittizio
    expect(user).toEqual(mockUser);

  });


  // TEST PER IL LOGOUT
  it('should remove user from localStorage on logout', () => {

    // Arrange: impostiamo il localStorage con l'utente corrente
    localStorage.setItem(
      'currentUser',
      JSON.stringify(mockUser)
    );

    // Act: chiamiamo il metodo di logout
    service.logout();

    // Assert: verifichiamo che il localStorage non contenga più l'utente corrente
    expect(
      localStorage.getItem('currentUser')
    ).toBeNull();
  });


  // TEST PER OTTENERE L'UTENTE CORRENTE
  // Questa funzione dovrebbe restituire l'utente corrente salvato nel localStorage
  // Se non c'è nessun utente salvato, dovrebbe restituire null
  it('should return current user from localStorage', () => {

    // Arrange: impostiamo il localStorage con l'utente corrente
    localStorage.setItem(
      'currentUser',
      JSON.stringify(mockUser)
    );

    // Act: chiamiamo il metodo per ottenere l'utente corrente
    const user = service.getCurrentUser();

    // Assert: verifichiamo che l'utente restituito sia uguale all'utente fittizio
    expect(user).toEqual(mockUser);

  });


  // TEST PER GESTIRE UTENTE NON TROVATO
  // Questo test verifica che il metodo getCurrentUser ritorni null quando non c'è alcun utente salvato nel localStorage
  it('should return null when no user is stored', () => {

     // Act: chiamiamo il metodo per ottenere l'utente corrente quando non c'è alcun utente salvato nel localStorage
     const user = service.getCurrentUser(); // Recuperiamo l'utente corrente dal localStorage. 
     // In caso non ci sia alcun utente salvato, dovrebbe ritornare null.

     // Assert: verifichiamo che l'utente sia null
     expect(user).toBeNull();   // Verifichiamo che l'utente sia null quando non è presente nel localStorage

  });

  
  // TEST PER VERIFICARE SE L'UTENTE È LOGGATO
  // Presupponendo che ci sia un utente salvato nel localStorage. Questo test verifica che il metodo isLoggedIn ritorni true.
  it('should return true when user is logged in', () => {

    // Arrange: impostiamo il localStorage con l'utente corrente
    localStorage.setItem(
      'currentUser',
      JSON.stringify(mockUser)  // Salviamo l'utente corrente nel localStorage trasformandolo in stringa JSON 
      // in modo che possa essere recuperato correttamente
    );

    // Act & Assert: verifichiamo se l'utente è loggato, dovrebbe ritornare true
    expect(
      service.isLoggedIn()  // Verifichiamo se l'utente è loggato, dovrebbe ritornare true 
      // perché abbiamo salvato l'utente nel localStorage
    ).toBe(true);  

  });


  // TEST PER VERIFICARE SE L'UTENTE NON È LOGGATO
  // Presupponendo che non ci sia un utente salvato nel localStorage. Questo test verifica che il metodo isLoggedIn ritorni false.
  it('should return false when user is not logged in', () => {

    // Act & Assert: verifichiamo se l'utente è loggato, dovrebbe ritornare false
    expect(
      service.isLoggedIn()
    ).toBe(false);

  });


  // TEST PER VERIFICARE SE L'UTENTE è HR
  // Questo test verifica se il metodo isHr() ritorna true per un utente con ruolo HR
  it('should return true for HR user', () => {


    // Arrange: creiamo un utente fittizio con ruolo HR
    const hrUser = {  
      ...mockUser,  // Copiamo tutte le proprietà dell'utente fittizio
      role: UserRole.HR  // Impostiamo il ruolo dell'utente come HR
    };

    // Salviamo l'utente HR nel localStorage
    localStorage.setItem(
      'currentUser',
      JSON.stringify(hrUser)
    );

    // Act & Assert: verifichiamo se l'utente è HR, dovrebbe ritornare true
    expect(
      service.isHr()
    ).toBe(true);

  });


  // TEST PER VERIFICARE SE L'UTENTE è EMPLOYEE
  // Questo test verifica se il metodo isEmployee() ritorna true per un utente con ruolo EMPLOYEE
  it('should return true for EMPLOYEE user', () => {

    // Arrange: impostiamo il localStorage con l'utente corrente (ruolo EMPLOYEE)
    localStorage.setItem(
      'currentUser',
      JSON.stringify(mockUser)   // Ricordiamo che abbiamo definito mockUser con ruolo EMPLOYEE e perciò non è necessario modificarlo
    );

    // Act & Assert: verifichiamo se l'utente è EMPLOYEE, dovrebbe ritornare true
    expect(
      service.isEmployee()  
    ).toBe(true);

  });


  // TEST PER VERIFICARE SE UN EMPLOYEE NON È HR
  // Questa verifica che un utente con ruolo EMPLOYEE non sia considerato HR
  it('should return false for employee in isHr', () => {

    // Arrange: impostiamo il localStorage con l'utente corrente (ruolo EMPLOYEE)
    localStorage.setItem(
      'currentUser',
      JSON.stringify(mockUser)
    );

    // Act & Assert: verifichiamo se l'utente è HR, dovrebbe ritornare false
    expect(
      service.isHr()
    ).toBe(false);

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
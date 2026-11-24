import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth.service';
import { vi } from 'vitest';
import { UserRole } from '../interfaces/enum';
import { UserService } from './user.service';
import { firstValueFrom, of } from 'rxjs';

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
  it('should login and save it in localStorage', async () => {

    // Arrange: impostiamo il mock del servizio utente per restituire l'utente fittizio
    userServiceMock.getUsers.mockReturnValue(
      of([mockUser])
    );

    // Act: chiamiamo il metodo di login con le credenziali dell'utente fittizio
    const user = await firstValueFrom(
      service.login(
        'mario@test.it',
        '1234567'
      )
    );

    // Assert: verifichiamo che l'utente restituito dal login sia uguale all'utente fittizio 
    // e che sia salvato correttamente nel localStorage
    expect(user).toEqual(mockUser);

    expect(
      JSON.parse(
        localStorage.getItem('currentUser')!
      )
    ).toEqual(mockUser);

  });


  // TEST PER LE CREDENZIALI ERRATE 
  it('should return undefined when credentials are invalid', async () => {

    // Arrange: impostiamo il mock del servizio utente per restituire l'utente fittizio
    userServiceMock.getUsers.mockReturnValue(
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
  it('should return null when no user is stored', () => {

    // Act: chiamiamo il metodo per ottenere l'utente corrente 
    const user = service.getCurrentUser();

    // Assert: verifichiamo che l'utente sia null
    expect(user).toBeNull();

  });



  // TEST PER VERIFICARE SE L'UTENTE È LOGGATO
  it('should return true when user is logged in', () => {

    // Arrange: impostiamo il localStorage con l'utente corrente
    localStorage.setItem(
      'currentUser',
      JSON.stringify(mockUser)
    );

    // Act & Assert: verifichiamo se l'utente è loggato, dovrebbe ritornare true
    expect(
      service.isLoggedIn()
    ).toBe(true);

  });


  // TEST PER VERIFICARE SE L'UTENTE NON È LOGGATO
  it('should return false when user is not logged in', () => {

    // Act & Assert: verifichiamo se l'utente è loggato, dovrebbe ritornare false
    expect(
      service.isLoggedIn()
    ).toBe(false);

  });


  // TEST PER VERIFICARE SE L'UTENTE è HR
  it('should return true for HR user', () => {


    // Arrange: creiamo un utente fittizio con ruolo HR
    const hrUser = {
      ...mockUser,
      role: UserRole.HR
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
  it('should return true for EMPLOYEE user', () => {

    // Arrange: impostiamo il localStorage con l'utente corrente (ruolo EMPLOYEE)
    localStorage.setItem(
      'currentUser',
      JSON.stringify(mockUser)
    );

    // Act & Assert: verifichiamo se l'utente è EMPLOYEE, dovrebbe ritornare true
    expect(
      service.isEmployee()
    ).toBe(true);

  });


  // TEST PER VERIFICARE SE UN EMPLOYEE NON È HR
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



// VS Code Counter: 141 code lines (24/11/2026)



// TEST VERIFICATI (24/11/2026):
// - 'should login and save it in localStorage' (Login corretto) (Avvenuto con successo)
// - 'should return undefined when credentials are invalid' (Login con credenziali non valide) (Avvenuto con successo)
// - 'should login ignoring email case' (Login ignorando il case dell'email) (Avvenuto con successo)
// - 'should remove user from localStorage on logout' (Logout) (Avvenuto con successo)
// - 'should return current user from localStorage' (Ottenere l'utente corrente) (Avvenuto con successo)
// - 'should return null when no user is stored' (Gestione utente non trovato) (Avvenuto con successo)
// - 'should return true when user is logged in' (Verificare se l'utente è loggato) (Avvenuto con successo)
// - 'should return false when user is not logged in' (Verificare se l'utente non è loggato) (Avvenuto con successo)
// - 'should return true for HR user' (Verificare se l'utente è HR) (Avvenuto con successo)
// - 'should return true for EMPLOYEE user' (Verificare se l'utente è EMPLOYEE) (Avvenuto con successo)
// - 'should return false for employee in isHr' (Verificare se un EMPLOYEE non è HR) (Avvenuto con successo)

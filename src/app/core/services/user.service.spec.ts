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

    service = TestBed.inject(UserService);
    httpMock = TestBed.inject(HttpTestingController);

  });

  afterEach(() => {
    httpMock.verify();
  });


  // PRENDERE TUTTI GLI UTENTI TRANNE SYSTEM CONFIG
  it('should return users excluding systemConfig', () => {

    service.getUsers()
      .subscribe(result => {

        expect(result).toEqual([
          employeeMock,
          hrMock
        ]);

      });

    const req = httpMock.expectOne(
      service['apiUrl']
    );

    expect(req.request.method)
      .toBe('GET');

    req.flush(usersMock);

  });


  // PRENDERE UTENTE PER ID
  it('should get user by id', () => {

    service.getUserById('1')
      .subscribe(user => {
        expect(user).toEqual(employeeMock);
      });

    const req = httpMock.expectOne(
      `${environment.apiUrl}/users/1`
    );

    expect(req.request.method)
      .toBe('GET');

    req.flush(employeeMock);

  });


  // PRENDERE UTENTE PER EMAIL
  it('should get user by email', () => {

    service.getUserByEmail(
      'mario@test.it'
    ).subscribe(user => {
      expect(user).toBe(employeeMock);
    });

    const req = httpMock.expectOne(
      `${service['apiUrl']}?email=mario@test.it`
    );

    expect(req.request.method).toBe('GET');

    req.flush([employeeMock]);

  });


  // PRENDERE UTENTE PER EMAIL: CASO "UTENTE NON TROVATO"
  it('should return undefined when email is not found', () => {

    service.getUserByEmail(
      'unknown@test.it'
    ).subscribe(user => {
      expect(user).toBeUndefined();
    });

    const req = httpMock.expectOne(
      `${service['apiUrl']}?email=unknown@test.it`
    );

    req.flush([]);

  });


  // PRENDERE SOLO GLI EMPLOYEE
  it('should return only employees', () => {

    service.getEmployees()
      .subscribe(result => {

        expect(result).toEqual([
          employeeMock
        ]);

      });

    const req = httpMock.expectOne(
      service['apiUrl']
    );

    req.flush(usersMock);

  });


  // AGGIORNA UTENTE
  it('should update user', () => {

    service.updateUser(
      employeeMock.id,
      employeeMock as never
    ).subscribe(user => {

      expect(user).toEqual(employeeMock);

    });


    const req = httpMock.expectOne(
      `${service['apiUrl']}/${employeeMock.id}`
    );

    expect(req.request.method).toBe('PUT');

    expect(req.request.body).toEqual(employeeMock);

    req.flush(employeeMock);

  });


  // PRENDERE I DETTAGLI DI UNA RICHIESTA CON L'UTENTE
  it('should return request details with user', () => {

    service.getRequestDetails('12')
      .subscribe(result => {

        expect(result).toEqual({
          ...requestMock,
          user: employeeMock
        });

      });

    const requestReq = httpMock.expectOne(
      `${environment.apiUrl}/refundRequests/12`
    );

    expect(requestReq.request.method).toBe('GET');

    requestReq.flush(requestMock);

    const userReq = httpMock.expectOne(
      `${environment.apiUrl}/users/1`
    );

    expect(userReq.request.method).toBe('GET');

    userReq.flush(employeeMock);
  });


});



// VS Code Counter: 151 code lines (27/11/2026)



// TEST VERIFICATI (27/11/2026):
// 'should return users excluding systemConfig' (Prendere tutti gli utenti tranne systemConfig)
// (Avvenuto con successo)
// 'should get user by id' (Prendere utente per ID) (Avvenuto con successo)
// 'should get user by email' (Prendere utente per email) (Avvenuto con successo)
// 'should return undefined when email is not found'
// (Prendere utente per email: caso "utente non trovato") (Avvenuto con successo)
// 'should return only employees' (Prendere solo gli employee)
// 'should update user' (Aggiornare utente) (Avvenuto con successo)
// 'should return request details with user' (Prendere i dettagli di una richiesta con l'utente)
// (Avvenuto con successo)
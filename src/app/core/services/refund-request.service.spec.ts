import { TestBed } from '@angular/core/testing';
import { RefundRequestService } from './refund-request.service';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';

describe('RefundRequestService', () => {

  let service: RefundRequestService;
  let httpMock: HttpTestingController;

  const mockRequest = {
    id: '1',
    userId: '10',
    status: 'PENDING',
    totalRequestedAmount: 100,
    totalApprovedAmount: 0
  };

  const mockRequests = [
    mockRequest
  ];


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


  afterEach(() => {
    httpMock.verify();
  });


  // PRENDERE LE RICHIESTE
  // Verifica:
  // metodo GET
  // endpoint corretto
  // risposta corretta

  it('should get all requests', () => {

    service.getRequests()
      .subscribe(requests => {
        expect(requests).toEqual(mockRequests)
      });

    const req = httpMock.expectOne(
      service['apiUrl']
    );

    expect(req.request.method)
      .toBe('GET');

    req.flush(mockRequests);  // flush è un metodo che simula la risposta del server con i dati forniti 
    // e completa la richiesta HTTP in sospeso

  });


  // PRENDERE RICHIESTA PER ID 
  // Verifica endpoint dinamico
  it('should get requested by id', () => {

    service.getRequestById('1')
      .subscribe(request => {

        expect(request).toEqual(mockRequest);

      });

    const req = httpMock.expectOne(
      `${service['apiUrl']}/1`
    );

    expect(req.request.method)
      .toBe('GET');

    req.flush(mockRequest);

  });


  // PRENDERE RICHIESTE PER ID DELL'UTENTE
  it('should get requests by user id', () => {

    service.getRequestsByUserId('10')
      .subscribe(requests => {

        expect(requests).toEqual(mockRequests);

      });

    const req = httpMock.expectOne(
      `${service['apiUrl']}?userId=10`
    );

    expect(req.request.method)
      .toBe('GET');

    req.flush(mockRequests);

  });


  // CREARE UNA RICHIESTA
  // Verifica:
  // POST 
  // Body corretto 
  it('should create request', () => {

    service.createRequest(mockRequest as never)
      .subscribe(request => {
        expect(request).toEqual(mockRequest);
      });

    const req = httpMock.expectOne(
      service['apiUrl']
    );

    expect(req.request.method)
      .toBe('POST');

    expect(req.request.body)
      .toEqual(mockRequest);

    req.flush(mockRequest);

  });


  // AGGIORNA RICHIESTA
  // Verifica: 
  // PUT
  // id corretto
  // payload corretto
  it('should update request', () => {

    service.updateRequest(
      '1',
      mockRequest as never
    ).subscribe(request => {

      expect(request)
        .toEqual(mockRequest);

    });

    const req = httpMock.expectOne(
      `${service['apiUrl']}/1`
    );

    expect(req.request.method)
      .toBe('PUT');

    expect(req.request.body)
      .toEqual(mockRequest);

    req.flush(mockRequest);

  });


  // ELIMINARE RICHIESTA 
  // Verifica DELETE
  it('should delete request', () => {

    service.deleteRequest('1')
      .subscribe();

    const req = httpMock.expectOne(
      `${service['apiUrl']}/1`
    );

    expect(req.request.method)
      .toBe('DELETE');

    req.flush(null);

  });


  // PRENDERE TUTTE LE RICHIESTE
  it('should get all requests for HR', () => {

    service.getAllRequests()
      .subscribe(requests => {

        expect(requests).toEqual(mockRequest);

      });

    const req = httpMock.expectOne(
      service['apiUrl']
    );

    expect(req.request.method)
      .toBe('GET');

    req.flush(mockRequests);

  });


  // GESTIONE ERRORE HTTP
  it('should handle http error', () => {

    service.getRequests().subscribe({

      next: () => expect.fail('should fail'),
      error: error => {
        expect(error.status)
          .toBe(500);
      }

    });

    const req = httpMock.expectOne(
      service['apiUrl']
    );

    req.flush('Server error',
      {
        status: 500,
        statusText: 'Server Error'
      }
    );

  });

});



//  C'E' UN ERRORE DA SISTEMARE (TEST)
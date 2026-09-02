import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { RefundRequest } from '../interfaces/refund-request';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})

//Responsabile delle richieste di rimborso
export class RefundRequestService {


  private readonly apiUrl = `${environment.apiUrl}/refundRequests`;


  constructor(private http: HttpClient) { }


  // METODO PER OTTENERE TUTTE LE RICHIESTE DI RIMBORSO
  getRequests(): Observable<RefundRequest[]> {
    return this.http.get<RefundRequest[]>(this.apiUrl);
  }


  // METODO PER OTTENERE UNA RICHIESTA TRAMITE ID
  getRequestById(id: string): Observable<RefundRequest> {
    return this.http.get<RefundRequest>(`${this.apiUrl}/${id}`);
  }


  // METODO PER OTTENERE 1 O PIÙ RICHIESTE DI UN UTENTE TRAMITE IL SUO ID
  // Nota: Qui un dipendente può avere più richieste
  getRequestByUserId(userId: string): Observable<RefundRequest[]> {
    return this.http.get<RefundRequest[]>
      (`${this.apiUrl}?userId=${userId}`);

  }


  // METODO PER CREARE UNA NUOVA RICHIESTA DI RIMBORSO
  createRequest(request: RefundRequest): Observable<RefundRequest> {  
    return this.http.post<RefundRequest>(  
      this.apiUrl,
      request
    );
  }


  // METODO PER AGGIORNARE UNA RICHIESTA DI RIMBORSO
  updateRequest(
    id: string,
    request: RefundRequest
  ): Observable<RefundRequest> {
    return this.http.put<RefundRequest>(
      `${this.apiUrl}/${id}`,
      request
    );
  }


  // METODO PER ELIMINARE UNA RICHIESTA DI RIMBORSO
  deleteRequest(
    id: string
  ): Observable<void> {
    return this.http.delete<void>(  
      `${this.apiUrl}/${id}`
    );
  }


}


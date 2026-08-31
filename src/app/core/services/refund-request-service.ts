import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { RefundRequest } from '../interfaces/refund-request';

@Injectable({
  providedIn: 'root',
})

//Responsabile delle richieste di rimborso
export class RefundRequestService {

    private readonly apiUrl = `${environment.apiUrl}/refundRequests`; // URL dell'API per le richieste di rimborso
    
    constructor(private http: HttpClient) { }  // Iniezione del servizio HttpClient per effettuare le richieste HTTP

    // METODO PER OTTENERE TUTTE LE RICHIESTE DI RIMBORSO
    getRequests(){
      return this.http.get<RefundRequest[]>(this.apiUrl);  // fa una richiesta GET all'API per ottenere tutte le richieste di rimborso e restituisce un array di oggetti RefundRequest
      // come fa a riconoscere che l'oggetto restituito è di tipo RefundRequest? perché abbiamo specificato <RefundRequest[]> come tipo di ritorno della funzione get, quindi TypeScript sa che l'oggetto restituito sarà un array di oggetti RefundRequest
    }
}


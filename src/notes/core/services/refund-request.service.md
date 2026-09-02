# COMMENTI

Ho creato questo servizio per gestire tutte le operazioni relative alle richieste di rimborso, come ottenere, creare, aggiornare ed eliminare le richieste.

In questo modo, il componente che utilizza questo servizio può facilmente interagire con l'API senza preoccuparsi dei dettagli delle richieste HTTP.


```TYPESCRIPT
//Responsabile delle richieste di rimborso
export class RefundRequestService {

  private readonly apiUrl = `${environment.apiUrl}/refundRequests`; // URL dell'API per le richieste di rimborso

  constructor(private http: HttpClient) { }  // Iniezione del servizio HttpClient per effettuare le richieste HTTP


  // METODO PER OTTENERE TUTTE LE RICHIESTE DI RIMBORSO
  getRequests(): Observable<RefundRequest[]> {
    return this.http.get<RefundRequest[]>(this.apiUrl);  // Fa una richiesta GET all'API per ottenere tutte le richieste di rimborso e restituisce un array di oggetti RefundRequest
    // Come fa a riconoscere che l'oggetto restituito è di tipo RefundRequest? perché abbiamo specificato <RefundRequest[]> come tipo di ritorno della funzione get, quindi TypeScript sa che l'oggetto restituito sarà un array di oggetti RefundRequest
  }


  // METODO PER OTTENERE UNA RICHIESTA TRAMITE ID
  getRequestById(id: string): Observable<RefundRequest> {
    return this.http.get<RefundRequest>(`${this.apiUrl}/${id}`);  // fa una richiesta GET all'API per ottenere una singola richiesta di rimborso tramite il suo ID
  }


  // METODO PER OTTENERE 1 O PIU' RICHIESTE DI UN UTENTE TRAMITE IL SUO ID
  // Nota: Qui un dipendente può avere più richieste
  getRequestByUserId(userId: string): Observable<RefundRequest[]> {

    return this.http.get<RefundRequest[]> // fa una richiesta GET all'API per ottenere tutte le richieste di rimborso di un utente tramite il suo ID

      (`${this.apiUrl}?userId=${userId}`); // uso "?userId=ID dell'utente" (una query string) per filtrare le richieste di rimborso dell'utente specifico. Devo scriverlo così per far capire all'API quale utente sto cercando. E' un parametro di query nell'URL.

  }


  // METODO PER CREARE UNA NUOVA RICHIESTA DI RIMBORSO
  createRequest(request: RefundRequest): Observable<RefundRequest> {
    return this.http.post<RefundRequest>(  // fa una richiesta POST all'API per creare una nuova richiesta di rimborso
      this.apiUrl, // URL dell'API per creare una nuova richiesta di rimborso
      request  // dati della nuova richiesta di rimborso
    );
  }


  // METODO PER AGGIORNARE UNA RICHIESTA DI RIMBORSO
  updateRequest(
    id: string,
    request: RefundRequest
  ) Observable<RefundRequest> {
    return this.http.put<RefundRequest>(  // fa una richiesta PUT all'API per aggiornare una richiesta di rimborso
      `${this.apiUrl}/${id}`, // URL dell'API per aggiornare la richiesta di rimborso specificata dall'ID
      request  // dati aggiornati della richiesta di rimborso
    )
  }


  // METODO PER ELIMINARE UNA RICHIESTA DI RIMBORSO
  deleteRequest(
    id: string,
    request: RefundRequest
  ) Observable<void> {
    return this.http.delete<void>(  // fa una richiesta DELETE all'API per eliminare una richiesta di rimborso
      `${this.apiUrl}/${id}` // questa è l'URL dell'API per eliminare la richiesta di rimborso specificata dall'ID
    );
  }

}
  ```

## NB:

- Una query string è una parte dell'URL che contiene parametri di ricerca, in questo caso userId, per filtrare i risultati dell'API.

- <void> significa che non ci aspettiamo alcun contenuto di risposta dal server.
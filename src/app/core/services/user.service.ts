import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { User } from '../interfaces/user';
import { UserRole } from '../interfaces/enum';


@Injectable({
  providedIn: 'root',
})

export class UserService {

  private readonly apiUrl = `${environment.apiUrl}/users`;

  constructor(private http: HttpClient) { }


  // METODO PER OTTENERE TUTTI GLI UTENTI
  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl)
  }


  // METODO PER OTTENERE UN UTENTE SPECIFICO IN BASE ALL'ID
  getUserById(id: string): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/${id}`);
  }


  // METODO PER OTTENERE UN UTENTE SPECIFICO IN BASE ALL'EMAIL
  // NOTA: Anche se l'email dovrebbe essere unica, MockAPI restituisce comunque una lista.
  getUserByEmail(email: string): Observable<User | undefined> {
    // Perché User[] causa errore? Risposta: perché sto usando map per restituire solo il primo elemento della lista, 
    // quindi il tipo risultante è User | undefined, non User[] che è un array.
    return this.http
      .get<User[]>(`${this.apiUrl}?email=${email}`)  // Restituisce un array di utenti che corrispondono all'email (anche se dovrebbe esserci solo uno)
      .pipe(map(users => users[0]))  // Il pipe serve per trasformare l'array di utenti in un singolo utente (il primo elemento)
    // users[0] è il primo elemento dell'array, che corrisponde all'utente con l'email specificata (se esiste perché potrebbe non esserci nessun utente con quell'email)
    // Quindi map(users => users[0]) serve per ottenere il primo utente dell'array, che è quello con l'email specificata.
  }  // Questo metodo mi sarà utile per implementare la funzionalità di reset della password basata sull'email dell'utente.


  // METODO PER OTTENERE I DIPENDENTI (EMPLOYEES)
  getEmployees(): Observable<User[]> {
    return this.getUsers().pipe(
      map(users =>
        users.filter(user => user.role === UserRole.EMPLOYEE)
      )
    );

  }


  // METODO PER AGGIORNARE UN UTENTE
  // Questo metodo aggiorna un utente esistente in base all'ID fornito.
  updateUser(id: string, user: User): Observable<User> {  // I parametri sono l'ID dell'utente da aggiornare e l'oggetto User con i nuovi dati da aggiornare
    // Il valore di ritorno è l'utente aggiornato.
    return this.http.put<User>(  // Effettua una richiesta HTTP PUT per aggiornare l'utente con l'ID specificato
      `${this.apiUrl}/${id}`,  // URL dell'endpoint per aggiornare l'utente con l'ID specificato
      user   // user indica l'oggetto User con i nuovi dati da aggiornare
    );
  }

}


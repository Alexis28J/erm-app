import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { map, Observable, switchMap } from 'rxjs';
import { RequestWithUser, User } from '../interfaces/user';
import { UserRole } from '../interfaces/enum';
import { RefundRequest } from '../interfaces/refund-request';


@Injectable({
  providedIn: 'root',
})

export class UserService {

  private readonly apiUrl = `${environment.apiUrl}/users`;

  constructor(private http: HttpClient) { }


  // METODO PER OTTENERE TUTTI GLI UTENTI
  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl).pipe(
      map(users => users.filter(user => !user.systemConfig))
    );
  }


  // METODO PER OTTENERE UN UTENTE SPECIFICO IN BASE ALL'ID
  getUserById(id: string): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/${id}`);
  }


  // METODO PER OTTENERE UN UTENTE SPECIFICO IN BASE ALL'EMAIL
  getUserByEmail(email: string): Observable<User | undefined> {
    return this.http
      .get<User[]>(`${this.apiUrl}?email=${email}`)
      .pipe(map(users => users[0]))
  }


  // METODO PER OTTENERE I DIPENDENTI (EMPLOYEES)
  getEmployees(): Observable<User[]> {
    return this.getUsers().pipe(
      map(users =>
        users.filter(user => user.role === UserRole.EMPLOYEE && !user.systemConfig)
      )
    );
  }


  // METODO PER AGGIORNARE UN UTENTE
  updateUser(id: string, user: User): Observable<User> {
    return this.http.put<User>(
      `${this.apiUrl}/${id}`,
      user
    );
  }


  // METODO PER OTTENERE I DETTAGLI DI UNA RICHIESTA CON I DATI DELL'UTENTE ASSOCIATO
  getRequestDetails(requestId: string): Observable<RequestWithUser> {

    return this.http.get<RefundRequest>(`${environment.apiUrl}/refundRequests/${requestId}`).pipe(
      switchMap(request =>
        this.http.get<User>(`${environment.apiUrl}/users/${request.userId}`).pipe(
          map(user => ({ ...request, user }))
        )
      )
    );

  }

}


// VS Code counter: 49 code lines (22/10/2026)
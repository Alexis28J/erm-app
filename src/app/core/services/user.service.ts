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
  getUserByEmail(email: string): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}?email=${email}`);
  }


  // METODO PER OTTENERE I DIPENDENTI (EMPLOYEES)
  getEmployees(): Observable<User[]> {
    return this.getUsers().pipe(
      map(users =>
        users.filter(user => user.role === UserRole.EMPLOYEE)
      )
    );
  }

}


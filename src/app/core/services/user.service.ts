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
  getUserByEmail(email: string): Observable<User | undefined> {
    return this.http
      .get<User[]>(`${this.apiUrl}?email=${email}`)
      .pipe(map(users => users[0]))
  }


  // METODO PER OTTENERE I DIPENDENTI (EMPLOYEES)
  getEmployees(): Observable<User[]> {
    return this.getUsers().pipe(
      map(users =>
        users.filter(user => user.role === UserRole.EMPLOYEE)
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

}


// VS Code counter: 37 code lines (08/10/2026)
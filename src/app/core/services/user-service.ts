import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { User } from '../interfaces/user';


@Injectable({
  providedIn: 'root',
})

export class UserService {

    private readonly apiUrl = `${environment.apiUrl}/users`; 
    
    constructor(private http: HttpClient) { }  


    // METODO PER OTTENERE TUTTI GLI UTENTI
    getUsers(){
      return this.http.get<User[]>(this.apiUrl)  
    }


    // METODO PER OTTENERE UN UTENTE SPECIFICO IN BASE ALL'ID
    getUserById(id: string){
      return this.http.get<User>(`${this.apiUrl}/${id}`); 
    }


    // METODO PER OTTENERE UN UTENTE SPECIFICO IN BASE ALL'EMAIL
    getUserByEmail(email: string){
      return this.http.get<User>(`${this.apiUrl}?email=${email}`); 
    }

    
}


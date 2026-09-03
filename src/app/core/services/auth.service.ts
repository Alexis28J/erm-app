import { Injectable } from '@angular/core';
import { UserService } from './user.service';
import { map, tap } from 'rxjs/operators';
import { User } from '../interfaces/user';
import { UserRole } from '../interfaces/enum';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})

export class AuthService {

    private readonly STORAGE_KEY = 'currentUser';

    constructor(private userService: UserService) { }


    // METODO PER LOGGARSI
    login(email: string, password: string): Observable<User | undefined> {

        return this.userService.getUsers()
            .pipe(
                map(users =>
                    users.find(
                        user => {
                            return user.email.toLowerCase() === email.toLowerCase() &&
                                user.password === password &&
                                user.active !== false
                        }
                    )
                ),
                tap(user => {
                    if (user) {
                        localStorage.setItem(
                            this.STORAGE_KEY,
                            JSON.stringify(user)
                        );
                    }
                })
            );

    }


    // METODO PER LOGOUT
    logout() {
        localStorage.removeItem(
            this.STORAGE_KEY
        );
    }


    // METODO PER OTTENERE L'UTENTE CORRENTE DAL LOCALSTORAGE
    getCurrentUser(): User | null {

        const user =
            localStorage.getItem(
                this.STORAGE_KEY
            );

        return user
            ? JSON.parse(user)
            : null;

    }


    // METODO PER VERIFICARE SE L'UTENTE È LOGGATO
    isLoggedIn(): boolean {
        return !!this.getCurrentUser();
    }


    // METODO PER CONTROLLARE SE L'UTENTE CORRENTE È HR
    isHr(): boolean {
        const user = this.getCurrentUser();

        return user?.role === UserRole.HR;
    }


    // METODO PER CONTROLLARE SE L'UTENTE CORRENTE È DIPENDENTE NORMALE (EMPLOYEE)
    isEmployee(): boolean {
        const user = this.getCurrentUser();

        return user?.role === UserRole.EMPLOYEE;
    }

}



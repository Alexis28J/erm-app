import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { AppConfig } from '../interfaces/app-config';

@Injectable({
    providedIn: 'root'
})

export class ConfigService {

    private readonly apiUrl = `${environment.apiUrl}/users/config`;


    constructor(private http: HttpClient) { }


    // METODO PER OTTENERE LA CONFIGURAZIONE DEGLI UTENTI
    getConfig() {
        return this.http.get<AppConfig>(this.apiUrl);
    }


    // METODO PER AGGIORNARE LA CONFIGURAZIONE DEGLI UTENTI
    updateConfig(config: AppConfig) {
        return this.http.put<AppConfig>(
            this.apiUrl,
            config
        )
    }

}



// VS Code counter: 20 code lines (13/10/2026)


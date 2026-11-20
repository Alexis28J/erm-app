import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { AppConfig } from '../interfaces/app-config';

@Injectable({
    providedIn: 'root'
})

export class ConfigService {

    private readonly apiUrl = `${environment.apiUrl}/users/config`;

    private readonly http = inject(HttpClient);


    // SIGNAL PER MEMORIZZARE LA CONFIGURAZIONE DEGLI UTENTI
    readonly config = signal<AppConfig | null>(null);


    // METODO PER AGGIORNARE LA CONFIGURAZIONE DEGLI UTENTI
    updateConfig(config: AppConfig) {
        return this.http.put<AppConfig>(
            this.apiUrl,
            config
        )
    }


    // METODO PER CARICARE LA CONFIGURAZIONE DEGLI UTENTI
    loadConfig() {
        return this.http.get<AppConfig>(this.apiUrl);
    }


    // METODO PER IMPOSTARE LA CONFIGURAZIONE DEGLI UTENTI
    setConfig(config: AppConfig) {
        this.config.set(config);
    }

}



// VS Code counter: 24 code lines (20/11/2026)


# COMMENTI

```TYPESCRIPT
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { AppConfig } from '../interfaces/app-config';

@Injectable({
    providedIn: 'root'
})

// Questo servizio serve per gestire la configurazione degli utenti, permettendo di ottenere e aggiornare le impostazioni tramite richieste HTTP.
// La configurazione degli utenti include tutte le impostazioni relative agli utenti, come i limiti di spesa e altre preferenze specifiche.
// Di solito, gli agenti HR utilizzano questa configurazione per gestire centralmente le impostazioni degli utenti all'interno dell'applicazione.


export class ConfigService {

    private readonly apiUrl = `${environment.apiUrl}/users/config`;  // Endpoint per la configurazione degli utenti
    // config rappresenta la configurazione degli utenti che si trova all'interno dell'endpoint specificato.
    // Nel mio caso dentro la resource "users" del servizio MockAPI.


    constructor(private http: HttpClient) { }  // Inietta il servizio HttpClient per effettuare richieste HTTP


    // METODO PER OTTENERE LA CONFIGURAZIONE DEGLI UTENTI
    getConfig() {  
        return this.http.get<AppConfig>(this.apiUrl);  // Effettua una richiesta GET per ottenere la configurazione degli utenti
        // <AppConfig> indica il tipo di dati attesi come risposta dalla richiesta GET 
    }


    // METODO PER AGGIORNARE LA CONFIGURAZIONE DEGLI UTENTI
    updateConfig(config: AppConfig) {
        return this.http.put<AppConfig>(  // Effettua una richiesta PUT per aggiornare la configurazione degli utenti
            // <AppConfig> indica il tipo di dati attesi come risposta dalla richiesta PUT cioè la configurazione aggiornata degli utenti
            this.apiUrl,  // Endpoint per la configurazione degli utenti
            config   // Dati della configurazione degli utenti da aggiornare
        )  // Effettua una richiesta PUT per aggiornare la configurazione degli utenti
    }
}
```

Il decoratore @Service non esiste in Angular. In Angular, per indicare che una classe può essere iniettata come servizio, si utilizza il decoratore @Injectable.

## Come mai si quando si crea un servizio in Angular, @Service viene impostato automaticamente?
La risposta è che alcuni IDE o strumenti di generazione del codice possono mostrare @Service come convenzione, ma in realtà Angular utilizza @Injectable per la gestione dei servizi.
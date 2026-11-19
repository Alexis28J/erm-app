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


    // constructor(private http: HttpClient) { }  // Inietta il servizio HttpClient per effettuare richieste HTTP
    private readonly http = inject(HttpClient);  // E' il modo moderno di ottenere il servizio HttpClient senza usare il costruttore.
    // Non c'è differenza funzionale rispetto all'uso del costruttore, ma è più conciso e moderno.


    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    // // METODO PER OTTENERE LA CONFIGURAZIONE DEGLI UTENTI
    // getConfig() {  
    //     return this.http.get<AppConfig>(this.apiUrl);  // Effettua una richiesta GET per ottenere la configurazione degli utenti
    //     // <AppConfig> indica il tipo di dati attesi come risposta dalla richiesta GET 
    // }


    // SIGNAL PER MEMORIZZARE LA CONFIGURAZIONE DEGLI UTENTI
    readonly config = signal<AppConfig | null>(null);


    // Il metodo getConfig() è stato commentato perché ora utilizzo il signal che memorizza la configurazione localmente.
    // Rispetto al metodo getConfig() che faceva sempre una richiesta HTTP, il signal permette di memorizzare la configurazione localmente e ridurre le chiamate al server.
    // In questo modo, posso accedere alla configurazione corrente direttamente dal signal senza fare una nuova richiesta HTTP ogni volta.
    // Questo approccio migliora le prestazioni e riduce il carico sul server.



    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    
    // METODO PER AGGIORNARE LA CONFIGURAZIONE DEGLI UTENTI
    updateConfig(config: AppConfig) {
        return this.http.put<AppConfig>(  // Effettua una richiesta PUT per aggiornare la configurazione degli utenti
            // <AppConfig> indica il tipo (modello) di dati attesi come risposta dalla richiesta PUT cioè la configurazione aggiornata degli utenti
            this.apiUrl,  // Endpoint per la configurazione degli utenti
            config   // Dati da inviare al server per aggiornare la configurazione
        )  // Effettua una richiesta PUT per aggiornare la configurazione degli utenti
    }

    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    // METODO PER CARICARE LA CONFIGURAZIONE DEGLI UTENTI
    loadConfig(){
        return this.http.get<AppConfig>(this.apiUrl);  // get<AppConfig> indica che ci aspettiamo una risposta di tipo AppConfig dal server.
        // Quindi, non c'è modo di ottenere per sbaglio una risposta di tipo diverso da AppConfig.
    }

    // I metodi loadConfig() e updateConfig() fanno ancora richieste HTTP per ottenere e aggiornare la configurazione sul server.
    // Questo è necessario perché vogliamo mantenere la configurazione aggiornata sia localmente che sul server.
    // Ricorda che il signal (this.config) solo aggiorna la configurazione localmente mentre loadConfig() e updateConfig() gestiscono la comunicazione con il server.
    // Tuttavia, setConfig() permette di aggiornare il signal localmente senza fare una richiesta HTTP.

    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    // METODO PER IMPOSTARE LA CONFIGURAZIONE DEGLI UTENTI
    setConfig(config: AppConfig){
        this.config.set(config);
    }
    // Questo metodo utilizza il signal per aggiornare la configurazione localmente senza fare una richiesta HTTP al server.

    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    // Prima il servizio faceva solo richieste HTTP per ottenere e aggiornare la configurazione degli utenti, 
    // ora utilizza anche un signal per memorizzare localmente la configurazione.

    // ConfigService deve mantenere la configurazione in memoria (signal) per poterla utilizzare senza dover fare sempre richieste HTTP.

    // Quindi usare signal è una scelta migliore per mantenere la configurazione in memoria e ridurre le richieste HTTP.
    // Usando solo richieste HTTP, ogni volta che serve la configurazione si dovrebbe fare una nuova richiesta, aumentando il carico sul server.
}
```

Il decoratore @Service non esiste in Angular. In Angular, per indicare che una classe può essere iniettata come servizio, si utilizza il decoratore @Injectable.

## Come mai si quando si crea un servizio in Angular, @Service viene impostato automaticamente?
La risposta è che alcuni IDE o strumenti di generazione del codice possono mostrare @Service come convenzione, ma in realtà Angular utilizza @Injectable per la gestione dei servizi.
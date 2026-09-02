# PASSI 

1. Ho eseguito `ng new erm-app` per creare il progetto su Angular.


2. Ho usato il comando `ng add @angular/material` per installare Angular Material nel mio progetto.


3. Ho creato i modelli dati dentro `shared/interfaces`.


4. Ho creato 2 file `environment.ts`, uno per l'ambiente di `sviluppo` e uno per l'ambiente di `produzione`, in modo da poter configurare l'applicazione in modo appropriato per ogni ambiente. 

In questo modo, posso garantire che le impostazioni e le variabili siano corrette per ogni ambiente, evitando problemi durante lo sviluppo e la distribuzione dell'applicazione.

Senza questi file, sarei costretto a modificare manualmente le impostazioni e le variabili ogni volta che passo da un ambiente all'altro, il che potrebbe portare a errori e problemi di configurazione.


5. Ho creato il file `user-service.ts` per fornire un servizio che gestisce le operazioni relative agli utenti, come ottenere tutti gli utenti, ottenere un utente specifico in base all'ID o all'email, e restituire i dati degli utenti come oggetti User.


6. Ho creato il servizio `refund-request-service` per gestire tutte le operazioni relative alle richieste di rimborso, come ottenere, creare, aggiornare ed eliminare le richieste.


7. Ho creato il servizio `auth-service` per gestire l'autenticazione degli utenti, inclusi login, logout e verifica dello stato di login.


8. Nel file `app.config.ts`, ho importato e configurato i provider per HttpClient, il router e la gestione globale degli errori del browser.


9. Ho creato la cartella features e dentro ho creato i componenti `login-employee-component` e `login-hr-component`


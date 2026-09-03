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


9. Ho creato la cartella `features` e dentro ho creato i componenti `home` e `login`. 
Creerò una solo un componente login per entrambi tipi di dipendente.
Nel mio modello ho già `role: UserRole` e nel mio AuthService ho già impostato i metodi `isEmployee()`
`isHr()`. Quindi, basterebbe che il sito reindirizzi l'utente a un determinato dashboard a seconda del suo ruolo. 


10. Sempre dentro `features`, ho creato le cartelle `employee` e `hr`.
Dentro `employee` ho creato 3 componenti: `employee-dashboard`, `request-list` e `new-request`.
E dentro `hr` ho creato altri 3 componenti: `hr-dashboard`, `request-list` e `request-detail`.


11. Su app.routes.ts, ho configurato la rotta delle pagine `home` e `login`. 
    (vedi file `app.routes.ts.md` per vederlo in modo più dettagliato)


12. Nel template di `home`, ho messo una struttura base facendo uso di contenitori `div` e moduli di Angular Material come `MatButtonModule`. Inoltre, ho impostato la route di login tramite il `routerLink` sul pulsante Login. Ho aggiunto anche un po' di css.
   

13. Per la (unica) pagina di login, ho deciso di implementare una struttura base facendo uso del Reactive Form che è lo standard nei progetti Angular. 


14. Ho creato, in modo basico, il `dashboard dell'employee` con i pulsanti di azione e la gestione dell'utente corrente.
In questo modo, l'utente può vedere le informazioni principali e accedere rapidamente alle azioni disponibili nel dashboard.
Inoltre, ho aggiunto nel file delle rotte, il path di questo componente. 


15. Ho implementato `l'Auth Guard` per proteggere le rotte delle pagine. Per fare ciò, ho fatto uso delle Functional Guards.


16. Continuando con la protezione delle rotte, ho deciso di implementare il `RoleGuard` perché dopo l'Auth Guard, il Role Guard è la protezione più importante dell'applicazione. L'Auth Guard verifica che l'utente sia autenticato ma il RoleGuard verifica che l'utente autenticato abbia il ruolo corretto. L'obbiettivo di implementarlo è proteggere le aree dell'applicazione designati a un ruolo specifico. 
Per ultimo, ho modificato la rotta della dashboard del EMPLOYEE, aggiustandola alle nuove condizioni.


17. Ho creato la logica della dashboard HR usando la stessa logica che ho usato per quello dell'employee. 

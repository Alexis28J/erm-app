// Ho trasferito le categorie di spesa alla resource "users" di MockAPI. 
// Quindi ho creato un utente tecnico dedicato per gestire le categorie di spesa tramite le API di MockAPI.


// PER VEDERE IL FLUSSO COMPLETO VEDI GLI APPUNTI DENTRO IL FILE "expense-categories.constant.md" (NOTES).
    

////////////////////////////////////////////////////////////////////////////////////////////////////////////


// In MockAPI (e un contesto di sviluppo software in generale), un utente tecnico (spesso chiamato Technical User, Service Account o App User) 
// è un account creato non per essere usato da una persona reale, ma per consentire a un'applicazione, un software o uno script di autenticarsi e interagire con le API in modo sicuro.

// Ecco le caratteristiche principali e perché si usa:
// • Automazione: Viene utilizzato per processi automatizzati, come test d'integrazione, pipeline di CI/CD (Continuous Integration/Continuous Deployment) o sincronizzazioni di dati in background.
// • Separazione dei ruoli: Permette di non legare le credenziali dell'API a un dipendente specifico. Se uno sviluppatore lascia l'azienda, l'applicazione continua a funzionare perché l'utente tecnico rimane attivo.
// • Sicurezza e Permessi minimi: A un utente tecnico vengono assegnati solo i permessi strettamente necessari (es. solo lettura di determinati endpoint mock), riducendo i rischi di sicurezza rispetto a un utente amministratore reale.
// • Tracciabilità: Poiché l'utente tecnico è separato dagli utenti reali, è più facile tracciare quali azioni sono state eseguite dall'applicazione rispetto a quelle eseguite da persone reali.
// • Manutenzione semplificata: Poiché l'utente tecnico è dedicato all'interazione con le API, è più facile aggiornare, modificare o revocare le credenziali senza impattare gli utenti reali.

// Nel mio caso, l'utente tecnico è stato creato specificamente per gestire le categorie di spesa tramite le API di MockAPI, garantendo che le operazioni automatizzate possano essere eseguite senza dipendere da un utente reale.
// Se avessi un backend reale, l'utente tecnico potrebbe comunque essere utilizzato per gestire le categorie di spesa in modo automatizzato, mantenendo separati i permessi e le credenziali dagli utenti reali.
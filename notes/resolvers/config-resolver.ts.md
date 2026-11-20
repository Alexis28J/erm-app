# COMMENTI

Un resolver in Angular è una funzione o un servizio che viene eseguito prima che una rotta venga attivata, permettendo di recuperare i dati necessari per la rotta prima che il componente venga caricato.

Quindi è utile per garantire che i dati necessari siano disponibili prima che il componente della rotta venga visualizzato.

In sintesi, il resolver si assicura che la configurazione dell'applicazione sia caricata prima che le rotte vengano attivate, permettendo all'app di avere accesso ai dati di configurazione necessari fin dall'inizio.


```TYPESCRIPT
import { ResolveFn } from '@angular/router';
import { AppConfig } from './core/interfaces/app-config';
import { inject } from '@angular/core';
import { ConfigService } from './core/services/config-service';

// ResolveFn è un tipo di funzione fornito da Angular Router che rappresenta un resolver. 
// La funzione deve restituire un valore o un Observable/Promise che risolve (fornisce) il valore necessario per la rotta.
// In questo caso, la funzione restituisce direttamente il risultato di configService.getConfig(), 
// che è un Observable che risolve (fornisce) un oggetto AppConfig necessario per la rotta.

export const configResolver: ResolveFn<AppConfig> = () => {

  const configService = inject(ConfigService);  // Inietta il servizio ConfigService per ottenere la configurazione dell'app.
  
  // Commentato perché ora utilizziamo loadConfig() con il resolver.
  // return configService.getConfig();  // Restituisce un Observable che risolve (fornisce) l'oggetto AppConfig necessario per la rotta.

  return configService.loadConfig().pipe(
    tap(config => configService.setConfig(config))
    // Il metodo tap viene utilizzato per eseguire un'azione collaterale senza modificare il flusso dei dati. In questo caso, impostiamo la configurazione caricata nel servizio.
  );

};


// Qual'è la differenza rispetto al vecchio approccio?
// Prima, i componenti dovevano fare richieste HTTP direttamente tramite getConfig() per ottenere la configurazione.
// Ora, il resolver si occupa di caricare la configurazione e aggiorna il signal del ConfigService.
// I componenti possono semplicemente leggere il signal del ConfigService, evitando richieste HTTP ridondanti.


// Quindi il flusso è router -> resolver -> ConfigService (signal) -> Signal<AppConfig> (significa che la configurazione è disponibile come signal).
// Interpretando questo flusso, possiamo capire che adesso il router (cioè il sistema di navigazione delle rotte) si affida al resolver per ottenere la configurazione prima di attivare la rotta, evitando che i componenti debbano gestire direttamente le richieste HTTP per la configurazione.
// Signal<AppConfig> rappresenta la configurazione dell'applicazione come signal, permettendo ai componenti di reagire automaticamente ai cambiamenti della configurazione.

```

# Qual'è la differenza tra resolver e initializer?

 - Un resolver viene eseguito prima che una rotta venga attivata e serve per recuperare i dati necessari per quella rotta.

 -  Un initializer, invece, viene eseguito all'avvio dell'applicazione e serve per inizializzare configurazioni o dati globali necessari per l'intera applicazione.

 Quindi, la vera differenza è che un resolver è legato al ciclo di vita di una rotta specifica, mentre un initializer è legato al ciclo di vita dell'intera applicazione.

 In pratica, l'initializer è utile per configurazioni globali necessarie all'avvio, mentre il resolver è utile per configurazioni specifiche di una rotta.

 Questo significa che Initializer è più pesante in termini di avvio dell'applicazione, poiché deve completare il caricamento della configurazione prima che l'app sia pronta.

 Il resolver, invece, non rallenta l'avvio dell'app, ma garantisce che la configurazione sia disponibile solo quando necessario per una determinata rotta.


 # NOTA: Non dimenticare di aggiungere questo resolver alla configurazione delle rotte del componente che ne ha bisogno.
# COMMENTI

```TYPESCRIPT
import { ResolveFn } from '@angular/router';
import { AppConfig } from './core/interfaces/app-config';
import { inject } from '@angular/core';
import { ConfigService } from './core/services/config-service';

export const configResolver: ResolveFn<AppConfig> = () => {
  const configService = inject(ConfigService);  // Inietta il servizio ConfigService per ottenere la configurazione dell'app.
  return configService.getConfig();   // Restituisce un Observable che risolve (fornisce) l'oggetto AppConfig necessario per la rotta.
};



// Un resolver in Angular è una funzione o un servizio che viene eseguito prima che una rotta venga attivata, 
// permettendo di recuperare i dati necessari per la rotta prima che il componente venga caricato.
// Quindi è utile per garantire che i dati necessari siano disponibili prima che il componente della rotta venga visualizzato.


// ResolveFn è un tipo di funzione fornito da Angular Router che rappresenta un resolver. 
// La funzione deve restituire un valore o un Observable/Promise che risolve (fornisce) il valore necessario per la rotta.
// In questo caso, la funzione restituisce direttamente il risultato di configService.getConfig(), 
// che è un Observable che risolve (fornisce) un oggetto AppConfig necessario per la rotta.


// Qual'è la differenza tra resolver e initializer?
// Un resolver viene eseguito prima che una rotta venga attivata e serve per recuperare i dati necessari per quella rotta.
// Un initializer, invece, viene eseguito all'avvio dell'applicazione e serve per inizializzare configurazioni o dati globali necessari per l'intera applicazione.
// Quindi, la vera differenza è che un resolver è legato al ciclo di vita di una rotta specifica, mentre un initializer è legato al ciclo di vita dell'intera applicazione.
// In sintesi, un resolver è specifico per una rotta e viene eseguito prima che la rotta venga attivata, mentre un initializer è globale e viene eseguito all'avvio dell'applicazione.
```
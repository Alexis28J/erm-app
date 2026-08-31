# COMMENTI

Gli `export enumerati` sono utili per definire un insieme di valori costanti che possono essere utilizzati in tutto il progetto. 

In questo caso, l'enumerazione `UserRole` definisce due ruoli possibili per un utente: `EMPLOYEE` e `HR`. 

Questi valori possono essere utilizzati per controllare l'accesso alle funzionalità dell'applicazione in base al ruolo dell'utente.

Il vantaggio di utilizzare gli `enum` è che forniscono un insieme di valori costanti e leggibili, rendendo il codice più chiaro e meno soggetto a errori rispetto all'uso di stringhe o numeri "magici".


### NB: 
Li scrivo in maiuscolo per convenzione, cioè per indicare che si tratta di costanti. In questo modo, quando si utilizza l'enumerazione `UserRole`, è chiaro che si sta facendo riferimento a valori fissi e non a variabili che possono cambiare durante l'esecuzione del programma.
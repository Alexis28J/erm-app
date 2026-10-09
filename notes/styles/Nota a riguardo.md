I file SCSS che iniziano con un trattino basso (underscore), come _filename.scss, sono chiamati partial (parziali) in Sass e servono a indicare al compilatore di non generare un file CSS autonomo per quel file specifico.

In un progetto Angular, questi file vengono utilizzati esclusivamente per essere importati all'interno di altri fogli di stile principali tramite la direttiva @use o @import.
Perché si usano i "partial"?

   -  Evitare file duplicati o inutili: Se il compilatore generasse un file CSS per ogni singolo modulo, ti ritroveresti con decine di file .css vuoti o ridondanti nella cartella di build.
    
   - Organizzazione del codice: Permettono di spezzettare l'architettura CSS in blocchi logici e gestibili (es. variabili, mixin, funzioni, design system).

   - Ottimizzazione delle performance: Angular elabora solo i file di stile principali associati ai componenti o l'styles.scss globale, includendo i partial solo dove sono stati esplicitamente richiesti.


////  

## Esempio pratico

Immagina di avere un file con le variabili dei colori chiamato _variables.scss:


```SCSS
// _variables.scss (Non verrà compilato in un file CSS separato)
$primary-color: #3498db;
$secondary-color: #2ecc71;


// Puoi richiamarlo nel file di stile globale o di un componente senza usare l'underscore o l'estensione:


// styles.scss
@use 'variables'; // Cerca automaticamente _variables.scss

body {
  background-color: variables.$primary-color;
}
```
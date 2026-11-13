# COMMENTI

Questa pipe serve per tradurre le chiavi in base al dizionario della lingua corrente. 
Se la chiave non è presente nel dizionario, viene restituita la chiave stessa.
Ad esempio, se la lingua corrente è l'italiano e il dizionario contiene la chiave 'hello' con il valore 'ciao', allora {{ 'hello' | translate }} restituirà 'ciao'.

```TYPESCRIPT
@Pipe({
  name: 'translate',
  pure: false
  // La proprietà pure indica che la pipe non è pura (cioè dipende da uno stato esterno) e per questo deve essere rieseguita ogni volta che cambia lo stato osservato (ad esempio la lingua corrente)
})
export class TranslatePipe implements PipeTransform {

  private readonly languageService = inject(LanguageService);

  // Il metodo transform prende una chiave come input e restituisce la traduzione corrispondente dal dizionario della lingua corrente. Se la chiave non è presente nel dizionario, viene restituita la chiave stessa.
  transform(key: string): string {  

    const dictionary = this.languageService.dictionary();  // Ottieni il dizionario della lingua corrente

    const value = key  // Suddividi la chiave in parti separate da '.' e naviga nel dizionario. Questo mi consente di ottenere il valore corretto anche per chiavi annidate.

    .split('.')  // Ad esempio, 'employee.dashboard.title' diventa ['employee', 'dashboard', 'title']. Posso accedere al valore corretto navigando nel dizionario.

    .reduce<any>(  // reduce<any> mi permette di iterare attraverso le parti della chiave e ottenere il valore corretto nel dizionario.

      (obj, current) => obj?.[current],  // Questa riga indica come accedere al valore corrente nel dizionario durante l'iterazione.
      
      dictionary  // Inizia la riduzione partendo dal dizionario e navigando attraverso le chiavi annidate per ottenere il valore corretto.
    );

    return value ?? key;  // Se il valore non esiste nel dizionario, restituisci la chiave stessa come fallback.

  }

}
```
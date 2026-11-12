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

  // Il metodo transform prende una chiave come input e restituisce la traduzione corrispondente dal dizionario della lingua corrente.
  // Se la chiave non è presente nel dizionario, viene restituita la chiave stessa.
  transform(key: string): string {  
    return (
      this.languageService.dictionary()[  // Ottieni il valore corrispondente alla chiave nel dizionario della lingua corrente
      key as keyof ReturnType<typeof this.languageService.dictionary> // Tratta la chiave come una chiave valida del dizionario della lingua corrente
      ] ?? key  // Se la chiave non è presente nel dizionario, restituisci la chiave stessa
    );
  }

}
```
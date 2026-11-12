# COMMENTI

Questo servizio gestisce la lingua corrente dell'applicazione, fornendo metodi per impostare, ottenere e alternare la lingua, e un dizionario tradotto basato sulla lingua selezionata. 

Questo servizio utilizza i signal di Angular per gestire lo stato della lingua in modo reattivo. 
In questo modo, qualsiasi componente che osserva la lingua o il dizionario tradotto verrà aggiornato automaticamente quando la lingua cambia.

```TYPESCRIPT
export class LanguageService {
    
    // SIGNAL CHE CONTIENE LA LINGUA CORRENTE
    private readonly _language = signal<Language>(  
        (localStorage.getItem('language') as Language) ?? 'it' 
        // Se non è presente una lingua nel localStorage, utilizza 'it' come lingua predefinita
    );  
    
    // <Language> indica il tipo di dato (modello) che rappresenta la lingua corrente (ad esempio 'it' o 'en') e viene importato dal file language.type.ts.
    // NB: L'underscore iniziale (_) indica che si tratta di una proprietà privata e non dovrebbe essere utilizzata direttamente al di fuori della classe. Il suo uso non è obbligatorio, ma è una convenzione comune per indicare proprietà private. Non impedisce comunque l'accesso alla proprietà dall'esterno della classe.


    // SIGNAL PUBBLICA CHE ESPONE LA LINGUA CORRENTE COME READONLY
    // Espone la lingua corrente come segnale di sola lettura, in modo che i componenti possano utilizzarla senza modificarla direttamente.
    readonly language = this._language.asReadonly();  
    // L'uso di .asReadonly() mi assicura che i componenti possano leggere la lingua corrente senza modificarla direttamente.


    // SIGNAL CHE CONTIENE IL DIZIONARIO DELLA LINGUA CORRENTE
    // Espone il dizionario della lingua corrente come segnale calcolato, in modo che i componenti possano utilizzarlo senza modificarlo direttamente.
    readonly dictionary = computed(
        () => translations[this.language()]  // Restituisce il dizionario della lingua corrente basato sul segnale della lingua. 
        // Ad esempio, se la lingua corrente è 'it', restituirà il dizionario italiano.
    );


    // METODO PER IMPOSTARE LA LINGUA CORRENTE
    // Questo metodo mi consente di impostare la lingua corrente, aggiornando sia il localStorage che il segnale interno della lingua.
    setLanguage(language: Language): void {
        localStorage.setItem('language', language);  // Salva la lingua corrente nel localStorage, in modo che venga mantenuta anche dopo il refresh della pagina.
        this._language.set(language);  // Aggiorna il segnale della lingua corrente, in modo che tutti i componenti che lo osservano ricevano il nuovo valore.
    }


    // METODO PER TOGGLE LA LINGUA CORRENTE
    // Questo metodo mi consente di alternare la lingua corrente tra 'it' e 'en'.
    toggleLanguage(): void {
        this.setLanguage(  // Imposta la lingua corrente alternando tra 'it' e 'en'.
            this.language() === 'it'  // Se la lingua corrente è 'it', passa a 'en', altrimenti passa a 'it'.
                ? 'en'
                : 'it'  // 'it' è la lingua predefinita se non è presente una lingua nel localStorage.
        );
    }

}
```
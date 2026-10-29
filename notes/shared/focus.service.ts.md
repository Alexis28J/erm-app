# COMMENTI

```TYPESCRIPT
export class FocusService {
    // Creo un servizio singleton per gestire il focus degli elementi nella mia applicazione
    // Un servizio singleton significa che ci sarà una sola istanza di questo servizio in tutta l'applicazione.
    // In altre parole, ogni volta che iniettiamo questo servizio in un componente o in un altro servizio, 
    // la stessa istanza verrà utilizzata.
    // Questo è utile per gestire il focus in modo centralizzato e coerente in tutta l'applicazione.


    // SIGNAL CHE MEMORIZZA IL RIFERIMENTO ALL'ELEMENTO TARGET CORRENTE
    // Questo signal memorizza il riferimento all'elemento del DOM che deve ricevere il focus.
    private customTarget = signal<ElementRef<HTMLElement> | null>(null);


    // METODO PER IMPOSTARE IL TARGET PERSONALIZZATO
    // Permette alle singole pagine di registrare il proprio "main-content" personalizzato
    // Registra un elemento del DOM come target personalizzato per il focus.
    setCustomTarget(elementRef: ElementRef<HTMLElement>) {
        this.customTarget.set(elementRef);
    }


    // METODO PER REIMPOSTARE IL TARGET PERSONALIZZATO AL COMPORTAMENTO DI DEFAULT
    // Resetta il target personalizzato al comportamento di default (es. quando si cambia pagina).
    resetTarget() {
        this.customTarget.set(null);
    }


    // METODO PER OTTENERE IL TARGET CORRENTE
    // Restituisce il target corrente (l'elemento del DOM che deve ricevere il focus)
    // Se non è stato impostato un target personalizzato, restituisce null.
    // Utile per ottenere l'elemento che deve ricevere il focus corrente.
    getTarget() {
        return this.customTarget();
    }

}
```
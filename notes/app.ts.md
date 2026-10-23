# COMMENTI

```TYPESCRIPT
export class App {

  // TITOLO DELL'APPLICAZIONE
  protected readonly title = signal('erm-app');

  //// CONFIGURAZIONE PER IL SALTO AL CONTENUTO PRINCIPALE ////
  // Questa configurazione permette di saltare direttamente al contenuto principale della pagina
  // Il link di salto sarà visibile solo quando riceve il focus, migliorando l'accessibilità della pagina

  // CONTENITORE PRINCIPALE DELLA PAGINA
  // Seleziona il tag <main> della pagina corrente usando i Signals
  private mainContent = viewChild<ElementRef<HTMLElement>>('mainContent');


  // METODO PER SALTARE AL CONTENUTO PRINCIPALE
  jumpToTheContent() {
    this.mainContent()?.nativeElement.focus();
  }

}
```
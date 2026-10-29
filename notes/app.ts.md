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
  // private mainContent = viewChild<ElementRef<HTMLElement>>('mainContent');


  // METODO PER SALTARE AL CONTENUTO PRINCIPALE
  // jumpToTheContent() {
  //   this.mainContent()?.nativeElement.focus();
  // }



  //// CONFIGURAZIONE PER IL SALTO PERSONALIZZATO ////

  // RIFERIMENTO AL CONTENITORE PRINCIPALE DELLA PAGINA
  // Il riferimento al contenitore principale della pagina viene ottenuto tramite ViewChild che seleziona l'elemento con il template reference variable 'defaultMainContent'.
  private defaultMainContent = viewChild<ElementRef<HTMLElement>>('defaultMainContent');


  // SERVIZI INIETTATI 
  private focusService = inject(FocusService);
  private router = inject(Router);


  // METODO PER SALTARE AL CONTENUTO PRINCIPALE (DEFAULT O CUSTOM)
  jumpToTheContent() {
    
    const customTarget = this.focusService.getTarget();  // Ottiene il target personalizzato del focus, se presente.

    if (customTarget) {
      // Se la pagina corrente ha definito un target custom (es. una card), sposta il focus lì
      customTarget.nativeElement.focus();
    } else {
      // Altrimenti usa il contenitore <main> di default
      this.defaultMainContent()?.nativeElement.focus();
    }
  }

}
```
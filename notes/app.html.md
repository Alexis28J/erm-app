# COMMENTI

```HTML
<!-- app.component.html (Il guscio principale dell'applicazione) -->

<!-- SKIP LINK PER LA NAVIGAZIONE TRAMITE TASTIERA (ID DI DESTINAZIONE STATICO) -->

<!-- 1. Lo Skip Link punta sempre allo stesso ID -->
<!-- Link del salto per la navigazione globale -->
<!-- <a class="skip-link" href="#main-content">Jump to main content 👇</a> -->
<!-- Purtroppo, questo link reindirizza sempre allo stesso ID e non può essere dinamico.
 Questo è dovuto al fatto che l'ID di destinazione è statico e non può cambiare dinamicamente in base alla pagina corrente. -->


<!-- 2. Il tag <main> fa da contenitore per TUTTE le pagine -->
<!-- Intestazione target con tabindex="-1" per consentire il focus da codice. -->
<!-- <main id="main-content" tabindex="-1"></main> -->

<!-- 
  In parole semplici, questo permette di saltare direttamente al contenuto principale della pagina quando si utilizza la navigazione tramite tastiera.
  tabindex="-1" indica che l'elemento può essere messo a fuoco solo tramite codice e non tramite la normale navigazione con il tasto Tab.
  -->

<!-- ROUTER OUTLET PER IL CARICAMENTO DINAMICO DELLE PAGINE -->
<!-- Il Router di Angular distrugge e ricrea i componenti 
       delle varie pagine proprio qui dentro! -->
<!-- <router-outlet></router-outlet> -->

<!-- FINE DELLO SKIP LINK -->


<!-- SKIP LINK PER LA NAVIGAZIONE TRAMITE TASTIERA (ID DI DESTINAZIONE DINAMICO)-->

<!-- Rimuoviamo l'href nativo e usiamo un evento click gestito da Angular -->
<button mat-button class="skip-link focus-target" (click)="jumpToTheContent()" aria-label="Jump to main content">
    Jump to main content 👇
</button>


<!-- Ogni layout ha il suo contenitore principale -->
<main #defaultMainContent tabindex="-1" class="focus-target">
    <router-outlet></router-outlet>
</main>
```
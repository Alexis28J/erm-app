```SCSS
// Non metto @use perché questo file contiene solo stili per lo spinner di caricamento. 
// Se avessi bisogno di utilizzare variabili o mixin da altri file SCSS, dovrei usare @use per importarli.


/* SPINNER DI CARICAMENTO */
.mat-mdc-progress-spinner {
  stroke: rgba(60, 98, 250, 0.6) !important;
  /* Cambia il colore del cerchio */
}

.loading-spinner {
  // se voglio centrare il cerchio all'interno del contenitore
  display: flex !important;
  justify-content: center !important;
  /* Centra orizzontalmente */
  align-items: center !important;
  /* Centra verticalmente */
}
```
```SCSS
// Non metto @use perché questo file contiene solo stili per gli snackbar.
// Se avessi bisogno di utilizzare variabili o mixin da altri file SCSS, dovrei usare @use per importarli.


// SNACKBAR 
.mdc-snackbar {
    --mat-sys-inverse-surface: rgba(21, 99, 255, 0.311) !important;
    /* Colore di sfondo */
    text-align: center;
}


mat-mdc-snack-bar-label.panelClass-error {
    --mat-sys-inverse-surface: rgba(255, 21, 21, 0.311) !important;
}


// .mat-mdc-snack-bar-container.panelClass-error {
//  ...
// }


// .mat-mdc-snack-bar-container.error-snackbar {
//  ...
// }
```
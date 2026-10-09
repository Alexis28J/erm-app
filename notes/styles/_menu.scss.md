```SCSS
@use './variables' as *; // Importa tutte le variabili definite in _variables.scss per poterle utilizzare in questo file SCSS

// Le variabili si utilizzeranno in questo file per definire i colori e altri stili del menu.

// @use è una direttiva SCSS che permette di importare moduli SCSS, come variabili, mixin e funzioni, in un altro file SCSS. In questo caso, stiamo importando tutte le variabili definite in _variables.scss.


// MENU 
.mat-mdc-menu-content {
    background-color: #d0dffd !important;

    &:hover {
        overflow: hidden !important;
    }
}


// SINGOLO ELEMENTO DEL MENU 
.mat-mdc-menu-item {
    background-color: #d0dffd !important;

    &:hover {
        background-color: #c5d7fb !important;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2) !important;
        transform: scale(1.1) !important;
        overflow: hidden !important;
        color: #005cbb !important;

        mat-icon {
            color: #005cbb !important;
        }
    }
}
```
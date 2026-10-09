```SCSS
@use './variables' as *; // Importa le variabili globali (file _variables.scss) per l'uso in tutte le tabelle

// I colori delle variabili definite in _variables.scss possono essere utilizzati per personalizzare le tabelle Material Design.

// Ad esempio, posso usare variables.$primary-color per impostare il colore di sfondo delle celle dell'intestazione.


//@use è il modo per importare moduli SCSS, come le variabili globali definite in _variables.scss.


// TABELLE MATERIAL DESIGN 
.mat-mdc-table {
    width: 100%;
    margin-top: 20px;
    border-radius: 12px !important;
    overflow: hidden !important;
    border-style: solid !important;
    border-width: 2px !important;
    border-color: rgba(22, 80, 195, 0.352) !important;

    &:hover {
        border-color: rgba(60, 98, 250, 0.6) !important;
    }
}


// HEADER DELLE TABELLE MATERIAL DESIGN
.mat-mdc-header-cell {
    font-weight: bold !important;
    text-align: center !important;
    padding: 12px !important;
    background-color: #c5d7fb !important;

    // Se voglio modificare mat-sort-header-container, posso farlo qui.
    .mat-sort-header-container {
        justify-content: center !important;
        align-items: center !important;
    }

    .mat-sort-header-arrow {
        opacity: 0.38 !important;
    }
}


// CELLE DELLE TABELLE MATERIAL DESIGN
.mat-mdc-cell {
    text-align: center !important;
    padding: 12px !important;
}


// HOVER SULLE RIGHE DELLE TABELLE MATERIAL DESIGN
.mat-mdc-row:hover {
    background-color: #dde5f4 !important;
    transform: translateY(-1px);
    transition: transform 0.3s ease;
}
```
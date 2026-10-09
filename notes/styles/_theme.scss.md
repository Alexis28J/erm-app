```SCSS
// QUI METTO LE DEFINIZIONI DEL TEMA DELL'APPLICAZIONE, COME COLORI PRINCIPALI, FONT E ALTRI STILI GLOBALI

@use '@angular/material' as mat; // Importa il modulo dei temi di Angular Material  // as mat indica l'alias per accedere ai temi


html {
    // Imposta lo stile globale per l'elemento HTML
    height: 100%;

    @include mat.theme((color: (primary: mat.$azure-palette, // Colore primario del tema, quello principale dell'applicazione
                tertiary: mat.$blue-palette, // Colore terziario del tema, quello che viene utilizzato per evidenziare elementi secondari
            ),
            typography: Roboto,
            density: 0, // La densità si riferisce alla compattezza degli elementi dell'interfaccia,cioè quanto sono ravvicinati tra loro, 0 indica densità normale
        ));
}

// Perché dobbiamo impostare lo stile globale per il body separatamente dall'HTML?
// Questo perché l'HTML e il body hanno comportamenti di layout diversi e dobbiamo assicurarci 
// che entrambi occupino l'intera altezza della finestra.


body {
    // Imposta lo stile globale per l'elemento body
    color-scheme: light; // Imposta il tema dei colori del browser su chiaro

    background-color: var(--mat-sys-surface); // --mat-sys-surface è il colore di sfondo principale del tema
    color: var(--mat-sys-on-surface); // --mat-sys-on-surface è il colore del testo principale del tema
    font: var(--mat-sys-body-medium); // --mat-sys-body-medium è lo stile del testo principale del tema

    margin: 0;
    height: 100%;
}
```
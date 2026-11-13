# COMMENTI

```SCSS
// SPAZIATORE FLESSIBILE PER LAYOUT
.spacer {
    flex: 1 1 auto; // Permette allo spacer di crescere e ridursi automaticamente
    // Il primo 1 indica la capacità di crescere
    // Il secondo 1 indica la capacità di ridursi
    // auto indica la dimensione base flessibile
}


// TOOLBAR DI ANGULAR MATERIAL
mat-toolbar {
    border-bottom: 1px solid #ccc;
    background-color: #f4f3f6;
}


// LOGO DELL'APPLICAZIONE
.app-logo {
    height: 120px;
    margin-right: 10px;

    &:hover {
        transform: scale(1.1);
        transition: transform 0.3s ease-in-out;
    }
}


// PULSANTE DELLA BANDIERA (FLAG BUTTON)
.flag-btn {
    // position: relative  // Non è necessario perché il pulsante si posiziona correttamente senza di esso
    right: 20px;  
    padding-top: 5px;

    &:hover,
    &:focus {
        background-color: rgb(191, 210, 252);
    }
}


// TITOLO DELL'APPLICAZIONE CON FONT PERSONALIZZATO: ZEN DOTS
h1 {
    font-family: "Zen Dots", sans-serif !important;
    font-size: 36px !important;
}


// PULSANTE "PERSONAL AREA"
.personal-area:hover,
.flag-btn:hover,
h1:hover {
    color: #005cbb;
    transform: scale(1.1);
    transition: transform 0.3s ease-in-out;
}


// CONTENITORE PRINCIPALE DELLA HOME
.home-container {
    display: flex;
    justify-content: center;
    margin-top: 60px;
}


// CARD DI ANGULAR MATERIAL
mat-card {
    width: 600px;
}


// HEADER DELLA CARD DI ANGULAR MATERIAL
mat-card-header {
    display: flex;
    align-items: center;
    justify-content: space-evenly;
}


// TITOLO DELLA CARD
mat-card-title {
    text-align: center;
    position: relative;
    left: 1.3rem;
}


// ICONA DELLA CARD
.card-icon {
    min-height: 60px;
    min-width: 60px;
    margin-bottom: 10px;
}


// CONTENUTO DELLA CARD DI ANGULAR MATERIAL
mat-card-content {
    text-align: center;
    font-size: 16px;
    margin-bottom: 20px;
    line-height: 1.5;
}


// PULSANTI DELLA CARD DI ANGULAR MATERIAL
mat-card-actions {
    display: flex;
    justify-content: center;
    gap: 10px;
    margin-bottom: 14px;
}
```
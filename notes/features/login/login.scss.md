# COMMENTI

```SCSS
.login-container {
    display: flex;
    justify-content: center;  // Centra orizzontalmente il contenuto del login
    align-items: center;  // Centra verticalmente il contenuto del login

    min-height: calc(100vh - 64px);
    // Altezza minima per centrare verticalmente il contenuto del login
    // Calcola l'altezza disponibile sottraendo l'altezza dell'header (64px) dalla viewport

    // 64px indica l'altezza dell'header dell'app cioè la parte superiore fissa. 
    // In questo modo il contenuto del login sarà centrato verticalmente rispetto alla parte visibile della finestra.
    // 64px è un valore che io ho misurato (o deciso) come altezza dell'header dell'app.

    padding: 20px;
}


mat-card {
    width: 100%;
    max-width: 450px;
    gap: 2rem; // Spazio tra gli elementi all'interno del mat-card
}


mat-card-header {
    display: flex;
    flex-direction: column;

    mat-card-title {
        text-align: start;  // Allinea il titolo del login a sinistra
        font-size: 1.5rem;
        padding-bottom: 8px;
    }

    mat-card-subtitle {
        font-family: "Zen Dots", sans-serif;  // Font scaricato da Google Fonts
        font-size: 2rem;
        text-align: center;  // Allinea il sottotitolo del login al centro
        padding-bottom: 8px;
        cursor: pointer;

        &:hover {
            color: #005cbb;
            scale: 1.05;
            transition: transform 0.3s ease-in-out;  // Aggiunge una transizione fluida all'effetto hover
        }
    }

    span {
        font-size: 1.5rem;
        text-align: end;  // Allinea il testo "Application" a destra
    }
}


mat-card-content {
    display: flex;
    flex-direction: column;
    gap: 16px;
}


form {
    display: flex;
    flex-direction: column;
    gap: 25px;
}


mat-form-field {
    width: 100%;  // Imposta la larghezza del campo del modulo al 100% del contenitore padre
}


.password-field {
// se voglio che il pulsante stia nella stessa riga del input della password, posso usare position: relative;
    position: relative;
    // Significa che il password field sarà il contenitore relativo per il pulsante di toggle
    // In altre parole, il pulsante di toggle sarà posizionato assolutamente rispetto a questo contenitore, il che permette di posizionarlo correttamente all'interno del campo password.

    display: flex;

    button {
        width: 40px;  // Imposta la larghezza del pulsante della password
        position: absolute;
        right: 0%;  // Posiziona il pulsante orizzontalmente al centro rispetto all'input della password
        top: 50%;  // Posiziona il pulsante verticalmente al centro rispetto all'input della password
        transform: translateY(-50%);  // Centra verticalmente il pulsante rispetto all'input della password
    }
    
}

button {
    width: 100%;  // Assicura che il pulsante occupi tutta la larghezza disponibile del contenitore.
}


// PULSANTE DI TOGGLE AL PASSAGGIO DEL MOUSE
.toggle-btn:hover {
    color: #005cbb;
    scale: 1.05;
    transition: transform 0.3s ease-in-out;
}


// MESSAGGIO DI ERRORE DEL LOGIN
.error-message {
    color: #d32f2f;
    font-size: 20px;
    text-align: center;
    margin-top: 0px;
}


mat-card-actions {
    gap: 16px;
}
```
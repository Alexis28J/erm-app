# COMMENTI

```SCSS
.login-container {
    display: flex;
    justify-content: center;
    align-items: center;

    min-height: calc(100vh - 64px);  // 64px indica l'altezza dell'header dell'app cioè la parte superiore fissa. 
    // In questo modo il contenuto del login sarà centrato verticalmente rispetto alla parte visibile della finestra.
    // 64px è un valore che io ho misurato (o deciso) come altezza dell'header dell'app.

    padding: 20px;
}

.password-field {
// se voglio che il pulsante stia nella stessa riga del input della password, posso usare position: relative;
    position: relative;
    display: flex;

    button {
        width: 40px;  // Imposta la larghezza del pulsante della password
        position: absolute;
        right: 0%;  // Posiziona il pulsante orizzontalmente al centro rispetto all'input della password
        top: 50%;  // Posiziona il pulsante verticalmente al centro rispetto all'input della password
        transform: translateY(-50%);  // Centra verticalmente il pulsante rispetto all'input della password
    }
}
```
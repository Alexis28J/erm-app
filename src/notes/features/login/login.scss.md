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
```
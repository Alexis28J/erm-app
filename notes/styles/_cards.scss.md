```SCSS
@use './variables' as *; // Importa le variabili globali (file _variables.scss) per l'uso in tutte le card

// @use è il modo per importare moduli SCSS, come le variabili globali definite in _variables.scss.


// CARD MATERIAL DESIGN
.mat-mdc-card {
  padding: 16px !important;
  margin: 16px !important;
  border-style: solid !important;
  border-width: 2px !important;
  border-color: rgba(22, 80, 195, 0.212) !important;
  background-color: rgba(21, 99, 255, 0.212) !important;
  box-shadow: 0 2px 7px 0 rgba(0, 0, 0, 0.4), // Ombra principale per profondità
    0 0 6px 0 rgba(56, 189, 248, 0.08) !important; // Ombra secondaria per effetto glow

  // Per fare un'animazione quando lo stato della card cambia (ad esempio al passaggio del mouse o al clic)
  transition: all 0.3s ease !important;

  // Quindi, ora possiamo definire lo stile al passaggio del mouse
  &:hover {
    // & è un selettore che si riferisce all'elemento corrente, in questo caso .mat-mdc-card
    border-color: rgba(60, 98, 250, 0.6) !important;
    box-shadow: 0 5px 20px 0 rgba(0, 0, 0, 0.4), // Ombra principale per profondità
      0 0 7px 0 rgba(56, 189, 248, 0.08) !important; // Ombra secondaria per effetto glow
    /* Solleva leggermente la card */
    transform: translateY(-0.5px);
  }

}
```
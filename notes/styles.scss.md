# COMMENTI

```SCSS
// TABELLE MATERIAL DESIGN
.mat-mdc-table {
  width: 100%;
  margin-top: 20px;
  border-radius: 12px !important;
  overflow: hidden !important; // Impedisce che il contenuto della tabella esca dai bordi arrotondati
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
}


// CELLE DELLE TABELLE MATERIAL DESIGN
.mat-mdc-cell {
  text-align: center !important;
  padding: 12px !important;
}


// HOVER SULLE RIGHE DELLE TABELLE MATERIAL DESIGN
.mat-mdc-row:hover {
  background-color: #dde5f4 !important;

  // effetto di sollevamento al passaggio del mouse
  transform: translateY(-1px);
  transition: transform 0.3s ease;
}


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


// PULSANTI MATERIAL DESIGN
.mdc-button--raised {
  border-style: solid !important;
  border-width: 2px !important;
  border-color: rgba(22, 80, 195, 0.35) !important;

  &:hover {
    border-color: rgba(60, 98, 250, 0.6) !important;
  }
}


// TOOLBAR MATERIAL DESIGN
.mat-toolbar {
  border-style: solid !important;
  border-width: 2px !important;
  border-color: rgba(0, 0, 0, 0.12) !important;
  background-color: rgba(22, 80, 195, 0.212) !important;
  box-shadow: 0 3px 5px -2px rgba(0, 0, 0, 0.3);
  /* Ombra per dare profondità */
}


/*//////////////////////////////////////////////////////////////////////////////////
  ANIMAZIONI DELLE SFERE
//////////////////////////////////////////////////////////////////////////////////*/

// CONTENITORE PRINCIPALE A SCHERMO INTERO
.background-container {
  position: fixed; // Mantiene il contenitore fisso sullo schermo, indipendentemente dallo scorrimento
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: #ffffff;
  z-index: -1; // Mantiene lo sfondo dietro ai contenuti 
  overflow: hidden; // Impedisce alle sfere di fuoriuscire dal contenitore
}


/* STILE BASE PER LE "SFERE" */
.sphere {
  position: absolute; // Posiziona le sfere in modo assoluto (cioè staccate dal flusso normale) all'interno del contenitore principale
  border-radius: 50%;
  filter: blur(80px); // Applica un effetto sfocato alle sfere
  opacity: 0.7; // Questa opacità contribuisce all'effetto sfocato e morbido delle sfere
  will-change: transform, opacity; // Indica al browser che queste proprietà cambieranno, ottimizzando le prestazioni delle animazioni
}


/* SFERE INDIVIDUALI */
.sphere-1 {
  width: 500px;
  height: 500px;
  background-color: #cad5f0;
  top: -10%; // Posiziona la sfera leggermente fuori dalla parte superiore dello schermo
  left: -10%;
  animation: slow-motion-1 40s infinite ease-in-out alternate; // infinite: l'animazione si ripete all'infinito
  // ease-in-out: l'animazione accelera all'inizio e rallenta alla fine
  // alternate: l'animazione alterna la direzione ad ogni ciclo
}

.sphere-2 {
  width: 600px;
  height: 600px;
  background-color: #b8c8eb;
  bottom: -10%; // Posiziona la sfera leggermente fuori dalla parte inferiore dello schermo
  right: -10%; // Posiziona la sfera leggermente fuori dalla parte destra dello schermo
  animation: slow-motion-2 45s infinite ease-in-out alternate;
}

.sphere-3 {
  width: 400px;
  height: 400px;
  background-color: #9bb5e8;
  top: 30%;
  right: 20%;
  animation: slow-motion-3 38s infinite ease-in-out alternate;
}

.sphere-4 {
  width: 550px;
  height: 550px;
  background-color: #8aa9e6;
  bottom: 15%;
  left: 15%;
  animation: slow-motion-4 50s infinite ease-in-out alternate;
}

/* Traiettorie personalizzate per ogni forma per evitare movimenti ripetitivi */
@keyframes slow-motion-1 {
  0% {
    transform: translate(0, 0) scale(1); // Stato iniziale: nessuna traslazione e scala normale
    opacity: 0.5;
  }

  50% {
    transform: translate(15vw, 10vh) scale(1.1); // Stato intermedio: traslazione e scala leggermente aumentata
    opacity: 0.7;
  }

  100% {
    transform: translate(5vw, 25vh) scale(0.9); // Stato finale: traslazione e scala ridotta
    opacity: 0.4;
  }
}

// Se imposto valori diversi per le trasformazioni, posso ottenere effetti di movimento unici per ogni sfera 
// ma devo fare attenzione a non creare movimenti troppo bruschi o innaturali perché potrebbero risultare sgradevoli alla vista.
// Quindi, più punti chiave definisco nelle animazioni, più fluido e naturale sarà il movimento delle sfere ma anche più complesso da gestire.
// Mentre meno punti chiave definisco, più il movimento risulterà rigido e meno naturale ma più semplice da gestire (0%, 50% e 100%).

@keyframes slow-motion-2 {
  0% {
    transform: translate(0, 0) scale(1);
    opacity: 0.6;
  }

  50% {
    transform: translate(-20vw, -15vh) scale(0.9);
    opacity: 0.4;
  }

  100% {
    transform: translate(-10vw, 5vh) scale(1.1);
    opacity: 0.7;
  }
}

@keyframes slow-motion-3 {
  0% {
    transform: translate(0, 0) scale(1);
    opacity: 0.4;
  }

  50% {
    transform: translate(-10vw, 20vh) scale(1.2);
    opacity: 0.6;
  }

  100% {
    transform: translate(-25vw, -5vh) scale(0.8);
    opacity: 0.5;
  }
}

@keyframes slow-motion-4 {
  0% {
    transform: translate(0, 0) scale(1);
    opacity: 0.5;
  }

  50% {
    transform: translate(20vw, -20vh) scale(0.8);
    opacity: 0.4;
  }

  100% {
    transform: translate(10vw, -10vh) scale(1.1);
    opacity: 0.6;
  }
}

//////////////////////////////////////////////////////////////////////////////////
/* FINE ANIMAZIONI DELLE SFERE */


/* MENU */
.mat-mdc-menu-content,
.mat-mdc-menu-item {
  background-color: #d0dffd !important;

  &:hover {
    background-color: #c5d7fb !important;
  }
}


/* DIALOGHI */
.mat-mdc-dialog-surface {
  background-color: #dfe7f7 !important;
}


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
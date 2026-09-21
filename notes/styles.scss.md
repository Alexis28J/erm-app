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
/// 
/// TERZA VERSIONE DELLO SFONDO ANIMATO (MASSIMA OTTIMIZZAZIONE)
.background-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: #ffffff;
  z-index: -1;
  overflow: hidden;
}

/* 🚀 SUPER OTTIMIZZAZIONE: Rimpicciolito e poi scalato */
.blur-wrapper {
  width: 25%;         /* Occupa solo 1/4 dello schermo nei calcoli */
  height: 25%;        /* Occupa solo 1/4 dello schermo nei calcoli */
  position: absolute;
  top: 0;
  left: 0;
  
  filter: blur(20px); /* Ridotto il raggio (perché ora l'area è più piccola) */
  
  /* we origin top left per gestire lo scale, e lo ingrandiamo di 4 volte */
  transform-origin: top left;
  transform: scale(4) translateZ(0); 
  
  backface-visibility: hidden; /* Ulteriore spinta per la GPU */
}

/* STILE BASE PER LE SFERE */
.sphere {
  position: absolute;
  border-radius: 50%;
  will-change: transform;
}

/* 🚀 OTTIMIZZAZIONE: Dimensioni ridotte per scalare dentro il wrapper al 25% */
.sphere-1 {
  width: 70px;
  height: 70px;
  background-color: #cad5f0;
  top: -5%;
  left: -5%;
  opacity: 0.6;
  animation: slow-motion-1 40s infinite ease-in-out alternate;
}

.sphere-2 {
  width: 80px;
  height: 80px;
  background-color: #b8c8eb;
  bottom: -5%;
  right: -5%;
  opacity: 0.5;
  animation: slow-motion-2 45s infinite ease-in-out alternate;
}

.sphere-3 {
  width: 60px;
  height: 60px;
  background-color: #9bb5e8;
  top: 30%;
  right: 20%;
  opacity: 0.5;
  animation: slow-motion-3 38s infinite ease-in-out alternate;
}

.sphere-4 {
  width: 75px;
  height: 75px;
  background-color: #8aa9e6;
  bottom: 15%;
  left: 15%;
  opacity: 0.5;
  animation: slow-motion-4 50s infinite ease-in-out alternate;
}

/* 🚀 NOTA: Abbiamo rimosso lo scale(2) dalle animazioni perché ci pensa già il wrapper! */
@keyframes slow-motion-1 {
  0%   { transform: translate(0, 0); }
  50%  { transform: translate(15vw, 10vh); }
  100% { transform: translate(5vw, 25vh); }
}

@keyframes slow-motion-2 {
  0%   { transform: translate(0, 0); }
  50%  { transform: translate(-20vw, -15vh); }
  100% { transform: translate(-10vw, 5vh); }
}

@keyframes slow-motion-3 {
  0%   { transform: translate(0, 0); }
  50%  { transform: translate(-10vw, 20vh); }
  100% { transform: translate(-25vw, -5vh); }
}

@keyframes slow-motion-4 {
  0%   { transform: translate(0, 0); }
  50%  { transform: translate(20vw, -20vh); }
  100% { transform: translate(10vw, -10vh); }
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

/////////////////////////////////////////////////////////////////////////////////////////////////////////

# PRIMA VERSIONE DELLO SFONDO ANIMATO (MOLTO PESANTE)

Il problema principale non sono le animazioni in sé, ma l'uso combinato di filter: blur(80px) su elementi molto grandi (fino a 600px) in movimento continuo. Il rendering del filtro sfocatura in tempo reale su superfici così ampie è una delle operazioni più dispendiose per i motori grafici dei browser (in particolare WebRender di Firefox).

- Il filtro blur() dinamico: Ogni volta che la sfera si muove anche solo di un pixel, il browser deve ricalcolare la sfocatura di un'area enorme. Moltiplicato per 4 sfere, l'impatto è notevole.

- Le transizioni di opacity: Cambiare continuamente l'opacità all'interno dello stesso @keyframes costringe il browser a ricalcolare la trasparenza dello sfondo pixel per pixel.


```SCSS
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
```

////////////////////////////////////////////////////////////////////////////////////////////////////////

# SECONDA VERSIONE DELLO SFONDO ANIMATO (PIù OTTIMIZZATA)

- will-change: transform lavora al 100%: Avendo rimosso l'animazione dell'opacità, il browser isola le sfere su un livello hardware dedicato della scheda video (GPU). Il movimento diventa fluido a 60+ FPS.

- Effetto "Vetro Sfumato" (backdrop-filter): Invece di far calcolare 4 sfocature diverse in movimento, creiamo un pannello fisso trasparente sopra le sfere che le sfoca mentre ci passano sotto. Questo abbatte drasticamente l'uso della CPU su Firefox e Safari.


```SCSS
/*//////////////////////////////////////////////////////////////////////////////////
  ANIMAZIONI DELLE SFERE
//////////////////////////////////////////////////////////////////////////////////*/
/// 
// VERSIONE OTTIMIZZATA   
/* CONTENITORE PRINCIPALE A SCHERMO INTERO */
.background-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: #ffffff;
  z-index: -1;
  overflow: hidden;
  /* Applichiamo il blur qui o usiamo un overlay: riduce drasticamente il carico */
}

/* 💡 L'INGANNO PERFETTO: Un overlay fisso che sfoca tutto ciò che sta sotto */
.background-container::after {
  content: '';
  position: absolute;
  top: 0; left: 0; right: 0; bottom: 0;
  backdrop-filter: blur(80px); /* Sfoca le sfere in un colpo solo. In questo modo si riduce il carico computazionale rispetto a sfocare ogni singola sfera.  */
  -webkit-backdrop-filter: blur(80px);
  pointer-events: none;
  z-index: 2;
}

/* STILE BASE PER LE "SFERE" (Rimosso il blur da qui) */
.sphere {
  position: absolute;
  border-radius: 50%;
  /* filter: blur(80px); <- RIMOSSO per salvare la CPU */
  will-change: transform; /* Ottimizzato: tolto opacity che causava repaint */
}

/* SFERE INDIVIDUALI (Impostiamo un'opacità fissa di partenza) */
.sphere-1 {
  width: 500px;
  height: 500px;
  background-color: #cad5f0;
  top: -10%;
  left: -10%;
  opacity: 0.6;
  animation: slow-motion-1 40s infinite ease-in-out alternate;
}

.sphere-2 {
  width: 600px;
  height: 600px;
  background-color: #b8c8eb;
  bottom: -10%;
  right: -10%;
  opacity: 0.5;
  animation: slow-motion-2 45s infinite ease-in-out alternate;
}

.sphere-3 {
  width: 400px;
  height: 400px;
  background-color: #9bb5e8;
  top: 30%;
  right: 20%;
  opacity: 0.5;
  animation: slow-motion-3 38s infinite ease-in-out alternate;
}

.sphere-4 {
  width: 550px;
  height: 550px;
  background-color: #8aa9e6;
  bottom: 15%;
  left: 15%;
  opacity: 0.5;
  animation: slow-motion-4 50s infinite ease-in-out alternate;
}

/* 💡 Keyframes alleggeriti: rimosso il cambio di opacità continuo */
@keyframes slow-motion-1 {
  0%   { transform: translate(0, 0) scale(1); }
  25%  { transform: translate(10vw, 5vh) scale(1.05); }
  50%  { transform: translate(15vw, 10vh) scale(1.1); }
  75%  { transform: translate(10vw, 20vh) scale(1.05); }
  100% { transform: translate(5vw, 25vh) scale(0.9); }
}

@keyframes slow-motion-2 {
  0%   { transform: translate(0, 0) scale(1); }
  25%  { transform: translate(-10vw, 10vh) scale(1.05); }
  50%  { transform: translate(-20vw, -15vh) scale(0.9); }
  75%  { transform: translate(-15vw, 0) scale(1); }
  100% { transform: translate(-10vw, 5vh) scale(1.1); }
}

@keyframes slow-motion-3 {
  0%   { transform: translate(0, 0) scale(1); }
  25%  { transform: translate(10vw, 10vh) scale(1.1); }
  50%  { transform: translate(-10vw, 20vh) scale(1.2); }
  75%  { transform: translate(-20vw, 10vh) scale(1); }
  100% { transform: translate(-25vw, -5vh) scale(0.8); }
}

@keyframes slow-motion-4 {
  0%   { transform: translate(0, 0) scale(1); }
  25%  { transform: translate(15vw, 15vh) scale(1.05); }
  50%  { transform: translate(20vw, -20vh) scale(0.8); }
  75%  { transform: translate(5vw, -15vh) scale(1); }
  100% { transform: translate(10vw, -10vh) scale(1.1); }
}

//////////////////////////////////////////////////////////////////////////////////
/* FINE ANIMAZIONI DELLE SFERE */
```

////////////////////////////////////////////////////////////////////////////////////////////////////

# TERZA VERSIONE DELLO SFONDO ANIMATO (ANCOR PIù OTTIMIZZATA)

- Meno pixel nativi: Avendo dimezzato larghezza e altezza delle sfere nel CSS, l'area totale che il browser deve calcolare inizialmente si è ridotta del 75%. L'ingrandimento viene fatto poi in modo ultra-fluido dalla GPU con scale(2).

- Niente calcoli "sotto" lo schermo: Il passaggio a un normale filter: blur() applicato al wrapper evita i costosi calcoli di campionamento dello sfondo richiesti da backdrop-filter.


```SCSS
/*//////////////////////////////////////////////////////////////////////////////////
  ANIMAZIONI DELLE SFERE
//////////////////////////////////////////////////////////////////////////////////*/
/// 
/// SECONDA VERSIONE OTTIMIZZATA
.background-container {
  position: fixed;
  top: 0; left: 0;
  width: 100vw; height: 100vh;
  background-color: #ffffff;
  z-index: -1;
  overflow: hidden;
}

/* 💡 OTTIMIZZAZIONE: Il blur viene applicato una volta sola qui dentro, 
   evitando il più pesante backdrop-filter */
.blur-wrapper {
  width: 100%;
  height: 100%;
  filter: blur(60px); /* Ridotto leggermente per performance, ma l'effetto resta soffice */
  transform: translateZ(0); /* Forza l'accelerazione hardware hardware su Firefox/Chrome */
}

/* STILE BASE PER LE SFERE */
.sphere {
  position: absolute;
  border-radius: 50%;
  will-change: transform;
}

/* 💡 OTTIMIZZAZIONE: Dimensioni dimezzate (es. da 500px a 250px).
   Usiamo scale(2) per riportarle alla grandezza originale senza pesare sulla memoria! */
.sphere-1 {
  width: 250px; height: 250px;
  background-color: #cad5f0;
  top: -5%; left: -5%;
  opacity: 0.6;
  animation: slow-motion-1 40s infinite ease-in-out alternate;
}

.sphere-2 {
  width: 300px; height: 300px;
  background-color: #b8c8eb;
  bottom: -5%; right: -5%;
  opacity: 0.5;
  animation: slow-motion-2 45s infinite ease-in-out alternate;
}

.sphere-3 {
  width: 200px; height: 200px;
  background-color: #9bb5e8;
  top: 30%; right: 20%;
  opacity: 0.5;
  animation: slow-motion-3 38s infinite ease-in-out alternate;
}

.sphere-4 {
  width: 275px; height: 275px;
  background-color: #8aa9e6;
  bottom: 15%; left: 15%;
  opacity: 0.5;
  animation: slow-motion-4 50s infinite ease-in-out alternate;
}

/* 💡 TRAIETTORIE A 3 PUNTI + SCALE INTEGRATO */
@keyframes slow-motion-1 {
  0%   { transform: translate(0, 0) scale(2); }
  50%  { transform: translate(15vw, 10vh) scale(2.2); }
  100% { transform: translate(5vw, 25vh) scale(1.8); }
}

@keyframes slow-motion-2 {
  0%   { transform: translate(0, 0) scale(2); }
  50%  { transform: translate(-20vw, -15vh) scale(1.8); }
  100% { transform: translate(-10vw, 5vh) scale(2.2); }
}

@keyframes slow-motion-3 {
  0%   { transform: translate(0, 0) scale(2); }
  50%  { transform: translate(-10vw, 20vh) scale(2.4); }
  100% { transform: translate(-25vw, -5vh) scale(1.6); }
}

@keyframes slow-motion-4 {
  0%   { transform: translate(0, 0) scale(2); }
  50%  { transform: translate(20vw, -20vh) scale(1.6); }
  100% { transform: translate(10vw, -10vh) scale(2.2); }
}

//////////////////////////////////////////////////////////////////////////////////
/* FINE ANIMAZIONI DELLE SFERE */
```


////////////////////////////////////////////////////////////////////////////////////////////////////

# TERZA VERSIONE DELLO SFONDO ANIMATO (MASSIMA OTTIMIZAZZIONE)

1. IL TRUCCO DEL DOWNSCALING

Invece di applicare il blur su un wrapper a dimensione intera, faccio rimpicciolire il .blur-wrapper al 25% della sua dimensione e poi farlo ingrandire di 4 volte usando transform: scale(4).

Quindi, il browser dovrà calcolare il blur (e i movimenti delle sfere) su un'area 4 volte più piccola (meno pixel), e solo dopo ingrandirà il risultato visivo. Trattandosi di un'animazione astratta e sfocata, la perdita di risoluzione è totalmente invisibile all'occhio umano, ma le performance schizzano alle stelle.


2. SOSTITUZIONE FILTER BLUR CON I GRADIENTI RADIALI

Se si vuole eliminare del tutto la proprietà filter (che su alcuni browser mobile consuma molta batteria), posso definire la sfocatura direttamente dentro le sfere usando un radial-gradient che sfuma verso il trasparente. I gradienti nativi sono molto più leggeri da calcolare per la GPU rispetto a un filtro di sfuocatura algoritmico.

```SCSS
.background-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: #ffffff;
  z-index: -1;
  overflow: hidden;
}

/* 🚀 SUPER OTTIMIZZAZIONE: Rimpicciolito e poi scalato */
.blur-wrapper {
  width: 25%;         /* Occupa solo 1/4 dello schermo nei calcoli */
  height: 25%;        /* Occupa solo 1/4 dello schermo nei calcoli */
  position: absolute;
  top: 0;
  left: 0;
  
  filter: blur(20px); /* Ridotto il raggio (perché ora l'area è più piccola) */
  
  /* we origin top left per gestire lo scale, e lo ingrandiamo di 4 volte */
  transform-origin: top left;
  transform: scale(4) translateZ(0); 
  
  backface-visibility: hidden; /* Ulteriore spinta per la GPU */
  // backface-visibility serve a migliorare le prestazioni della GPU durante le trasformazioni 3D facendo sì che il retro dell'elemento non venga renderizzato
}

/* STILE BASE PER LE SFERE */
.sphere {
  position: absolute;
  border-radius: 50%;
  will-change: transform;
}

/* 🚀 OTTIMIZZAZIONE: Dimensioni ridotte per scalare dentro il wrapper al 25% */
.sphere-1 {
  width: 70px;
  height: 70px;
  background-color: #cad5f0;
  top: -5%;
  left: -5%;
  opacity: 0.6;
  animation: slow-motion-1 40s infinite ease-in-out alternate;
}

.sphere-2 {
  width: 80px;
  height: 80px;
  background-color: #b8c8eb;
  bottom: -5%;
  right: -5%;
  opacity: 0.5;
  animation: slow-motion-2 45s infinite ease-in-out alternate;
}

.sphere-3 {
  width: 60px;
  height: 60px;
  background-color: #9bb5e8;
  top: 30%;
  right: 20%;
  opacity: 0.5;
  animation: slow-motion-3 38s infinite ease-in-out alternate;
}

.sphere-4 {
  width: 75px;
  height: 75px;
  background-color: #8aa9e6;
  bottom: 15%;
  left: 15%;
  opacity: 0.5;
  animation: slow-motion-4 50s infinite ease-in-out alternate;
}

/* 🚀 NOTA: Abbiamo rimosso lo scale(2) dalle animazioni perché ci pensa già il wrapper! */
@keyframes slow-motion-1 {
  0%   { transform: translate(0, 0); }
  50%  { transform: translate(15vw, 10vh); }
  100% { transform: translate(5vw, 25vh); }
}

@keyframes slow-motion-2 {
  0%   { transform: translate(0, 0); }
  50%  { transform: translate(-20vw, -15vh); }
  100% { transform: translate(-10vw, 5vh); }
}

@keyframes slow-motion-3 {
  0%   { transform: translate(0, 0); }
  50%  { transform: translate(-10vw, 20vh); }
  100% { transform: translate(-25vw, -5vh); }
}

@keyframes slow-motion-4 {
  0%   { transform: translate(0, 0); }
  50%  { transform: translate(20vw, -20vh); }
  100% { transform: translate(10vw, -10vh); }
}

```
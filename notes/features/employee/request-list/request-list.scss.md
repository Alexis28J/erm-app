# COMMENTI

```SCSS
.container {
    margin: 1.5rem;
    padding-top: 0.25rem;
}


mat-card-header{
    display: flex;
    justify-content: space-between;
}


mat-card-title {
    padding-bottom: 12px;
    padding-left: 0;
}


// PULSANTE EXPORT EXCEL
.excel {
    color: green;
    border-color: green !important;
    bottom: 5px;

    &:hover,
    &:focus {
        color: darkgreen;
        border-color: darkgreen !important;
        background-color: rgba(144, 238, 144, 0.218);
    }
}


// COLORI STATUS
.approved {
    color: green;
    font-weight: 600;
}

.pending {
    color: orange;
    font-weight: 600;
}

.rejected {
    color: red;
    font-weight: 600;
}

.partial_approved,
// Scrivo entrambe le versioni per gestire 
.partial-approved {
    // sia underscore che trattino
    color: rgb(30, 196, 30);
    font-weight: 600;
}

.draft {
    color: gray;
    font-weight: 600;
}

.in_progress,
.in-progress {
    color: #009dff;
    font-weight: 600;
}


// PULSANTE DELETE DI OPZIONI DRAFT
.delete:hover, .delete:focus {
    background-color: rgba(255, 0, 0, 0.1) !important;
    color: red !important;

    mat-icon{
        color: red !important;
    }
}


// STILE DELLA TABELLA CON COLONNE A LARGHEZZA UGUALE
.equal-width-table {
  table-layout: fixed; // Forza tutte le colonne ad avere la stessa larghezza

  th {
    font-size: 1rem;
  }
}

/* Distribuisce lo spazio equamente (es. 3 colonne = 33.33% ciascuna) */
.equal-width-table th {
  width: calc(100% / 6); // Imposta la larghezza di ciascuna colonna al 16.66% (per 6 colonne)
  overflow: hidden; // Opzionale: evita che testi troppo lunghi rompano il layout
  text-overflow: ellipsis; // Mostra "..." per testi troppo lunghi
  white-space: nowrap; // Impedisce al testo di andare a capo
}


// STILE DEL MESSAGGIO "NON CI SONO RICHIESTE"
.no-found {
    display: flex;
    justify-content: center;
    align-items: center;

    color: rgb(17, 17, 18);
    font-size: 2rem;
    font-weight: bold;
    margin-top: 20px;
    padding-bottom: 20px;
}


// PULSANTI DI NAVIGAZIONE
.navigation-buttons {
    display: flex;
    justify-content: space-between;
    margin: 1.5rem 1rem;
}
```
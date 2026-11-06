# COMMENTI

```SCSS
.datepicker-container {
    position: relative;  // Necessario per posizionare correttamente il popup del calendario
    width: 100%;  // Occupa tutta la larghezza disponibile del contenitore padre 
    // Il contenitore padre è l'antenato più vicino (nel DOM) con position relativa o assoluta 
    // e non necessariamente si trova nello stesso componente.
} 


.datepicker-field {
    height: 56px;
    border: 1px solid #7a7d86;
    border-radius: 4px;
    padding: 0 16px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    cursor: pointer;
    position: relative;
    bottom: 1.5px;

    // Commentato perché praticamente non c'è differenza visibile.
    // transition: border-color .2s; //.2s indica la durata della transizione che è di 0.2 secondi. Più precisamente, quando il colore del bordo cambia, la transizione avverrà in 0.2 secondi.
    // Più alto è il valore, più lenta sarà la transizione.

    &:hover {
        border-radius: 4px;
        border-color: black;
    }

    input:focus-within {
        border-width: 2px;
        border-color: #1976d2;
    }

    &.active-border {
        border: 2px solid #1976d2;

        span,
        mat-icon {
            color: #1976d2;
        }
    }
}


.datepicker-value {
    color: rgba(0, 0, 0, 0.87);
    font-size: 1rem;
}


.datepicker-field.touched {
    border: 1px solid #be3e43;

    span,
    mat-icon {
        color: #ba1a1a
    }
}


.calendar-popup {
    position: absolute; // Posiziona il popup del calendario in modo assoluto rispetto al contenitore
    z-index: 99; // Assicura che il popup del calendario sia sopra altri elementi ma sotto eventuali overlay più alti
    top: 100%; // Posiziona il popup del calendario sotto il campo data
    padding: 8px 12px;
    width: calc(100% - 24px); // Sottrae il padding orizzontale del campo data (12px per lato)
    background: #c6d9fc;
    border-radius: 4px;
    box-shadow:
        0 4px 8px rgba(0, 0, 0, .1),
        0 8px 24px rgba(0, 0, 0, .15);
}


.calendar-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 8px;
    font-weight: bold;

    button {
        border: none;
        background: transparent;
        cursor: pointer;
        font-size: 70%;
    }

    button:disabled {  // :disabled è una pseudo-classe che seleziona i pulsanti disabilitati. Quindi lavora solo sui pulsanti che hanno l'attributo disabled ([disabled]) nel markup HTML.
        opacity: 0.5;
        pointer-events: none; // Disabilita l'interazione con il pulsante disabilitato
    }

    button:hover,
    button:focus {
        background: rgba(25, 118, 210, 0.12);
        border-radius: 50%;
        color: #1976d2;
    }
}


.calendar-container {
    background-color: rgba(255, 255, 255, 0.506);
    border: 1px solid rgba(60, 98, 250, 0.6);
    border-radius: 4px;

    &:hover,
    &:focus {
        background-color: white;
    }
}


.calendar-weekdays {
    border-bottom: 1px solid rgba(60, 98, 250, 0.6);
    padding: 3px;
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    text-align: center;
    font-size: 13px;
    font-weight: bold;
}


.calendar-grid {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    flex: 1;
}


.day-button {
    border: none;
    background: transparent;
    cursor: pointer;
    padding: 4px;

    &:hover,
    &:focus {
        background: rgba(25, 118, 210, 0.12);
        font-weight: bold;
        border-radius: 50%;
    }
}


.day-selected {
    background: #1976d2 !important;
    border-radius: 50%;
    color: white;
    font-weight: bold;
}


.other-month {
    opacity: .4;
}


.sunday {
    color: red;
}
```
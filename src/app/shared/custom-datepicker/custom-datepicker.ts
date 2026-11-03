import { Component, computed, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  imports: [],
  selector: 'app-custom-datepicker',
  styleUrls: ['./custom-datepicker.scss'],
  templateUrl: './custom-datepicker.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CustomDatepicker),  // forwardRef serve a fare riferimento a una classe (CustomDatepicker) che non è ancora definita al momento della dichiarazione.
      // Questo è necessario perché al momento della dichiarazione del provider, la classe CustomDatepicker non è ancora definita. forwardRef permette di rimandare la risoluzione della classe fino a quando non è effettivamente disponibile.
      multi: true  // Indica che NG_VALUE_ACCESSOR può avere più provider, non solo questo (CustomDatepicker).
    }
  ]
})
export class CustomDatepicker implements ControlValueAccessor {
  
  // VALORE INTERNO DEL DATEPICKER
  value = '';

  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  /// METODI DI CONTROL VALUE ACCESSOR CHE SERVONO PER INTEGRARE IL MIO DATEPICKER CON ANGULAR FORMS
  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  // FUNZIONE CHIAMATA QUANDO IL VALORE DEL DATEPICKER CAMBIA
  onChange = (_: string) => { };  // Funzione chiamata quando il valore del datepicker cambia. Il parametro _ indica che il valore passato non viene utilizzato direttamente all'interno della funzione.
  // {} indica che il parametro non viene utilizzato direttamente cioè viene passato ma non usato all'interno della funzione.

  // FUNZIONE CHIAMATA QUANDO IL DATEPICKER VIENE TOCCATO (INTERAGITO)
  onTouched = () => { };  // Funzione chiamata quando il datepicker viene toccato (interagito). 
  // () e {} indicano che non ci sono parametri e il corpo della funzione è vuoto. Il che significa che inizialmente non viene eseguita alcuna azione.



  // METODO CHIAMATO DA ANGULAR PER AGGIORNARE IL VALORE DEL DATEPICKER
  writeValue(value: string): void {  // Metodo chiamato da Angular per aggiornare il valore del datepicker.
    this.value = value;  // Aggiorna il valore interno del datepicker.
  }


  // METODO CHIAMATO DA ANGULAR PER REGISTRARE LA FUNZIONE DI CAMBIO VALORE
  registerOnChange(fn: any): void {  // Metodo chiamato da Angular per registrare la funzione da chiamare quando il valore del datepicker cambia.
    this.onChange = fn; // Salva la funzione da chiamare quando il valore cambia. // fn proviene da Angular e deve essere chiamata ogni volta che il valore cambia.
  } // Quindi ogni volta che il valore del datepicker cambia, Angular sa quale funzione chiamare grazie a questa registrazione che in questo caso è onChange.


  // METODO CHIAMATO DA ANGULAR PER REGISTRARE LA FUNZIONE DI TOUCH DEL DATEPICKER
  registerOnTouched(fn: any): void { // Metodo chiamato da Angular per registrare la funzione da chiamare quando il datepicker viene toccato.
    this.onTouched = fn; // Salva la funzione da chiamare quando il datepicker viene toccato. Angular la chiamerà ogni volta che il datepicker viene interagito.
  } // Quindi ogni volta che il datepicker viene interagito, Angular sa quale funzione chiamare grazie a questa registrazione che in questo caso è onTouched.


  // Quindi, qual'è la differenza tra onChange e registerOnChange?
  // onChange è la funzione che viene chiamata quando il valore del datepicker cambia.
  // registerOnChange è il metodo che Angular chiama per fornire la funzione da chiamare quando il valore cambia. 
  // In pratica, registerOnChange serve a registrare onChange con Angular quando il valore del datepicker cambia.


  // Qual'è la differenza tra onTouched e registerOnTouched?
  // onTouched è la funzione che viene chiamata quando il datepicker viene interagito.
  // registerOnTouched è il metodo che Angular chiama per fornire la funzione da chiamare quando il datepicker viene interagito.
  // In pratica, registerOnTouched serve a registrare onTouched con Angular quando il datepicker viene interagito.

  // In questo modo Angular sa come gestire il valore e lo stato del datepicker personalizzato, chiamando le funzioni appropriate quando il valore cambia o quando il datepicker viene interagito.
  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  ///
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  // METODO PER SELEZIONARE UNA DATA
  selectDate(date: Date): void {  // Metodo chiamato quando l'utente seleziona una data nel datepicker.
    
    console.log('Data selezionata:', date);
    console.log('Data odierna:', new Date());

    if (date > new Date()) {  // Se è stato selezionato un valore maggiore della data odierna, esegue eventuali azioni aggiuntive.
      return;   // Interrompe l'esecuzione del metodo se la data selezionata è maggiore della data odierna.
    }  // Per usare l'operatore > correttamente, entrambe le date devono essere nel formato locale della data.

    this.value = date.toISOString();  // Aggiorna il valore interno del datepicker con la data selezionata.
    // toISOString converte la data selezionata in una stringa nel formato ISO, che è utile per confronti e memorizzazione.

    console.log('Valore del datepicker:', this.value);

    this.onChange(this.value);  // Chiama la funzione onChange registrata da Angular per notificare il cambio di valore.
    this.onTouched();  // Chiama la funzione onTouched registrata da Angular per notificare che il datepicker è stato interagito.

    console.log('Valore finale del datepicker:', this.value);
    this.toggleCalendar();  // Chiude il calendario dopo aver selezionato una data.

  }

  
  // METODO PER OTTENERE LA DATA FORMATTATA
  // Restituisce la data selezionata nel formato locale, oppure una stringa vuota se non è stata selezionata alcuna data.
  formattedDate(): string {
    if (!this.value) {  // Se non è stato selezionato alcun valore, restituisce una stringa vuota.
      return '';
    }
    const date = new Date(this.value);  // Converte il valore interno del datepicker in un oggetto Date.
    return date.toLocaleDateString();  // Restituisce la data nel formato locale.
  }


  isOpen: boolean = false;  // Stato di apertura del calendario del datepicker.


  toggleCalendar(): void {  // Metodo per aprire o chiudere il calendario del datepicker.
    this.isOpen = !this.isOpen;  // Inverte lo stato di apertura del calendario.
  }


  // METODO PER OTTENERE LA DATA CORRENTE 
  getCurrentDate(): Date {
    return this.value   // Se è presente un valore selezionato, 
    ? new Date(this.value) // lo converte il valore selezionato in oggetto Date.
    : new Date(); // Altrimenti restituisce la data odierna.
  }


  currentDate = this.getCurrentDate(); // Ottiene la data corrente basata sul valore selezionato o sulla data odierna.
  currentMonth = this.currentDate.getMonth();  // Ottiene solo il mese corrente dalla data corrente.
  currentYear = this.currentDate.getFullYear(); // Ottiene solo l'anno corrente dalla data corrente.
  previousMonthDate = new Date(this.currentYear, this.currentMonth - 1, 1); // Crea una nuova data per il mese precedente. -1 serve per sottrarre un mese al mese corrente. Mentre 1 indica il primo giorno del mese.
  nextMonthDate = new Date(this.currentYear, this.currentMonth + 1, 1) // Crea una nuova data per il mese successivo. +1 serve per aggiungere un mese al mese corrente. Mentre 1 indica il primo giorno del mese.


  goToPreviousMonth(): void {  // Metodo per andare al mese precedente nel calendario.
    this.currentMonth--;  // Decrementa il mese corrente.

    if (this.currentMonth < 0) {
      this.currentMonth = 11;  // Se il mese corrente diventa negativo, significa che siamo passati a dicembre dell'anno precedente.
      this.currentYear--;  // Decrementa l'anno corrente.
    }

    this.nextMonthDate = new Date(this.currentYear, this.currentMonth + 1, 1); // Aggiorna la data del mese successivo.
  }
  

  goToNextMonth(): void {  // Metodo per andare al mese successivo nel calendario.
    this.currentMonth++;  // Incrementa il mese corrente.

    if (this.currentMonth > 11) {
      this.currentMonth = 0;  // Se il mese corrente supera 11, significa che siamo passati a gennaio dell'anno successivo.
      this.currentYear++;  // Incrementa l'anno corrente.
    }

    this.previousMonthDate = new Date(this.currentYear, this.currentMonth - 1, 1); // Aggiorna la data del mese precedente.
  }


  isNextMonthDisabled(): boolean {  // Metodo per verificare se il pulsante del mese successivo deve essere disabilitato.
    return this.nextMonthDate > this.getCurrentDate();  // Disabilita il pulsante se il mese successivo è oltre la data odierna.
  }


  currentMonthName(): string {  // Metodo per ottenere il nome del mese corrente.
    return new Date(0, this.currentMonth).toLocaleString('en', { month: 'long' });  // Restituisce il nome del mese nel formato lungo.
  } 


  // CALCOLO DINAMICO DEI GIORNI DEL MESE CORRENTE
  daysInMonth = computed(() => {

    // 1. Quanti giorni ci sono nel mese corrente?
    const totalDays = new Date(this.currentYear, this.currentMonth + 1, 0).getDate();

    // 2. Qual'è il primo giorno del mese? (0 = Sunday, ... ,6 = Saturday)
    let firstDayIndex = new Date(this.currentYear, this.currentMonth, 1).getDay();  // new Date(year, month, 1) rappresenta il primo giorno del mese corrente. getDay() restituisce il giorno della settimana (0 = Sunday, ... , 6 = Saturday)

    // Adattamento per far iniziare la settimana di Lunedì (0 = Monday, ... ,6 = Sunday)
    firstDayIndex = firstDayIndex === 0 ? 6 : firstDayIndex - 1;  // Adatta l'indice del primo giorno per far iniziare la settimana di Lunedì (0 = Monday, ..., 6 = Sunday)
    // 0 ? 6 : firstDayIndex - 1 indica che se il primo giorno è Domenica (0), lo si mappa a 6, altrimenti si sottrae 1 per adattare l'indice alla settimana che inizia di Lunedì.

    // Genera i giorni vuoti di riempimento iniziale
    const blanks = Array(firstDayIndex).fill(null);  // Crea un array di giorni vuoti per allineare il primo giorno del mese alla corretta posizione nella griglia del calendario.

    // Genera i giorni effettivi del mese
    const days = Array.from({ length: totalDays }, (_, i) => new Date(this.currentYear, this.currentMonth, i + 1)); // Crea un array di oggetti Date per ogni giorno del mese corrente.
    // _ rappresenta l'indice corrente nell'array generato da Array.from, mentre i rappresenta il numero del giorno (0-based).
    // Quindi new Date(year, month, i + 1) rappresenta il giorno i-esimo del mese corrente. i parte da 0, quindi si aggiunge 1 per ottenere il giorno corretto.


    return [...blanks, ...days];  // Combina i giorni vuoti iniziali con i giorni effettivi del mese per ottenere l'array completo dei giorni da visualizzare nel calendario.

  });



}


// ControlValueAccessor è un'interfaccia che permette a un componente personalizzato di integrarsi con i form di Angular, gestendo la lettura e la scrittura dei valori e lo stato di disabilitazione.
// Per implementarla, è necessario definire i metodi writeValue, registerOnChange, registerOnTouched e setDisabledState.
// Esempio di implementazione:
// writeValue(value: any): void { ... }
// registerOnChange(fn: any): void { ... }
// registerOnTouched(fn: any): void { ... }
// setDisabledState?(isDisabled: boolean): void { ... }
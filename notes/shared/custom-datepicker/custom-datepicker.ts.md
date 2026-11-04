# COMMENTI

`ControlValueAccessor` è un'interfaccia che permette a un componente personalizzato di integrarsi con i form di Angular, gestendo la lettura e la scrittura dei valori e lo stato di disabilitazione.

Per implementarla, è necessario definire i metodi writeValue, registerOnChange, registerOnTouched e setDisabledState.

Esempio di implementazione:
 - writeValue(value: any): void { ... }
 - registerOnChange(fn: any): void { ... }
 - registerOnTouched(fn: any): void { ... }
 - setDisabledState?(isDisabled: boolean): void { ... }


```TYPESCRIPT
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

  /////////////////////////////////////////////////////////////////////////////////////////////////////////
  /// METODI DI CONTROL VALUE ACCESSOR CHE SERVONO PER INTEGRARE IL MIO DATEPICKER CON ANGULAR FORMS
  /////////////////////////////////////////////////////////////////////////////////////////////////////////

  // FUNZIONE CHIAMATA QUANDO IL VALORE DEL DATEPICKER CAMBIA
  onChange = (_: string) => { };  // Funzione chiamata quando il valore del datepicker cambia. Il parametro _ indica che il valore passato non viene utilizzato direttamente all'interno della funzione.
  // {} indica che il parametro non viene utilizzato direttamente cioè viene passato ma non usato all'interno della funzione.

  // FUNZIONE CHIAMATA QUANDO IL DATEPICKER VIENE TOCCATO (INTERAGITO)
  onTouched = () => { };  // Funzione chiamata quando il datepicker viene toccato (interagito). 
  // () e {} indicano che non ci sono parametri e il corpo della funzione è vuoto. Il che significa che inizialmente non viene eseguita alcuna azione.



  // METODO CHIAMATO DA ANGULAR PER AGGIORNARE IL VALORE DEL DATEPICKER
  writeValue(value: string): void {

    this.value = value;  // Aggiorna il valore interno del datepicker con il nuovo valore fornito da Angular (cioè il valore selezionato nel form control).

    if (value) {  // Se è stato fornito un valore, aggiorna la visualizzazione del calendario in base a quel valore.
      const date = new Date(value);  // Converte il valore fornito da Angular in un oggetto Date per poterlo utilizzare nel calendario.
      date.getMonth();  // Aggiorna il mese corrente del calendario in base alla data fornita.
      date.getFullYear();  // Aggiorna l'anno corrente del calendario in base alla data fornita.

      this.viewDate.set(date); // Aggiorna la data visualizzata nel calendario in base alla data fornita.
    }

  }


  // METODO CHIAMATO DA ANGULAR PER REGISTRARE LA FUNZIONE DI CAMBIO VALORE
  registerOnChange(fn: any): void {  // Metodo chiamato da Angular per registrare la funzione da chiamare quando il valore del datepicker cambia.
    this.onChange = fn; // Salva la funzione da chiamare quando il valore cambia. // fn proviene da Angular e deve essere chiamata ogni volta che il valore cambia.
  } // Quindi ogni volta che il valore del datepicker cambia, Angular sa quale funzione chiamare grazie a questa registrazione che in questo caso è onChange.


  // METODO CHIAMATO DA ANGULAR PER REGISTRARE LA FUNZIONE DI TOUCH DEL DATEPICKER
  registerOnTouched(fn: any): void { // Metodo chiamato da Angular per registrare la funzione da chiamare quando il datepicker viene toccato.
    this.onTouched = fn; // Salva la funzione da chiamare quando il datepicker viene toccato. Angular la chiamerà ogni volta che il datepicker viene interagito.
  } // Quindi ogni volta che il datepicker viene interagito, Angular sa quale funzione chiamare grazie a questa registrazione che in questo caso è onTouched.


  // QUAL'E' LA DIFFERENZA TRA onChange e registerOnChange?
  // onChange è la funzione che viene chiamata quando il valore del datepicker cambia.
  // registerOnChange è il metodo che Angular chiama per fornire la funzione da chiamare quando il valore cambia. 
  // In pratica, registerOnChange serve a registrare onChange con Angular quando il valore del datepicker cambia.


  // Qual'è la differenza tra onTouched e registerOnTouched?
  // onTouched è la funzione che viene chiamata quando il datepicker viene interagito.
  // registerOnTouched è il metodo che Angular chiama per fornire la funzione da chiamare quando il datepicker viene interagito.
  // In pratica, registerOnTouched serve a registrare onTouched con Angular quando il datepicker viene interagito.

  // In questo modo Angular sa come gestire il valore e lo stato del datepicker personalizzato, chiamando le funzioni appropriate quando il valore cambia o quando il datepicker viene interagito.

  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  ///
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


  // METODO PER SELEZIONARE UNA DATA
  selectDate(date: Date): void {  // Metodo chiamato quando l'utente seleziona una data nel datepicker.

    this.today.setHours(0, 0, 0, 0);  // Imposta l'ora della data odierna a mezzanotte per confronti corretti senza considerare l'ora.

    const selectedDate = new Date(date); // Crea una copia della data selezionata per poterla manipolare senza modificare l'originale.

    selectedDate.setHours(0, 0, 0, 0);  // Imposta l'ora della data selezionata a mezzanotte per confronti corretti senza considerare l'ora.

    if (selectedDate > this.today) {
      return;  // Se la data selezionata è maggiore di oggi, non fare nulla.
    }

    // console.log('Selected date:', selectedDate); 

    const isoDate = selectedDate.toISOString(); // Converte la data selezionata in formato ISO string per memorizzazione e comunicazione con Angular.
    // Il formato ISO string è standard e permette di rappresentare la data in modo univoco senza dipendere dal fuso orario.

    this.value = isoDate;  // Aggiorna il valore interno del datepicker con la data selezionata in formato ISO string.

    this.onChange(isoDate);  // Chiama la funzione onChange registrata da Angular per notificare il cambio di valore. isoDate è il nuovo valore selezionato.

    this.onTouched();  // Chiama la funzione onTouched registrata da Angular per notificare che il datepicker è stato interagito.

    this.toggleCalendar();  // Chiude il calendario dopo aver selezionato una data.

  }


  // METODO PER OTTENERE LA DATA FORMATTATA
  formattedDate(): string {

    if (!this.value) {  // Se non è stato selezionato alcun valore, 
      return '';  // restituisce una stringa vuota.
    }
    
    const date = new Date(this.value);  // Converte il valore interno del datepicker in un oggetto Date, in modo da poter applicare la formattazione locale.
    return date.toLocaleDateString();  // Restituisce la data nel formato locale.

  }


  // PROPRIETÀ PER LO STATO DEL CALENDARIO
  // Questa proprietà indica se il calendario del datepicker è aperto o chiuso.
  // Viene utilizzata per determinare se mostrare o nascondere il calendario.
  isOpen: boolean = false;  // Stato (iniziale) di apertura del calendario del datepicker.


  // METODO PER TOGGLE DEL CALENDARIO
  toggleCalendar(): void {  // Metodo per aprire o chiudere il calendario del datepicker.
    this.isOpen = !this.isOpen;  // Inverte lo stato di apertura del calendario.
  }


  // SIGNAL CHE RAPPRESENTA LA DATA VISUALIZZATA NEL CALENDARIO
  viewDate = signal(new Date())  
  // new Date() rappresenta la data iniziale visualizzata nel calendario quando viene aperto cioè la data corrente.
  // Quindi, questo signal serve solo per la visualizzazione del calendario e non influisce sul valore selezionato.

  // Perché è necessario viewDate e non solo value?
  // Il signal viewDate mi serve per gestire la data visualizzata nel calendario senza influenzare il valore selezionato.
  // Quando apro il calendario, viewDate viene inizializzato con la data corrente.
  // Quando navigo tra i mesi, aggiorno viewDate senza modificare il valore selezionato.
  // Quando seleziono una data, il valore selezionato viene aggiornato separatamente tramite this.value.
  // In sintesi, viewDate gestisce solo la visualizzazione del calendario, mentre value gestisce il valore selezionato.


  // DATA CORRENTE 
  today = new Date();  // Data corrente utilizzata per confronti e limitazioni nel calendario


  // ARRAY DEI NOMI DEI MESI
  // Nomi dei mesi utilizzati per la visualizzazione nel calendario
  months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];


    // METODO PER ANDARE AL MESE PRECEDENTE
  goToPreviousMonth(): void {

    const current = this.viewDate();  // Data attualmente visualizzata nel calendario cioè il mese e l'anno che l'utente sta guardando

    const previousMonth = new Date(  // Questo è un oggetto Date che rappresenta il primo giorno del mese precedente rispetto a quello attualmente visualizzato nel calendario
      current.getFullYear(),  // Anno corrente visualizzato nel calendario
      current.getMonth() - 1,  // Mese precedente rispetto a quello attualmente visualizzato
      1  // Primo giorno del mese precedente
    );

    this.viewDate.set(previousMonth); // Aggiorna la data visualizzata nel calendario al mese precedente

    this.viewDate().getMonth();  // Aggiorna il mese visualizzato
    this.viewDate().getFullYear();  // Aggiorna l'anno visualizzato

  }


  // METODO PER ANDARE AL MESE SUCCESSIVO
  goToNextMonth(): void {

    const current = this.viewDate();  // Data attualmente visualizzata nel calendario cioè il mese e l'anno che l'utente sta guardando

    const nextMonth = new Date(    // Questo è un oggetto Date che rappresenta il primo giorno del mese successivo rispetto a quello attualmente visualizzato nel calendario
      current.getFullYear(),  // Anno corrente visualizzato nel calendario
      current.getMonth() + 1,  // Mese successivo rispetto a quello attualmente visualizzato
      1  // Primo giorno del mese successivo
    );

    if (  // Controlla se il mese successivo supera la data odierna
      nextMonth.getFullYear() > this.today.getFullYear() ||   // Se l'anno del mese successivo è maggiore dell'anno corrente, oppure
      (nextMonth.getFullYear() === this.today.getFullYear() &&  // Se l'anno del mese successivo è uguale all'anno corrente e
        nextMonth.getMonth() > this.today.getMonth())           // il mese del mese successivo è maggiore del mese corrente
    ) {
      return;    // allora disabilita il passaggio al mese successivo
    }

    this.viewDate.set(nextMonth);  // Aggiorna la data visualizzata nel calendario al mese successivo

    this.viewDate().getMonth();   // Aggiorna il mese visualizzato
    this.viewDate().getFullYear();  // Aggiorna l'anno visualizzato
  }


  // METODO PER VERIFICARE SE IL MESE SUCCESSIVO È DISABILITATO
  isNextMonthDisabled() {
    return (this.viewDate().getFullYear() === this.today.getFullYear()  // Se l'anno visualizzato è quello corrente
      && this.viewDate().getMonth() === this.today.getMonth());  // e il mese visualizzato è quello corrente, allora il mese successivo è disabilitato
  }


  // METODO PER OTTENERE IL NOME DEL MESE CORRENTE
  currentMonthName(): string {
    return this.months[this.viewDate().getMonth()];    // Restituisce il nome del mese corrente basato sulla data visualizzata nel calendario
  }


  // CALCOLO DINAMICO DEI GIORNI DEL MESE CORRENTE
  // Questo metodo calcola dinamicamente i giorni del mese corrente, tenendo conto dei giorni vuoti all'inizio del calendario per allineare correttamente i giorni della settimana.
  daysInMonth = computed(() => {

    const currentViewDate = this.viewDate();  // Ottiene la data attualmente visualizzata nel calendario

    const totalDays = new Date(   // Calcola il numero totale di giorni nel mese corrente
      currentViewDate.getFullYear(),  // Anno corrente della data visualizzata
      currentViewDate.getMonth() + 1,  // Mese successivo a quello visualizzato (+ 1). Questo serve per ottenere l'ultimo giorno del mese corrente
      0  // Giorno 0 del mese successivo corrisponde all'ultimo giorno del mese corrente
    ).getDate();  // Restituisce il numero totale di giorni nel mese corrente


    let firstDayIndex = new Date(   // Calcola l'indice (0 = domenica, 1 = lunedì, ecc.) del primo giorno del mese corrente 
      currentViewDate.getFullYear(),  // Anno corrente della data visualizzata
      currentViewDate.getMonth(),  // Mese corrente della data visualizzata
      1  // Primo giorno del mese corrente
    ).getDay();  // Restituisce l'indice del giorno della settimana del primo giorno del mese corrente (0 = domenica, 1 = lunedì, ecc.)


    firstDayIndex = firstDayIndex === 0 ? 6 : firstDayIndex - 1;  // Adatta l'indice del primo giorno del mese corrente per iniziare da lunedì (0 = lunedì, 6 = domenica)

    const blanks = Array(firstDayIndex).fill(null);  // Crea un array di celle vuote per i giorni precedenti al primo giorno del mese corrente
    // Questo serve a riempire le celle vuote all'inizio del calendario per allineare correttamente i giorni del mese corrente con i giorni della settimana

    const days = Array.from(   // Crea un array di oggetti Date per ogni giorno del mese corrente
      { length: totalDays },  // Lunghezza dell'array corrispondente al numero totale di giorni nel mese corrente
      (_, i) => new Date(  // _ rappresenta l'indice corrente nell'array mentre i rappresenta il numero del giorno nel mese corrente (0-based, quindi si aggiunge 1)
        currentViewDate.getFullYear(),  // Creo un oggetto Date per il giorno corrente del mese
        currentViewDate.getMonth(),
        i + 1  // Giorno del mese corrente (1-based)
      )
    );
    return [...blanks, ...days];  // Restituisce un array combinato di celle vuote e giorni del mese corrente per il rendering del calendario
  });
   // Quindi, se dobbiamo dividere in passaggi il metodo daysInMonth, possiamo pensarlo come:
   // 1. Calcolare il numero totale di giorni nel mese corrente
   // 2. Determinare l'indice del primo giorno del mese corrente
   // 3. Creare un array di celle vuote per i giorni precedenti al primo giorno del mese
   // 4. Creare un array di oggetti Date per ogni giorno del mese corrente
   // 5. Combinare le celle vuote e i giorni del mese corrente per il rendering del calendario

```
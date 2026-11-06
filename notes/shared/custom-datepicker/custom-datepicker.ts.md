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

    const isoDate = selectedDate.toISOString(); // Converte la data selezionata in formato ISO string per memorizzazione e comunicazione con Angular. Il formato ISO string è standard e permette di rappresentare la data in modo univoco senza dipendere dal fuso orario.

    this.value = isoDate;  // Aggiorna il valore interno del datepicker con la data selezionata in formato ISO string.

    this.onChange(isoDate);  // Chiama la funzione onChange registrata da Angular per notificare il cambio di valore. isoDate è il nuovo valore selezionato.

    this.onTouched();  // Chiama la funzione onTouched registrata da Angular per notificare che il datepicker è stato interagito.

    this.toggleCalendar();  // Chiude il calendario dopo aver selezionato una data.

    this.isTouched = false;  // Resetto lo stato di toccato dopo la selezione della data in modo che il bordo non rimanga attivo

  }
  
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  
  // METODO PER OTTENERE LA DATA FORMATTATA
  formattedDate(): string {

    if (!this.value) {  // Se non è stato selezionato alcun valore, 
      return '';  // restituisce una stringa vuota.
    }
    
    const date = new Date(this.value);  // Converte il valore interno del datepicker in un oggetto Date, in modo da poter applicare la formattazione locale.

    return date.toLocaleDateString();  // Restituisce la data nel formato locale (ad esempio, "dd/mm/yyyy" in Italia).
    
  }


  // PROPRIETÀ PER LO STATO DEL CALENDARIO
  // Questa proprietà indica se il calendario del datepicker è aperto o chiuso.
  // Viene utilizzata per determinare se mostrare o nascondere il calendario.
  isOpen: boolean = false;  


  // PROPRIETÀ PER TRACCIARE LO STATO DEL BORDO ATTIVO DEL DIV
  // Indica se il div è stato cliccato, utile per gestire lo stato del bordo attivo
  isClicked: boolean = false;   


  // METODO PER TOGGLE DEL CALENDARIO
  toggleCalendar(): void {  // Metodo per aprire o chiudere il calendario del datepicker.

    event.stopPropagation();  // Evita che il click di apertura attivi subito il listener di chiusura (document:click)
    this.isOpen = !this.isOpen;  // Inverte lo stato di apertura del calendario.

    if(!this.isOpen){
      this.isClicked = false; // Reset se viene chiuso dal bottone
    }

  }


  // LISTENER PER I CLICK SUL DOCUMENTO, PER CHIUDERE IL CALENDARIO SE SI CLICCA FUORI
  // Questo listener chiude il calendario se si clicca fuori dal componente stesso
  // @HostListener è un decoratore di Angular che permette di ascoltare eventi su elementi specifici o sul documento stesso. 
  // In questo caso, ascolta i click sul documento per chiudere il calendario se si clicca fuori dal componente.
  @HostListener('document:click', ['$event'])  // Ascolta i click su tutta la pagina (document)
  onDocumentClick(event: MouseEvent): void {

    // Verifica se l'elemento cliccato si trova all'INTERNO di questo componente
    const clickedInside = this.elementRef.nativeElement.contains(event.target);  
    // elementRef rappresenta il riferimento al componente stesso
    // nativeElement rappresenta l'elemento DOM del componente stesso 
    // contains(event.target) verifica se l'elemento cliccato è all'interno del componente stesso

    // Se l'utente ha cliccato fuori e il quadro è aperto, lo chiudiamo e resettiamo il bordo attivo
    if (!clickedInside && this.isOpen) {
      this.isOpen = false;     // chiude il menu 
      this.isClicked = false;   //  e resetta il bordo
    }

  }
  ///// FINE LISTENER CLICK DOCUMENTO


  // METODO PER ATTIVARE IL BORDO DEL DIV QUANDO VI SI CLICCA DENTRO
  activateBorder(event: Event): void {  // Viene chiamato quando si clicca DENTRO il div
    this.isClicked = true;  // Attiva il bordo del div (tramite la classe CSS) quando si clicca dentro
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
  ///////////// FINE SPIEGAZIONE DI viewDate


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
      current.getMonth() - 1,  /// La sottrazione di 1 porta al mese precedente rispetto a quello attualmente visualizzato
      1  // Siccome abbiamo impostato il giorno a 1, quindi otteniamo il primo giorno non di questo mese ma del mese precedente (getMonth() - 1)
    );

    this.viewDate.set(previousMonth);  // Allora, imposta la data visualizzata nel calendario al mese precedente
    this.viewDate().getMonth();  // Una volta aggiornata la data visualizzata, ottiene il mese corrente del calendario.
    this.viewDate().getFullYear();  // Infine, ottiene l'anno della data visualizzata nel calendario.
    // Quindi con getMonth() e getFullYear() possiamo ottenere il mese e l'anno correnti del calendario per poter aggiornare la UI o effettuare controlli.

  } 
  ///////////// FINE SPIEGAZIONE DEL METODO goToPreviousMonth()


  // METODO PER ANDARE AL MESE SUCCESSIVO
  goToNextMonth(): void {

    const current = this.viewDate();  // Data attualmente visualizzata nel calendario cioè il mese e l'anno che l'utente sta guardando

    const nextMonth = new Date(  // Questo è un oggetto Date che rappresenta il primo giorno del mese successivo rispetto a quello attualmente visualizzato nel calendario
      current.getFullYear(),  // Anno corrente visualizzato nel calendario
      current.getMonth() + 1,  // Sommando 1 otteniamo il mese successivo rispetto a quello corrente
      1  // Imposto il giorno al primo, no del mese corrente ma di quello successivo (getMonth() + 1)
    );

    if (  // Controlla se il mese successivo supera la data odierna
      nextMonth.getFullYear() > this.today.getFullYear() ||   // Se l'anno del mese successivo è maggiore dell'anno corrente, oppure
      (nextMonth.getFullYear() === this.today.getFullYear() &&  // Se l'anno del mese successivo è uguale all'anno corrente e
        nextMonth.getMonth() > this.today.getMonth())           // il mese del mese successivo è maggiore del mese corrente
    ) {
      return;    // Allora il mese successivo è disabilitato e non si può andare oltre la data odierna.
    }

    this.viewDate.set(nextMonth);  // Imposto il mese successivo come data visualizzata nel calendario
    this.viewDate().getMonth();  // Una volta aggiornata la data visualizzata, ottiene il mese corrente del calendario.
    this.viewDate().getFullYear(); // Infine, ottiene l'anno corrente del calendario.
    // In questo modo, grazie a queste chiamate, possiamo ottenere il mese e l'anno correnti del calendario aggiornato, se necessario per ulteriori elaborazioni.
  }
   ///////////// FINE SPIEGAZIONE DEL METODO goToNextMonth()


  // METODO PER VERIFICARE SE IL MESE SUCCESSIVO È DISABILITATO
  isNextMonthDisabled() {
    return (this.viewDate().getFullYear() === this.today.getFullYear()  // Se l'anno visualizzato è quello corrente
      && this.viewDate().getMonth() === this.today.getMonth());  // e il mese visualizzato è quello corrente, allora il mese successivo è disabilitato.
  }
  // Sebbene, nel metodo goToNextMonth, si controlli se il mese successivo supera la data odierna,
  // questo metodo restituisce true se il mese successivo è disabilitato (ovvero se siamo già al mese corrente o oltre).
  // Serve principalmente per disabilitare il pulsante "mese successivo" quando non è possibile avanzare oltre il mese corrente.
  // Invece il controllo all'interno di goToNextMonth serve a prevenire l'aggiornamento della vista del calendario oltre il mese corrente.

  ////// FINE SPIEGAZIONE DEL METODO isNextMonthDisabled()


  // METODO PER OTTENERE IL NOME DEL MESE CORRENTE
  currentMonthName(): string {
    return this.months[this.viewDate().getMonth()];  // Restituisce il nome del mese corrente basato sulla data visualizzata nel calendario
  }
    // months è l'array che contiene i nomi dei mesi.
    // this.viewDate().getMonth() restituisce l'indice del mese corrente (0 = gennaio, 11 = dicembre).
    // Quindi, quando si ottiene l'indice del mese corrente tramite this.viewDate().getMonth(), 
    // si può usare quell'indice per accedere al nome del mese corrispondente nell'array months.

  ///// FINE SPIEGAZIONE DEL METODO currentMonthName()


  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// 
  // CALCOLO DINAMICO DEI GIORNI DEL MESE CORRENTE
  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // Questo metodo calcola dinamicamente i giorni del mese corrente, tenendo conto dei giorni vuoti all'inizio del calendario per allineare correttamente i giorni della settimana.
  daysInMonth = computed(() => {

    // Numero totale di giorni nel mese corrente ////////////////////////////////////////////////////////////////////////////////////////////////
    const totalDays = new Date(       // Calcola il numero totale di giorni nel mese corrente riprendendo l'ultimo giorno del mese corrente 
      currentViewDate.getFullYear(),  // Anno corrente della data visualizzata
      currentViewDate.getMonth() + 1,  // Mese successivo a quello visualizzato (+ 1). Questo serve per ottenere l'ultimo giorno del mese corrente
      0  // Giorno 0 del mese successivo corrisponde all'ultimo giorno del mese corrente
      // Javascript considera il giorno 0 come l'ultimo giorno del mese precedente. Ad esempio, se vogliamo ottenere l'ultimo giorno del mese corrente, impostiamo il giorno a 0 del mese successivo.
    ).getDate();  // Allora, considerando che il giorno 0 del mese successivo rappresenta l'ultimo giorno del mese corrente, otteniamo  quindi il numero totale di giorni nel mese corrente.

    
    // Analizzando punto per punto, totalDays rappresenta l'ultimo giorno del mese corrente, quindi il numero totale di giorni nel mese corrente
    // 1. this.viewDate().getFullYear() ottiene l'anno corrente della vista del calendario
    // 2. this.viewDate().getMonth() + 1 ottiene il mese successivo (JavaScript conta i mesi da 0 a 11). In questo modo possiamo ottenere l'ultimo giorno del mese corrente impostando il giorno a 0. 
    // Questo per sfruttare il comportamento di JavaScript che considera il giorno 0 come l'ultimo giorno del mese precedente.
    // 3. Infatti, 0 indica l'ultimo giorno del mese precedente (il mese corrente meno uno che è il mese che stiamo calcolando), quindi otteniamo l'ultimo giorno del mese corrente
    // 4. getDate() restituisce il numero del giorno dell'ultimo giorno del mese corrente (ad esempio, 30 per aprile), che corrisponde al numero totale di giorni nel mese corrente

    // In sintesi: new Date(...) è utilizzato per ottenere l'ultimo giorno del mese corrente sfruttando il comportamento di JavaScript che considera il giorno 0 come l'ultimo giorno del mese precedente.
    // Mentre che getDate() restituisce il numero del giorno dell'ultimo giorno del mese corrente, che rappresenta il numero totale di giorni nel mese corrente.

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


    // Calcola l'indice del primo giorno del mese corrente 
    // Ad esempio, se il primo giorno del mese è mercoledì, firstDayIndex sarà 3 (Javascript considera 0 come domenica e 6 come sabato)
    let firstDayIndex = new Date(   // Calcola l'indice (0 = domenica, 1 = lunedì, ecc.) del primo giorno del mese corrente 
      currentViewDate.getFullYear(),  // Anno corrente della data visualizzata
      currentViewDate.getMonth(),  // Mese corrente della data visualizzata
      1  // Primo giorno del mese corrente
    ).getDay();  // Restituisce l'indice del giorno della settimana del primo giorno del mese corrente (0 = domenica, 1 = lunedì, ecc.)


    // Adattamento dell'indice del primo giorno del mese corrente (0 = lunedì, 6 = domenica)
    firstDayIndex = firstDayIndex === 0 ? 6 : firstDayIndex - 1;  // Sposta l'indice in modo che 0 = lunedì, 6 = domenica
    // Adatta l'indice del primo giorno del mese corrente per iniziare da lunedì (0 = lunedì, 6 = domenica)


    // Non più necessario, utilizziamo i giorni del mese precedente per riempire gli spazi vuoti all'inizio della griglia
    // const blanks = Array(firstDayIndex).fill(null); 
    // Crea un array di celle vuote per i giorni precedenti al primo giorno del mese corrente
    // Questo serve a riempire le celle vuote all'inizio del calendario per allineare correttamente i giorni del mese corrente con i giorni della settimana

    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    // L'ultimo giorno del mese precedente
    // Calcola l'ultimo giorno del mese precedente per determinare quali giorni mostrare nella griglia del calendario all'inizio del mese corrente
    const previousMonthLastDay =
    new Date(
      this.viewDate().getFullYear(),
      this.viewDate().getMonth(),
      0  // In JavaScript, il giorno 0 del mese corrente rappresenta l'ultimo giorno del mese precedente.
    ).getDate();  // Quindi otteniamo l'ultimo giorno del mese precedente.


    // Giorni del mese precedente
    // Genera un array di Date per i giorni del mese precedente da mostrare all'inizio della griglia del calendario
    const previousMonthDays = Array.from(  // Array.from genera un array 
      {length: firstDayIndex},  // di lunghezza firstDayIndex, cioè il numero di giorni del mese precedente da mostrare all'inizio della griglia del calendario

      (_, i) => // _ rappresenta l'indice corrente nell'array generato, cioè la posizione del giorno del mese precedente (spazio vuoto) da mostrare all'inizio della griglia del calendario
      // i rappresenta l'indice corrente nell'array generato, cioè il numero progressivo del giorno del mese precedente (che si sta generando) da mostrare all'inizio della griglia del calendario

        new Date(
          this.viewDate().getFullYear(),  // Ottengo l'anno del giorno del mese precedente
          this.viewDate().getMonth() - 1,  // - 1 indica il mese precedente rispetto al mese corrente della vista del calendario
          previousMonthLastDay - firstDayIndex + i + 1  // Calcola il giorno del mese precedente da mostrare all'inizio della griglia del calendario
          // Sottraendo firstDayIndex da previousMonthLastDay otteniamo il primo giorno del mese precedente da mostrare all'inizio della griglia del calendario
          // Aggiungendo i, otteniamo il giorno corretto del mese precedente da mostrare all'inizio della griglia del calendario
          // Si deve aggiungere 1 perché i giorni del mese iniziano da 1 e non da 0
          // Di conseguenza, otteniamo il giorno corretto del mese precedente da mostrare all'inizio della griglia del calendario 
          // Ad esempio, se firstDayIndex = 3 e previousMonthLastDay = 30, i = 0 darà 28, i = 1 darà 29, i = 2 darà 30
        ) 
    );

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    // Giorni del mese corrente
    // Genera un array di Date per i giorni del mese corrente
    const currentMonthDays = Array.from(  // Array.from genera un array di Date per i giorni del mese corrente
      { length: totalDays },  // Array di lunghezza pari al numero totale di giorni nel mese corrente
      (_, i) => new Date(  // In parole semplici stiamo dicendo che _ e i rappresentano rispettivamente l'elemento corrente (spazio vuoto) e l'indice corrente nell'array generato (che parte da 0)
        this.viewDate().getFullYear(),  // Ottengo l'anno del mese corrente
        this.viewDate().getMonth(),  // Ottengo il mese corrente
        i + 1  // i + 1 rappresenta il giorno del mese corrente dove i parte da 0 quindi aggiungiamo 1 siccome i giorni del mese partono da 1.
      )
      // Se analizziamo il codice, vediamo che stiamo creando un nuovo oggetto Date per ogni giorno del mese corrente, partendo dal giorno 1 fino all'ultimo giorno del mese.
    );

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    // Somma dei giorni del mese precedente e del mese corrente
    // Questo array contiene tutti i giorni del mese precedente e del mese corrente, utili per costruire la griglia del calendario completa.a
    // Uso il metodo spread per combinare i due array in un unico array di giorni
    const allDays = [...previousMonthDays, ...currentMonthDays];

    
    // Numero di celle disponibili nella griglia del calendario (6 righe x 7 colonne = 42 celle)
    // Calcola il numero di celle rimanenti per completare la griglia del calendario sottraendo il numero di giorni già presenti (mese precedente + mese corrente) da 42
    const remainingCells = 42 - allDays.length;  // I calendari veri completano la griglia a: 42 celle cioè 6 righe x 7 colonne
    // 42 = 6 righe x 7 colonne. 7 colonne per i giorni della settimana e 6 righe per coprire tutti i possibili giorni del mese, 
    // inclusi quelli del mese precedente e successivo necessari per completare la griglia.

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    // Giorni del mese successivo
    // Genera un array di Date per i giorni del mese successivo da mostrare alla fine della griglia del calendario
    const nextMonthDays = Array.from(  // Array.from genera un array
      { length: remainingCells },  // di lunghezza pari al numero di celle rimanenti da riempire nella griglia del calendario
      (_, i) => new Date(  // e genera un oggetto Date per ciascun giorno del mese successivo da mostrare nella griglia
        this.viewDate().getFullYear(),  // Ottengo l'anno corrente della vista del calendario
        this.viewDate().getMonth() + 1,  // Ottengo il mese successivo della vista del calendario
        i + 1   // Calcolo il giorno del mese successivo da mostrare nella griglia del calendario (ad esempio 1, 2, 3, ...)
      )
    ); 
    
    // Quindi a differenza degli array dei giorni del mese precedente e corrente, questo array utilizza _ e i per generare i giorni del mese successivo da mostrare nella griglia.
    
    // Come funziona?
    // Array.from crea un array della lunghezza specificata (remainingCells)
    // Per ogni elemento dell'array, viene chiamata la funzione (_, i) => new Date(...)
    // In questo modo, generiamo tutti i giorni necessari del mese successivo per completare la griglia del calendario

    // i è l'indice passato alla funzione di callback (indice dei numeri generati da Array.from) e viene utilizzato per calcolare il giorno del mese successivo da mostrare nella griglia (i + 1)

    // _ è l'indice degli spazi rimanenti nella griglia del calendario.

    // Nelle array precedenti, _ non veniva utilizzato perché i giorni venivano calcolati direttamente usando i + 1 o altre formule specifiche per il mese precedente o corrente. E Lo stesso concetto si applica anche ai giorni del mese successivo, dove _ rappresenta l'indice dell'array generato da Array.from, ma non viene utilizzato direttamente.

    // Quindi considerando anche le array precedenti, possiamo dire che _ non viene mai utilizzato direttamente per calcolare i giorni del calendario, ma serve solo come placeholder (spazio vuoto) per l'indice corrente (che viene rappresentato da i) nell'array generato da Array.from.

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    // Non più necessario, utilizziamo i giorni del mese precedente per riempire gli spazi vuoti all'inizio della griglia
    // return [...blanks, ...currentMonthDays]; 

    // Restituzione dell'array completo dei giorni 
    // L'array completo dei giorni include i giorni del mese precedente, del mese corrente e del mese successivo per riempire la griglia del calendario
    return [...previousMonthDays, ...currentMonthDays, ...nextMonthDays];

    // Li scrivo con il metodo spread operator (...) per unire i tre array in un unico array completo dei giorni
    // Qual'è la differenza tra usare o meno lo spread operator?
    // Senza lo spread operator, otterrei un array di array, mentre con lo spread operator ottieni un array piatto contenente tutti i giorni.

    });

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    // Se analizziamo il metodo daysInMonth in passaggi:
    // 1. Calcoliamo il numero totale di giorni nel mese corrente.
    // 2. Determiniamo l'indice del primo giorno del mese corrente.
    // 3. Adattiamo l'indice per considerare il lunedì come primo giorno della settimana.
    // 4. Calcoliamo l'ultimo giorno del mese precedente.
    // 5. Creiamo un array dei giorni del mese precedente.
    // 6. Creiamo un array dei giorni del mese corrente.
    // 7. Combiniamo i giorni del mese precedente e del mese corrente.
    // 8. Calcoliamo il numero di celle rimanenti nella griglia del calendario.
    // 9. Creiamo un array dei giorni del mese successivo.
    // 10. Restituiamo l'array completo dei giorni per la visualizzazione nel calendario.

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //// FINE SPIEGAZIONE METODO daysInMonth
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


    // METODO PER VERIFICARE SE UN GIORNO È SELEZIONATO
    // Restituisce true se la data passata corrisponde alla data selezionata, altrimenti false
  isDaySelected(date: Date): boolean {
    if (!this.value) {  // Se non c'è un valore selezionato, il giorno non può essere selezionato
      return false;  // Se non metto questo controllo, il metodo potrebbe generare un errore quando this.value è null o undefined
    }

    const selected = new Date(this.value);  // Converto il valore selezionato in un oggetto Date per confrontarlo con la data passata

    return (  // Restituisce true se il giorno, il mese e l'anno corrispondono alla data selezionata
      selected.getDate() === date.getDate()  // Confronto il giorno del mese
      && selected.getMonth() === date.getMonth()  // Confronto il mese
      && selected.getFullYear() === date.getFullYear()  // Confronto l'anno
    );
    // Perché verificare se un giorno è selezionato?
    // Serve per evidenziare nel calendario il giorno che corrisponde alla data selezionata dall'utente. 
    // Inoltre, permette di gestire correttamente la selezione e la visualizzazione della data nel componente del calendario.
    // Senza questa verifica, il calendario non saprebbe quale giorno evidenziare come selezionato.
  }


  // METODO PER VERIFICARE SE UN GIORNO APPARTIENE AL MESE CORRENTE
  // Questo helper verifica se un determinato giorno appartiene al mese corrente visualizzato nel calendario
  isCurrentMonth(date: Date): boolean {
    return (  
      date.getMonth() === this.viewDate().getMonth() &&  // Verifica se il mese del giorno corrisponde al mese corrente visualizzato
      date.getFullYear() === this.viewDate().getFullYear()  // Verifica se l'anno del giorno corrisponde all'anno corrente visualizzato
    );
  }
  // Un helper è un metodo di supporto utilizzato all'interno della classe per semplificare determinate operazioni o calcoli.
  // Il vantaggio degli helper è che rendono il codice più leggibile e riutilizzabile, evitando duplicazioni e semplificando la manutenzione.
  


  // METODO PER VERIFICARE SE è DOMENICA
  // Restituisce true se il giorno è una domenica, altrimenti false
  isSunday(date: Date): boolean {
    return date.getDay() === 0;  // In JavaScript, 0 rappresenta la domenica, quindi questo metodo restituisce true se il giorno è domenica
  } 
  // Il metodo getDay() di JavaScript serve a restituire il giorno della settimana corrispondente a una determinata data, espresso come un numero intero compreso tra 0 e 6.



  // VARIABILE DI STATO PER SIMULARE IL TOUCHED DEL FORM CONTROL
  isTouched = false;  



  // METODO PER ATTIVARE LO STATO TOUCHED
  setTouched(){

    if (!this.isTouched) {  // Se il campo non è ancora stato toccato, impostalo come toccato
      this.isTouched = true;
    }
  
    if (this.value) {  // Se c'è un valore selezionato, impostalo come non toccato
      this.isTouched = false;
    }

  }
}
```
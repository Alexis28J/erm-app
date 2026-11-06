import { Component, computed, ElementRef, forwardRef, HostListener, signal } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';


@Component({
  imports: [MatIconModule],
  selector: 'app-custom-datepicker',
  styleUrls: ['./custom-datepicker.scss'],
  templateUrl: './custom-datepicker.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CustomDatepicker),
      multi: true
    }
  ]
})
export class CustomDatepicker implements ControlValueAccessor {

  constructor(private elementRef: ElementRef) { }  // Inietto ElementRef per poter controllare i confini del componente

  // VALORE INTERNO DEL DATEPICKER
  value = '';

  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  /// METODI DI CONTROL VALUE ACCESSOR CHE SERVONO PER INTEGRARE IL MIO DATEPICKER CON ANGULAR FORMS
  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  // FUNZIONE CHIAMATA QUANDO IL VALORE DEL DATEPICKER CAMBIA
  onChange = (_: string) => { };


  // FUNZIONE CHIAMATA QUANDO IL DATEPICKER VIENE TOCCATO (INTERAGITO)
  onTouched = () => { };


  // METODO CHIAMATO DA ANGULAR PER AGGIORNARE IL VALORE DEL DATEPICKER
  writeValue(value: string): void {

    this.value = value;

    if (value) {
      const date = new Date(value);
      date.getMonth();
      date.getFullYear();

      this.viewDate.set(date);
    }

  }


  // METODO CHIAMATO DA ANGULAR PER REGISTRARE LA FUNZIONE DI CAMBIO VALORE
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }


  // METODO CHIAMATO DA ANGULAR PER REGISTRARE LA FUNZIONE DI TOUCH DEL DATEPICKER
  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  ///
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  // METODO PER SELEZIONARE UNA DATA
  selectDate(date: Date, event: Event): void {

    this.today.setHours(0, 0, 0, 0);

    const selectedDate = new Date(date);
    selectedDate.setHours(0, 0, 0, 0);

    if (selectedDate > this.today) {
      return;
    }

    const isoDate = selectedDate.toISOString();
    this.value = isoDate;

    this.onChange(isoDate);
    this.onTouched();

    this.toggleCalendar(event);

    this.isTouched = false;  

  }


  // METODO PER OTTENERE LA DATA FORMATTATA
  formattedDate(): string {

    if (!this.value) {
      return '';
    }

    const date = new Date(this.value);
    return date.toLocaleDateString();

  }


  // PROPRIETÀ PER LO STATO DEL CALENDARIO
  isOpen: boolean = false;


  // PROPRIETÀ PER TRACCIARE LO STATO DEL BORDO ATTIVO DEL DIV
  isClicked: boolean = false;


  // METODO PER TOGGLE DEL CALENDARIO
  toggleCalendar(event: Event): void {

    event.stopPropagation();
    this.isOpen = !this.isOpen;

    if (!this.isOpen) {
      this.isClicked = false;
    }

  }


  // LISTENER PER I CLICK SUL DOCUMENTO, PER CHIUDERE IL CALENDARIO SE SI CLICCA FUORI
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {

    const clickedInside = this.elementRef.nativeElement.contains(event.target);

    if (!clickedInside && this.isOpen) {
      this.isOpen = false;
      this.isClicked = false;
    }

  }


  // METODO PER ATTIVARE IL BORDO DEL DIV QUANDO VI SI CLICCA DENTRO
  activateBorder(event: Event): void {
    this.isClicked = true;
  }


  // SIGNAL CHE RAPPRESENTA LA DATA VISUALIZZATA NEL CALENDARIO
  viewDate = signal(new Date());


  // DATA CORRENTE 
  today = new Date();


  // ARRAY DEI NOMI DEI MESI
  months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];


  // METODO PER ANDARE AL MESE PRECEDENTE
  goToPreviousMonth(): void {

    const current = this.viewDate();

    const previousMonth = new Date(
      current.getFullYear(),
      current.getMonth() - 1,
      1
    );

    this.viewDate.set(previousMonth);
    this.viewDate().getMonth();
    this.viewDate().getFullYear();
  }


  // METODO PER ANDARE AL MESE SUCCESSIVO
  goToNextMonth(): void {

    const current = this.viewDate();

    const nextMonth = new Date(
      current.getFullYear(),
      current.getMonth() + 1,
      1
    );

    if (
      nextMonth.getFullYear() > this.today.getFullYear() ||
      (nextMonth.getFullYear() === this.today.getFullYear() &&
        nextMonth.getMonth() > this.today.getMonth())
    ) {
      return;
    }

    this.viewDate.set(nextMonth);
    this.viewDate().getMonth();
    this.viewDate().getFullYear();

  }


  // METODO PER VERIFICARE SE IL MESE SUCCESSIVO È DISABILITATO
  isNextMonthDisabled() {
    return (this.viewDate().getFullYear() === this.today.getFullYear()
      && this.viewDate().getMonth() === this.today.getMonth());
  }


  // METODO PER OTTENERE IL NOME DEL MESE CORRENTE
  currentMonthName(): string {
    return this.months[this.viewDate().getMonth()];
  }


  // CALCOLO DINAMICO DEI GIORNI DEL MESE CORRENTE
  daysInMonth = computed(() => {

    // Numero totale di giorni nel mese corrente
    const totalDays = new Date(
      this.viewDate().getFullYear(),
      this.viewDate().getMonth() + 1,
      0
    ).getDate();

    // L'indice del primo giorno del mese corrente (0 = domenica, 6 = sabato)
    let firstDayIndex = new Date(
      this.viewDate().getFullYear(),
      this.viewDate().getMonth(),
      1
    ).getDay();


    // Adattamento dell'indice del primo giorno del mese corrente (0 = lunedì, 6 = domenica)
    firstDayIndex = firstDayIndex === 0 ? 6 : firstDayIndex - 1;


    // L'ultimo giorno del mese precedente
    const previousMonthLastDay =
      new Date(
        this.viewDate().getFullYear(),
        this.viewDate().getMonth(),
        0
      ).getDate();


    // Giorni del mese precedente
    const previousMonthDays = Array.from(
      { length: firstDayIndex },
      (_, i) =>
        new Date(
          this.viewDate().getFullYear(),
          this.viewDate().getMonth() - 1,
          previousMonthLastDay - firstDayIndex + i + 1
        )
    );


    // Giorni del mese corrente
    const currentMonthDays = Array.from(
      { length: totalDays },
      (_, i) => new Date(
        this.viewDate().getFullYear(),
        this.viewDate().getMonth(),
        i + 1
      )
    );


    // Somma dei giorni del mese precedente e del mese corrente
    const allDays = [...previousMonthDays, ...currentMonthDays];


    // Numero di celle disponibili nella griglia del calendario (6 righe x 7 colonne = 42 celle)
    const remainingCells = 42 - allDays.length;


    // Giorni del mese successivo
    const nextMonthDays = Array.from(
      { length: remainingCells },
      (_, i) => new Date(
        this.viewDate().getFullYear(),
        this.viewDate().getMonth() + 1,
        i + 1
      )
    );


    // Restituzione dell'array completo dei giorni 
    return [...previousMonthDays, ...currentMonthDays, ...nextMonthDays];
  });


  // METODO PER VERIFICARE SE UN GIORNO È SELEZIONATO
  isDaySelected(date: Date): boolean {
    if (!this.value) {  
      return false;
    }

    const selected = new Date(this.value);

    return (
      selected.getDate() === date.getDate()
      && selected.getMonth() === date.getMonth()
      && selected.getFullYear() === date.getFullYear()
    );

  }


  // METODO PER VERIFICARE SE UN GIORNO APPARTIENE AL MESE CORRENTE
  isCurrentMonth(date: Date): boolean {
    return (
      date.getMonth() === this.viewDate().getMonth() &&
      date.getFullYear() === this.viewDate().getFullYear()
    );
  }


  // METODO PER VERIFICARE SE è DOMENICA
  isSunday(date: Date): boolean {
    return date.getDay() === 0;
  }


  // VARIABILE DI STATO PER SIMULARE IL TOUCHED DEL FORM CONTROL
  isTouched = false;  


  // METODO PER ATTIVARE LO STATO TOUCHED
  setTouched(){

    if (!this.isTouched) {  
      this.isTouched = true;
    }
    
    if (this.value) {
      this.isTouched = false;
    }
    
  }

}



// VS Code Counter: 193 code lines (06/11/2026)
import { Component, computed, forwardRef, signal } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  imports: [],
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
  selectDate(date: Date): void {

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

    this.toggleCalendar();

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


  // METODO PER TOGGLE DEL CALENDARIO
  toggleCalendar(): void {
    this.isOpen = !this.isOpen;
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

    if (  // Controlla se il mese successivo supera la data odierna
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

    const currentViewDate = this.viewDate();

    const totalDays = new Date(
      currentViewDate.getFullYear(),
      currentViewDate.getMonth() + 1,
      0
    ).getDate();


    let firstDayIndex = new Date(
      currentViewDate.getFullYear(),
      currentViewDate.getMonth(),
      1
    ).getDay();


    firstDayIndex = firstDayIndex === 0 ? 6 : firstDayIndex - 1;

    const blanks = Array(firstDayIndex).fill(null);


    const days = Array.from(
      { length: totalDays },
      (_, i) => new Date(
        currentViewDate.getFullYear(),
        currentViewDate.getMonth(),
        i + 1
      )
    );
    return [...blanks, ...days];
  });

}



// VS Code Counter: 122 code lines (04/11/2026)
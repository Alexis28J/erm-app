# COMMENTI

Ho creato il componente per il login dei dipendenti utilizzando Reactive Forms di Angular.

I Reactive Forms permettono di gestire i form in modo più strutturato e reattivo.

Sono dei form gestiti interamente dal codice TypeScript, piuttosto che dal template HTML.

Il form include campi per l'email e la password, entrambi con validazione.

Quando il form viene inviato, i valori vengono stampati nella console solo se il form è valido.



```TYPESCRIPT
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';

@Component({
  imports: [ReactiveFormsModule],  // Non è necessario aggiungere FormBuilder, FormGroup o Validators qui perché vengono importati automaticamente dal modulo reattivo.
  //In altre parole, questi tre (FormBuilder, FormGroup e Validators) non devono essere aggiunti qui perché sono già disponibili tramite ReactiveFormsModule.

  selector: 'app-login-employee-component',
  styleUrls: ['./login-employee-component.scss'],
  templateUrl: './login-employee-component.html',
})
export class LoginEmployeeComponent {

  constructor(
    private fb: FormBuilder  // FormBuilder è utilizzato per creare il form reattivo 
  ) {

    // INIZIALIZZAZIONE DEL FORM DI LOGIN (Reactive Forms)
    // Si crea quando il componente viene istanziato (cioè quando si carica la pagina del login), utilizzando il FormBuilder per definire i controlli del form e le loro regole di validazione.
    this.loginForm = this.fb.group({

      email: ['', [Validators.required, Validators.email]],  // Sia required che email sono delle validazioni (o regole) fornite da Angular tramite Validators

      password: ['', Validators.required]  // required significa che il campo è obbligatorio mentre email richiede anche il formato corretto dell'email
      // Le regole di formato per l'email e la password sono gestite tramite Validators di Angular.

    });
  }


  // METODO PER LA GESTIONE DELL'INVIO DEL FORM
  // Una volta che l'utente invia il form, questo metodo viene chiamato per gestire i dati inseriti.
  // Se il form non è valido, non viene fatto nulla.
  onSubmit() {

    if (this.loginForm.valid) {  //Controlla se il form è valido prima di procedere

      console.log(this.loginForm.value);  // Sia valid che value sono proprietà (o metodi) del form gestito da Angular Reactive Forms
      // valid indica se il form è valido secondo le regole di validazione definite tramite Validators
      // value contiene i valori attuali dei campi del form

    }

  }


  loginForm: FormGroup;  // Rappresenta il form per il login dei dipendenti, gestito tramite Reactive Forms di Angular

}
```
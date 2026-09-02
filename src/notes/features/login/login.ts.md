# COMMENTI 

Questo file gestisce il componente di login, inclusa la logica per l'autenticazione e la navigazione in base al ruolo dell'utente.


```TYPESCRIPT
export class Login {

  // INIEZIONE DELLE DIPENDENZE
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  errorMessage = '';  // inizializzo il messaggio di errore a una stringa vuota 


  // DEFINIZIONE DEL FORM DI LOGIN
  // loginForm è il FormGroup che rappresenta il modulo di login, contenente i campi email e password con le rispettive validazioni.
  loginForm = this.fb.group({  // Il metodo group crea un nuovo FormGroup con i controlli specificati
    email: ['', [Validators.required, Validators.email]], // Validators.required assicura che il campo non sia vuoto
    password: ['', [Validators.required]] // Validators.required assicura che il campo non sia vuoto
  });


  // METODO PER GESTIRE L'INVIO DEL FORM DI LOGIN
  onSubmit(): void {  // Metodo chiamato quando l'utente invia il form di login

    if (this.loginForm.invalid) {  // Se il form non è valido, esco dal metodo
      return;
    }

    const { email, password } = this.loginForm.getRawValue();  // creo un oggetto con i valori del form 
    // const { email, password } significa che sto estraendo le proprietà email e password dall'oggetto 
    // this.loginForm.getRawValue() restituisce un oggetto con tutte le proprietà del form, in questo caso email e password
    // In sintesi, sto estraendo i valori email e password dal form in modo da poterli utilizzare per l'autenticazione.


    this.authService.login(  // Chiamo il metodo di login del servizio di autenticazione
      email!,   // Passo l'email al metodo di login  
      password!   // Passo la password al metodo di login
      // ! indica che il valore non è null o undefined
    )

      .subscribe(user => {  // Subscribo al risultato del login cioè ricevo l'utente autenticato
      // Di solito, il metodo subscribe viene usato con gli Observable per gestire i dati asincroni (ad esempio, le risposte del server)
      // ma può essere da Reactive Forms per ascoltare cosa digita l'utente nei campi del form e reagire di conseguenza (ad esempio, per abilitare/disabilitare pulsanti o mostrare messaggi di errore in tempo reale)

        if (!user) {
          this.errorMessage =   // Imposto il messaggio di errore se l'autenticazione fallisce
            "Invalid email or password";

          return;
        }

        this.errorMessage = '';  // Serve per resettare eventuali messaggi di errore precedenti
        // Quando il login va a buon fine, conviene pulire eventuali errori precedenti.

        if (user.role === UserRole.HR) {  // Se l'utente ha il ruolo HR, lo reindirizzo al dashboard HR
          this.router.navigate(
            ['/hr/dashboard']
          );

        } else {  // Altrimenti, reindirizzo l'utente al dashboard Employee

          this.router.navigate(
            ['/employee/dashboard']
          );
        }

      });

  }
}
```

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

# FORMGROUP 

Un `FormGroup` in Angular è una classe dei `Reactive Forms` che raggruppa insieme più elementi di controllo, chiamati `FormControl`.

Serve a gestire un modulo intero o una sezione di esso come un blocco unico


## A COSA SERVE:

- `ORGANIZZARE I DATI`: unisce i valori dei singoli campi di input in un unico oggetto JavaScript strutturato a coppie chiave-valore.

- `VALIDAZIONE GLOBALE`: calcola lo stato di validità dell'intero gruppo controllando i singoli campi. Se anche un solo controllo non è valido, l'intero FormGroup risulta non valido.

- `TRACCIAMENTO DELLO STATO`: permette di monitorare in modo sincrono se il form è stato modificato (dirty), se è stato visitato (touched) o se è valido (valid).

- `GESTIONE SEMPLIFICATA`: consente di resettare, leggere o impostare i valori di tutti i campi in blocco con un solo comando.


//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

# METODO .GROUP()

In Angular, il metodo `FormBuilder.group()` serve a creare e configurare un `FormGroup`, che è una raccolta di controlli di un modulo (input, checkbox, ecc.) gestiti come un unico blocco. 


## A COSA SERVE IN PRATICA?

- `RAGGRUPPA I DATI`: Unisce più campi associati (es. nome, email, password) in un unico oggetto.Semplifica il codice: Evita di dover istanziare manualmente ogni singolo FormControl.

- `GESTISCE LO STATO`: Permette di verificare validità, errori e valori di tutto il modulo in un colpo solo.

- `TRACCIA I CAMBIAMENTI`: Consente di ascoltare le modifiche dell'intero gruppo di campi contemporaneamente.


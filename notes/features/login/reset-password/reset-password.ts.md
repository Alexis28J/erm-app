# COMMENTI

```TYPESCRIPT
export class ResetPassword {

  // INIEZIONE DELLE DIPENDENZE
  private readonly fb = inject(FormBuilder);
  private readonly userService = inject(UserService);
  private readonly router = inject(Router);
  private readonly notification = inject(Notification);


  // STATI REATTIVI
  readonly loading = signal(false);  // Stato reattivo per indicare se l'operazione di reset della password è in corso
  // Lo stato loading è utile quando si vuole mostrare un indicatore di caricamento all'utente durante l'operazione di reset della password

  readonly errorMessage = signal('');  // Stato reattivo per memorizzare eventuali messaggi di errore durante il reset della password


  // FORM REATTIVO PER IL RESET DELLA PASSWORD
  readonly form = this.fb.nonNullable.group({  // La proprietà nonNullable garantisce che i valori del form non possano essere nulli
    email: [
      '',
      [
        Validators.required,  // L'email è obbligatoria
        Validators.email   // L'email deve avere un formato valido (ad es. esempio@dominio.com)
      ]
    ],
    password: [
      '',
      [
        Validators.required,  // La password è obbligatoria
        Validators.minLength(6)  // La password deve avere almeno 6 caratteri
      ]
    ],
    confirmPassword: [
      '',
      [
        Validators.required,  // La conferma della password è obbligatoria
      ]
    ]
  });


  // METODO PER IL RESET DELLA PASSWORD
  onSubmit(): void {

    if (this.form.invalid) {  // Se il form non è valido, segnala tutti i campi come toccati e interrompi l'esecuzione
      this.form.markAllAsTouched();  // Evidenzia tutti i campi come toccati (li mostra in rosso) per mostrare eventuali errori di validazione
      return;
    }

    const {      // Estrai i valori del form (email, password e conferma della password)
      email,
      password,
      confirmPassword
    } = this.form.getRawValue();

    // Il metodo getRawValue() viene utilizzato per ottenere i valori correnti del form, anche se non sono stati modificati. 
    // Questo include tutti i campi del form, non solo quelli che sono stati toccati o modificati.

    // Perché si scrive in questo modo - const {email, password, confirmPassword}? 
    // Questo è un esempio di destructuring assignment in JavaScript/TypeScript.
    // Invece di accedere ai valori del form con this.form.getRawValue().email, this.form.getRawValue().password, ecc.,
    // possiamo estrarli direttamente in variabili separate con una sola riga di codice.
    // Quindi scriverlo così è più conciso e leggibile di 
    // const email = this.form.getRawValue().email;
    // const password = this.form.getRawValue().password;
    // const confirmPassword = this.form.getRawValue().confirmPassword;

    if (password !== confirmPassword) {  // Se la password e la conferma della password non corrispondono, mostra un messaggio di errore
      this.errorMessage.set('Passwords do not match!');  // Imposta il messaggio di errore nello stato reattivo
      return;  // Interrompi l'esecuzione del metodo onSubmit se le password non corrispondono
    }

    this.loading.set(true);  // Imposta lo stato di caricamento su true per indicare che l'operazione è in corso

    this.errorMessage.set('');  // Resetta il messaggio di errore prima di iniziare l'operazione di reset della password

    this.userService
      .getUserByEmail(email)  // Recupera l'utente dal server utilizzando l'email fornita
      .subscribe({   // Gestisce la risposta del server dopo aver tentato di recuperare l'utente per email
        // Questo passaggio si fa per gestire la risposta del server dopo aver tentato di recuperare l'utente per email
        // Se non lo facciamo, potremmo non gestire correttamente il caso in cui l'utente non esiste nel server

        next: user => {  // Gestisce il caso in cui l'utente viene trovato o meno

          if (!user) {   // Se l'utente non viene trovato, mostra un messaggio di errore
            this.loading.set(false);  // Imposta lo stato di caricamento su false poiché l'operazione non può continuare senza un utente valido

            this.errorMessage.set(   // Imposta il messaggio di errore indicando che l'utente non è stato trovato
              'User not found'
            );

            return;  // Interrompi l'esecuzione del metodo onSubmit se l'utente non viene trovato

          }

          this.userService  // Invece, se l'utente viene trovato, aggiorna la sua password
            .updateUser(  // Chiama il servizio per aggiornare l'utente con la nuova password
              user.id,  // ID dell'utente da aggiornare
              {
                ...user,  // Mantieni tutte le proprietà esistenti dell'utente
                password  // Aggiorna la password dell'utente con il nuovo valore fornito
              }
            )
            .subscribe({  // Gestisce la risposta del server dopo aver tentato di aggiornare l'utente
              // Questo passaggio si fa per gestire la risposta del server dopo aver tentato di aggiornare l'utente
              // Se non lo facciamo, potremmo non gestire correttamente il caso in cui l'aggiornamento della password fallisce

              next: () => {  // Gestisce il caso in cui l'aggiornamento della password ha successo
                this.loading.set(false);  // Imposta lo stato di caricamento su false poiché l'operazione è completata
                this.notification.success('Password updated sucessfully');  // Mostra una notifica di successo
                this.router.navigate(['/login']);  // Reindirizza l'utente alla pagina di login
              },

              error: () => {  // Gestisce il caso in cui si verifica un errore durante l'aggiornamento della password

                this.loading.set(false);  // Imposta lo stato di caricamento su false poiché l'operazione è terminata con un errore

                this.errorMessage.set(
                  'Unexpected error'  // Mostra un messaggio di errore generico
                );
              }

              // Ricorda che subscribe è necessario per eseguire effettivamente la richiesta HTTP
            });
        }
      })

  }


  // METODO PER MOSTRARE/NASCONDERE LA PASSWORD
  hidePassword = true;

  togglePasswordVisibility(): void {
    this.hidePassword = !this.hidePassword;
  }


}
```
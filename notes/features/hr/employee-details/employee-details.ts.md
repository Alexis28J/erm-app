# COMMENTI

```TYPESCRIPT
export class EmployeeDetails {

  // INIEZIONE DELLE DIPENDENZE
  private route = inject(ActivatedRoute);
  private userService = inject(UserService);


  // SIGNAL PER L'ID DELL'IMPIEGATO
  employeeId = toSignal(
    this.route.paramMap.pipe(   // Ottieni i parametri della route corrente
      map(params => params.get('id') ?? '') // Estrai l'ID dell'impiegato dai parametri della route. Lascia una stringa vuota se non è presente.
    ),
    {
      initialValue: ''  // Valore iniziale per l'ID dell'impiegato
    }
  );


  // SIGNAL PER I DETTAGLI DELL'IMPIEGATO
  employee = toSignal(
    this.route.paramMap.pipe(  // Ottieni i parametri della route corrente per caricare i dettagli dell'impiegato
      switchMap(params =>
        this.userService.getUserById(params.get('id')!) // Carica i dettagli dell'impiegato utilizzando l'ID estratto dai parametri della route
      )
    ),
    {
      initialValue: undefined  // Valore iniziale per i dettagli dell'impiegato. undefined e non una stringa vuota, perché i dettagli sono un oggetto.
    }
  );


  //   Nel modello di Angular, i Signal si dividono in due categorie principali:
  // 1. Writable Signals (creati con signal()): rappresentano uno stato locale che puoi modificare direttamente usando .set(), .update(), o .asReadonly().
  // 2. Read-Only Signals (restituiti da computed() o toSignal()): rappresentano un valore che dipende da qualcos'altro. 
  // Non puoi forzarne il valore a mano, perché il loro compito è riflettere fedelmente la loro sorgente (in questo caso, il flusso del tuo Observable).


  }
  ```

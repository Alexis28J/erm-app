# COMMENTI

```TYPESCRIPT
export class EmployeeList {

  constructor() {

      effect(() => {  // effect aggiona la tabella ogni volta che cambia la lista filtrata degli impiegati
      
      this.dataSource.data = this.filteredEmployees();  // Aggiorna il datasource della tabella con la lista filtrata degli impiegati

    })

    // searchControl serve per aggiornare il segnale di ricerca ogni volta che l'utente digita qualcosa
    // valueChanges serve per rilevare ogni cambiamento nel campo di ricerca
    // In sintesi, ogni volta che l'utente digita qualcosa nel campo di ricerca, il segnale di ricerca viene aggiornato e di conseguenza la tabella mostra solo gli impiegati che corrispondono al termine di ricerca.


    this.searchControl.valueChanges.subscribe(value => {  // Aggiorno il segnale di ricerca ogni volta che il valore del controllo di ricerca cambia.
      this.search.set(value ?? '');  // Aggiorna il segnale di ricerca con il valore corrente del controllo di ricerca
    });
  }


  // ORDINA LA TABELLA IN BASE ALLA COLONNA SPECIFICATA
  @ViewChild(MatSort)
  set sort(sort: MatSort) {

    if (!sort) {
      return;
    }

    this.dataSource.sort = sort;

    this.dataSource.sortingDataAccessor = (item, property) => {

      switch (property) {
        case "code": return item.employeeCode;
        case "name": return item.name;
        case "email": return item.email;
        case "active": return item.active;
        default: return item[property as keyof User] as any;
      };

    };

    // Ordinamento iniziale
    this.dataSource.sort.active = 'name';
    this.dataSource.sort.direction = 'asc';
    this.dataSource.sort.sortChange.emit({
      active: 'name',
      direction: 'asc'
    });

  }


  // PAGINATORE DELLA TABELLA
  @ViewChild(MatPaginator)
  set paginator(paginator: MatPaginator) {  // Imposta il paginatore della tabella
    if (!paginator) {  // Se il paginatore non è disponibile, esci dal metodo
      return;
    }
    this.dataSource.paginator = paginator;  
  }


  // INIEZIONE DEL SERVIZIO USER  
  private userService = inject(UserService);
  private router = inject(Router)


  // CONTROLLO DI RICERCA
  searchControl = new FormControl(''); // Inizio una variabile per il controllo di ricerca. Lo inizio con una stringa vuota.
  //FormControl è un oggetto che rappresenta un singolo controllo di input nel modulo reattivo.


  // SEGNALE CHE CONTIENE LA LISTA DEGLI IMPIEGATI
  employees = toSignal(  // Variabile che conterrà la lista degli impiegati. Utilizzo toSignal per convertire l'Observable in un segnale.
    this.userService.getEmployees(),
    {
      initialValue: []  // Inizio con una lista vuota di impiegati.
    }
  );


  // SEGNALE DI RICERCA
  search = signal(''); // Segnale che conterrà il termine di ricerca corrente.


  // COMPUTED CHE RESTITUISCE LA LISTA FILTRATA DEGLI IMPIEGATI
  filteredEmployees = computed(() => { // Computed che restituisce la lista filtrata degli impiegati in base al termine di ricerca.

    const term = this.search().toLowerCase();  // Converto il termine di ricerca in minuscolo per il confronto case-insensitive.

    return this.employees().filter(employee =>  // Filtro gli impiegati in base al termine di ricerca.
      employee.name.toLowerCase().includes(term)  // Controllo se il nome dell'impiegato include il termine di ricerca.
      || employee.surname.toLowerCase().includes(term)  // Controllo se il cognome dell'impiegato include il termine di ricerca.
      || employee.email.toLowerCase().includes(term)  // Controllo se l'email dell'impiegato include il termine di ricerca.
    );

  });


  // COLONNE VISUALIZZATE NELLA TABLE
  displayedColumns = [
    'employeeCode',
    'name',
    'email',
    'active',
    'actions'
  ];


  // METODO PER DIRIGERSI ALLA PAGINA "DETTAGLI DEL DIPENDENTE"
  viewDetails(employeeId: string): void {
    this.router.navigate(['/hr/employee-details', employeeId])
  }

}
```
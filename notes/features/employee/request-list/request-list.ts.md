# COMMENTI:

Questo componente mostra la lista delle richieste di rimborso dell'utente corrente. 

Mostra le colonne: Mese di riferimento, Data di creazione, Stato, Importo richiesto e Importo approvato.

Utilizza il servizio AuthService per ottenere l'utente corrente e il servizio RefundRequestService per caricare le richieste di rimborso associate all'utente.

I dati vengono visualizzati in una tabella utilizzando il componente MatTable di Angular Material.


```TYPESCRIPT
export class RequestList {

  // COSTRUTTORE DEL COMPONENTE CHE INIZIALIZZA LA TABELLA DELLE RICHIESTE DI RIMBORSO
  constructor() {  // Il costruttore permette di inizializzare la tabella delle richieste di rimborso

    // EFFETTO CHE AGGIORNA LA TABELLA QUANDO LE RICHIESTE CAMBIANO
    effect(() => {   // effect è una funzione reattiva che esegue il codice al suo interno ogni volta che i segnali utilizzati cambiano

      this.dataSource.data =  // quindi aggiorna i dati della tabella con le richieste correnti
        this.requests();

    });  // Questo effetto si assicura che la tabella venga aggiornata ogni volta che le richieste cambiano ad esempio quando l'utente effettua una nuova richiesta o una richiesta esistente viene modificata

  }

  // INIEZIONE DEI SERVIZI
  private authService = inject(AuthService);
  private refundRequestService = inject(RefundRequestService);
  private router = inject(Router); // Servizio per la navigazione tra le pagine dell'applicazione


  // UTENTE CORRENTE E RICHIESTE DI RIMBORSO
  currentUser: User = this.authService.getCurrentUser()!; // Recupera l'utente corrente dal servizio di autenticazione
  // il simbolo "!" indica che ci aspettiamo che il valore non sia mai null o undefined


  // RICHIESTE DI RIMBORSO DELL'UTENTE CORRENTE
  requests = toSignal(  // Converte l'Observable restituito dal servizio getRequestsByUserId in un Signal, che è una rappresentazione reattiva dello stato delle richieste di rimborso dell'utente corrente
    this.refundRequestService
      .getRequestsByUserId(this.currentUser.id), // Prende le richieste di rimborso dell'utente corrente
    {
      initialValue: []  // Valore iniziale del Signal, utilizzato prima che l'Observable restituisca un valore
    }
  )


  // COLONNE DELLA TABELLA
  displayedColumns: string[] = [   // Colonne della tabella delle richieste di rimborso
    'referenceMonth',   // Ogni colonna rappresenta un attributo della richiesta di rimborso
    'creationDate',
    'status',
    'totalRequestedAmount',
    'totalApprovedAmount',
    'actions'
  ];


  // FONTE DATI PER LA TABELLA DELLE RICHIESTE DI RIMBORSO
  dataSource = new MatTableDataSource<RefundRequest>()  // Inizializza la fonte dati per la tabella delle richieste di rimborso
  // MatTableDataSource è una classe fornita da Angular Material per gestire i dati della tabella, quindi dataSource utilizza questa classe per mantenere e aggiornare i dati visualizzati nella tabella
  // In parole semplici, dataSource contiene i dati che vengono visualizzati nella tabella delle richieste di rimborso
  // Senza dataSource, la tabella non avrebbe alcun dato da visualizzare


  // METODO PER VISUALIZZARE I DETTAGLI DI UNA RICHIESTA DI RIMBORSO
  viewDetails(requestId: string): void {  
    this.router.navigate([
      '/employee/request-details',
      requestId
    ]);

  // Perché non utilizzare direttamente il routerLink nell'HTML invece di questo metodo?
  // Risposta: Utilizzare il routerLink direttamente nell'HTML è più semplice e leggibile,
  // ma questo metodo può essere utile se è necessario eseguire ulteriori logiche prima della navigazione.
  // Ad esempio, si potrebbe voler registrare un evento di analytics (cioè un tracking dell'azione dell'utente) prima della navigazione.
  }

}
```
# COMMENTI

```TYPESCRIPT
  // Questo componente rappresenta un editor di spese, che permette di visualizzare, aggiungere e rimuovere spese all'interno di un modulo reattivo.
  // Dal componente edit-request, questo componente riceve il modulo principale delle spese e le informazioni sulle spese stesse.

export class ExpenseEditor {

  // COSTRUTTORE DEL COMPONENTE CHE INIZIALIZZA L'EFFECT PER IL FOCUS DELLA CARD
  constructor() {

    // 2. L'effect monitora costantemente il Signal 'focusCard'
    effect(() => {
      
      const card = this.focusCard();

      // 3. IMPORTANTE: Controlla che card esista E che abbia il nativeElement
      // nativeElement è un riferimento all'elemento DOM effettivo e serve per impostare il focus correttamente
      // In sintesi, il controllo dice
      if (card && card.nativeElement) {  // Se card (il riferimento all'elemento DOM) esiste e ha un nativeElement (cioè l'elemento DOM effettivo),
        this.focusService.setCustomTarget(card);  // Imposta il focus sull'elemento card
      }
    })
  }

  private focusService = inject(FocusService);

  // private focusCard = viewChild.required<ElementRef<HTMLElement>>('focusCard'); 
  // Poiché l'elemento HTML da focalizzare si trova dentro un @if, non posso forzare il focus immediatamente alla creazione del componente. 
  // Devo aspettare che il rendering successivo sia completato.

  // 1. Definisco il viewChild SENZA .required() -> Ora restituisce ElementRef o undefined
  private focusCard = viewChild<ElementRef<HTMLElement>>('focusCard')



  // Il metodo input viene utilizzato per dichiarare le proprietà che riceveranno valori dall'esterno del componente
  // Il metodo output viene utilizzato per dichiarare gli eventi che il componente può emettere verso l'esterno


  // INPUTS
  // Form group per l'intero editor delle spese
  // Form array contiene i singoli gruppi di spesa
  form = input.required<FormGroup>();  // () indica che si sta chiamando il metodo required con il tipo FormGroup
  // In questo modo il componente può ricevere un oggetto FormGroup dall'esterno, che rappresenta il modulo principale delle spese.

  expenses = input.required<FormArray>();  // () indica che si sta chiamando il metodo required con il tipo FormArray
  // Cioè si sta dichiarando una proprietà chiamata expenses che riceverà un valore di tipo FormArray dall'esterno del componente


  expenseProgressData = input.required<any[]>();  // () indica che si sta chiamando il metodo required con il tipo any[]
  // any[] indica che si tratta di un array di elementi di tipo any cioè di qualsiasi tipo
  // Cioè si sta dichiarando una proprietà chiamata expenseProgressData che riceverà un valore di tipo any[] dall'esterno del componente


  expenseCategories = input.required<ExpenseLimit[]>();
  // expenseCategories contiene i limiti di spesa per ciascuna categoria


  // GETTER PER I GRUPPI DI SPESE
  get expenseGroups(): FormGroup[] {
    return this.expenses()
    .controls as FormGroup[];
  }


  // OUTPUTS
  addExpense = output<void>();  // () indica che si sta chiamando il metodo output con il tipo void
  // Cioè si sta dichiarando un evento chiamato addExpense che il componente può emettere verso l'esterno senza passare alcun valore (void)


  removeExpense = output<number>();  // () indica che si sta chiamando il metodo output con il tipo number
  // Cioè si sta dichiarando un evento chiamato removeExpense che il componente può emettere verso l'esterno passando un valore di tipo number
  

  filesSelected = output<{
    event: Event;
    index: number;
  }>();  // () indica che si sta chiamando il metodo output con il tipo specificato
  // Quindi quando il componente emette l'evento fileSelected, passerà un oggetto contenente sia l'evento di tipo Event che l'indice di tipo number
  // In questo modo il componente può comunicare all'esterno quale file è stato selezionato e a quale indice corrisponde nell'elenco delle spese


  removeAttachment = output<{
    expenseIndex: number;
    attachmentIndex: number;
  }>();  // () indica che si sta chiamando il metodo output con il tipo specificato
  // Cioè si sta dichiarando un evento chiamato removeAttachment che il componente può emettere verso l'esterno passando un oggetto contenente l'indice della spesa e l'indice dell'allegato da rimuovere
  // In questo modo il componente può comunicare all'esterno quale allegato deve essere rimosso e a quale spesa appartiene
}


  // METODO PER OTTENERE L'IMPORTO MASSIMO PER UNA CATEGORIA SPECIFICA
  // Restituisce l'importo massimo consentito per la categoria specificata nel parametro `categoryName`
  getMaxAmount(categoryName: string): number {

    return this.expenseCategories()
      .find(
        c => c.name === categoryName
      )?.maxAmount ?? 0;

  }

```
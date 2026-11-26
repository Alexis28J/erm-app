# COMMENTI

I file .spec.ts sono i file di test in cui vengono verificati i comportamenti dei componenti,servizi o facade dell'applicazione Angular.

## COMANDO PER ESEGUIRE I TEST DI UN FILE SPECIFICO
ng test --include="path del file"


```TYPESCRIPT
import { TestBed } from '@angular/core/testing';
import { ExcelExportService } from './excel-export.service';
import { vi } from 'vitest';
import { utils, writeFile } from 'xlsx';
import * as XLSX from 'xlsx';

// STRATEGIA
// Dobbiamo verificare che il service costruisca correttamente il file Excel.
// Non vogliamo creare davvero un file .xlsx durante i test.
// Quindi dobbiamo mockare xlsx.

// MOCK DELLA LIBRERIA XLSX (simuliamo le funzioni senza creare realmente file Excel)
vi.mock('xlsx', () => ({
  utils: {  // utils sono le funzioni di utilità di xlsx
    json_to_sheet: vi.fn(), // converte un array di oggetti JSON in un foglio Excel
    decode_range: vi.fn(),  // decodifica un intervallo di celle
    encode_cell: vi.fn(),   // codifica una cella
    book_new: vi.fn(),      // crea un nuovo workbook
    book_append_test: vi.fn(), // aggiunge un foglio al workbook creato
    book_append_sheet: vi.fn() // aggiunge un foglio al workbook esistente
  },
  writeFile: vi.fn()  // scrive il workbook su un file
}));


// MOCK DEGLI UTENTI
const mockUsers = [
  {
    id: '1',
    name: 'Mario',
    surname: 'Rossi',
    email: 'mario@test.it',
    active: true
  }
];


// MOCK DELLE RICHIESTE
const mockRequests = [
  {
    id: '1',
    userId: '1',
    referenceMonth: '2026-11-01',
    status: 'APPROVED',
    TotalRequestedAmount: 100,
    totalApprovedAmount: 80,
    creationDate: '2026-11-01',
    lastUpdateDate: '2026-11-02'
  }
];


describe('ExcelExportService', () => {

  let service: ExcelExportService;

  beforeEach(() => {

    TestBed.configureTestingModule({});

    service = TestBed.inject(ExcelExportService);

    vi.clearAllMocks(); // puliamo tutti i mock prima di ogni test

  });

  // Cos'è l'intervallo di celle?
  // L'intervallo di celle rappresenta l'area del foglio di calcolo che contiene i dati.
  // Viene definito da una cella iniziale (s: start) e una cella finale (e: end),
  // dove r indica la riga e c indica la colonna.
  // Ad esempio, s: { r: 0, c: 0 }, e: { r: 1, c: 6 } significa che l'intervallo va dalla cella A1 alla cella G2.
  // Perché G2 e non F2?
  // La colonna finale c: 6 corrisponde alla colonna G (A=0, B=1, ..., G=6).

  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  // TEST PER LA CREAZIONE DEL WORKSHEET
  // Questo test verifica che il servizio ExcelExportService sia in grado di creare correttamente un worksheet a partire dalle richieste mockate. 
  // Insomma cercare di simulare la creazione del worksheet come se facessimo:
  // const worksheet = XLSX.utils.json_to_sheet(mockRequests) 
  it('should create worksheet from requests', () => {

    // 1. Creiamo un mock del worksheet che verrà restituito da json_to_sheet (che simula un foglio Excel)
    const worksheet = { 
        '!ref': 'A1:G2', 
        D2: {},  // simuliamo una cella del worksheet
        E2: {}  // simuliamo un'altra cella del worksheet allo scopo di testare la codifica delle celle
         };  
    // '!ref' indica l'intervallo di celle del worksheet
    // 'A1:G2' indica l'intervallo di celle occupate nel worksheet
    // Allora '!ref': 'A1:G2' indica che il worksheet occupa le celle da A1 a G2

    // Non basta creare un mock del worksheet, dobbiamo anche fare il mock delle funzioni di XLSX che lo manipolano
    // come json_to_sheet, decode_range e encode_cell, altrimenti il test non saprebbe come comportarsi con il worksheet mockato
    // Se non facessimo il mock di queste funzioni, il test potrebbe fallire o comportarsi in modo imprevisto.


    // 2. Facciamo il mock della funzione json_to_sheet per restituire il worksheet creato (simulando la conversione di JSON in un foglio Excel)
    vi.mocked(
      XLSX.utils.json_to_sheet  // mock della funzione json_to_sheet di XLSX che converte un array di oggetti JSON in un foglio Excel
    ).mockReturnValue(
      worksheet as never // restituiamo il mock del worksheet creato da json_to_sheet 
      // as never è un cast per TypeScript che indica che stiamo forzando il tipo del valore restituito, 
      // ignorando il tipo atteso dalla funzione.
    );


    // 3. Facciamo il mock della funzione decode_range per restituire l'intervallo decodificato del worksheet (simulando la decodifica dell'intervallo di celle)
    // L'intervallo decodificato serve per determinare l'intervallo di celle nel worksheet mockato.
    vi.mocked(
      XLSX.utils.decode_range  // mock della funzione decode_range di XLSX che decodifica un intervallo di celle in un oggetto con start e end. Questo ci serve per simulare la decodifica dell'intervallo di celle del worksheet.
    ).mockReturnValue({
      s: { r: 0, c: 0 },  // start: indica la cella iniziale dell'intervallo (r: riga, c: colonna)
      e: { r: 1, c: 6 }  // end: indica la cella finale dell'intervallo (r: riga, c: colonna)
    });


    // 4. Facciamo il mock della funzione encode_cell per restituire la cella codificata come stringa (simulando la codifica di una cella in una stringa)
    // La funzione encode_cell serve per convertire le coordinate della cella in una stringa, 
    // utile per il worksheet mockato che utilizza le stringhe delle celle come chiavi.
    vi.mocked(
      XLSX.utils.encode_cell // mock della funzione encode_cell di XLSX che codifica una cella in una stringa (es. 'D2')
      // Questo ci serve per simulare la codifica di una cella in una stringa (es. 'D2')
    ).mockImplementation(({c}) => {  // Definiamo il comportamento della funzione mockata in base alla colonna 'c' della cella
      return c === 3 ? 'D2' : 'E2'; // Se la colonna è 3 restituiamo 'D2', altrimenti 'E2'
    }); // Quindi, siccome Vitest non esegue realmente la codifica delle celle, la finalità del punto 4 è simulare la codifica delle celle in stringhe specifiche per il test.

    // mockImplementation serve a definire o sostituire la logica interna di una funzione mock o spia, 
    // permettendoti di simulare un comportamento personalizzato durante i test invece di limitarti a restituire un valore statico.

    // Mentre metodi come mockReturnValue() restituiscono sempre lo stesso risultato fisso, mockImplementation() accetta una vera e propria funzione JavaScript che viene eseguita ogni volta che il mock viene invocato.

  });


  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  // TEST PER LA CREAZIONE DEL WORKBOOK (const workbook = XLSX.utils.book_new())
  // Questo test verifica che venga creato un nuovo workbook quando si esportano le richieste
  // Insomma cerca di simulare la creazione di un nuovo workbook e la conversione dei dati in un foglio Excel
  it('should create workbook', () => {
   

    // 1. Creiamo un mock del workbook che verrà restituito da book_new (che simula un nuovo workbook Excel)
    const workbook = {};   // {} indica un oggetto vuoto che simula il workbook Excel
    // Ma non basta creare manualmente un oggetto vuoto, dobbiamo anche fare il mock della funzione book_new per restituirlo
    // Questo ci permette di testare la funzione exportRequests senza dover creare un vero workbook Excel
    // Se non facessimo il mock di book_new, la funzione exportRequests potrebbe tentare di creare un vero workbook Excel, 
    // il che non è desiderabile nei test.


    // 2. Facciamo il mock della funzione book_new per restituire il workbook creato 
    // (simulando la creazione di un nuovo workbook Excel)
    vi.mocked(
      XLSX.utils.book_new
    ).mockReturnValue(
      workbook as never  // as never per castare il tipo altrimenti TypeScript potrebbe lamentarsi
    );  // grazie a book_new possiamo simulare la creazione di un nuovo workbook Excel 


    // 3. Facciamo il mock della funzione json_to_sheet per restituire un worksheet 
    // (simulando la conversione di JSON in un foglio Excel)
    vi.mocked(
      XLSX.utils.json_to_sheet
    ).mockReturnValue({
      '!ref': 'A1:G2'
    } as never);


    // 4. Facciamo il mock della funzione decode_range per restituire l'intervallo decodificato del worksheet 
    // (simulando la decodifica dell'intervallo di celle)
    vi.mocked(
      XLSX.utils.decode_range
    ).mockReturnValue({
      s: { r: 0, c: 0 },
      e: { r: 1, c: 6 }
    }); // L'intervallo decodificato del worksheet serve per determinare l'intervallo di celle da elaborare nel foglio Excel


    // 5. Chiamiamo la funzione exportRequests per verificare che venga creato il workbook e il worksheet simulati
    service.exportRequests(
      mockRequests as never,  // Passiamo i mock delle richieste come argomento
      mockUsers as never  // Passiamo i mock degli utenti come argomento
    );  // Quindi stiamo testando l'esportazione delle richieste con i mock dei dati


    // 6. Verifichiamo che la funzione book_new sia stata chiamata per creare il workbook
    expect(
      XLSX.utils.book_new  // book_new dovrebbe essere chiamato per creare un nuovo workbook Excel
    ).toHaveBeenCalled();  // toHaveBeenCalled verifica che la funzione book_new sia stata effettivamente chiamata
    // Potremmo anche verificare che json_to_sheet e decode_range siano stati chiamati con i dati corretti, se necessario

  });


  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  // TEST PER L'AGGIUNTA DEL WORKSHEET AL WORKBOOK (XLSX.utils.book_append_sheet)
  // Questo test verifica che il worksheet venga aggiunto correttamente al workbook. 
  // Per fare ciò, utilizziamo il mock del workbook e del worksheet creati in precedenza.
  it('should append worksheet to workbook', () => {

    // 1. Creiamo i mock del workbook e del worksheet che verranno utilizzati nel test
    const workbook = {};
    const worksheet = {
      '!ref': 'A1:G2'
    };

    // 2. Facciamo il mock delle funzioni book_new, json_to_sheet e decode_range per restituire i mock creati
    // Necessario per simulare la creazione del workbook e del worksheet senza interagire con il file system reale (file system del computer).
    // In questo modo, possiamo testare la funzione exportRequests senza creare effettivamente file Excel sul disco.
    vi.mocked(
      XLSX.utils.book_new
    ).mockReturnValue(
      workbook as never
    );
    

    // 3. Facciamo il mock della funzione json_to_sheet per restituire il worksheet simulato
    vi.mocked(
      XLSX.utils.json_to_sheet  // Mock della funzione json_to_sheet per restituire il worksheet simulato
    ).mockReturnValue(
      worksheet as never  // Mock del worksheet simulato castato come never per compatibilità con il tipo atteso
    );


    // 4. Facciamo il mock della funzione decode_range per restituire l'intervallo decodificato del worksheet 
    // (simulando la decodifica dell'intervallo di celle)
    vi.mocked(
      XLSX.utils.decode_range
    ).mockReturnValue({
      s: { r: 0, c: 0 },
      e: { r: 1, c: 6 }
    });
    // Siccome abbiamo fatto il mock di tutte le funzioni necessarie cioè book_new, json_to_sheet e decode_range, 
    // possiamo chiamare exportRequests senza interagire con il file system reale


    // 5. Chiamiamo la funzione exportRequests per verificare che il worksheet venga aggiunto al workbook
    service.exportRequests(  // Chiamata della funzione exportRequests con i mock dei dati delle richieste e degli utenti
      mockRequests as never, // Mock dei dati delle richieste
      mockUsers as never // Mock dei dati degli utenti
    );


    // 6. Verifichiamo che la funzione book_append_sheet sia stata chiamata con il workbook, 
    // il worksheet e il nome del foglio corretto
    expect(
      XLSX.utils.book_append_sheet
    ).toHaveBeenCalledWith(
      workbook,
      worksheet,
      'Requests'
    );

  });


  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  // TEST PER SALVATAGGIO DEL FILE EXCEL (XLSX.writeFile)
  // Questo test verifica che la funzione writeFile venga chiamata per salvare il file Excel generato
  // Insomma, questo test cerca di simulare il salvataggio del file Excel utilizzando la funzione writeFile
  it('should write excel file', () => {

    // 1. Facciamo il mock della funzione json_to_sheet per restituire un worksheet simulato
    vi.mocked(
      XLSX.utils.json_to_sheet
    ).mockReturnValue({
      '!ref': 'A1:G2'
    } as never);

    // 2. Facciamo il mock della funzione decode_range per restituire l'intervallo decodificato del worksheet
    // (simulando la decodifica dell'intervallo di celle)
    vi.mocked(
      XLSX.utils.decode_range
    ).mockReturnValue({
      s: { r: 0, c: 0 },  // Cella iniziale (A1)
      e: { r: 1, c: 6 }   // Cella finale (G2)
    });

    // 3. Chiamiamo la funzione exportRequests per generare il file Excel (simulando la creazione del file)
    service.exportRequests(
      mockRequests as never,  // Passiamo i mock delle richieste come argomento
      mockUsers as never  // Passiamo i mock degli utenti come argomento
    );

    // 4. Verifichiamo che la funzione writeFile sia stata chiamata per salvare il file Excel generato
    // (simulando il salvataggio del file)
    expect(
      XLSX.writeFile  
    ).toHaveBeenCalled();

  });

  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  // TEST PER ESPORTAZIONE DI LISTA DEI DIPENDENTI (exportEmployees)
  // Questo test verifica che la funzione exportEmployees generi correttamente un worksheet dai dati dei dipendenti
  // e che il file Excel venga salvato tramite la funzione writeFile.
  it('should export employees', () => {

    // 1. Facciamo il mock della funzione json_to_sheet per restituire un worksheet simulato
    vi.mocked(
      XLSX.utils.json_to_sheet
    ).mockReturnValue(
      {} as never  // Simuliamo un worksheet vuoto per il test
    );

    // 2. Facciamo il mock della funzione writeFile per simulare il salvataggio del file Excel
    service.exportEmployees(
      mockUsers as never  // Simuliamo i dati dei dipendenti per il test
    );


    // 3. Verifichiamo che le funzioni json_to_sheet e writeFile siano state chiamate correttamente
    expect(
      XLSX.utils.json_to_sheet  
    ).toHaveBeenCalled();


    // 4. Verifichiamo che la funzione writeFile sia stata chiamata per salvare il file Excel
    expect(
      XLSX.writeFile   // Simuliamo il salvataggio del file Excel
    ).toHaveBeenCalled();

  });

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  // TEST PER VERIFICARE LA TRASFORMAZIONE DEI DATI (mapRequestData)
  // Questo test verifica che la funzione exportRequests trasformi correttamente i dati delle richieste prima di generarne il worksheet.
  // Insomma, verifica che i dati passati al worksheet siano corretti.
  it('should map request data correctly', () => {

    // 1. Facciamo il mock della funzione json_to_sheet per restituire un worksheet simulato
    vi.mocked(
      XLSX.utils.json_to_sheet
    ).mockReturnValue({
      '!ref': 'A1:G2'
    } as never);


    // 2. Facciamo il mock della funzione decode_range per restituire l'intervallo decodificato del worksheet
    // (simulando la decodifica dell'intervallo di celle)
    vi.mocked(
      XLSX.utils.decode_range
    ).mockReturnValue({
      s: { r: 0, c: 0 },
      e: { r: 1, c: 6 }
    });


    // 3. Chiamiamo la funzione exportRequests per generare il file Excel (simulando la creazione del file)
    service.exportRequests(
      mockRequests as never,
      mockUsers as never
    );


    // 4. Recuperiamo i dati passati al worksheet per verificarne la correttezza
    // dataPassedToWorksheet contiene i dati trasformati che sono stati passati al worksheet tramite json_to_sheet
    const dataPassedToWorksheet = vi.mocked(
      XLSX.utils.json_to_sheet
    ).mock.calls[0][0];  // Recuperiamo il primo argomento passato alla prima chiamata di json_to_sheet (i dati trasformati) 
    // .mock.calls è un array che contiene tutte le chiamate effettuate alla funzione mockata.
    // Ogni elemento dell'array rappresenta una chiamata e contiene un array degli argomenti passati.
    // Quindi mock.calls[0][0] è il primo argomento della prima chiamata.
    // Il primo [0] indica la prima chiamata alla funzione mockata.
    // Il secondo [0] indica il primo argomento passato a quella chiamata.


    // 5. Verifichiamo che i dati passati al worksheet siano corretti
    expect(
      dataPassedToWorksheet[0].Employee  // [0] indica il primo elemento dell'array dei dati trasformati cioè la prima richiesta
    ).toBe('Mario Rossi');  // Quindi il primo elemento dell'array dei dati trasformati ha Employee uguale a 'Mario Rossi'


    // 6. Verifichiamo che l'importo richiesto e l'importo approvato siano corretti
    expect(
      dataPassedToWorksheet[0].Status  
    ).toBe('Approved');


    // 7. Verifichiamo che l'importo richiesto e l'importo approvato siano corretti
    expect(
      dataPassedToWorksheet[0].RequestedAmount
    ).toBe(100);


    // 8. Verifichiamo che l'importo approvato sia corretto
    expect(
      dataPassedToWorksheet[0].ApprovedAmount
    ).toBe(80);

  });

});
```


- vi.fn è una funzione di Vitest che crea un mock function, utile per intercettare e verificare le chiamate ai metodi durante i test.

Come funziona? 
Quando viene chiamata una funzione mockata con vi.fn, Vitest registra le chiamate e i parametri passati.
Questo permette di verificare se la funzione è stata chiamata, quante volte e con quali argomenti.


- it(...): è la funzione di Vitest che definisce un singolo unit test.
La stringa passata a it(...) descrive il comportamento atteso dal test.

- expect(...): è la funzione di Vitest che verifica che una condizione sia vera.

- toHaveBeenCalled(): è un matcher di Vitest che verifica che un mock sia stato chiamato almeno una volta.

- toBe(...): è un matcher di Vitest che verifica che il valore atteso sia uguale al valore ricevuto.

- Pattern AAA è un approccio comune nei test unitari che suddivide il test in tre fasi distinte: Arrange, Act e Assert.

1. Arrange: prepara l'ambiente di test, inizializza mock e dati necessari.

2. Act: esegue l'azione da testare (ad esempio chiamata a facade.saveDraft() o facade.submitRequest()).

3. Assert: verifica che il risultato sia quello atteso, utilizzando expect(...) e matcher come toBe(...) o toHaveBeenCalled().

Non sempre è necessario utilizzare tutti e tre i passaggi del pattern AAA, soprattutto nei test più semplici, ma è una buona pratica mantenerli separati per chiarezza e manutenzione del test.

- Quando il metodo delega a un altro servizio, è utile intercettare le chiamate ai mock per verificare che i dati passati siano corretti.
Quindi è necessario usare un mock per "spiare" (spy) le chiamate al servizio e verificare i dati passati, tramite .mock.calls (o toHaveBeenCalledWith).
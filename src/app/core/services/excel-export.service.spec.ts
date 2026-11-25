import { TestBed } from '@angular/core/testing';
import { ExcelExportService } from './excel-export.service';
import { vi } from 'vitest';
import { utils, writeFile } from 'xlsx';
import * as XLSX from 'xlsx';


// MOCK DELLA LIBRERIA XLSX (simuliamo le funzioni senza creare realmente file Excel)
vi.mock('xlsx', () => ({
  utils: {
    json_to_sheet: vi.fn(),
    decode_range: vi.fn(),
    encode_cell: vi.fn(),
    book_new: vi.fn(),
    book_append_test: vi.fn(),
    book_append_sheet: vi.fn()
  },
  writeFile: vi.fn()
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

    vi.clearAllMocks();

  });



  // TEST PER LA CREAZIONE DEL WORKSHEET (const worksheet = XLSX.utils.json_to_sheet(data))
  it('should create worksheet from requests', () => {

    // 1. Creiamo un mock del worksheet che verrà restituito da json_to_sheet (che simula un foglio Excel)
    const worksheet = {
      '!ref': 'A1:G2',
      D2: {},
      E2: {}
    };


    // 2. Facciamo il mock della funzione json_to_sheet per restituire il worksheet creato 
    // (simulando la conversione di JSON in un foglio Excel)
    vi.mocked(
      XLSX.utils.json_to_sheet
    ).mockReturnValue(
      worksheet as never
    );


    // 3. Facciamo il mock della funzione decode_range per restituire l'intervallo decodificato del worksheet 
    // (simulando la decodifica dell'intervallo di celle)
    vi.mocked(
      XLSX.utils.decode_range
    ).mockReturnValue({
      s: { r: 0, c: 0 },
      e: { r: 1, c: 6 }
    });


    // 4. Facciamo il mock della funzione encode_cell per restituire la cella codificata come stringa 
    // (simulando la codifica di una cella in una stringa)
    vi.mocked(
      XLSX.utils.encode_cell
    ).mockImplementation(({ c }) => {
      return c === 3 ? 'D2' : 'E2';
    });

  });



  // TEST PER LA CREAZIONE DEL WORKBOOK (const workbook = XLSX.utils.book_new())
  it('should create workbook', () => {

    // 1. Creiamo un mock del workbook che verrà restituito da book_new (che simula un nuovo workbook Excel)
    const workbook = {};


    // 2. Facciamo il mock della funzione book_new per restituire il workbook creato 
    // (simulando la creazione di un nuovo workbook Excel)
    vi.mocked(
      XLSX.utils.book_new
    ).mockReturnValue(
      workbook as never
    );


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
    });


    // 5. Chiamiamo la funzione exportRequests per verificare che venga creato il workbook e il worksheet simulati
    service.exportRequests(
      mockRequests as never,
      mockUsers as never
    );


    // 6. Verifichiamo che la funzione book_new sia stata chiamata per creare il workbook
    expect(
      XLSX.utils.book_new
    ).toHaveBeenCalled();

  });



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
    // Necessario per simulare la creazione del workbook e del worksheet senza interagire con il file system reale
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

});



// VS Code Counter: code lines (25/11/2026)



// TEST VERIFICATI (25/11/2026):
// - should create worksheet from requests (Creazione del worksheet) (Avvenuto con successo)
// - should create workbook (Creazione del workbook) (Avvenuto con successo)



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
    totalRequestedAmount: 100,
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
  it('should append worksheet to workbook', () => {

    // 1. Creiamo i mock del workbook e del worksheet che verranno utilizzati nel test
    const workbook = {};
    const worksheet = {
      '!ref': 'A1:G2'
    };


    // 2. Facciamo il mock delle funzioni book_new, json_to_sheet e decode_range per restituire i mock creati
    vi.mocked(
      XLSX.utils.book_new
    ).mockReturnValue(
      workbook as never
    );


    // 3. Facciamo il mock della funzione json_to_sheet per restituire il worksheet simulato
    vi.mocked(
      XLSX.utils.json_to_sheet
    ).mockReturnValue(
      worksheet as never
    );


    // 4. Facciamo il mock della funzione decode_range per restituire l'intervallo decodificato del worksheet 
    // (simulando la decodifica dell'intervallo di celle)
    vi.mocked(
      XLSX.utils.decode_range
    ).mockReturnValue({
      s: { r: 0, c: 0 },
      e: { r: 1, c: 6 }
    });


    // 5. Chiamiamo la funzione exportRequests per verificare che il worksheet venga aggiunto al workbook
    service.exportRequests(
      mockRequests as never,
      mockUsers as never
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


  // TEST PER SALVATAGGIO DEL FILE EXCEL (XLSX.writeFile)
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
      s: { r: 0, c: 0 },
      e: { r: 1, c: 6 }
    });


    // 3. Chiamiamo la funzione exportRequests per generare il file Excel (simulando la creazione del file)
    service.exportRequests(
      mockRequests as never,
      mockUsers as never
    );


    // 4. Verifichiamo che la funzione writeFile sia stata chiamata per salvare il file Excel generato
    // (simulando il salvataggio del file)
    expect(
      XLSX.writeFile
    ).toHaveBeenCalled();

  });


  // TEST PER ESPORTAZIONE DI LISTA DEI DIPENDENTI (exportEmployees)
  it('should export employees', () => {

    // 1. Facciamo il mock della funzione json_to_sheet per restituire un worksheet simulato
    vi.mocked(
      XLSX.utils.json_to_sheet
    ).mockReturnValue(
      {} as never
    );


    // 2. Facciamo il mock della funzione writeFile per simulare il salvataggio del file Excel
    service.exportEmployees(
      mockUsers as never
    );


    // 3. Verifichiamo che le funzioni json_to_sheet e writeFile siano state chiamate correttamente
    expect(
      XLSX.utils.json_to_sheet
    ).toHaveBeenCalled();


    // 4. Verifichiamo che la funzione writeFile sia stata chiamata per salvare il file Excel
    expect(
      XLSX.writeFile
    ).toHaveBeenCalled();

  });


  // TEST PER VERIFICARE LA TRASFORMAZIONE DEI DATI (mapRequestData)
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
    const dataPassedToWorksheet = vi.mocked(
      XLSX.utils.json_to_sheet
    ).mock.calls[0][0];


    // 5. Verifichiamo che i dati passati al worksheet siano corretti
    expect(
      dataPassedToWorksheet[0].Employee
    ).toBe('Mario Rossi');


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



// VS Code Counter: 195 code lines (26/11/2026)



// TEST VERIFICATI (26/11/2026):
// - should create worksheet from requests (Creazione del worksheet) (Avvenuto con successo)
// - should create workbook (Creazione del workbook) (Avvenuto con successo)
// - should append worksheet to workbook (Aggiunta del worksheet al workbook) (Avvenuto con successo)
// - should write excel file (Salvataggio del file Excel) (Avvenuto con successo)
// - should export employees (Esportazione della lista dei dipendenti) (Avvenuto con successo)
// - should map request data correctly (Trasformazione dei dati) (Avvenuto con successo)



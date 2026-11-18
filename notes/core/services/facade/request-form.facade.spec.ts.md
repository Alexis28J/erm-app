# COMMENTI

I file .spec.ts sono i file di test in cui vengono verificati i comportamenti dei componenti,servizi o facade dell'applicazione Angular.

## COMANDO PER ESEGUIRE I TEST DI UN FILE SPECIFICO
ng test --include="path del file"


```TYPESCRIPT
import { TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { vi, describe, beforeEach, it, expect } from 'vitest';
import { RequestFormFacade } from './request-form.facade';
import { AttachmentService } from '../attachment.service';
import { ExpenseCategoryName } from '../../interfaces/enum';
import { Expense } from '../../interfaces/expense';

describe('RequestFormFacade', () => {

  // let service: RequestFormFacade;  // cambio il nome della variabile da service a facade per maggiore chiarezza nel test
  let facade: RequestFormFacade;


  // Devo creare dei mock per i servizi utilizzati dal facade poiché non voglio utilizzare le implementazioni reali nei test
  // In questo modo posso testare il facade senza dipendere dalle implementazioni reali dei servizi


  // Mock for ActivatedRoute
  // Questo mock simula il comportamento di ActivatedRoute per i test del facade
  const activatedRouteMock = {
    snapshot: {  // Simula lo snapshot di ActivatedRoute
      data: {  // Simula i dati presenti nello snapshot di ActivatedRoute
        config: {  // Simula la configurazione presente nei dati di ActivatedRoute
          expenseLimits: [  // Simula i limiti di spesa presenti nella configurazione

            // Ho creato una configurazione finta per testare il metodo totalAllowedAmount 
            {              
              name: 'MEAL',    
              maxAmount: 30
            },
            {
              name: 'TRAIN',
              maxAmount: 50
            }

          ]  
        }
      }
    }
  };


  // Mock for AttachmentService
  const attachmentServiceMock = {
    fileToAttachment: vi.fn()  // Simula il metodo fileToAttachment di AttachmentService
  };


  // MODULO DI TEST E INIEZIONE DEL FACADE PRIMA DI OGNI TEST
  // beforeEach viene utilizzato per configurare il modulo di test e iniettare il facade prima di ogni test
  // Il suo nome deriva dal fatto che viene eseguito prima di ogni test definito con it()
  beforeEach(() => {
    TestBed.configureTestingModule({  // TestBed è un modulo di test fornito da Angular per configurare e creare l'ambiente di test
      providers: [  // Qui vengono forniti i servizi necessari per il test del facade, inclusi i mock
        RequestFormFacade,  // Indica che RequestFormFacade deve essere fornito come servizio nel modulo di test
        { provide: ActivatedRoute, useValue: activatedRouteMock }, // Utilizza il mock di ActivatedRoute invece dell'implementazione reale
        { provide: AttachmentService, useValue: attachmentServiceMock } // Utilizza il mock di AttachmentService invece dell'implementazione reale
        
        // provide indica che stiamo fornendo un servizio specifico nel modulo di test
        // useValue permette di specificare il valore da utilizzare al posto dell'implementazione reale
      ]
    });
    facade = TestBed.inject(RequestFormFacade);  // Inietta il facade dal modulo di test configurato
  });

  // // TEST PER VERIFICARE L'AGGIUNTA DI UNA NUOVA SPESA (METODO ADD EXPENSE)
  it('should add expense', () => {
    facade.addExpense();    // Chiama il metodo addExpense del facade per aggiungere una nuova spesa
    expect(facade.expenses.length).toBe(1); // Verifica che la lunghezza dell'array delle spese sia 1 dopo l'aggiunta
  });


  // // TEST PER VERIFICARE LA RIMOZIONE DI UNA SPESA (METODO REMOVE EXPENSE)
  it('should remove expense', () => {
    facade.addExpense(); // E' necessario aggiungere una spesa prima di poterla rimuovere
    facade.removeExpense(0); // Chiama il metodo removeExpense del facade per rimuovere la spesa appena aggiunta
    expect(facade.expenses.length).toBe(0); // Verifica che la lunghezza dell'array delle spese sia 0 dopo la rimozione
  });


  // // TEST PER VERIFICARE LA POPOLAZIONE DELLE SPESE (METODO POPULATE EXPENSES)
  // Il metodo populateExpenses() deve svuotare il FormArray e aggiungere le spese ricevute
  it('should populate expenses', () => {

    const expenses: Expense[] = [
      {
        id: '1',
        date: '2026-11-01',
        category: ExpenseCategoryName.MEAL,
        description: 'Pasta al pesto e frittata',
        requestedAmount: 10,
        approvedAmount: 0,
        attachments: []
      },
      {
        id: '2',
        date: '2026-11-02',
        category: ExpenseCategoryName.TRAIN,
        description: 'Andata e ritorno',
        requestedAmount: 30,
        approvedAmount: 0,
        attachments: []
      }
    ];

    facade.populateExpenses(expenses);

    expect(facade.expenses.length).toBe(2);  // Verifica che gli oggetti siano 2
    expect(facade.expenses.at(0).value.category).toBe(ExpenseCategoryName.MEAL);  // Verifica che la categoria della prima spesa sia MEAL
    expect(facade.expenses.at(1).value.category).toBe(ExpenseCategoryName.TRAIN);  // Verifica che la categoria della seconda spesa sia TRAIN
  })


  // TEST PER VERIFICARE LA VALIDAZIONE DEL FORM (validateForm)
  // Qui conviene fare più test per verificare la validazione del form

  // Caso 1: form completamente vuoto
  it('should return error when form is invalid', () => {

    const result = facade.validateForm();

    expect(result).toBe('Please fill in all required fields');

  });


  // Caso 2: referenceMonth compilato ma nessuna spesa
  // NOTA: Siccome referenceMonth è obbligatorio, il form sarà considerato invalido se non è compilato
  it('should require at least one expense', () => {

    facade.requestForm.patchValue({
      referenceMonth: '2026-11'
    });

    const result = facade.validateForm();

    expect(result).toBe('Please add at least one expense');

  });


  // Caso 3: form valido
  it('should return null when form is valid', () => {

    facade.requestForm.patchValue({
      referenceMonth: '2026-11'
    });

    facade.addExpense();

    facade.expenses.at(0).patchValue({
      date: '2026-11-01',
      category: ExpenseCategoryName.MEAL,
      requestedAmount: 100
    });

    const result = facade.validateForm();

    expect(result).toBeNull();

  });



  // TEST PER VERIFICARE LA SOMMA TOTALE DELLE SPESE RICHIESTE (totalRequestedAmount)
  // totalRequestedAmount() è un computed
  it('should calculate the total requested amount', () => {

    facade.populateExpenses([
      {
        id: '1',
        date: '2026-11-01',
        category: ExpenseCategoryName.MEAL,
        description: '',
        requestedAmount: 10,
        approvedAmount: 0,
        attachments: []
      },
      {
        id: '2',
        date: '2026-11-02',
        category: ExpenseCategoryName.TRAIN,
        description: '',
        requestedAmount: 30,
        approvedAmount: 0,
        attachments: []
      }
    ]);

    expect(facade.totalRequestedAmount()).toBe(40);
  });


  // TEST PER VERIFICARE LA SOMMA TOTALE DELLE SPESE AMMESSE (totalAllowedAmount)
  // Per testare totalAllowedAmount() devo creare delle spese con i loro importi massimi consentiti
  // perché il metodo usa: category.maxAmount e non il requestedAmount.
  it('should calculate total allowed amount', () => {
          facade.populateExpenses([
      {
        id: '1',
        date: '2026-11-01',
        category: ExpenseCategoryName.MEAL,
        description: '',
        requestedAmount: 10,
        approvedAmount: 0,
        attachments: []
      },
      {
        id: '2',
        date: '2026-11-02',
        category: ExpenseCategoryName.TRAIN,
        description: '',
        requestedAmount: 30,
        approvedAmount: 0,
        attachments: []
      }
    ]);

    expect(facade.totalAllowedAmount()).toBe(80);
  })

    
});
```
import { TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { vi, describe, beforeEach, it, expect } from 'vitest';
import { RequestFormFacade } from './request-form.facade';
import { AttachmentService } from '../attachment.service';
import { ExpenseCategoryName } from '../../interfaces/enum';
import { Expense } from '../../interfaces/expense';

describe('RequestFormFacade', () => {

  let facade: RequestFormFacade;


  // Mock for ActivatedRoute
  const activatedRouteMock = {
    snapshot: {
      data: {
        config: {
          expenseLimits: [
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
    fileToAttachment: vi.fn()
  };


  // MODULO DI TEST E INIEZIONE DEL FACADE PRIMA DI OGNI TEST
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        RequestFormFacade,
        { provide: ActivatedRoute, useValue: activatedRouteMock },
        { provide: AttachmentService, useValue: attachmentServiceMock }
      ]
    });
    facade = TestBed.inject(RequestFormFacade);
  });

  // // TEST PER VERIFICARE L'AGGIUNTA DI UNA NUOVA SPESA (METODO ADD EXPENSE)
  it('should add expense', () => {
    facade.addExpense();
    expect(facade.expenses.length).toBe(1);
  });


  // // TEST PER VERIFICARE LA RIMOZIONE DI UNA SPESA (METODO REMOVE EXPENSE)
  it('should remove expense', () => {
    facade.addExpense();
    facade.removeExpense(0);
    expect(facade.expenses.length).toBe(0);
  });


  // // TEST PER VERIFICARE LA POPOLAZIONE DELLE SPESE (METODO POPULATE EXPENSES)
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

    expect(facade.expenses.length).toBe(2);
    expect(facade.expenses.at(0).value.category).toBe(ExpenseCategoryName.MEAL);
    expect(facade.expenses.at(1).value.category).toBe(ExpenseCategoryName.TRAIN);
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
  // perché il metodo usa: category.maxAmount.
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



// VS Code Counter: 146 code lines (18/11/2026)



// TEST VERIFICATI (18/11/2026): 
// - 'should add a new expense' (addExpense)  (avvenuto con successo)
// - 'should remove expense' (removeExpense)  (avvenuto con successo)
// - 'should populate expenses' (populateExpenses)  (avvenuto con successo)
// - 'should return error when form is invalid' (validateForm. Caso 1)  (avvenuto con successo)
// - 'should require at least one expense' (validateForm. Caso 2)  (avvenuto con successo)
// - 'should return null when form is valid' (validateForm. Caso 3)  (avvenuto con successo)
// - 'should calculate the total requested amount' (totalRequestedAmount) (avvenuto con successo)
// - 'should calculate total allowed amount' (totalAllowedAmount) (avvenuto con successo)

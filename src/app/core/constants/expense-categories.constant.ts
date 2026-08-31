import { ExpenseCategory } from '../../core/interfaces/expense-category';
import { ExpenseCategoryName } from '../../core/interfaces/enum';


export const EXPENSE_CATEGORIES: ExpenseCategory[] = [
  {
    id: '1',
    name: ExpenseCategoryName.TAXI,
    maxAmount: 50,
    receiptRequired: true
  },
  {
    id: '2',
    name: ExpenseCategoryName.TRAIN,
    maxAmount: 200,
    receiptRequired: true
  },
  {
    id: '3',
    name: ExpenseCategoryName.BOARD,
    maxAmount: 70,
    receiptRequired: true
  },
  {
    id: '4',
    name: ExpenseCategoryName.HOTEL,
    maxAmount: 120,
    receiptRequired: true
  },
  {
    id: '5',
    name: ExpenseCategoryName.FUEL,
    maxAmount: 100,
    receiptRequired: true
  },
  {
    id: '6',
    name: ExpenseCategoryName.OTHER,
    maxAmount: 30,
    receiptRequired: false
  }
];



// Import definicji bazy danych
import type { Database } from "./db/database.types";

// DTO dla Expense (pełny rekord z bazy danych)
export type ExpenseDTO = Database["public"]["Tables"]["expenses"]["Row"];

// Command Model dla tworzenia Expense (używamy typu Insert z bazy)
export type CreateExpenseCommand = Database["public"]["Tables"]["expenses"]["Insert"];

// Command Model dla aktualizacji Expense (używamy typu Update z bazy)
export type UpdateExpenseCommand = Database["public"]["Tables"]["expenses"]["Update"];

// DTO dla Payment (pełny rekord z bazy danych)
export type PaymentDTO = Database["public"]["Tables"]["payments"]["Row"];

// Command Model dla tworzenia Payment (używamy typu Insert z bazy)
export type CreatePaymentCommand = Database["public"]["Tables"]["payments"]["Insert"];

// Command Model dla aktualizacji Payment (używamy typu Update z bazy)
export type UpdatePaymentCommand = Database["public"]["Tables"]["payments"]["Update"];

// Command Model dla tworzenia pierwszego miesiąca – zawiera tylko datę startu
export interface CreateFirstMonthCommand {
  start_date: string;
}

// DTO dla odpowiedzi po stworzeniu pierwszego miesiąca
export interface MonthDTO {
  month: string;
  // Lista wydatków powiązanych z danym miesiącem
  expenses: ExpenseDTO[];
}

// DTO dla odpowiedzi przy generowaniu nowego miesiąca
export interface NewMonthDTO {
  month: string;
  // Lista wygenerowanych wydatków dla nowego miesiąca
  generated_expenses: ExpenseDTO[];
}

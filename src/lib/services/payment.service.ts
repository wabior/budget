import type { SupabaseClient } from "../../db/supabase.client";
import type { CreatePaymentCommand, ExpenseDTO, PaymentDTO } from "../../types";

/**
 * Serwis obsługujący operacje na płatnościach
 */
export class PaymentService {
  constructor(private readonly supabase: SupabaseClient) {}

  /**
   * Generuje rekordy płatności dla nowo utworzonego wydatku
   * Logika generowania płatności zależy od typu i częstotliwości wydatku
   *
   * @param expense - Wydatek, dla którego generujemy płatności
   * @returns Lista utworzonych płatności lub błąd
   */
  async generatePaymentsForExpense(expense: ExpenseDTO): Promise<{
    data: PaymentDTO[] | null;
    error: Error | null;
  }> {
    try {
      // Przygotowujemy listę płatności do wygenerowania
      const paymentsToCreate: CreatePaymentCommand[] = [];

      // Logika generowania płatności w zależności od typu wydatku
      if (expense.type === "one_time") {
        // Dla wydatków jednorazowych generujemy jedną płatność na start_date
        const paymentDate = new Date(expense.start_date);
        // payment_month musi być pierwszym dniem miesiąca w formacie YYYY-MM-DD
        const paymentMonth = `${paymentDate.getFullYear()}-${String(paymentDate.getMonth() + 1).padStart(2, "0")}-01`;

        paymentsToCreate.push({
          user_id: expense.user_id,
          expense_id: expense.expense_id,
          payment_amount: expense.amount,
          payment_date: expense.start_date,
          payment_month: paymentMonth,
          paid_amount: 0,
          status: "unpaid", // zgodnie z memory: domyślny status to 'unpaid'
        });
      } else if (expense.type === "regular" || expense.type === "installment" || expense.type === "variable") {
        // Dla wydatków cyklicznych generujemy płatności zgodnie z częstotliwością
        const payments = this.generateRecurringPayments(
          expense.user_id,
          expense.expense_id,
          expense.amount,
          expense.start_date,
          expense.end_date,
          expense.frequency
        );
        paymentsToCreate.push(...payments);
      }

      // Jeśli nie ma płatności do utworzenia, zwracamy pustą tablicę
      if (paymentsToCreate.length === 0) {
        return {
          data: [],
          error: null,
        };
      }

      // Wstawiamy płatności do bazy danych
      const { data, error } = await this.supabase.from("payments").insert(paymentsToCreate).select();

      if (error) {
        console.error("Błąd podczas generowania płatności:", error);
        return {
          data: null,
          error: new Error(`Nie udało się wygenerować płatności: ${error.message}`),
        };
      }

      return {
        data: data as PaymentDTO[],
        error: null,
      };
    } catch (error) {
      console.error("Nieoczekiwany błąd podczas generowania płatności:", error);
      return {
        data: null,
        error: error instanceof Error ? error : new Error("Nieoczekiwany błąd podczas generowania płatności"),
      };
    }
  }

  /**
   * Generuje listę cyklicznych płatności na podstawie częstotliwości
   *
   * @param user_id - ID użytkownika
   * @param expense_id - ID wydatku
   * @param amount - Kwota płatności
   * @param start_date - Data rozpoczęcia
   * @param end_date - Data zakończenia (opcjonalna)
   * @param frequency - Częstotliwość w miesiącach (1-12)
   * @returns Lista płatności do utworzenia
   */
  private generateRecurringPayments(
    user_id: string,
    expense_id: number,
    amount: number,
    start_date: string,
    end_date: string | null,
    frequency: number
  ): CreatePaymentCommand[] {
    const payments: CreatePaymentCommand[] = [];

    // Jeśli częstotliwość = 0, nie generujemy cyklicznych płatności
    if (frequency === 0) {
      return payments;
    }

    const startDate = new Date(start_date);
    const endDate = end_date ? new Date(end_date) : null;

    // Generujemy płatności do końca roku lub do end_date
    const currentYear = startDate.getFullYear();
    const yearEnd = new Date(currentYear, 11, 31); // 31 grudnia obecnego roku
    const effectiveEndDate = endDate && endDate < yearEnd ? endDate : yearEnd;

    let currentDate = new Date(startDate);

    // Generujemy płatności co 'frequency' miesięcy
    while (currentDate <= effectiveEndDate) {
      const paymentDateStr = currentDate.toISOString().split("T")[0]; // Format YYYY-MM-DD
      // payment_month musi być pierwszym dniem miesiąca w formacie YYYY-MM-DD
      const paymentMonth = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, "0")}-01`;

      payments.push({
        user_id,
        expense_id,
        payment_amount: amount,
        payment_date: paymentDateStr,
        payment_month: paymentMonth,
        paid_amount: 0,
        status: "unpaid",
      });

      // Dodajemy 'frequency' miesięcy do currentDate
      currentDate = new Date(currentDate);
      currentDate.setMonth(currentDate.getMonth() + frequency);
    }

    return payments;
  }

  /**
   * Pobiera wszystkie płatności dla danego wydatku
   * @param expense_id - ID wydatku
   * @returns Lista płatności lub błąd
   */
  async getPaymentsByExpenseId(expense_id: number): Promise<{
    data: PaymentDTO[] | null;
    error: Error | null;
  }> {
    try {
      const { data, error } = await this.supabase
        .from("payments")
        .select()
        .eq("expense_id", expense_id)
        .order("payment_date", { ascending: true });

      if (error) {
        console.error("Błąd podczas pobierania płatności:", error);
        return {
          data: null,
          error: new Error(`Nie udało się pobrać płatności: ${error.message}`),
        };
      }

      return {
        data: data as PaymentDTO[],
        error: null,
      };
    } catch (error) {
      console.error("Nieoczekiwany błąd podczas pobierania płatności:", error);
      return {
        data: null,
        error: error instanceof Error ? error : new Error("Nieoczekiwany błąd podczas pobierania płatności"),
      };
    }
  }
}

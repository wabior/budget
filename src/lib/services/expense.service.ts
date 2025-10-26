import type { SupabaseClient } from "../../db/supabase.client";
import type { CreateExpenseCommand, ExpenseDTO } from "../../types";

/**
 * Serwis obsługujący operacje na wydatkach
 */
export class ExpenseService {
  constructor(private readonly supabase: SupabaseClient) {}

  /**
   * Tworzy nowy wydatek w bazie danych
   * @param command - Dane wydatku do utworzenia
   * @returns Utworzony wydatek lub błąd
   */
  async createExpense(command: CreateExpenseCommand): Promise<{
    data: ExpenseDTO | null;
    error: Error | null;
  }> {
    try {
      // Wstawiamy rekord do tabeli expenses
      const { data, error } = await this.supabase.from("expenses").insert(command).select().single();

      if (error) {
        console.error("Błąd podczas tworzenia wydatku:", error);
        return {
          data: null,
          error: new Error(`Nie udało się utworzyć wydatku: ${error.message}`),
        };
      }

      if (!data) {
        return {
          data: null,
          error: new Error("Nie zwrócono danych utworzonego wydatku"),
        };
      }

      return {
        data: data as ExpenseDTO,
        error: null,
      };
    } catch (error) {
      console.error("Nieoczekiwany błąd podczas tworzenia wydatku:", error);
      return {
        data: null,
        error: error instanceof Error ? error : new Error("Nieoczekiwany błąd podczas tworzenia wydatku"),
      };
    }
  }

  /**
   * Pobiera wydatek po ID
   * @param id - ID wydatku
   * @returns Wydatek lub błąd
   */
  async getExpenseById(id: string): Promise<{
    data: ExpenseDTO | null;
    error: Error | null;
  }> {
    try {
      const { data, error } = await this.supabase.from("expenses").select().eq("id", id).single();

      if (error) {
        console.error("Błąd podczas pobierania wydatku:", error);
        return {
          data: null,
          error: new Error(`Nie udało się pobrać wydatku: ${error.message}`),
        };
      }

      return {
        data: data as ExpenseDTO,
        error: null,
      };
    } catch (error) {
      console.error("Nieoczekiwany błąd podczas pobierania wydatku:", error);
      return {
        data: null,
        error: error instanceof Error ? error : new Error("Nieoczekiwany błąd podczas pobierania wydatku"),
      };
    }
  }
}

import type { APIRoute } from "astro";
import { DEFAULT_USER_ID } from "../../db/supabase.client";
import { CreateExpenseSchema } from "../../lib/validators/expense.validator";
import { ExpenseService } from "../../lib/services/expense.service";
import { PaymentService } from "../../lib/services/payment.service";

export const prerender = false;

/**
 * POST /api/expenses
 * Tworzy nowy wydatek i automatycznie generuje powiązane płatności
 */
export const POST: APIRoute = async ({ request, locals }) => {
  try {
    // 1. Pobranie danych z body żądania
    let body;
    try {
      body = await request.json();
    } catch {
      return new Response(
        JSON.stringify({
          error: "Nieprawidłowy format JSON",
          details: "Nie można sparsować treści żądania",
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // 2. Walidacja danych wejściowych
    const validationResult = CreateExpenseSchema.safeParse(body);

    if (!validationResult.success) {
      const errors = validationResult.error.errors.map((err) => ({
        path: err.path.join("."),
        message: err.message,
      }));

      return new Response(
        JSON.stringify({
          error: "Błąd walidacji danych",
          details: errors,
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const validatedData = validationResult.data;

    // 3. Pobranie klienta Supabase z context.locals
    const supabase = locals.supabase;

    if (!supabase) {
      return new Response(
        JSON.stringify({
          error: "Błąd konfiguracji serwera",
          details: "Brak klienta Supabase w kontekście",
        }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // 4. Przypisanie user_id (na razie DEFAULT_USER_ID, później z auth)
    // TODO: Po wdrożeniu autoryzacji zastąpić przez: const userId = context.locals.session?.user.id
    const expenseData = {
      ...validatedData,
      user_id: DEFAULT_USER_ID,
    };

    // 5. Utworzenie wydatku
    const expenseService = new ExpenseService(supabase);
    const { data: expense, error: expenseError } = await expenseService.createExpense(expenseData);

    if (expenseError || !expense) {
      return new Response(
        JSON.stringify({
          error: "Nie udało się utworzyć wydatku",
          details: expenseError?.message || "Nieznany błąd",
        }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // 6. Automatyczne generowanie płatności
    const paymentService = new PaymentService(supabase);
    const { data: payments, error: paymentsError } = await paymentService.generatePaymentsForExpense(expense);

    if (paymentsError) {
      // Logujemy błąd, ale nie przerywamy - wydatek został już utworzony
      console.error("Ostrzeżenie: Nie udało się wygenerować płatności:", paymentsError);

      return new Response(
        JSON.stringify({
          warning: "Wydatek utworzony, ale wystąpił problem z generowaniem płatności",
          expense,
          payments: [],
          error: paymentsError.message,
        }),
        {
          status: 201,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // 7. Zwrócenie sukcesu z utworzonym wydatkiem i płatnościami
    return new Response(
      JSON.stringify({
        message: "Wydatek utworzony pomyślnie",
        expense,
        payments: payments || [],
        payments_count: payments?.length || 0,
      }),
      {
        status: 201,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    // Obsługa nieoczekiwanych błędów
    console.error("Nieoczekiwany błąd w endpoint /api/expenses:", error);

    return new Response(
      JSON.stringify({
        error: "Wewnętrzny błąd serwera",
        details: error instanceof Error ? error.message : "Nieznany błąd",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
};

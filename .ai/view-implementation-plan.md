# API Endpoint Implementation Plan: Create Expense Endpoint

## 1. Przegląd punktu końcowego
Endpoint służy do tworzenia nowego rekordu wydatku. Po utworzeniu wydatku system automatycznie generuje powiązane rekordy płatności, co zapewnia integralność danych oraz eliminuje potrzebę ręcznego tworzenia płatności.

## 2. Szczegóły żądania
- **Metoda HTTP**: POST
- **Struktura URL**: /api/expenses
- **Parametry**:
  - **Wymagane**:
    - `user_id`: identyfikator użytkownika (UUID), pobierany z Supabase Auth
    - `name`: nazwa wydatku
    - `amount`: kwota wydatku (numeric)
    - `frequency`: częstotliwość (integer, wartość od 0 do 12; dla wydatków jednorazowych wartość 0)
    - `start_date`: data rozpoczęcia (format YYYY-MM-DD)
    - `status`: status wydatku (zgodny z typem ENUM: `active`, `completed`, `suspended`)
    - `type`: typ wydatku (zgodny z typem ENUM: `regular`, `one_time`, `installment`, `variable`)
  - **Opcjonalne**:
    - `end_date`: data zakończenia
    - `notes`: dodatkowe notatki
- **Przykład treści żądania**:
  ```json
  {
    "user_id": "UUID",
    "name": "Electricity Bill",
    "amount": 120.50,
    "frequency": 1,
    "start_date": "2025-10-01",
    "end_date": "2025-12-31",
    "status": "active",
    "notes": "Monthly bill",
    "type": "regular"
  }
  ```

## 3. Wykorzystywane typy
- **DTO**:
  - `ExpenseDTO` – reprezentuje pełny rekord wydatku pobrany z bazy
  - `PaymentDTO` – reprezentuje pełny rekord płatności pobrany z bazy
- **Command Modele**:
  - `CreateExpenseCommand` – dane wymagane do utworzenia nowego rekordu w tabeli `expenses`
  - `UpdateExpenseCommand` – dane do aktualizacji rekordu wydatku (używane przy modyfikacjach)

## 4. Przepływ danych
1. Odbiór żądania HTTP POST na endpoint `/api/expenses`.
2. Walidacja danych wejściowych wykorzystując bibliotekę Zod (lub inny walidator) w oparciu o zdefiniowane typy.
3. Autoryzacja – weryfikacja tokenu/sesji użytkownika przy użyciu Supabase Auth poprzez pobranie `user_id` z kontekstu.
4. Wywołanie funkcji serwisowej, np. `ExpenseService.createExpense(CreateExpenseCommand)`, odpowiedzialnej za:
   - Wstawienie rekordu do tabeli `expenses`
   - Automatyczne wygenerowanie powiązanych rekordów płatności poprzez wywołanie metody w `PaymentService` (np. `PaymentService.generatePaymentsForExpense(expense)`)
5. Zwrócenie odpowiedzi HTTP 201 Created wraz z pełnymi danymi nowo utworzonego wydatku (w tym datami `created_at` oraz `updated_at`).

## 5. Względy bezpieczeństwa
- **Uwierzytelnianie**: Weryfikacja, czy żądanie pochodzi od autoryzowanego użytkownika (np. poprzez token sesyjny lub inny mechanizm wykonywany w kontekście Supabase Auth).
- **Autoryzacja**: Sprawdzenie, czy `user_id` przekazany w żądaniu odpowiada aktualnie zalogowanemu użytkownikowi, aby uniemożliwić manipulację danymi innych użytkowników.
- **Walidacja danych**: Użycie Zod do sprawdzenia poprawności formatu, zakresu wartości (np. częstotliwość między 0 a 12) oraz integralności przekazanych danych.

## 6. Obsługa błędów
- **400 Bad Request**: Zwrot w przypadku błędów walidacyjnych lub niekompletnych/niepoprawnych danych wejściowych.
- **401 Unauthorized**: Zwrot, gdy użytkownik nie jest autoryzowany lub `user_id` nie odpowiada zalogowanemu użytkownikowi.
- **500 Internal Server Error**: Zwrot w przypadku nieprzewidzianych błędów (np. błędy bazy danych, wyjątki w logice biznesowej).
- Dodatkowo, logowanie błędów (np. do systemu monitoringu lub pliku logów) w celu ich późniejszej analizy.

## 7. Wydajność
- Upewnienie się, że tabele posiadają odpowiednie indeksy (szczególnie dla kluczy obcych `user_id`, `expense_id`), co przyspieszy operacje wstawiania i wyszukiwania.
- Optymalizacja zapytań SQL, szczególnie dotyczących automatycznego generowania rekordów w tabeli `payments`.
- Wykorzystanie operacji asynchronicznych do obsługi połączeń z bazą, co zwiększy responsywność endpointu.

## 8. Etapy implementacji
1. **Walidacja danych**:
   - Utworzenie walidatora danych wejściowych przy użyciu Zod (np. stworzenie schematu `ExpenseSchema`).
2. **Implementacja logiki biznesowej**:
   - Utworzenie/rozszerzenie serwisu `ExpenseService` o metodę `createExpense`, która będzie realizowała wstawienie danych do tabeli `expenses`.
   - Implementacja logiki generowania płatności w dedykowanym serwisie `PaymentService` (np. metoda `generatePaymentsForExpense`), która przyjmuje utworzony rekord wydatku i generuje powiązane rekordy w tabeli `payments`.
3. **Uwierzytelnianie i autoryzacja**:
   - Integracja mechanizmu uwierzytelniania opartego na Supabase Auth poprzez pobieranie informacji o użytkowniku z `context.locals`.
   - Weryfikacja zgodności `user_id` w żądaniu z identyfikatorem aktualnie zalogowanego użytkownika.
4. **Implementacja endpointu**:
   - Utworzenie pliku API w katalogu `/src/pages/api` (np. `/src/pages/api/expenses.ts`), który obsłuży metodę POST.
   - Przekazanie danych do serwisów `ExpenseService` oraz `PaymentService`.
5. **Obsługa błędów oraz logowanie**:
   - Zaimplementowanie mechanizmu obsługi wyjątków, który przechwyci i odpowiednio zareaguje na błędy walidacyjne, autoryzacyjne oraz błędy serwera.
   - Implementacja systemu logowania krytycznych błędów.

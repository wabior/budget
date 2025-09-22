# Schemat bazy danych

## 1. Tabele

### 1.1. `users` (Supabase Auth)

This table is managed by Supabase Auth.

- id: UUID PRIMARY KEY
- email: VARCHAR(255) NOT NULL UNIQUE
- encrypted_password: VARCHAR NOT NULL
- created_at: TIMESTAMPTZ NOT NULL DEFAULT now()
- confirmed_at: TIMESTAMPTZ

**UWAGA:** Nie twórz tej tabeli ręcznie - Supabase Auth automatycznie zarządza tabelą `auth.users`. W kodzie aplikacji odwołuj się do `auth.users` lub używaj funkcji `auth.uid()` do pobierania ID bieżącego użytkownika.

### 1.2. `expenses`

```sql
-- Definicje typów ENUM dla statusu i typu wydatku
CREATE TYPE expense_status AS ENUM ('active', 'completed', 'suspended');
CREATE TYPE expense_type AS ENUM ('regular', 'one_time', 'installment', 'variable');

CREATE TABLE expenses (
    expense_id SERIAL PRIMARY KEY,
    user_id uuid NOT NULL,
    name TEXT NOT NULL,
    amount NUMERIC NOT NULL,
    frequency INTEGER NOT NULL CHECK (frequency BETWEEN 0 AND 12),
    start_date DATE NOT NULL,
    end_date DATE,
    status expense_status NOT NULL,
    notes TEXT,
    type expense_type NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    CHECK (type <> 'one_time' OR frequency = 0),
    CONSTRAINT fk_expenses_user FOREIGN KEY (user_id) REFERENCES auth.users(id)
);
```

### 1.3. `payments`

```sql
-- Definicja typu ENUM dla statusu płatności
CREATE TYPE payment_status AS ENUM ('unpaid', 'paid');

CREATE TABLE payments (
    payment_id SERIAL PRIMARY KEY,
    expense_id INTEGER NOT NULL,
    user_id uuid NOT NULL,
    payment_amount NUMERIC NOT NULL,
    paid_amount NUMERIC DEFAULT 0 NOT NULL,
    payment_date DATE NOT NULL,
    payment_month DATE NOT NULL, -- Określa miesiąc płatności (np. pierwszy dzień miesiąca)
    status payment_status NOT NULL DEFAULT 'unpaid',
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    CONSTRAINT fk_payments_expense FOREIGN KEY (expense_id) REFERENCES expenses(expense_id),
    CONSTRAINT fk_payments_user FOREIGN KEY (user_id) REFERENCES auth.users(id)
);
```

## 2. Relacje między tabelami

- `auth.users` 1:N `expenses` – każdy wydatek należy do jednego użytkownika.
- `auth.users` 1:N `payments` – każda płatność należy do jednego użytkownika.
- `expenses` 1:N `payments` – dla każdego wydatku może być wiele płatności.

## 3. Indeksy

```sql
-- Indeksy dla tabeli expenses
CREATE INDEX idx_expenses_user_id ON expenses(user_id);

-- Indeksy dla tabeli payments
CREATE INDEX idx_payments_user_id ON payments(user_id);
CREATE INDEX idx_payments_expense_id ON payments(expense_id);
CREATE INDEX idx_payments_user_expense_month ON payments(user_id, expense_id, payment_month);
CREATE INDEX idx_payments_user_month ON payments(user_id, payment_month);
CREATE INDEX idx_payments_expense_month ON payments(expense_id, payment_month);
CREATE INDEX idx_payments_user_expense ON payments(user_id, expense_id);
```

## 4. Zasady PostgreSQL (RLS)

```sql
-- Włączenie RLS dla tabeli expenses
ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;
CREATE POLICY user_expenses_policy ON expenses
    USING (user_id = auth.uid());

-- Włączenie RLS dla tabeli payments
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
CREATE POLICY user_payments_policy ON payments
    USING (user_id = auth.uid());
```

## 5. Dodatkowe uwagi

- Ograniczenie CHECK w tabeli `expenses` zapewnia, że dla wydatków typu `one_time` wartość `frequency` wynosi 0.
- Przykładowe polityki RLS (Row Level Security) wymagają, aby identyfikator bieżącego użytkownika był pobierany za pomocą `auth.uid()` (integracja z Supabase Auth).

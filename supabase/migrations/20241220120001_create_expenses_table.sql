-- Migration: Create expenses table
-- Description: Create expenses table with indexes and constraints
-- Dependencies: 20241220120000_create_enums.sql, auth.users table
-- Created: 2024-12-20

-- Enable UUID extension for user IDs
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create expenses table
CREATE TABLE expenses (
    expense_id SERIAL PRIMARY KEY,
    user_id uuid NOT NULL,
    name TEXT NOT NULL,
    amount NUMERIC NOT NULL CHECK (amount > 0),
    frequency INTEGER NOT NULL CHECK (frequency BETWEEN 0 AND 12),
    start_date DATE NOT NULL,
    end_date DATE,
    status expense_status NOT NULL DEFAULT 'active',
    notes TEXT,
    type expense_type NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    
    -- Business logic constraints
    CHECK (type <> 'one_time' OR frequency = 0),
    CHECK (end_date IS NULL OR end_date >= start_date),
    
    -- Foreign key constraints
    CONSTRAINT fk_expenses_user FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Create indexes for performance optimization
CREATE INDEX idx_expenses_user_id ON expenses(user_id);
CREATE INDEX idx_expenses_status ON expenses(status);
CREATE INDEX idx_expenses_type ON expenses(type);
CREATE INDEX idx_expenses_start_date ON expenses(start_date);

-- Add table and column comments for documentation
COMMENT ON TABLE expenses IS 'Tabela wydatków użytkowników z różnymi typami i częstotliwością płatności';
COMMENT ON COLUMN expenses.expense_id IS 'Unikalny identyfikator wydatku';
COMMENT ON COLUMN expenses.user_id IS 'ID użytkownika (odwołanie do auth.users)';
COMMENT ON COLUMN expenses.name IS 'Nazwa wydatku';
COMMENT ON COLUMN expenses.amount IS 'Kwota wydatku (musi być większa od 0)';
COMMENT ON COLUMN expenses.frequency IS 'Częstotliwość płatności w miesiącach (0 = jednorazowo, 1-12 = miesięcznie)';
COMMENT ON COLUMN expenses.start_date IS 'Data rozpoczęcia wydatku';
COMMENT ON COLUMN expenses.end_date IS 'Data zakończenia wydatku (opcjonalna)';
COMMENT ON COLUMN expenses.status IS 'Status wydatku (active, completed, suspended)';
COMMENT ON COLUMN expenses.notes IS 'Dodatkowe notatki do wydatku';
COMMENT ON COLUMN expenses.type IS 'Typ wydatku (regular, one_time, installment, variable)';
COMMENT ON COLUMN expenses.created_at IS 'Data utworzenia rekordu';
COMMENT ON COLUMN expenses.updated_at IS 'Data ostatniej aktualizacji rekordu';

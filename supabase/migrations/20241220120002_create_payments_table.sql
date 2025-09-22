-- Migration: Create payments table
-- Description: Create payments table with indexes and constraints
-- Dependencies: 20241220120000_create_enums.sql, 20241220120001_create_expenses_table.sql, auth.users table
-- Created: 2024-12-20

-- Create payments table
CREATE TABLE payments (
    payment_id SERIAL PRIMARY KEY,
    expense_id INTEGER NOT NULL,
    user_id uuid NOT NULL,
    payment_amount NUMERIC NOT NULL CHECK (payment_amount > 0),
    paid_amount NUMERIC DEFAULT 0 NOT NULL CHECK (paid_amount >= 0),
    payment_date DATE NOT NULL,
    payment_month DATE NOT NULL, -- First day of payment month
    status payment_status NOT NULL DEFAULT 'unpaid',
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    
    -- Business logic constraints
    CHECK (paid_amount <= payment_amount),
    
    -- Foreign key constraints
    CONSTRAINT fk_payments_expense FOREIGN KEY (expense_id) REFERENCES expenses(expense_id) ON DELETE CASCADE,
    CONSTRAINT fk_payments_user FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Create indexes for performance optimization
CREATE INDEX idx_payments_user_id ON payments(user_id);
CREATE INDEX idx_payments_expense_id ON payments(expense_id);
CREATE INDEX idx_payments_user_expense_month ON payments(user_id, expense_id, payment_month);
CREATE INDEX idx_payments_user_month ON payments(user_id, payment_month);
CREATE INDEX idx_payments_expense_month ON payments(expense_id, payment_month);
CREATE INDEX idx_payments_user_expense ON payments(user_id, expense_id);
CREATE INDEX idx_payments_status ON payments(status);
CREATE INDEX idx_payments_payment_date ON payments(payment_date);

-- Add table and column comments for documentation
COMMENT ON TABLE payments IS 'Tabela płatności dla wydatków z możliwością częściowych wpłat';
COMMENT ON COLUMN payments.payment_id IS 'Unikalny identyfikator płatności';
COMMENT ON COLUMN payments.expense_id IS 'ID wydatku (odwołanie do expenses)';
COMMENT ON COLUMN payments.user_id IS 'ID użytkownika (odwołanie do auth.users)';
COMMENT ON COLUMN payments.payment_amount IS 'Wymagana kwota płatności (musi być większa od 0)';
COMMENT ON COLUMN payments.paid_amount IS 'Faktycznie opłacona kwota (może być mniejsza niż payment_amount)';
COMMENT ON COLUMN payments.payment_date IS 'Data płatności';
COMMENT ON COLUMN payments.payment_month IS 'Miesiąc płatności (pierwszy dzień miesiąca)';
COMMENT ON COLUMN payments.status IS 'Status płatności (unpaid, paid)';
COMMENT ON COLUMN payments.created_at IS 'Data utworzenia rekordu';
COMMENT ON COLUMN payments.updated_at IS 'Data ostatniej aktualizacji rekordu';

-- Migration: Create triggers for automatic timestamp updates
-- Description: Create function and triggers to automatically update updated_at column
-- Dependencies: 20241220120001_create_expenses_table.sql, 20241220120002_create_payments_table.sql
-- Created: 2024-12-20

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers to automatically update updated_at column
CREATE TRIGGER update_expenses_updated_at
    BEFORE UPDATE ON expenses
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_payments_updated_at
    BEFORE UPDATE ON payments
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Add comments for documentation
COMMENT ON FUNCTION update_updated_at_column() IS 'Funkcja automatycznie aktualizująca kolumnę updated_at przy każdej zmianie rekordu';
COMMENT ON TRIGGER update_expenses_updated_at ON expenses IS 'Trigger automatycznie aktualizujący updated_at w tabeli expenses';
COMMENT ON TRIGGER update_payments_updated_at ON payments IS 'Trigger automatycznie aktualizujący updated_at w tabeli payments';

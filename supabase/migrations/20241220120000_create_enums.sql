-- Migration: Create ENUM types for budget application
-- Description: Create custom ENUM types for expense status, type and payment status
-- Dependencies: None
-- Created: 2024-12-20

-- Create ENUM types for expense and payment statuses
CREATE TYPE expense_status AS ENUM ('active', 'completed', 'suspended');
CREATE TYPE expense_type AS ENUM ('regular', 'one_time', 'installment', 'variable');
CREATE TYPE payment_status AS ENUM ('unpaid', 'paid');

-- Add comments for documentation
COMMENT ON TYPE expense_status IS 'Status wydatku: active (aktywny), completed (zakończony), suspended (zawieszony)';
COMMENT ON TYPE expense_type IS 'Typ wydatku: regular (regularny), one_time (jednorazowy), installment (ratalny), variable (zmienny)';
COMMENT ON TYPE payment_status IS 'Status płatności: unpaid (nieopłacona), paid (opłacona)';

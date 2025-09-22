-- Migration: Enable RLS and create security policies
-- Description: Enable Row Level Security and create policies for expenses and payments tables
-- Dependencies: 20241220120001_create_expenses_table.sql, 20241220120002_create_payments_table.sql
-- Created: 2024-12-20

-- Enable Row Level Security (RLS) on all tables
ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for expenses table
-- Policy for authenticated users to select their own expenses
CREATE POLICY expenses_select_policy ON expenses
    FOR SELECT
    TO authenticated
    USING (user_id = auth.uid());

-- Policy for authenticated users to insert their own expenses
CREATE POLICY expenses_insert_policy ON expenses
    FOR INSERT
    TO authenticated
    WITH CHECK (user_id = auth.uid());

-- Policy for authenticated users to update their own expenses
CREATE POLICY expenses_update_policy ON expenses
    FOR UPDATE
    TO authenticated
    USING (user_id = auth.uid())
    WITH CHECK (user_id = auth.uid());

-- Policy for authenticated users to delete their own expenses
CREATE POLICY expenses_delete_policy ON expenses
    FOR DELETE
    TO authenticated
    USING (user_id = auth.uid());

-- Create RLS policies for payments table
-- Policy for authenticated users to select their own payments
CREATE POLICY payments_select_policy ON payments
    FOR SELECT
    TO authenticated
    USING (user_id = auth.uid());

-- Policy for authenticated users to insert their own payments
CREATE POLICY payments_insert_policy ON payments
    FOR INSERT
    TO authenticated
    WITH CHECK (user_id = auth.uid());

-- Policy for authenticated users to update their own payments
CREATE POLICY payments_update_policy ON payments
    FOR UPDATE
    TO authenticated
    USING (user_id = auth.uid())
    WITH CHECK (user_id = auth.uid());

-- Policy for authenticated users to delete their own payments
CREATE POLICY payments_delete_policy ON payments
    FOR DELETE
    TO authenticated
    USING (user_id = auth.uid());

-- Add comments explaining the security policies
COMMENT ON POLICY expenses_select_policy ON expenses IS 'Użytkownicy mogą wyświetlać tylko swoje wydatki';
COMMENT ON POLICY expenses_insert_policy ON expenses IS 'Użytkownicy mogą dodawać tylko wydatki do swojego konta';
COMMENT ON POLICY expenses_update_policy ON expenses IS 'Użytkownicy mogą aktualizować tylko swoje wydatki';
COMMENT ON POLICY expenses_delete_policy ON expenses IS 'Użytkownicy mogą usuwać tylko swoje wydatki';

COMMENT ON POLICY payments_select_policy ON payments IS 'Użytkownicy mogą wyświetlać tylko swoje płatności';
COMMENT ON POLICY payments_insert_policy ON payments IS 'Użytkownicy mogą dodawać tylko płatności do swojego konta';
COMMENT ON POLICY payments_update_policy ON payments IS 'Użytkownicy mogą aktualizować tylko swoje płatności';
COMMENT ON POLICY payments_delete_policy ON payments IS 'Użytkownicy mogą usuwać tylko swoje płatności';

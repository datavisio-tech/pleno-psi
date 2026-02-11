-- 004_add_persons_address_id.sql
-- Garante que a tabela addresses existe e que persons possui address_id com FK

CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS addresses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  street text NOT NULL,
  number text,
  city text NOT NULL,
  state text NOT NULL,
  zip_code text,
  country text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Add column if missing
ALTER TABLE persons ADD COLUMN IF NOT EXISTS address_id uuid;

-- Add FK constraint if not exists
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints tc
    JOIN information_schema.key_column_usage kcu ON tc.constraint_name = kcu.constraint_name
    WHERE tc.table_name = 'persons' AND tc.constraint_type = 'FOREIGN KEY' AND kcu.column_name = 'address_id'
  ) THEN
    ALTER TABLE persons
      ADD CONSTRAINT persons_address_id_fkey FOREIGN KEY (address_id) REFERENCES addresses(id) ON DELETE SET NULL ON UPDATE CASCADE;
  END IF;
END$$;

-- Index for address_id
CREATE INDEX IF NOT EXISTS idx_persons_address_id ON persons(address_id);

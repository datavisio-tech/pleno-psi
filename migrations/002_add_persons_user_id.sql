-- 002_add_persons_user_id.sql
-- Garante que a coluna user_id exista em persons e adiciona FK para users
BEGIN;

ALTER TABLE persons ADD COLUMN IF NOT EXISTS user_id uuid;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'fk_persons_user_id'
  ) THEN
    ALTER TABLE persons
      ADD CONSTRAINT fk_persons_user_id FOREIGN KEY (user_id)
      REFERENCES users(id) ON DELETE SET NULL ON UPDATE CASCADE;
  END IF;
END
$$;

COMMIT;

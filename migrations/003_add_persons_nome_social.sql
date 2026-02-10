-- 003_add_persons_nome_social.sql
-- Garante que a coluna nome_social exista na tabela persons
BEGIN;

ALTER TABLE persons ADD COLUMN IF NOT EXISTS nome_social text;

COMMIT;

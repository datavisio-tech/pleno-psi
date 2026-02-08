-- 001_initial.sql
-- Inicial: criar extensão e tabelas básicas conforme ER

-- Extensão para geração de UUID
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Addresses
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

-- Persons
CREATE TABLE IF NOT EXISTS persons (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name text NOT NULL,
  cpf varchar(14) UNIQUE,
  email text UNIQUE,
  phone text,
  birth_date date,
  gender text,
  created_at timestamptz DEFAULT now()
);

-- Users
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  password_hash text NOT NULL,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Clinics
CREATE TABLE IF NOT EXISTS clinics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  legal_name text,
  cnpj varchar(20) UNIQUE,
  address_id uuid REFERENCES addresses(id) ON DELETE SET NULL ON UPDATE CASCADE,
  subscription_id uuid,
  created_at timestamptz DEFAULT now()
);

-- Clinic users (admins/roles)
CREATE TABLE IF NOT EXISTS clinic_users (
  clinic_id uuid NOT NULL REFERENCES clinics(id) ON DELETE CASCADE ON UPDATE CASCADE,
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE,
  role text NOT NULL,
  PRIMARY KEY (clinic_id, user_id)
);

-- Professionals
CREATE TABLE IF NOT EXISTS professionals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  person_id uuid NOT NULL REFERENCES persons(id) ON DELETE CASCADE ON UPDATE CASCADE,
  professional_license text,
  specialty text,
  price numeric,
  created_at timestamptz DEFAULT now()
);

-- Clinic professionals (N:N)
CREATE TABLE IF NOT EXISTS clinic_professionals (
  clinic_id uuid NOT NULL REFERENCES clinics(id) ON DELETE CASCADE ON UPDATE CASCADE,
  professional_id uuid NOT NULL REFERENCES professionals(id) ON DELETE CASCADE ON UPDATE CASCADE,
  active boolean DEFAULT true,
  PRIMARY KEY (clinic_id, professional_id)
);

-- Patients
CREATE TABLE IF NOT EXISTS patients (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  person_id uuid NOT NULL REFERENCES persons(id) ON DELETE CASCADE ON UPDATE CASCADE,
  created_at timestamptz DEFAULT now()
);

-- Legal responsibles
CREATE TABLE IF NOT EXISTS legal_responsibles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  person_id uuid NOT NULL REFERENCES persons(id) ON DELETE CASCADE ON UPDATE CASCADE,
  billing_address_id uuid REFERENCES addresses(id) ON DELETE SET NULL ON UPDATE CASCADE
);

-- Patient responsibles (N:N)
CREATE TABLE IF NOT EXISTS patient_responsibles (
  patient_id uuid NOT NULL REFERENCES patients(id) ON DELETE CASCADE ON UPDATE CASCADE,
  legal_responsible_id uuid NOT NULL REFERENCES legal_responsibles(id) ON DELETE CASCADE ON UPDATE CASCADE,
  type text NOT NULL,
  PRIMARY KEY (patient_id, legal_responsible_id)
);

-- Appointments
CREATE TABLE IF NOT EXISTS appointments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  clinic_id uuid NOT NULL REFERENCES clinics(id) ON DELETE CASCADE ON UPDATE CASCADE,
  patient_id uuid NOT NULL REFERENCES patients(id) ON DELETE CASCADE ON UPDATE CASCADE,
  professional_id uuid NOT NULL REFERENCES professionals(id) ON DELETE CASCADE ON UPDATE CASCADE,
  start_time timestamptz NOT NULL,
  end_time timestamptz NOT NULL,
  status text NOT NULL,
  price numeric,
  created_at timestamptz DEFAULT now()
);

-- Subscription plans
CREATE TABLE IF NOT EXISTS subscription_plans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  price numeric NOT NULL,
  license_limit integer DEFAULT 1
);

-- Subscriptions
CREATE TABLE IF NOT EXISTS subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  clinic_id uuid REFERENCES clinics(id) ON DELETE CASCADE ON UPDATE CASCADE,
  plan_id uuid REFERENCES subscription_plans(id) ON DELETE SET NULL ON UPDATE CASCADE,
  status text,
  start_date date,
  end_date date
);

-- Migrations table (para controle simples)
CREATE TABLE IF NOT EXISTS migrations (
  id serial PRIMARY KEY,
  name text NOT NULL UNIQUE,
  applied_at timestamptz NOT NULL DEFAULT now()
);

-- Indexes básicos
CREATE INDEX IF NOT EXISTS idx_persons_cpf ON persons(cpf);
CREATE INDEX IF NOT EXISTS idx_clinics_cnpj ON clinics(cnpj);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

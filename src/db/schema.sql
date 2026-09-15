-- Agencia IA Purfect — provider-agnostic PostgreSQL schema
-- Compatible with standard PostgreSQL providers (Neon, Supabase, RDS, Railway, etc.).
-- No provider-specific extensions are required for the MVP.

create table if not exists decision_cases (
  id text primary key,
  objective text not null,
  period text not null,
  created_at timestamptz not null default now(),
  baseline jsonb not null default '{}'::jsonb,
  agents jsonb not null default '[]'::jsonb,
  sources jsonb not null default '[]'::jsonb,
  findings jsonb not null default '[]'::jsonb,
  contradictions jsonb not null default '[]'::jsonb,
  implementation text not null default '',
  results text not null default '',
  demo boolean not null default false
);

create table if not exists recommendations (
  id text primary key,
  case_id text references decision_cases(id) on delete cascade,
  title text not null,
  description text not null,
  agent text not null,
  priority text not null check (priority in ('Alta','Media')),
  status text not null check (status in ('PROPOSED','VALIDATED','CONFLICTED','APPROVED','REJECTED','IMPLEMENTED','MEASURING','SUCCESSFUL','NEUTRAL','FAILED')),
  evidence jsonb not null default '[]'::jsonb,
  blockers jsonb not null default '[]'::jsonb,
  metric text not null,
  next_step text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists recommendation_audit (
  id text primary key,
  recommendation_id text not null references recommendations(id) on delete cascade,
  created_at timestamptz not null default now(),
  from_status text not null,
  to_status text not null,
  actor text not null
);

create table if not exists experiments (
  id text primary key,
  case_id text references decision_cases(id) on delete set null,
  recommendation_id text references recommendations(id) on delete set null,
  name text not null,
  hypothesis text not null,
  primary_kpi text not null,
  baseline_value numeric,
  target_value numeric,
  window_days integer not null check (window_days > 0),
  status text not null default 'PLANNED' check (status in ('PLANNED','RUNNING','COMPLETED','CANCELLED')),
  result text,
  created_at timestamptz not null default now()
);

create index if not exists recommendations_case_idx on recommendations(case_id);
create index if not exists recommendations_status_idx on recommendations(status);
create index if not exists recommendation_audit_rec_idx on recommendation_audit(recommendation_id);
create index if not exists experiments_case_idx on experiments(case_id);

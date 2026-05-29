-- Migration 001: prospecting_leads table for cold-email pipeline view
-- Run in Supabase SQL Editor.

create table if not exists public.prospecting_leads (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  -- Identity
  email text not null,
  business_name text not null default '',
  owner_first_name text not null default '',
  phone text not null default '',
  website text not null default '',
  address text not null default '',
  city text not null default '',
  state text not null default '',
  country text not null default 'US',
  category text not null default '',

  -- Source / pipeline
  status text not null default 'evaluated', -- evaluated | ready | held | suppressed
  blockers text not null default '',
  source_tier text not null default '',
  source_tier_label text not null default '',
  source_geo text not null default '',
  source_query text not null default '',
  assigned_sender text not null default '',
  assigned_sender_domain text not null default '',

  -- Enriched signals
  review_count integer,
  rating numeric(3,1),
  photos_count integer,
  hours_present boolean,
  days_since_last_review integer, -- computed from latest_review_date
  has_website boolean,
  has_category boolean,
  latest_review_date text not null default '',

  -- Gap scoring (matches 20-signal report, checkable subset)
  worst_gap text not null default '',       -- missing_hours | no_website | thin_profile | stale_reviews | few_reviews | few_photos | suppressed
  gap_hook text not null default '',        -- fully-rendered opening sentence
  visibility_score integer,                 -- 0-100, based on 6 checkable signals

  -- Individual signal statuses (red | amber | green)
  signal_missing_hours text not null default '',
  signal_no_website text not null default '',
  signal_thin_profile text not null default '',
  signal_stale_reviews text not null default '',
  signal_few_reviews text not null default '',
  signal_few_photos text not null default '',

  -- Competitor
  competitor_name text not null default '',
  competitor_review_count integer,

  -- Email verification
  email_verification_status text not null default '',
  email_verification_flags text not null default '',

  -- Extra
  metadata jsonb not null default '{}'::jsonb,

  unique (email)
);

-- Pipeline query indexes
create index if not exists prospecting_leads_worst_gap_idx
  on public.prospecting_leads (worst_gap, status, created_at desc);

create index if not exists prospecting_leads_visibility_score_idx
  on public.prospecting_leads (visibility_score desc, created_at desc);

create index if not exists prospecting_leads_status_idx
  on public.prospecting_leads (status, source_tier, created_at desc);

create index if not exists prospecting_leads_source_tier_idx
  on public.prospecting_leads (source_tier, category, created_at desc);

create index if not exists prospecting_leads_city_category_idx
  on public.prospecting_leads (city, category, worst_gap);

create index if not exists prospecting_leads_email_idx
  on public.prospecting_leads (email);

-- RLS
alter table public.prospecting_leads enable row level security;

drop policy if exists "service role manages prospecting leads" on public.prospecting_leads;
create policy "service role manages prospecting leads"
  on public.prospecting_leads
  for all
  to service_role
  using (true)
  with check (true);

grant all privileges on public.prospecting_leads to service_role;

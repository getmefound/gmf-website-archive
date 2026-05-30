-- Migration 003: Always Ready early-access nurture pipeline fields.
-- Run in Supabase SQL Editor after 002-waitlist-signups.sql.

alter table public.waitlist_signups
  add column if not exists first_name text not null default '',
  add column if not exists stage text not null default 'signed_up',
  add column if not exists nurture_step integer not null default 0,
  add column if not exists next_send_at timestamptz,
  add column if not exists drip_stopped_at timestamptz,
  add column if not exists unsubscribed_at timestamptz,
  add column if not exists suppressed_at timestamptz,
  add column if not exists email_1_sent_at timestamptz,
  add column if not exists email_2_sent_at timestamptz,
  add column if not exists email_3_sent_at timestamptz,
  add column if not exists email_4_sent_at timestamptz,
  add column if not exists resend_message_ids jsonb not null default '{}'::jsonb,
  add column if not exists last_reply_at timestamptz,
  add column if not exists last_reply_text text not null default '',
  add column if not exists last_reply_intent text not null default '';

create index if not exists waitlist_signups_stage_idx
  on public.waitlist_signups (source, stage, updated_at desc);

create index if not exists waitlist_signups_next_send_idx
  on public.waitlist_signups (source, next_send_at)
  where next_send_at is not null and drip_stopped_at is null and unsubscribed_at is null;

create index if not exists waitlist_signups_reply_idx
  on public.waitlist_signups (source, last_reply_intent, last_reply_at desc)
  where last_reply_at is not null;

create or replace view public.always_ready_waitlist_pipeline_view as
select
  id,
  created_at,
  updated_at,
  submitted_at,
  email,
  name,
  first_name,
  business_name,
  source,
  status,
  stage,
  nurture_step,
  next_send_at,
  drip_stopped_at,
  unsubscribed_at,
  suppressed_at,
  email_1_sent_at,
  email_2_sent_at,
  email_3_sent_at,
  email_4_sent_at,
  last_reply_at,
  last_reply_intent,
  case
    when suppressed_at is not null or unsubscribed_at is not null then false
    when stage in ('onboarding', 'manual_review', 'spot_requested') then false
    else true
  end as can_receive_automation,
  metadata
from public.waitlist_signups
where source = 'always-ready-waitlist';

grant select on public.always_ready_waitlist_pipeline_view to service_role;

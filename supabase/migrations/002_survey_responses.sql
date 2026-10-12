create table if not exists survey_responses (
  id             bigserial primary key,
  respondent_id  text unique not null,
  started_at     timestamptz not null default now(),
  completed_at   timestamptz,
  time_taken_s   integer,
  device         text,
  src            text default '',
  cmp            text default '',
  b_param        text,
  buyer          boolean,
  completed      boolean default false,
  current_screen text,
  q1             text,
  q2             text,
  q2_other       text,
  q2_order       text[],
  q3             text[],
  q3_other       text,
  q3_order       text[],
  q4             text,
  q5_no          text,
  q6             text[],
  q6_other       text,
  q6_order       text[],
  q6a            text,
  q6b            text,
  q6c            text,
  q6c_order      text[],
  q7_no          text,
  q5_yes         text,
  q6d_yes        text,
  q8             text[],
  q8_other       text,
  q8_order       text[],
  q9             text,
  q10_email      text,
  q10_consent    boolean default false,
  created_at     timestamptz default now(),
  updated_at     timestamptz default now()
);

alter table survey_responses enable row level security;

-- Anon key (used by the API route) can insert and update
create policy "anon_insert" on survey_responses
  for insert to anon with check (true);

create policy "anon_update_own" on survey_responses
  for update to anon using (true) with check (true);

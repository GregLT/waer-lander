create table if not exists waitlist_signups (
  id         bigserial primary key,
  email      text unique not null,
  created_at timestamptz default now()
);

-- Row-level security: only service role can read/write
alter table waitlist_signups enable row level security;

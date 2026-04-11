create table if not exists public.products (
  id           uuid primary key default gen_random_uuid(),
  name         text not null,
  brand        text not null,
  category     text not null check (category in ('Personal Care', 'Home Cleaning', 'Baby Care', 'Kitchen')),
  description  text,
  safety_score text check (safety_score in ('clean', 'caution', 'avoid')),
  score        integer check (score >= 0 and score <= 100),
  created_at   timestamptz default now()
);

-- Allow public read access
alter table public.products enable row level security;

create policy "Products are publicly readable"
  on public.products for select
  using (true);

-- Allow anon inserts (seeding and V1 single-user writes)
create policy "Allow anon insert"
  on public.products for insert
  with check (true);

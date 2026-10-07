-- The Grand Table — Supabase schema for shared/real-time orders.
-- Run this once in your Supabase project's SQL editor (Database > SQL Editor).

create table if not exists public.orders (
    id bigint generated always as identity (start with 1047) primary key,
    table_number text not null,
    items jsonb not null,
    subtotal numeric not null default 0,
    total numeric not null default 0,
    payment text not null default 'Pay at Table',
    status text not null default 'received',
    created_at timestamptz not null default now()
);

-- Row Level Security: this app has no login system, so the public
-- "anon" key needs permission to read/write orders directly.
alter table public.orders enable row level security;

create policy "Public can read orders" on public.orders
    for select using (true);

create policy "Public can insert orders" on public.orders
    for insert with check (true);

create policy "Public can update order status" on public.orders
    for update using (true);

-- Realtime: let the dashboard receive INSERT/UPDATE events instantly.
alter publication supabase_realtime add table public.orders;

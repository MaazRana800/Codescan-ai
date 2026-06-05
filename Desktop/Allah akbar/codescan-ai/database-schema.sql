-- UPDATED DATABASE SCHEMA for CodeScan AI
-- Changes: Replaced stripe_customer_id with lemonsqueezy fields, using Gemini AI

-- USERS table (extends Supabase auth.users)
create table public.profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  email text not null,
  full_name text,
  plan text default 'free' check (plan in ('free', 'pro', 'team')),
  review_count integer default 0,
  lemonsqueezy_customer_id text,
  lemonsqueezy_subscription_id text,
  github_access_token text,
  github_username text,
  created_at timestamp with time zone default now()
);

-- REVIEWS table (every code review submitted)
create table public.reviews (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade,
  title text,
  language text,
  original_code text not null,
  review_result jsonb,
  score_security integer,
  score_performance integer,
  score_maintainability integer,
  score_readability integer,
  overall_score integer,
  issue_count integer default 0,
  source text default 'paste' check (source in ('paste', 'github', 'webhook')),
  github_repo text,
  github_pr_number integer,
  status text default 'pending' check (status in ('pending', 'complete', 'error')),
  created_at timestamp with time zone default now()
);

-- REPOS table (GitHub repos user connected)
create table public.connected_repos (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade,
  repo_full_name text not null,
  repo_id bigint,
  webhook_id bigint,
  auto_review boolean default true,
  created_at timestamp with time zone default now(),
  unique(user_id, repo_full_name)
);

-- TEAMS table
create table public.teams (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  owner_id uuid references public.profiles(id),
  created_at timestamp with time zone default now()
);

-- TEAM MEMBERS table
create table public.team_members (
  team_id uuid references public.teams(id) on delete cascade,
  user_id uuid references public.profiles(id) on delete cascade,
  role text default 'member' check (role in ('owner', 'member')),
  primary key (team_id, user_id)
);

-- Row Level Security (RLS)
alter table public.profiles enable row level security;
alter table public.reviews enable row level security;
alter table public.connected_repos enable row level security;

create policy "Users see own profile" on public.profiles
  for all using (auth.uid() = id);

create policy "Users see own reviews" on public.reviews
  for all using (auth.uid() = user_id);

create policy "Users see own repos" on public.connected_repos
  for all using (auth.uid() = user_id);

-- Auto-create profile when user signs up
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

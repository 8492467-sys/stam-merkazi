-- ============================================================
-- אתר הסת"ם המרכזי – סכמת Supabase
-- העתק והרץ את כל הקובץ ב: Supabase > SQL Editor > New Query
-- ============================================================

-- פרופיל משתמש
create table if not exists profiles (
  id uuid primary key default gen_random_uuid(),
  display_name text,
  email text,
  phone text,
  created_at timestamptz default now(),
  is_blocked boolean default false,
  is_admin boolean default false
);

-- מודעות – טבלת בסיס לכל הקטגוריות
create table if not exists listings (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete set null,
  category text not null check (category in (
    'mezuzot','tefillin','sifrei-torah','megillot','taggers','hagahot',
    'pitum-ketoret','judaica-art','shkafim','klaf-stores','kulmusim',
    'sofer-rooms','drushim','cases','courses','stam-deliveries','sofer-supplies','forum'
  )),
  title text not null,
  description text,
  phone text,
  whatsapp_enabled boolean default false,
  website text,
  details jsonb default '{}'::jsonb,
  status text default 'active' check (status in ('active','draft','pending')),
  view_count int default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- תמונות מודעות
create table if not exists listing_images (
  id uuid primary key default gen_random_uuid(),
  listing_id uuid references listings(id) on delete cascade,
  storage_path text not null,
  display_order int default 0
);

-- פורום – פרטי שאלה
create table if not exists forum_details (
  listing_id uuid primary key references listings(id) on delete cascade,
  is_anonymous boolean default false,
  display_name text
);

-- פורום – תגובות
create table if not exists forum_replies (
  id uuid primary key default gen_random_uuid(),
  listing_id uuid references listings(id) on delete cascade,
  user_id uuid references profiles(id) on delete set null,
  parent_id uuid references forum_replies(id) on delete cascade,
  body text not null,
  is_anonymous boolean default false,
  display_name text,
  created_at timestamptz default now()
);

-- פניות / יצירת קשר
create table if not exists contacts (
  id uuid primary key default gen_random_uuid(),
  name text,
  email text,
  message text,
  is_handled boolean default false,
  created_at timestamptz default now()
);

-- ============================================================
-- Row Level Security
-- ============================================================

alter table profiles enable row level security;
alter table listings enable row level security;
alter table listing_images enable row level security;
alter table forum_details enable row level security;
alter table forum_replies enable row level security;
alter table contacts enable row level security;

-- profiles
create policy "public read profiles" on profiles for select using (true);
create policy "public insert profiles" on profiles for insert with check (true);
create policy "public update profiles" on profiles for update using (true);

-- listings: כולם קוראים, כולם יכולים לפרסם/לערוך/למחוק (כמו ברמות בקליק)
create policy "public read listings" on listings for select using (true);
create policy "public insert listings" on listings for insert with check (true);
create policy "public update listings" on listings for update using (true);
create policy "public delete listings" on listings for delete using (true);

-- listing_images
create policy "public read images" on listing_images for select using (true);
create policy "public insert images" on listing_images for insert with check (true);
create policy "public delete images" on listing_images for delete using (true);

-- forum_details
create policy "public read forum_details" on forum_details for select using (true);
create policy "public insert forum_details" on forum_details for insert with check (true);

-- forum_replies
create policy "public read forum_replies" on forum_replies for select using (true);
create policy "public insert forum_replies" on forum_replies for insert with check (true);
create policy "public delete forum_replies" on forum_replies for delete using (true);

-- contacts: כולם מוסיפים, אדמין קורא
create policy "public insert contacts" on contacts for insert with check (true);
create policy "admin read contacts" on contacts for select using (true);

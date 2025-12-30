create table "public"."marketing_signups" (
    "id" uuid not null default gen_random_uuid(),
    "created_at" timestamp with time zone not null default now(),
    "email" text not null,
    constraint "marketing_signups_pkey" primary key ("id"),
    constraint "marketing_signups_email_key" unique ("email")
);

alter table "public"."marketing_signups" enable row level security;

create policy "Enable insert for all" on "public"."marketing_signups"
as permissive for insert
to public
with check (true);

create table "public"."collection_shots" (
                                             "collection_id" uuid not null,
                                             "shot_id" uuid not null,
                                             "added_at" timestamp with time zone default now()
);


create table "public"."collections" (
                                        "id" uuid not null default uuid_generate_v4(),
                                        "name" text not null,
                                        "description" text,
                                        "user_id" uuid not null,
                                        "cover_image" text,
                                        "is_private" boolean default false,
                                        "created_at" timestamp with time zone default now(),
                                        "updated_at" timestamp with time zone default now()
);


create table "public"."comments" (
                                     "id" uuid not null default uuid_generate_v4(),
                                     "shot_id" uuid not null,
                                     "user_id" uuid not null,
                                     "content" text not null,
                                     "created_at" timestamp with time zone default now(),
                                     "updated_at" timestamp with time zone default now()
);


create table "public"."follows" (
                                    "follower_id" uuid not null,
                                    "following_id" uuid not null,
                                    "created_at" timestamp with time zone default now()
);


create table "public"."likes" (
                                  "shot_id" uuid not null,
                                  "user_id" uuid not null,
                                  "created_at" timestamp with time zone default now()
);


create table "public"."shot_blocks" (
                                        "id" uuid not null default gen_random_uuid(),
                                        "shot_id" uuid not null,
                                        "type" text not null,
                                        "position" integer not null,
                                        "content" text,
                                        "upload_id" uuid,
                                        "created_at" timestamp with time zone default now(),
                                        "updated_at" timestamp with time zone default now()
);


alter table "public"."shot_blocks" enable row level security;

create table "public"."shot_uploads" (
                                         "id" uuid not null default gen_random_uuid(),
                                         "file_type" text not null,
                                         "width" integer,
                                         "height" integer,
                                         "created_at" timestamp with time zone default now(),
                                         "file_ext" text,
                                         "file_size" integer not null default 0
);


alter table "public"."shot_uploads" enable row level security;

create table "public"."shots" (
                                  "id" uuid not null default uuid_generate_v4(),
                                  "title" text not null,
                                  "user_id" uuid not null,
                                  "category" text,
                                  "tags" text[],
                                  "is_premium" boolean default false,
                                  "is_promoted" boolean default false,
                                  "created_at" timestamp with time zone default now(),
                                  "updated_at" timestamp with time zone default now(),
                                  "removed_at" timestamp with time zone,
                                  "removal_reason" text
);


alter table "public"."shots" enable row level security;

create table "public"."userprofiles" (
                                         "id" uuid not null,
                                         "username" text not null,
                                         "name" text not null,
                                         "bio" text,
                                         "avatar_url" text,
                                         "location" text,
                                         "website" text,
                                         "created_at" timestamp with time zone default timezone('utc'::text, now()),
                                         "updated_at" timestamp with time zone default timezone('utc'::text, now()),
                                         "is_admin" boolean not null default false,
                                         "avatar_file_ext" text
);


alter table "public"."userprofiles" enable row level security;

create table "public"."views" (
                                  "shot_id" uuid not null,
                                  "user_id" uuid,
                                  "viewed_at" timestamp with time zone default now(),
                                  "ip_address" text
);


CREATE UNIQUE INDEX collection_shots_pkey ON public.collection_shots USING btree (collection_id, shot_id);

CREATE UNIQUE INDEX collections_pkey ON public.collections USING btree (id);

CREATE UNIQUE INDEX comments_pkey ON public.comments USING btree (id);

CREATE UNIQUE INDEX follows_pkey ON public.follows USING btree (follower_id, following_id);

CREATE INDEX idx_shots_removed_at ON public.shots USING btree (removed_at);

CREATE UNIQUE INDEX likes_pkey ON public.likes USING btree (shot_id, user_id);

CREATE UNIQUE INDEX shot_blocks_pkey ON public.shot_blocks USING btree (id);

CREATE INDEX shot_blocks_shot_id_idx ON public.shot_blocks USING btree (shot_id);

CREATE UNIQUE INDEX shot_blocks_shot_id_position_key ON public.shot_blocks USING btree (shot_id, "position");

CREATE INDEX shot_blocks_upload_id_idx ON public.shot_blocks USING btree (upload_id);

CREATE UNIQUE INDEX shot_uploads_pkey ON public.shot_uploads USING btree (id);

CREATE UNIQUE INDEX shots_pkey ON public.shots USING btree (id);

CREATE UNIQUE INDEX userprofiles_pkey ON public.userprofiles USING btree (id);

CREATE UNIQUE INDEX userprofiles_username_key ON public.userprofiles USING btree (username);

alter table "public"."collection_shots" add constraint "collection_shots_pkey" PRIMARY KEY using index "collection_shots_pkey";

alter table "public"."collections" add constraint "collections_pkey" PRIMARY KEY using index "collections_pkey";

alter table "public"."comments" add constraint "comments_pkey" PRIMARY KEY using index "comments_pkey";

alter table "public"."follows" add constraint "follows_pkey" PRIMARY KEY using index "follows_pkey";

alter table "public"."likes" add constraint "likes_pkey" PRIMARY KEY using index "likes_pkey";

alter table "public"."shot_blocks" add constraint "shot_blocks_pkey" PRIMARY KEY using index "shot_blocks_pkey";

alter table "public"."shot_uploads" add constraint "shot_uploads_pkey" PRIMARY KEY using index "shot_uploads_pkey";

alter table "public"."shots" add constraint "shots_pkey" PRIMARY KEY using index "shots_pkey";

alter table "public"."userprofiles" add constraint "userprofiles_pkey" PRIMARY KEY using index "userprofiles_pkey";

alter table "public"."collection_shots" add constraint "collection_shots_collection_id_fkey" FOREIGN KEY (collection_id) REFERENCES collections(id) ON DELETE CASCADE not valid;

alter table "public"."collection_shots" validate constraint "collection_shots_collection_id_fkey";

alter table "public"."collection_shots" add constraint "collection_shots_shot_id_fkey" FOREIGN KEY (shot_id) REFERENCES shots(id) ON DELETE CASCADE not valid;

alter table "public"."collection_shots" validate constraint "collection_shots_shot_id_fkey";

alter table "public"."collections" add constraint "collections_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE not valid;

alter table "public"."collections" validate constraint "collections_user_id_fkey";

alter table "public"."comments" add constraint "comments_shot_id_fkey" FOREIGN KEY (shot_id) REFERENCES shots(id) ON DELETE CASCADE not valid;

alter table "public"."comments" validate constraint "comments_shot_id_fkey";

alter table "public"."comments" add constraint "comments_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE not valid;

alter table "public"."comments" validate constraint "comments_user_id_fkey";

alter table "public"."follows" add constraint "follows_follower_id_fkey" FOREIGN KEY (follower_id) REFERENCES auth.users(id) ON DELETE CASCADE not valid;

alter table "public"."follows" validate constraint "follows_follower_id_fkey";

alter table "public"."follows" add constraint "follows_following_id_fkey" FOREIGN KEY (following_id) REFERENCES auth.users(id) ON DELETE CASCADE not valid;

alter table "public"."follows" validate constraint "follows_following_id_fkey";

alter table "public"."likes" add constraint "likes_shot_id_fkey" FOREIGN KEY (shot_id) REFERENCES shots(id) ON DELETE CASCADE not valid;

alter table "public"."likes" validate constraint "likes_shot_id_fkey";

alter table "public"."likes" add constraint "likes_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE not valid;

alter table "public"."likes" validate constraint "likes_user_id_fkey";

alter table "public"."shot_blocks" add constraint "shot_blocks_content_or_upload_check" CHECK ((((type = 'text'::text) AND (content IS NOT NULL) AND (upload_id IS NULL)) OR ((type = 'image'::text) AND (upload_id IS NOT NULL) AND (content IS NULL)))) not valid;

alter table "public"."shot_blocks" validate constraint "shot_blocks_content_or_upload_check";

alter table "public"."shot_blocks" add constraint "shot_blocks_shot_id_fkey" FOREIGN KEY (shot_id) REFERENCES shots(id) ON DELETE CASCADE not valid;

alter table "public"."shot_blocks" validate constraint "shot_blocks_shot_id_fkey";

alter table "public"."shot_blocks" add constraint "shot_blocks_shot_id_position_key" UNIQUE using index "shot_blocks_shot_id_position_key";

alter table "public"."shot_blocks" add constraint "shot_blocks_type_check" CHECK ((type = ANY (ARRAY['image'::text, 'text'::text]))) not valid;

alter table "public"."shot_blocks" validate constraint "shot_blocks_type_check";

alter table "public"."shot_blocks" add constraint "shot_blocks_upload_id_fkey" FOREIGN KEY (upload_id) REFERENCES shot_uploads(id) ON DELETE SET NULL not valid;

alter table "public"."shot_blocks" validate constraint "shot_blocks_upload_id_fkey";

alter table "public"."shots" add constraint "shots_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE not valid;

alter table "public"."shots" validate constraint "shots_user_id_fkey";

alter table "public"."userprofiles" add constraint "userprofiles_id_fkey" FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE not valid;

alter table "public"."userprofiles" validate constraint "userprofiles_id_fkey";

alter table "public"."userprofiles" add constraint "userprofiles_username_key" UNIQUE using index "userprofiles_username_key";

alter table "public"."views" add constraint "views_shot_id_fkey" FOREIGN KEY (shot_id) REFERENCES shots(id) ON DELETE CASCADE not valid;

alter table "public"."views" validate constraint "views_shot_id_fkey";

alter table "public"."views" add constraint "views_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE not valid;

alter table "public"."views" validate constraint "views_user_id_fkey";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
BEGIN
    -- This function will be triggered when a new user is created in auth.users
    -- It will create a placeholder entry in userprofiles
    -- The actual profile data will be filled in by the application
INSERT INTO public.userprofiles (id)
VALUES (NEW.id)
    ON CONFLICT (id) DO NOTHING;

RETURN NEW;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.handle_updated_at()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
  NEW.updated_at = TIMEZONE('utc', NOW());
RETURN NEW;
END;
$function$
;

grant delete on table "public"."collection_shots" to "anon";

grant insert on table "public"."collection_shots" to "anon";

grant references on table "public"."collection_shots" to "anon";

grant select on table "public"."collection_shots" to "anon";

grant trigger on table "public"."collection_shots" to "anon";

grant truncate on table "public"."collection_shots" to "anon";

grant update on table "public"."collection_shots" to "anon";

grant delete on table "public"."collection_shots" to "authenticated";

grant insert on table "public"."collection_shots" to "authenticated";

grant references on table "public"."collection_shots" to "authenticated";

grant select on table "public"."collection_shots" to "authenticated";

grant trigger on table "public"."collection_shots" to "authenticated";

grant truncate on table "public"."collection_shots" to "authenticated";

grant update on table "public"."collection_shots" to "authenticated";

grant delete on table "public"."collection_shots" to "service_role";

grant insert on table "public"."collection_shots" to "service_role";

grant references on table "public"."collection_shots" to "service_role";

grant select on table "public"."collection_shots" to "service_role";

grant trigger on table "public"."collection_shots" to "service_role";

grant truncate on table "public"."collection_shots" to "service_role";

grant update on table "public"."collection_shots" to "service_role";

grant delete on table "public"."collections" to "anon";

grant insert on table "public"."collections" to "anon";

grant references on table "public"."collections" to "anon";

grant select on table "public"."collections" to "anon";

grant trigger on table "public"."collections" to "anon";

grant truncate on table "public"."collections" to "anon";

grant update on table "public"."collections" to "anon";

grant delete on table "public"."collections" to "authenticated";

grant insert on table "public"."collections" to "authenticated";

grant references on table "public"."collections" to "authenticated";

grant select on table "public"."collections" to "authenticated";

grant trigger on table "public"."collections" to "authenticated";

grant truncate on table "public"."collections" to "authenticated";

grant update on table "public"."collections" to "authenticated";

grant delete on table "public"."collections" to "service_role";

grant insert on table "public"."collections" to "service_role";

grant references on table "public"."collections" to "service_role";

grant select on table "public"."collections" to "service_role";

grant trigger on table "public"."collections" to "service_role";

grant truncate on table "public"."collections" to "service_role";

grant update on table "public"."collections" to "service_role";

grant delete on table "public"."comments" to "anon";

grant insert on table "public"."comments" to "anon";

grant references on table "public"."comments" to "anon";

grant select on table "public"."comments" to "anon";

grant trigger on table "public"."comments" to "anon";

grant truncate on table "public"."comments" to "anon";

grant update on table "public"."comments" to "anon";

grant delete on table "public"."comments" to "authenticated";

grant insert on table "public"."comments" to "authenticated";

grant references on table "public"."comments" to "authenticated";

grant select on table "public"."comments" to "authenticated";

grant trigger on table "public"."comments" to "authenticated";

grant truncate on table "public"."comments" to "authenticated";

grant update on table "public"."comments" to "authenticated";

grant delete on table "public"."comments" to "service_role";

grant insert on table "public"."comments" to "service_role";

grant references on table "public"."comments" to "service_role";

grant select on table "public"."comments" to "service_role";

grant trigger on table "public"."comments" to "service_role";

grant truncate on table "public"."comments" to "service_role";

grant update on table "public"."comments" to "service_role";

grant delete on table "public"."follows" to "anon";

grant insert on table "public"."follows" to "anon";

grant references on table "public"."follows" to "anon";

grant select on table "public"."follows" to "anon";

grant trigger on table "public"."follows" to "anon";

grant truncate on table "public"."follows" to "anon";

grant update on table "public"."follows" to "anon";

grant delete on table "public"."follows" to "authenticated";

grant insert on table "public"."follows" to "authenticated";

grant references on table "public"."follows" to "authenticated";

grant select on table "public"."follows" to "authenticated";

grant trigger on table "public"."follows" to "authenticated";

grant truncate on table "public"."follows" to "authenticated";

grant update on table "public"."follows" to "authenticated";

grant delete on table "public"."follows" to "service_role";

grant insert on table "public"."follows" to "service_role";

grant references on table "public"."follows" to "service_role";

grant select on table "public"."follows" to "service_role";

grant trigger on table "public"."follows" to "service_role";

grant truncate on table "public"."follows" to "service_role";

grant update on table "public"."follows" to "service_role";

grant delete on table "public"."likes" to "anon";

grant insert on table "public"."likes" to "anon";

grant references on table "public"."likes" to "anon";

grant select on table "public"."likes" to "anon";

grant trigger on table "public"."likes" to "anon";

grant truncate on table "public"."likes" to "anon";

grant update on table "public"."likes" to "anon";

grant delete on table "public"."likes" to "authenticated";

grant insert on table "public"."likes" to "authenticated";

grant references on table "public"."likes" to "authenticated";

grant select on table "public"."likes" to "authenticated";

grant trigger on table "public"."likes" to "authenticated";

grant truncate on table "public"."likes" to "authenticated";

grant update on table "public"."likes" to "authenticated";

grant delete on table "public"."likes" to "service_role";

grant insert on table "public"."likes" to "service_role";

grant references on table "public"."likes" to "service_role";

grant select on table "public"."likes" to "service_role";

grant trigger on table "public"."likes" to "service_role";

grant truncate on table "public"."likes" to "service_role";

grant update on table "public"."likes" to "service_role";

grant delete on table "public"."shot_blocks" to "anon";

grant insert on table "public"."shot_blocks" to "anon";

grant references on table "public"."shot_blocks" to "anon";

grant select on table "public"."shot_blocks" to "anon";

grant trigger on table "public"."shot_blocks" to "anon";

grant truncate on table "public"."shot_blocks" to "anon";

grant update on table "public"."shot_blocks" to "anon";

grant delete on table "public"."shot_blocks" to "authenticated";

grant insert on table "public"."shot_blocks" to "authenticated";

grant references on table "public"."shot_blocks" to "authenticated";

grant select on table "public"."shot_blocks" to "authenticated";

grant trigger on table "public"."shot_blocks" to "authenticated";

grant truncate on table "public"."shot_blocks" to "authenticated";

grant update on table "public"."shot_blocks" to "authenticated";

grant delete on table "public"."shot_blocks" to "service_role";

grant insert on table "public"."shot_blocks" to "service_role";

grant references on table "public"."shot_blocks" to "service_role";

grant select on table "public"."shot_blocks" to "service_role";

grant trigger on table "public"."shot_blocks" to "service_role";

grant truncate on table "public"."shot_blocks" to "service_role";

grant update on table "public"."shot_blocks" to "service_role";

grant delete on table "public"."shot_uploads" to "anon";

grant insert on table "public"."shot_uploads" to "anon";

grant references on table "public"."shot_uploads" to "anon";

grant select on table "public"."shot_uploads" to "anon";

grant trigger on table "public"."shot_uploads" to "anon";

grant truncate on table "public"."shot_uploads" to "anon";

grant update on table "public"."shot_uploads" to "anon";

grant delete on table "public"."shot_uploads" to "authenticated";

grant insert on table "public"."shot_uploads" to "authenticated";

grant references on table "public"."shot_uploads" to "authenticated";

grant select on table "public"."shot_uploads" to "authenticated";

grant trigger on table "public"."shot_uploads" to "authenticated";

grant truncate on table "public"."shot_uploads" to "authenticated";

grant update on table "public"."shot_uploads" to "authenticated";

grant delete on table "public"."shot_uploads" to "service_role";

grant insert on table "public"."shot_uploads" to "service_role";

grant references on table "public"."shot_uploads" to "service_role";

grant select on table "public"."shot_uploads" to "service_role";

grant trigger on table "public"."shot_uploads" to "service_role";

grant truncate on table "public"."shot_uploads" to "service_role";

grant update on table "public"."shot_uploads" to "service_role";

grant delete on table "public"."shots" to "anon";

grant insert on table "public"."shots" to "anon";

grant references on table "public"."shots" to "anon";

grant select on table "public"."shots" to "anon";

grant trigger on table "public"."shots" to "anon";

grant truncate on table "public"."shots" to "anon";

grant update on table "public"."shots" to "anon";

grant delete on table "public"."shots" to "authenticated";

grant insert on table "public"."shots" to "authenticated";

grant references on table "public"."shots" to "authenticated";

grant select on table "public"."shots" to "authenticated";

grant trigger on table "public"."shots" to "authenticated";

grant truncate on table "public"."shots" to "authenticated";

grant update on table "public"."shots" to "authenticated";

grant delete on table "public"."shots" to "service_role";

grant insert on table "public"."shots" to "service_role";

grant references on table "public"."shots" to "service_role";

grant select on table "public"."shots" to "service_role";

grant trigger on table "public"."shots" to "service_role";

grant truncate on table "public"."shots" to "service_role";

grant update on table "public"."shots" to "service_role";

grant delete on table "public"."userprofiles" to "anon";

grant insert on table "public"."userprofiles" to "anon";

grant references on table "public"."userprofiles" to "anon";

grant select on table "public"."userprofiles" to "anon";

grant trigger on table "public"."userprofiles" to "anon";

grant truncate on table "public"."userprofiles" to "anon";

grant update on table "public"."userprofiles" to "anon";

grant delete on table "public"."userprofiles" to "authenticated";

grant insert on table "public"."userprofiles" to "authenticated";

grant references on table "public"."userprofiles" to "authenticated";

grant select on table "public"."userprofiles" to "authenticated";

grant trigger on table "public"."userprofiles" to "authenticated";

grant truncate on table "public"."userprofiles" to "authenticated";

grant update on table "public"."userprofiles" to "authenticated";

grant delete on table "public"."userprofiles" to "service_role";

grant insert on table "public"."userprofiles" to "service_role";

grant references on table "public"."userprofiles" to "service_role";

grant select on table "public"."userprofiles" to "service_role";

grant trigger on table "public"."userprofiles" to "service_role";

grant truncate on table "public"."userprofiles" to "service_role";

grant update on table "public"."userprofiles" to "service_role";

grant delete on table "public"."views" to "anon";

grant insert on table "public"."views" to "anon";

grant references on table "public"."views" to "anon";

grant select on table "public"."views" to "anon";

grant trigger on table "public"."views" to "anon";

grant truncate on table "public"."views" to "anon";

grant update on table "public"."views" to "anon";

grant delete on table "public"."views" to "authenticated";

grant insert on table "public"."views" to "authenticated";

grant references on table "public"."views" to "authenticated";

grant select on table "public"."views" to "authenticated";

grant trigger on table "public"."views" to "authenticated";

grant truncate on table "public"."views" to "authenticated";

grant update on table "public"."views" to "authenticated";

grant delete on table "public"."views" to "service_role";

grant insert on table "public"."views" to "service_role";

grant references on table "public"."views" to "service_role";

grant select on table "public"."views" to "service_role";

grant trigger on table "public"."views" to "service_role";

grant truncate on table "public"."views" to "service_role";

grant update on table "public"."views" to "service_role";

create policy "Authenticated users can delete shot_blocks"
on "public"."shot_blocks"
as permissive
for delete
to authenticated
using (true);


create policy "Authenticated users can insert shot_blocks"
on "public"."shot_blocks"
as permissive
for insert
to authenticated
with check (true);


create policy "Authenticated users can update shot_blocks"
on "public"."shot_blocks"
as permissive
for update
                      to authenticated
                      using (true);


create policy "Shot blocks are publicly viewable"
on "public"."shot_blocks"
as permissive
for select
               to authenticated, anon
               using (true);


create policy "Authenticated users can delete shot_uploads"
on "public"."shot_uploads"
as permissive
for delete
to authenticated
using (true);


create policy "Authenticated users can insert shot_uploads"
on "public"."shot_uploads"
as permissive
for insert
to authenticated
with check (true);


create policy "Authenticated users can update shot_uploads"
on "public"."shot_uploads"
as permissive
for update
                      to authenticated
                      using (true);


create policy "Shot uploads are publicly viewable"
on "public"."shot_uploads"
as permissive
for select
               to authenticated, anon
               using (true);


create policy "Admins can see all shots"
on "public"."shots"
as permissive
for select
               to public
               using ((EXISTS ( SELECT 1
               FROM userprofiles
               WHERE ((userprofiles.id = auth.uid()) AND (userprofiles.is_admin = true)))));


create policy "Admins can update any shot"
on "public"."shots"
as permissive
for update
               to public
               using ((EXISTS ( SELECT 1
               FROM userprofiles
               WHERE ((userprofiles.id = auth.uid()) AND (userprofiles.is_admin = true)))));


create policy "Admins can view removal_reason"
on "public"."shots"
as permissive
for select
               to public
               using ((EXISTS ( SELECT 1
               FROM userprofiles
               WHERE ((userprofiles.id = auth.uid()) AND (userprofiles.is_admin = true)))));


create policy "Users can delete their own rows"
on "public"."shots"
as permissive
for delete
to authenticated
using ((( SELECT auth.uid() AS uid) = user_id));


create policy "Users can insert their own rows"
on "public"."shots"
as permissive
for insert
to authenticated
with check (true);


create policy "Users can only see non-removed shots"
on "public"."shots"
as permissive
for select
                      to public
                      using ((removed_at IS NULL));


create policy "Users can update their own rows"
on "public"."shots"
as permissive
for update
               to authenticated
               using ((( SELECT auth.uid() AS uid) = user_id))
    with check ((( SELECT auth.uid() AS uid) = user_id));


create policy "Users can view all rows"
on "public"."shots"
as permissive
for select
               to authenticated, anon
               using (true);


create policy "Public profiles are viewable by everyone"
on "public"."userprofiles"
as permissive
for select
               to public
               using (true);


create policy "Users can insert their own profile"
on "public"."userprofiles"
as permissive
for insert
to public
with check ((auth.uid() = id));


create policy "Users can update their own profile"
on "public"."userprofiles"
as permissive
for update
                      to public
                      using ((auth.uid() = id));


CREATE TRIGGER update_userprofiles_updated_at BEFORE UPDATE ON public.userprofiles FOR EACH ROW EXECUTE FUNCTION handle_updated_at();




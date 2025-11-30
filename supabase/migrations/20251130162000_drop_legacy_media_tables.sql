-- Drop legacy, unused media tables now that shot_media_sources is canonical
DROP TABLE IF EXISTS public.shot_carousel_uploads;
DROP TABLE IF EXISTS public.shot_uploads;

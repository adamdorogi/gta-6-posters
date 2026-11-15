SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

COMMENT ON SCHEMA "public" IS 'standard public schema';

CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";

CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";

CREATE EXTENSION IF NOT EXISTS "supabase_vault" WITH SCHEMA "vault";

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";

CREATE TYPE "public"."canvas_size" AS ENUM (
    'Small',
    'Medium',
    'Large',
    'XL',
    'Digital'
);

ALTER TYPE "public"."canvas_size" OWNER TO "postgres";

CREATE TYPE "public"."generation_status" AS ENUM (
    'in_progress',
    'failed',
    'succeeded'
);

ALTER TYPE "public"."generation_status" OWNER TO "postgres";

CREATE TYPE "public"."order_status" AS ENUM (
    'pending',
    'submitted'
);

ALTER TYPE "public"."order_status" OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."consume_credit"("user_id" "uuid", "ip_address" "text") RETURNS "void"
    LANGUAGE "plpgsql"
    AS $$begin
  perform init_or_reset_credits(consume_credit.user_id, consume_credit.ip_address);

  update credits
  set credits = credits - 1
  where (credits.user_id = consume_credit.user_id or credits.ip_address = consume_credit.ip_address)
    and credits.credits > 0;

  if not found then
    raise exception 'Insufficient credits.';
  end if;
end;$$;

ALTER FUNCTION "public"."consume_credit"("user_id" "uuid", "ip_address" "text") OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."get_credits"("user_id" "uuid", "ip_address" "text") RETURNS TABLE("credits" smallint, "remaining" integer)
    LANGUAGE "plpgsql"
    AS $$
declare
  result public.credits;
begin
  remaining := init_or_reset_credits(get_credits.user_id, get_credits.ip_address);

  select *
    into result
    from public.credits
   where (public.credits.user_id = get_credits.user_id
          or public.credits.ip_address = get_credits.ip_address)
   limit 1;

  credits := result.credits;
  return next;
end;
$$;

ALTER FUNCTION "public"."get_credits"("user_id" "uuid", "ip_address" "text") OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."init_or_reset_credits"("user_id" "uuid", "ip_address" "text") RETURNS integer
    LANGUAGE "plpgsql"
    AS $$declare
  remaining int;
  reset_window interval := interval '12 hours';
begin
  insert into credits (user_id, ip_address)
  values (init_or_reset_credits.user_id, init_or_reset_credits.ip_address)
  on conflict do nothing;

  update credits
  set credits = 5,
      reset_at = now()
  where (credits.user_id = init_or_reset_credits.user_id or credits.ip_address = init_or_reset_credits.ip_address)
    and reset_at < now() - reset_window;

  select EXTRACT(EPOCH FROM (reset_at + reset_window - now()))
  into remaining
  from credits
  where credits.user_id = init_or_reset_credits.user_id or credits.ip_address = init_or_reset_credits.ip_address
  limit 1;

  return remaining;
end;$$;

ALTER FUNCTION "public"."init_or_reset_credits"("user_id" "uuid", "ip_address" "text") OWNER TO "postgres";

SET default_tablespace = '';

SET default_table_access_method = "heap";

CREATE TABLE IF NOT EXISTS "public"."credits" (
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "user_id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "ip_address" "text" NOT NULL,
    "credits" bigint DEFAULT '5'::bigint NOT NULL,
    "reset_at" timestamp with time zone DEFAULT "now"() NOT NULL
);

ALTER TABLE "public"."credits" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."generation_groups" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "style_id" "uuid" NOT NULL,
    "user_prompt" "text" DEFAULT ''::"text" NOT NULL
);

ALTER TABLE "public"."generation_groups" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."generations" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "generation_group_id" "uuid" NOT NULL,
    "status" "public"."generation_status" DEFAULT 'in_progress'::"public"."generation_status" NOT NULL,
    "path" "text",
    "is_upscaled" boolean DEFAULT false NOT NULL
);

ALTER TABLE "public"."generations" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."orders" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "generation_id" "uuid" NOT NULL,
    "status" "public"."order_status" DEFAULT 'pending'::"public"."order_status" NOT NULL,
    "name" "text" DEFAULT 'John Doe'::"text" NOT NULL,
    "email" "text" DEFAULT 'john.doe@gmail.com'::"text" NOT NULL,
    "city" "text" DEFAULT ''::"text",
    "country" "text" DEFAULT ''::"text",
    "line1" "text" DEFAULT ''::"text",
    "line2" "text",
    "postal_code" "text" DEFAULT ''::"text",
    "state" "text" DEFAULT ''::"text",
    "printify_id" "text",
    "size" "public"."canvas_size" NOT NULL,
    "order_number" bigint NOT NULL,
    "product_name" "text",
    "stripe_event_id" "text" NOT NULL,
    "total_price" bigint NOT NULL
);

ALTER TABLE "public"."orders" OWNER TO "postgres";

ALTER TABLE "public"."orders" ALTER COLUMN "order_number" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."orders_order_number_seq"
    START WITH 100000
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);

CREATE TABLE IF NOT EXISTS "public"."styles" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "name" "text" NOT NULL,
    "prompt" "text" NOT NULL,
    "rank" smallint DEFAULT '1'::smallint NOT NULL
);

ALTER TABLE "public"."styles" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."uploads" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "generation_group_id" "uuid",
    "path" "text" NOT NULL
);

ALTER TABLE "public"."uploads" OWNER TO "postgres";

ALTER TABLE ONLY "public"."credits"
    ADD CONSTRAINT "credits_ip_address_key" UNIQUE ("ip_address");

ALTER TABLE ONLY "public"."credits"
    ADD CONSTRAINT "credits_pkey" PRIMARY KEY ("user_id", "ip_address");

ALTER TABLE ONLY "public"."credits"
    ADD CONSTRAINT "credits_user_id_key" UNIQUE ("user_id");

ALTER TABLE ONLY "public"."generation_groups"
    ADD CONSTRAINT "generation_groups_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."generations"
    ADD CONSTRAINT "generations_path_key" UNIQUE ("path");

ALTER TABLE ONLY "public"."generations"
    ADD CONSTRAINT "generations_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."orders"
    ADD CONSTRAINT "orders_order_number_key" UNIQUE ("order_number");

ALTER TABLE ONLY "public"."orders"
    ADD CONSTRAINT "orders_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."orders"
    ADD CONSTRAINT "orders_printify_id_key" UNIQUE ("printify_id");

ALTER TABLE ONLY "public"."orders"
    ADD CONSTRAINT "orders_stripe_event_id_key" UNIQUE ("stripe_event_id");

ALTER TABLE ONLY "public"."styles"
    ADD CONSTRAINT "styles_name_key" UNIQUE ("name");

ALTER TABLE ONLY "public"."styles"
    ADD CONSTRAINT "styles_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."uploads"
    ADD CONSTRAINT "uploads_path_key" UNIQUE ("path");

ALTER TABLE ONLY "public"."uploads"
    ADD CONSTRAINT "uploads_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."generation_groups"
    ADD CONSTRAINT "generation_groups_style_id_fkey" FOREIGN KEY ("style_id") REFERENCES "public"."styles"("id") ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE ONLY "public"."generations"
    ADD CONSTRAINT "generations_generation_group_id_fkey" FOREIGN KEY ("generation_group_id") REFERENCES "public"."generation_groups"("id") ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE ONLY "public"."orders"
    ADD CONSTRAINT "orders_generation_id_fkey" FOREIGN KEY ("generation_id") REFERENCES "public"."generations"("id");

ALTER TABLE ONLY "public"."uploads"
    ADD CONSTRAINT "uploads_generation_group_id_fkey" FOREIGN KEY ("generation_group_id") REFERENCES "public"."generation_groups"("id") ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE "public"."credits" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."generation_groups" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."generations" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."orders" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."styles" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."uploads" ENABLE ROW LEVEL SECURITY;

ALTER PUBLICATION "supabase_realtime" OWNER TO "postgres";

GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";

GRANT ALL ON FUNCTION "public"."consume_credit"("user_id" "uuid", "ip_address" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."consume_credit"("user_id" "uuid", "ip_address" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."consume_credit"("user_id" "uuid", "ip_address" "text") TO "service_role";

GRANT ALL ON FUNCTION "public"."get_credits"("user_id" "uuid", "ip_address" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."get_credits"("user_id" "uuid", "ip_address" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_credits"("user_id" "uuid", "ip_address" "text") TO "service_role";

GRANT ALL ON FUNCTION "public"."init_or_reset_credits"("user_id" "uuid", "ip_address" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."init_or_reset_credits"("user_id" "uuid", "ip_address" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."init_or_reset_credits"("user_id" "uuid", "ip_address" "text") TO "service_role";

GRANT ALL ON TABLE "public"."credits" TO "anon";
GRANT ALL ON TABLE "public"."credits" TO "authenticated";
GRANT ALL ON TABLE "public"."credits" TO "service_role";

GRANT ALL ON TABLE "public"."generation_groups" TO "anon";
GRANT ALL ON TABLE "public"."generation_groups" TO "authenticated";
GRANT ALL ON TABLE "public"."generation_groups" TO "service_role";

GRANT ALL ON TABLE "public"."generations" TO "anon";
GRANT ALL ON TABLE "public"."generations" TO "authenticated";
GRANT ALL ON TABLE "public"."generations" TO "service_role";

GRANT ALL ON TABLE "public"."orders" TO "anon";
GRANT ALL ON TABLE "public"."orders" TO "authenticated";
GRANT ALL ON TABLE "public"."orders" TO "service_role";

GRANT ALL ON SEQUENCE "public"."orders_order_number_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."orders_order_number_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."orders_order_number_seq" TO "service_role";

GRANT ALL ON TABLE "public"."styles" TO "anon";
GRANT ALL ON TABLE "public"."styles" TO "authenticated";
GRANT ALL ON TABLE "public"."styles" TO "service_role";

GRANT ALL ON TABLE "public"."uploads" TO "anon";
GRANT ALL ON TABLE "public"."uploads" TO "authenticated";
GRANT ALL ON TABLE "public"."uploads" TO "service_role";

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "service_role";

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "service_role";

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "service_role";

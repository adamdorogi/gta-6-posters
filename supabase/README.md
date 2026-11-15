# GTA 6 Posters Supabase setup and recovery

The hosted project is **GTA 6 Posters** (`ptlpmahgepugdmzxicha`). This repository
contains the Postgres schema and migrations, project configuration, and four
Edge Functions.

`seed.sql` contains the three current `public.styles` rows. An existing hosted
database receives prompt changes through migrations when you run
`supabase db push --remote=<project-ref>`. The private `assets` bucket contains
the poster preview watermark and a reference JPEG for each style. A fresh
restore starts without customer records, orders, uploads, generations, or
Auth users.

## Style references

Each style row has a `reference_path` relative to the private `assets` bucket.
The reference JPEGs in `storage/assets/style-references/` are resized copies
of the cover artwork in `references/1`, Jason and Lucia 01 in `references/2`,
and the soundtrack artwork in `references/3`. Upload a new reference to
Storage before applying a migration that points to it.

The generation function labels the first attachment as style guidance and
sends every upload after it as a subject photo. MiniMax H3 Image handles
generation and accepts up to 16 images per request, including the style reference.

## Restore to a new hosted project

Use the [Supabase CLI](https://supabase.com/docs/guides/local-development/cli/getting-started)
version 3.1 or newer. Run the commands from the repository root.
You can use `npx supabase@3.1.0` in place of `supabase`.

1. Run `supabase login` and create an empty project with
   `supabase projects create` or the Supabase dashboard. The source uses
   Postgres 17 and the Tokyo region. Use `supabase projects list` to confirm
   the new reference.

   ```sh
   export RESTORE_PROJECT_REF="replace-with-new-project-ref"
   supabase config diff --remote="$RESTORE_PROJECT_REF"
   supabase config push --remote="$RESTORE_PROJECT_REF"
   supabase db push --remote="$RESTORE_PROJECT_REF" --include-seed
   supabase seed buckets --remote="$RESTORE_PROJECT_REF"
   ```

2. In the new project's Storage settings, create an S3 access-key pair.
   Store its endpoint, region, access key ID, and secret access key in the
   corresponding `S3_*` variables. The `process-order` function uses these
   values to upload to `upscaled-generations`.
   [Supabase S3 authentication](https://supabase.com/docs/guides/storage/s3/authentication)

3. Fill in the private `supabase/.env.restore` file. If you are starting
   with a fresh checkout, copy [`.env.example`](.env.example) to that path
   first. Supabase exports digests of Edge Function secrets. Retrieve or
   reissue any missing credentials from the providers and keep a copy in a
   password manager. Supabase supplies the destination project's
   `SUPABASE_*` variables automatically.

   ```sh
   supabase secrets set --remote="$RESTORE_PROJECT_REF" --env-file supabase/.env.restore
   supabase functions deploy --remote="$RESTORE_PROJECT_REF" --use-api
   supabase functions list --remote="$RESTORE_PROJECT_REF"
   ```

   The four functions are `generate`, `process-order`, `stripe-webhook`,
   and `printify-webhook`. The two internal functions authenticate with a
   Supabase secret API key. Use a Resend key authorized to send from
   `gta6posters.com`. The code sends all order and shipping messages from
   `GTA 6 Posters <hello@gta6posters.com>`.

4. Point the live and test Stripe webhook endpoints for
   `checkout.session.completed` to
   `https://<new-ref>.supabase.co/functions/v1/stripe-webhook`. Use the signing
   secrets for those endpoints as `STRIPE_WEBHOOK_SECRET` and
   `STRIPE_WEBHOOK_SECRET_TEST`. If you receive new signing secrets, update
   the file and rerun `supabase secrets set`. Point the Printify shop webhooks
   for `order:sent-to-production`, `order:shipment:created`, and
   `order:shipment:delivered` to
   `https://<new-ref>.supabase.co/functions/v1/printify-webhook`. The paper
   product is Printify blueprint 443, provider 30 (OPT OnDemand), with four
   vertical glossy variants. Keep the store's Printify shop ID and token
   aligned.

5. In Vercel, set `SUPABASE_URL` to the new project's URL and
   `SUPABASE_SECRET_KEY` to its secret API key in each environment that
   should use the new project. Redeploy the app. Reuse the existing provider
   accounts if you want to keep the Stripe, Printify, and Resend resources
   referenced by the app.

## Restore locally

With Docker running, use `supabase start` from the repository root.
`supabase db reset` reapplies the schema and the styles seed to the local
database. Use `supabase seed buckets` to apply the bucket configuration and
objects again.

For local functions, use `supabase functions serve --env-file <local-env-file>`
with test credentials. For S3 calls from the local Edge Functions, set
`S3_ENDPOINT=http://kong:8000/storage/v1/s3` and use the S3 region and keys
shown by `supabase status`. Set the Next.js `SUPABASE_URL` and
`SUPABASE_SECRET_KEY` to the local API URL and secret key if running the app
against this stack.

Verify the three styles, their references, and the watermark before routing
traffic to a replacement project. The SHA-256 checksums for the original
bucket objects are listed below. The CLI applies the project's 50 MiB upload limit to each
bucket and infers the zero-byte placeholder's media type as text/plain.
Storage generates new upload timestamps and ETags on restore.

| Object | Bytes | SHA-256 |
| --- | ---: | --- |
| `.emptyFolderPlaceholder` | 0 | `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855` |
| `watermark.png` | 11358 | `3aa6eacbd1c9f53b4f516b58f26e669966eaee6dc6683daed33aa188a6982e23` |

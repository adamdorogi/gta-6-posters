# AI Canvas Supabase restore

This snapshot was taken from AI Canvas (`hlsradpnbpghmtdqtjkk`, Tokyo,
`ap-northeast-1`) on November 15, 2026. It includes the Postgres 17 schema,
database functions, constraints, grants, row-level security, project
configuration, and all four deployed Edge Functions.

`seed.sql` contains all five rows from `public.styles`, including their
original IDs, prompts, timestamps, and ranks. `storage/assets/` contains both
objects in the private `assets` bucket, including `.emptyFolderPlaceholder`.
The four other buckets start empty. Customer records, orders, uploads,
generations, and Auth users start empty as well.

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
   and `printify-webhook`. The config preserves their deployed
   `verify_jwt` settings. The two internal functions authenticate with a
   Supabase secret API key. Direct imports are pinned to the versions
   found in the deployed bundles.

4. Point the live and test Stripe webhook endpoints for
   `checkout.session.completed` to
   `https://<new-ref>.supabase.co/functions/v1/stripe-webhook`. Use the signing
   secrets for those endpoints as `STRIPE_WEBHOOK_SECRET` and
   `STRIPE_WEBHOOK_SECRET_TEST`. If you receive new signing secrets, update
   the file and rerun `supabase secrets set`. Point the Printify shop webhooks
   for `order:sent-to-production`, `order:shipment:created`, and
   `order:shipment:delivered` to
   `https://<new-ref>.supabase.co/functions/v1/printify-webhook`.

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

Verify the five styles and both `assets` objects before routing traffic to
a replacement project. The SHA-256 checksums for the archived objects are
listed below. The CLI applies the project's 50 MiB upload limit to each
bucket and infers the zero-byte placeholder's media type as text/plain.
Storage generates new upload timestamps and ETags on restore.

| Object | Bytes | SHA-256 |
| --- | ---: | --- |
| `.emptyFolderPlaceholder` | 0 | `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855` |
| `watermark.png` | 23371 | `09906a5575aec5705e010310c4434e5eecdae2f504d8e837655b1f0f24c4fd9c` |

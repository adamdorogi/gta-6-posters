# GTA 6 Posters Vercel setup and recovery

The existing project is `gta-6-posters` under `adamdorogis-projects`. It uses
the Next.js preset and Node.js 26.x. The repository contains a pinned Vercel
CLI command. Run these commands from the repository root.

## Regional pricing

The website reads Vercel's `x-vercel-ip-country` request header on the server.
Visitors in Hungary (`HU`) receive the fixed HUF prices in
`app/utils/pricing.ts`. All other countries, including requests without a
country header, receive the USD prices. Checkout independently checks the
region and uses the server's price list. A currency mismatch refreshes the
page prices before the buyer can open another checkout.

For local verification, send `x-vercel-ip-country: HU` to the dev server.
Vercel supplies this header on deployed requests. Pricing is rendered per
request, including on the homepage FAQ and preview pages.

## Work with the existing project

```sh
pnpm vercel login
pnpm vercel link --yes --project gta-6-posters --scope adamdorogis-projects
pnpm vercel project inspect --non-interactive
pnpm vercel env ls
```

Vercel saves the checkout's link in the ignored `.vercel/` directory.
Linking can also write a Development export to `.env.local`. Keep a
copy of any existing `.env.local` before relinking. Use the separate
filenames below for Production and Preview.

```sh
umask 077
pnpm vercel env pull .env.vercel.production.pulled --environment production
pnpm vercel env pull .env.vercel.preview.pulled --environment preview
```

Vercel's pull command can export readable values. For the five app variables
in `gta-6-posters`, it returns `[SENSITIVE]` placeholders. Recreating those
entries requires saved values or replacements from the original providers.
Keep a copy of the values in a password manager.
[Vercel Config and Secret types](https://vercel.com/changelog/environment-variables-now-use-config-and-secret-types)

## Restore to a new Vercel project

1. Import `adamdorogi/gta-6-posters` into a new Vercel project. Use the Next.js
   preset, the repository root, and Node.js 26.x. Choose the Git branch
   that should deploy to Production.
   [Vercel Git deployments](https://vercel.com/docs/git)

2. On a fresh checkout, copy [`.env.vercel.example`](../.env.vercel.example)
   to `.env.vercel.production` and `.env.vercel.preview`. Fill in the five
   values for each environment. Use the Supabase URL and server-side API
   key for the backend that environment should use. For live checkout, set
   a live Stripe key in Production and a test key in Preview. Manage the
   Edge Function credentials through the Supabase restore workflow.
   [Supabase restore guide](../supabase/README.md)

3. Upload each file to the new project. Replace the name and scope to match
   your destination. Add `--dry-run` to validate the file and print the
   target and variable names before uploading. The command sends values to
   the CLI through standard input. It stores `SUPABASE_URL` as Config and
   the four credentials as Secrets. Rerun the command to replace existing
   values or finish an interrupted upload.

   ```sh
   pnpm vercel:env:push --project REPLACEMENT_PROJECT --scope adamdorogis-projects \
     --environment production --file .env.vercel.production
   pnpm vercel:env:push --project REPLACEMENT_PROJECT --scope adamdorogis-projects \
     --environment preview --file .env.vercel.preview
   ```

   To add or update an individual variable, use `pnpm vercel env add` with
   the destination project and environment.

4. Build a new deployment to pick up the saved values. Use the connected
   GitHub repository or deploy an intended checkout with the CLI.
   [Vercel deployment commands](https://vercel.com/docs/cli/deploy)

   ```sh
   pnpm vercel deploy --project REPLACEMENT_PROJECT --scope adamdorogis-projects
   pnpm vercel deploy --prod --project REPLACEMENT_PROJECT --scope adamdorogis-projects
   ```

   For a live cutover, assign `gta6posters.com` and `www.gta6posters.com` to the
   replacement project when it is ready to serve production traffic.

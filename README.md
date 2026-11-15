# GTA 6 Posters

[GTA 6 Posters](https://www.gta6posters.com/) turns selfies, group photos, and pet photos into illustrated posters. Customers choose Cover Art, Character, or The Album, generate a free preview, then order a high-resolution download or an unframed glossy paper print.

The store charges USD. A4 is $59, A3 is $69, A2 is $89, and A1 is $169. All paper prints include a digital copy and standard shipping to eligible destinations worldwide. A digital-only order is $29. Printify fulfills the paper prints through [OPT OnDemand](https://printify.com/app/products/443/generic-brand/posters-eu).

Customer support and automated order emails use [hello@gta6posters.com](mailto:hello@gta6posters.com).

## Local development

Install with `pnpm install` and run `pnpm dev`. Copy [the environment example](.env.vercel.example) to `.env.local` and configure Supabase and Stripe. Use a test Stripe key for local checkout. Run `pnpm lint` and `pnpm build` before deploying.

## Projects and deployment

- [Vercel setup and recovery](docs/vercel.md) for the `gta-6-posters` project and the production domain.
- [Supabase setup and recovery](supabase/README.md) for the GTA 6 Posters database, storage, and Edge Functions. The three generation prompts live in [the seed](supabase/seed.sql) and are rolled out to hosted databases through migrations.
- [Poster pricing](app/utils/pricing.ts), [shipping destinations](app/api/checkout/shipping-countries.ts), and [Printify fulfillment](supabase/functions/process-order/index.ts).

# TODO

1. improve prompts/ add reference image
2. uncomment image upscale
3. test order on live website, incognito, all database rows/cleared (but cancel printify order)
4. top up openrouter and replicate
5. create and test email account (namecheap?) (reply to order confirmation etc.)
6. done.

- maybe:
  - upsell/follow up emails (e.g. Want another style of the same photo?)
  - mockups above couch !
  - size comparison overlays/mockups
  - cart
  - abandoned checkout/ expired session email
  - prefill customer data by storing email into cookies and passing to checkout session
  - different landing pages for different styles
    - maybe dynamically (metadata, description, etc., as stored in DB)
    - add to sitemap

styles:

- royal
- viking
- mafia boss
- cowboy
- superhero

## TurnMeRoyal

8x10: $109 (from $316)

- area: 80sqin
- circumference: 36
- price per sqin: 1.3625
- price per circumference: 3.0277777778
- ratio: 0.8

12x16: $139 (from $406)

- area: 192sqin
- circumference: 56
- price per sqin: 0.7239583333
- price per circumference: 2.4821428571
- ratio: 0.75

18x24: $179 (from $510)

- area: 432sqin
- circumference: 84
- price per sqin: 0.4143518519
- price per circumference: 2.130952381
- ratio: 0.75

24x36: $209 (from $564)

- area: 864sqin
- circumference: 120
- price per sqin: 0.2418981481
- price per circumference: 1.7416666667
- ratio: 0.67

## Printify

### Classic Canvas (1.18") (https://printify.com/app/products/1061/generic-brand/classic-canvas)

8x12: $20.48 + $16.01 shipping = $40.14 (inc. taxes)
12x16: $23.79 + $16.01 shipping = $43.77 (inc. taxes)
16x24: $37.97 + $16.01 shipping = $59.37 (inc. taxes)
30x40: $82.58 + $23.10 shipping = $116.25 (inc. taxes)

## SIZES AND PRICING

2nd: (most popular)
3rd: (best value)

8 x 12 = $40.14 = $89 = $48.86 profit
12 x 16 = $43.77 = $109 = $65.23 profit
16 x 24 = $59.37 = $129 = $69.63 profit
30 x 40 = $116.25 = $209 = $92.75 profit

8 x 12 = $40.14 = $89 = $48.86 profit
12 x 16 = $43.77 = $99 = $55.23 profit
16 x 24 = $59.37 = $109 = $49.63 profit
30 x 40 = $116.25 = $199 = $82.75 profit

8 x 12 = $40.14 = $89 = $48.86 profit
12 x 16 = $43.77 = $99 = $55.23 profit
16 x 24 = $59.37 = $119 = $59.63 profit
30 x 40 = $116.25 = $199 = $82.75 profit

## Upscaling Prices (https://replicate.com/topazlabs/image-upscale)

- 1x to 6x (6x upscale): $0.16
- 6x to 12x (2x upscale): $0.56
- total: $0.72

maybe try: https://github.com/upscayl/upscayl

## Image sizes

8 x 12 = 3177 x 4394 px = 0.7230314065 vs 0.66...
12 x 16 = 4406 x 5622 px = 0.7837068659 vs 0.75
16 x 24 = 5634 x 7961 px = 0.7077000377 vs 0.66...
30 x 40 = 9803 x 12780 px = 0.767057903 vs 0.75

variant ids
8x12 80696
12x16 80698
16x24 80709
30x40 80722

```sh
curl -X POST -H "Authorization: Bearer $PRINTIFY_API_TOKEN" https://api.printify.com/v1/shops/27733486/orders.json -d '{
  "line_items": [
    {
      "print_provider_id": 66,
      "blueprint_id": 1061,
      "variant_id": 80696,
      "print_areas": {
        "front": [
          {
            "src": "https://www.animal.photos/mamm3/dolf-bn_files/dolphin2.jpg",
            "scale": 1, // TODO: get aspect ratio of canvases INCLUDING sides, and calculate scale factor accordingly
            "y": 0.5,
            "x": 0.5,
            "angle": 0
          }
        ]
      },
      "print_details": {
        "print_on_side": "regular"
      },
      "quantity": 1
    }
  ],
  "shipping_method": 1,
  "address_to": {
    "first_name": "John",
    "last_name": "Smith",
    "email": "adam.dorogi@gmail.com",
    "phone": "0574 69 21 90",
    "country": "AU",
    "region": "QLD",
    "address1": "ExampleBaan 121",
    "address2": "45",
    "city": "Brisbane",
    "zip": "4000"
  }
}
'
```

## TurnMeRoyal Flow

```
POST https://turnmeroyal.com/api/upload
Request: Form Data: photos (binary)
Response:
{
    "uploads": [
        {
            "upload_id": "d8df83b3-2542-45bd-a036-70cbecd125f6",
            "storage_path": "9bbafb59-3b86-43c2-914e-ad3e3cca879c/d8df83b3-2542-45bd-a036-70cbecd125f6.jpg"
        }
    ]
}

POST https://turnmeroyal.com/api/upload
Request: Form Data: photos (binary)
Response:
{
    "uploads": [
        {
            "upload_id": "62ba856d-0062-4eb1-8d0c-34df2463446a",
            "storage_path": "9bbafb59-3b86-43c2-914e-ad3e3cca879c/62ba856d-0062-4eb1-8d0c-34df2463446a.jpg"
        }
    ]
}

POST https://turnmeroyal.com/api/generate
Request:
{
  "upload_ids": [
    "62ba856d-0062-4eb1-8d0c-34df2463446a",
    "d8df83b3-2542-45bd-a036-70cbecd125f6"
  ],
  "allowed_category_ids": [
    "f35c525e-4f70-404e-8720-45c346c4646b",
    "f70fbfb1-f7ab-462a-a58f-156026e543a6",
    "ee8d4af9-7abd-42b5-840d-8f668408f7e3",
    "ec32fd61-9828-47e4-bda8-ac2214c6156d",
    "bec1bda9-9eeb-49c0-a7ca-fb381f415073",
    "c4e14482-b398-40e9-9c16-204e28b2807c",
    "59a831b7-b727-4075-898f-c4bcd5b2d389",
    "b01c8c8c-a9bc-4acf-8b79-87824f06c8e2",
    "3d1353fc-783f-4f5f-92ad-59972be64392",
    "18103374-9873-498a-8c59-f6c18718ed6e"
  ],
  "user_prompt": "no crown"
}
Response:
{
    "generation_group_id": "fad3b5f1-869d-4ac5-abf6-f21f2e2e296e",
    "generation_id": "abd46e7f-45f0-4f31-9881-152e7027c6fa",
    "category_id": "",
    "detected_category_name": "",
    "detection_time_ms": 1420
}

Redirect to: https://turnmeroyal.com/preview/fad3b5f1-869d-4ac5-abf6-f21f2e2e296e

show https://turnmeroyal.com/api/image/abd46e7f-45f0-4f31-9881-152e7027c6fa

GET https://turnmeroyal.com/api/generation-limit
Response:
{
    "is_authenticated":false,
    "used":8,
    "limit":15,
    "remaining":7
}

POST https://turnmeroyal.com/api/generate/retry
Request:
{
      "generation_group_id":"fad3b5f1-869d-4ac5-abf6-f21f2e2e296e",
      "source":"retry"
}
Response:
{
      "generation_id":"09cc4364-3749-450b-8c2d-0869ef129a33"
}

GET https://turnmeroyal.com/api/generation/09cc4364-3749-450b-8c2d-0869ef129a33/status
{
    "status": "processing",
    "watermarked_url": null,
    "error_message": null,
    "category_name": null,
    "detected_category_name": null,
    "detection_time_ms": 1461,
    "meta_event_id": null,
    "v2_subject_id": "235ce158-f2d2-41ae-8454-bc8427786a64",
    "v2_style_id": "7bf282b9-d67f-4168-8cb7-fd2fda2455ad"
}

https://bktibfdhkrzhefvybtlo.supabase.co/storage/v1/object/public/watermarked/admin/e584e0ed-248b-4be9-96c0-716973704d49.jpg
https://bktibfdhkrzhefvybtlo.supabase.co/storage/v1/object/public/reviews/loox-reviews/HlKAJUN6FL.jpg
```

## Printify Webhook Tests

Sent to Production

```
curl -X POST https://api.printify.com/v1/shops/27733486/webhooks/6a552bc053da25148b0c07e7/simulate -H "Authorization: Bearer $PRINTIFY_API_TOKEN" -H "Content-Type: application/json" -d '{
  "shop_id": 815256
}'
```

Shipment Created

```
curl -X POST https://api.printify.com/v1/shops/27733486/webhooks/6a53d2023e2bf118070f53f7/simulate -H "Authorization: Bearer $PRINTIFY_API_TOKEN" -H "Content-Type: application/json" -d '{
  "shop_id": 815256,
  "shipped_at": "2022-05-17 15:00:00+00:00",
  "carrier": {
    "code": "USPS",
    "tracking_number": "9400110200828911663274",
    "tracking_url": "https://example.com/track/9400110200828911663274"
  },
  "skus": [
    "6202"
  ]
}'
```

Shipment Delivered

```
curl -X POST https://api.printify.com/v1/shops/27733486/webhooks/6a53d2356593a903980dcd14/simulate -H "Authorization: Bearer $PRINTIFY_API_TOKEN" -H "Content-Type: application/json" -d '{
  "shop_id": 815256,
  "delivered_at": "2022-05-17 15:00:00+00:00",
  "carrier": {
    "code": "USPS",
    "tracking_number": "9400110200828911663274",
    "tracking_url": "https://example.com/track/9400110200828911663274"
  },
  "skus": [
    "6202"
  ]
}'
```

## For LLM

```
I'm working on a NextJS 16 website that let's users upload an image of themselves, loved ones, or pets, and they can generate a royal, renaissance style (among other styles) portrait, which they can also order as a physical canvas. Don't think of it as an AI tech app, but rather a niche ecommerce gift store.

Flow:
- user uploads at least one image, selects a style, an optional prompt, and submits
- preview will be generated and shown to user
- user can regenerate with a different style or prompt
- users get 5 credits/generations every 12 hours, to avoid abusing the system
- user can buy a physical canvas of the generation, or just the digital image
- after purchase has been placed, user receives an order confirmation email, and a digital download email (containing high-res 12K image)

Styles:
- royal
- viking
- mafia boss
- cowboy
- superhero

Product:
- Physical canvas
  - Material: high-quality polycotton
  - New Zealand Pinewood frame: The wooden frame is made from a high-quality New Zealand Pine
  - Semi-glossy satin finish
  - Comes with a self-assembly hanging kit: This semi-gloss canvas comes with a self-assembly hanging kit
  - Polycotton material: The satin-finish style canvas is printed on a wide format eco-solvent, high quality polycotton.
  - Vibrant colors: The latest printing techniques and state-of -the-art Epson printers provide bright and crisp colors matching your craziest designs
- Final designs (after purchase) will be upscaled to 12K, providing at least a +320dpi print (depending on canvas size)

Pricing:
- Physical canvas:
  - 8x12 inch: 89 AUD (production cost: 40.14 AUD, profit: 48.86 AUD)
  - 12x16 inch: 99 AUD (production cost: 43.77 AUD, profit: 55.23 AUD)
  - 16x24 inch: 109 AUD (production cost: 59.37 AUD, profit: 49.63 AUD)
  - 30x40 inch: 199 AUD (production cost: 116.25 AUD, profit: 82.75 AUD)
- Digital only: 59 AUD (production cost: 1 AUD, profit: 58 AUD)
- There will always be a 60% sale on (e.g. summer sale, winter sale, christmas sale, fathers day sale, etc.). Above prices are final, after discount has been applied.
- Free shipping included

Target audience:
- Australia only

Marketing:
- TikTok ads
- Instagram ads

Stack:
- NextJS 16 and Vercel (for frontend and some backend development, and deployment)
- Supabase (for edge functions, bucket storage, and Postgres database)
- OpenRouter and Replicate.com (for image generation and upscaling respectively)
- Stripe (for payments)
- Printify (for POD)
- Resend (for email)
- TikTok pixel and Meta pixel (for ads tracking)
```

- What should CTA buttons say? Download? Digital Only? Canvas + Digital
- landing page, value prop,

## Ads

Don't advertise AI.

Advertise reactions.

Videos like:

Girlfriend uploads boyfriend...

3 seconds later...

"...WHAT?!"

Show:

before

↓

generation

↓

canvas on wall

↓

person opening it

Those perform far better than showing prompts or interfaces.

You are an elite conversion copywriter specializing in premium ecommerce brands.

Your goal is NOT to sound clever. Your goal is to maximize conversion rate while maintaining a premium, trustworthy brand.

Context:

- Product: AI-generated premium portraits from uploaded photos.
- Customers upload a photo of themselves, loved ones or pets.
- Portraits are available as high-quality framed canvases and 12K digital downloads.
- Target audience: Australia.
- Primary acquisition: TikTok and Instagram ads.
- Brand personality:
  - Premium but approachable.
  - Emotional rather than technical.
  - Focus on the finished artwork, not the AI.
- Available styles include Royal, Viking, Cowboy, Superhero and Mafia Boss.

When writing copy:

- Prioritize clarity over cleverness.
- Keep headlines under 10 words whenever possible.
- Make every sentence easy to scan.
- Focus on emotion, pride, gifting and home decoration.
- Never overhype or sound spammy.
- Avoid clichés like "unlock", "revolutionary", "next level", "magic", "AI-powered", "state-of-the-art", "one-of-a-kind".
- Avoid fake urgency or manipulative sales tactics.
- Emphasize premium quality and timeless artwork.
- Write in Australian English.
- Whenever possible, generate 10-20 alternatives ranked from strongest to weakest, with a brief explanation of why each should convert well.

For every request:

1. Critique the existing copy.
2. Explain what could be improved.
3. Produce multiple alternatives.
4. Recommend the single strongest option and explain why.

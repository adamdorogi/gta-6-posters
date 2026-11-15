## Supabase recovery

The database migration, style catalog, storage assets, and Edge Functions are in
[`supabase/`](supabase/). Follow the [restore instructions](supabase/README.md)
to set up a new Supabase project and connect it to Vercel.

# TODO

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
- preview will be generated and shown to user in under a minute. no signup, credit card, email, etc. required
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
- Generated images are 3:4 aspect ratio

Pricing:
- Physical canvas:
  - 8x12 inch: 89 AUD
    - Production cost: 15.09 USD
    - Production tax: 1.51 USD
    - Shipping: 10.99 USD
    - Shipping tax: 1.10 USD
    - Total Printify cost: 28.69 USD (40.68 AUD)
    - Stripe fee (1.7% + 0.30 AUD): 1.81 AUD
    - Upscale cost: 0.16 USD + 0.48 USD (0.91 AUD)
    - Profit: 45.6 AUD
  - 12x16 inch: 99 AUD
    - Production cost: 17.55 USD
    - Production tax: 1.76 USD
    - Shipping: 10.99 USD
    - Shipping tax: 1.10 USD
    - Total Printify cost: 31.40 USD (44.52 AUD)
    - Stripe fee (1.7% + 0.30 AUD): 1.98 AUD
    - Upscale cost: 0.16 USD + 0.48 USD (0.91 AUD)
    - Profit: 51.59 AUD
  - 16x24 inch: 119 AUD
    - Production cost: 28.01 USD
    - Production tax: 2.80 USD
    - Shipping: 10.99 USD
    - Shipping tax: 1.10 USD
    - Total Printify cost: 42.90 USD (60.82 AUD)
    - Stripe fee (1.7% + 0.30 AUD): 2.32 AUD
    - Upscale cost: 0.16 USD + 0.48 USD (0.91 AUD)
    - Profit: 54.95 AUD
  - 30x40 inch: 199 AUD
    - Production cost: 60.92 USD
    - Production tax: 6.09 USD
    - Shipping: 15.79 USD
    - Shipping tax: 1.58 USD
    - Total Printify cost: 84.38 USD (119.63 AUD)
    - Stripe fee (1.7% + 0.30 AUD): 3.68 AUD
    - Upscale cost: 0.16 USD + 0.48 USD (0.91 AUD)
    - Profit: 74.78 AUD
- Digital only: 59 AUD
    - Stripe fee (1.7% + 0.30 AUD): 1.30 AUD
    - Upscale cost: 0.16 USD + 0.48 USD (0.91 AUD)
    - Profit: 56.79 AUD
- Free shipping included
- Profit calculations involve all relevant fees, liabilities, spendings

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

Website: https://www.turnroyal.com/
```

- What should CTA buttons say? Download? Digital Only? Canvas + Digital
- landing page, value prop,

## Ads

- ig+facebook first
- try pet vs human specific ad creates. see which performs better.
- 50 purchases per ad group per week
- Advantage+ Sales
- optimise for sales
- broad
- scale from $100-$150
- scale to $360 after first week. increase to 15-20 creatives
- 1 campaign, lots of creative. each creative for each target audience (e.g. dog owner, mafia boss couple, viking dad, etc.)
- CTA: "create yours free" / "try it" / "try it free"
- 10 different creatives
- creative is now the targeting. up the creative volume
- after we have 50 purchases/week, scale up, and replicate good performing ads
- creative types (no subtle differences, make them diverse and varied)
  1. transformation ad, before/after; normal video of dog/bf, transformation happens, person opening it, physical canvas in hands/on wall -> create yours
  2. reaction videos! (can be UGC, emotional)
  3. I gave my... boyfriend a rennaisance makeover, I turned my dad into a viking, etc. (UGC)
  4. style comparison/montage, flipping through canvases "which one would you choose?"
  5. physical product reveal (unboxing, assembly, etc) (UGC)
  6. mostly pets, couples
  7. 1v1 conversation (what to gift dad)
  8. sms ad? "i can't believe the gift" etc.
- hooks:
  - "I turned my dog into a Renaissance king."
  - "I turned my dad into a Viking."
  - "My boyfriend has never looked this ridiculous."
  - "I made my dog a Renaissance painting."
  - "Would you hang this in your house?"
  - "This might be the best gift I've ever bought."
  - "I gave my girlfriend 5 different personalities."
  - "Which version of him is the best?"
  - "I couldn't decide which one to print."
  - "This started as a photo of my dog."
  - "I spent $99 on this and honestly..."
  - "POV: your dog was born into the royal family."
  - "I turned my dog into a KING 👑"
- clickbait hooks that generate curiosity/intrigue, hyper-dopamine ads
  - pattern interrupt + burning intrigue + specific benefit (gift)
- hemingway writing grader (below 5th grade)
- add specificity (get insane laughs 2x per year, get it in 10 days, etc.)

saved https://www.tiktok.com/@itsturnmeroyal/video/7244847149249236251
saved https://www.tiktok.com/@itsturnmeroyal/video/7245252090786876699
https://www.tiktok.com/@itsturnmeroyal/video/7389641322866560289
saved https://www.tiktok.com/@bradensmith02/video/6983083928227679493
https://www.tiktok.com/@unapologeticallysarat/video/7336796875183476010
https://www.tiktok.com/@royalwhaaat/video/7081215992013032710
remake/use as inspo https://www.tiktok.com/@funwithfinney/video/7492613317366697222
remake/use as inspo https://www.tiktok.com/@historywithcara/video/7461868798723853614
https://www.facebook.com/turnmeroyal/videos/1768263673624043/
https://www.facebook.com/reel/1134794324340269
https://www.facebook.com/reel/2771640229656251
remake/use as inspo https://www.facebook.com/ads/library/?id=1553398299760072
emotional remake/use as inspo https://www.facebook.com/ads/library/?id=997842385972902
remake/use as inspo https://www.facebook.com/ads/library/?id=1110000968369975
remake/use as inspo https://www.facebook.com/ads/library/?id=1347926590037844
remake/use as inspo https://www.facebook.com/ads/library/?id=1357185166385698
https://www.facebook.com/ads/library/?id=1933342237357781
remake/use as inspo https://www.facebook.com/ads/library/?id=1982462622396699
emotional https://www.facebook.com/ads/library/?id=2180082945817460
x https://www.facebook.com/ads/library/?id=2288728085273657
x https://www.facebook.com/ads/library/?id=2251873595563243
https://www.facebook.com/ads/library/?id=1473934361446355
x https://www.facebook.com/ads/library/?id=3678013465672071
https://www.facebook.com/ads/library/?id=910779248740934
https://www.facebook.com/ads/library/?id=876939165258966
remake/use as inspo https://www.facebook.com/ads/library/?id=2802959173394220
https://www.facebook.com/ads/library/?id=1438029954757597
https://www.facebook.com/ads/library/?id=1038125245377534
emotional https://www.facebook.com/ads/library/?id=954141870327659

videos:

1. ✅ (human) princess chick
2. ✅ (human) beetlejuice (edit emoji)
3. ✅ (human) spiderman dude (cut out promo code)
4. ✅ (human) reaction video (w voiceover, ugc style) (family dad, bearded bf, viking bf)
5. ✅ (human) emotional (couple, https://www.facebook.com/ads/library/?id=997842385972902)
6. ✅ (pet) emotional (dead pet, https://www.facebook.com/ads/library/?id=954141870327659) / unboxing (unboxing, hanging) (https://www.facebook.com/ads/library/?id=2180082945817460)
7. ✅ (human) princess https://www.tiktok.com/@itsturnmeroyal/video/7327268196359081248
8. ✅ (pet) style montage (loop through all)
9. ✅ transformation (before/after pic, https://www.tiktok.com/@funwithfinney/video/7492613317366697222)
10. ✅ POV: i turned my X into Y (ugc style), or a remake of one of the ugc-like ads (https://www.facebook.com/ads/library/?id=1553398299760072, https://www.facebook.com/ads/library/?id=1110000968369975, https://www.facebook.com/ads/library/?id=1347926590037844, https://www.facebook.com/ads/library/?id=1357185166385698)

## Ad Content

1. base character prompt:

- create a prompt for a hyperrealistic ai influencer for model X, called name, age, demographic, etc., created on iphone 9:16
- should be close to demographic
- may have multiple influencers

2. generate image from base character prompt

- save image

3. generate starting frame using character image (2.) as reference

```
Transform the subject from the reference image into a candid UGC-style photo. Shot on iPhone front camera, handheld at arm's length, slightly tilted angle. Subject is mid-sentence holding [PRODUCT] up toward the camera, casual eye contact, natural unposed expression.
Setting: [bathroom mirror]. Lighting: harsh overhead fluorescent with mild shadows under eyes, or natural window light from one side. Background slightly cluttered with everyday items (toothbrush, coffee mug, keys, laundry). Photo quality: soft focus, mild motion blur, slight JPEG compression, no protessional retouching. Subject wears casual loungewear or workout clothes, hair slightly undone. Vertical 9:16 framing, subject occupying upper two-thirds of frame, product clearly visible and in focus.
Color grade: cool, slightly underexposed, true-to-life skin tones with visible pores and minor impertections.
```

- save image

4. create scripts

- look for real, well performing UGC scripts on ig, tiktok, etc. in similar niche
- check out their profile, find other well performing content
- transcribe (tokscript) and put all in one doc
- ask ai:

```
Here is existing organic content that has done very well in my niche. Here is the product. Here is my buyer avatar.
Here is the CTA. Create 5 variations with organic YouTube style Tiktok and Instagram reel scripting.
```

- should ideally have hook, build up, value/pivot, soft cta

5. generate video from starting frame

```
UGC-style video of a young woman in her bathroom showcasing the lip balm product "Glossier" into the camera and speaking (in an Australian accent): "Can you tell the difference between a real natural lip balm and a cheap toxic lip balm?"
```

- ideally break up script from 4. into its components (hook, cta, etc.), and generate videos separately for each
- edit cuts/on-screen captions manually with capcut, davinci resolve etc.

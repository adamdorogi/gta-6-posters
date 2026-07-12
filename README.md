# TODO

1. design order confirmation email
2. design digital download email
3. design shipment created email
4. design shipment delivered email
5. improve prompt
6. create and test email account (namecheap?) (reply to order confirmation)
7. SEO descriptions, og links, og images, metadata/titles, etc.
8. FAQ, videos, and other aesthetics
9. uncomment image upscale
10. done.

- maybe:
  - mockups above couch !
  - size comparison overlays/mockups
  - cart
  - abandoned checkout/ expired session email
  - prefill customer data by storing email into cookies and passing to checkout session
  - separate page for each style
    - maybe dynamically (metadata, description, etc., as stored in DB)
    - add to sitemap

styles:

- royal
- viking
- godfather
- cowboy
- super hero

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

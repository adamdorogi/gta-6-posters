# TODO

1. test image gen cost for 1K vs 2K vs 4K
2. ...

- error handling
  - out of credits
- UX and design
  - on preview page, user can select "edit", which will bring up a popup similar to the generation from on the main page. with the exception of the photo upload (for now). user can edit selected style and prompt.
- add /preview to robots.txt
- speed optimisations (await, nested requests, sql functions)
- improve prompt
- improve watermark (896x1200 probs)
- sort styles
- try to hack/break

- maybe:
  - mockups above couch !
  - size comparison overlays/mockups
  - cart
  - abandoned checkout/ expired session email
  - prefill customer data by storing email into cookies and passing to checkout session

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

# Image sizes

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

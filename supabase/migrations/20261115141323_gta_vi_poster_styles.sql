-- Install the GTA VI poster catalog on hosted and local databases.
insert into public.styles (id, name, prompt, rank) values
  (
    '6e723982-219f-49aa-bc40-f9d562ea954c',
    'Cover Art',
    $style_prompt$Likeness is the highest priority. Make the people and any pets in the uploaded photos the only subjects. Show each distinct subject once, even if they appear in several uploads. Preserve facial proportions, eye shape and color, nose, mouth, jawline, skin tone, age, hairline, hairstyle, build, and distinguishing details such as freckles, facial hair, glasses, or tattoos when visible. Preserve a pet's face shape, coat colors, and markings. Use the clearest uploaded view of each face. Keep faces large and unobstructed, and preserve their real features even where the illustration simplifies other details.

Create a GTA VI cover-art montage with roughly eight asymmetric comic panels. Vary their sizes and angles. Separate them with thick near-black plum gutters and use a matching narrow outer keyline. Give the subjects the largest panel toward the upper right, framed from the chest or waist up in contemporary South Florida streetwear. For a group, widen this panel and stagger shoulders so every face reads. Surround the main portrait with single-subject scenes of Vice City: a blue helicopter banking over pastel towers, a hot-pink sport bike, a yellow wedge-shaped supercar, a blue-and-white speedboat cutting a turquoise wake, and a palm-lined Art Deco streetscape. Keep these supporting panels free of people and pets.

Render sharp, illustrated realism with fine selective outlines, angular shadow shapes, detailed eyes and hair, and crisp highlights on metal and glass. Give each panel a limited palette so it reads at a glance. Across the cover, alternate turquoise and indigo with coral pink, tropical violet, and hot yellow-orange. Use warm sunlit edges and cool purple shadows on the subjects while keeping their actual complexions recognizable.

Lay a large logo across the middle of the montage, overlapping the panel gutters and sitting below the main faces. Stack the white lowercase words "grand", "theft", and "auto" on three close-set lines in heavy squared lettering with a thick dark outline. Behind them, place a huge "VI" with a white keyline and a violet-to-fuchsia-to-golden-orange fill with faint palm silhouettes. Place a small yellow square with the black R and white star near the lower right. Use only the specified lettering.

Compose one full-bleed A-series portrait poster (width to height 1:√2). Keep faces and lettering clear of the trim while carrying the panel art and graphic edges all the way to the paper edges. Output the flat artwork alone, with no frame, mat, mockup, or watermark.$style_prompt$,
    1
  ),
  (
    '91e35d81-5227-4910-b055-681a91912cba',
    'Character',
    $style_prompt$Likeness is the highest priority. Cast the people and any pets in the uploaded photos as the only subjects. Show each distinct subject once, even if they appear in several uploads. Preserve facial proportions, eye shape and color, nose, mouth, jawline, skin tone, age, hairline, hairstyle, build, and distinguishing details such as freckles, facial hair, glasses, or tattoos when visible. Preserve a pet's face shape, coat colors, and markings. Use the clearest uploaded view of each face. Keep every face large, well lit and unobstructed, and preserve those features through stylization.

Create a GTA VI character campaign poster as a single continuous, cinematic Vice City scene. Stage the subjects prominently in the lower two-thirds, from the waist or mid-thigh up, with open sky above and a low horizon behind them. Use a slightly low viewpoint and a poised, purposeful stance. Stagger multiple subjects by a shoulder or a half step so each face reads. Dress people in contemporary South Florida streetwear, using simple tanks, tees, open short-sleeved shirts, or denim that suits the individual. Pick one coherent setting, such as a waterfront promenade, palm-lined boulevard, or rooftop overlooking the bay. Use pastel Art Deco buildings or high-rises in the distance and a few environmental details, such as a parked sports car or a distant helicopter.

Use polished hand-painted digital game illustration. Define eyes, hair, and expressions with selective dark linework. Model faces and fabric with crisp planes of color, sharp cast shadows, a little hatching, and bright rim highlights. Set the scene at golden hour or dusk with a lavender-to-peach sky, apricot rim light, and mauve and indigo shadows. Cool teal water or city accents can balance the warm light. Keep actual skin tones legible through the colored lighting. Use edge palms and distant architecture to frame the leads without crowding them.

Center a large, solid-white title in the open upper sky, stacking "grand", "theft", and "auto" on three close-set lines of heavy squared lowercase lettering. Place a separate thin white outline "VI" near the bottom center and a small yellow R-star square near the lower right. Keep all lettering away from faces and use only the specified title and badge.

Compose one full-bleed A-series portrait poster (width to height 1:√2). Keep faces and lettering clear of the trim while extending the continuous scene to all four edges. Output the flat artwork alone, with no frame, mat, mockup, or watermark.$style_prompt$,
    2
  ),
  (
    '6140eddf-6834-4fe2-b510-384db9b06706',
    'The Album',
    $style_prompt$Likeness is the highest priority. Make the people and any pets in the uploaded photos the only subjects. Show each distinct subject once, even if they appear in several uploads. Preserve facial proportions, eye shape and color, nose, mouth, jawline, skin tone, age, hairline, hairstyle, build, and distinguishing details such as freckles, facial hair, glasses, or tattoos when visible. Preserve a pet's face shape, coat colors, and markings. Use the clearest uploaded view of each face. Keep the faces large and unobstructed. Favor the subjects' actual features over any character styling or dramatic lighting.

Create a GTA VI soundtrack sleeve as one continuous, quiet sunset scene. Place the subjects in the lower half beside a vintage muscle car seen broadside. Let the side of the car run horizontally through the lower composition. Give the subjects a relaxed lean or a hand resting on the car, with a contemplative expression and a natural gaze just off camera where the source pose allows. Use simple casual clothes. Keep the low Vice City waterfront skyline hazy. Put dark, wind-bent palms to the left and a few distant birds toward the right. Leave the upper half as open sky for the album title.

Use a smooth slate-blue sky grading through lavender, dusty pink, coral, and peach to a pale golden glow at the horizon. Model the subjects with deep violet-blue shadow shapes and narrow, warm sunset edges while keeping skin undertones recognizable. Reflect long pink and amber highlights across the car's paint. Combine clean, hand-drawn facial detail and sharply shaped digital shading with soft atmospheric gradients and a restrained neon glow. The mood is wistful and unhurried.

Set "GRAND THEFT AUTO" across the top in small, widely spaced white capitals. Beneath it, center an oversized, hollow "VI" drawn with a fine glowing white outline so the sky shows through. Overlay it with the words "The Album" in large, rising white brush script with a sweeping underline and a gentle pink-white halo. Keep this title treatment in the sky above the faces. Place a small white outlined R-star badge near the lower right. Use only the specified lettering.

Compose one full-bleed A-series portrait poster (width to height 1:√2). Keep faces and lettering clear of the trim while extending the sky, car, and surroundings to the paper edges. Output the flat artwork alone, with no frame, mat, mockup, or watermark.$style_prompt$,
    3
  )
on conflict (id) do update
set name = excluded.name,
    prompt = excluded.prompt,
    rank = excluded.rank;

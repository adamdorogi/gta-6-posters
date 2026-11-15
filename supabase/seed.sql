-- GTA VI poster catalogue for a fresh database, in reference folder order.
insert into public.styles (id, name, prompt, rank, reference_path) values
  (
    '6e723982-219f-49aa-bc40-f9d562ea954c',
    'Cover Art',
    $style_prompt$Build a GTA VI game cover out of interlocking, uneven comic panels. Use a deep aubergine outer keyline and bold gutters, with a few diagonals and tilted panel edges that make the page feel in motion. Put the main likenesses in prominent close or waist-up character panels, led by a large panel near the upper right. A solo subject gets one dominant panel. For a larger group, make the lead panel wider or give different people their own panels. Adjust the montage around the number of people, leaving enough room to read every face at poster size.

Use the spare panels for quick Vice City establishing shots. Vary the scale between a blue helicopter above candy-colored towers, a pink motorcycle, a low yellow sports car, a speedboat wake across turquoise water, a flamingo, and palm-lined Art Deco architecture. Give each scene a distinct silhouette and a tight palette, alternating aqua and electric blue with orchid, coral, and amber. Draw with decisive ink edges, blocks of saturated color, and angular shadow cuts across the brow, cheek, and neck. Pick out a few strands, fabric creases, and sharp glints on chrome or glass. Give the faces the same crisp, graphic construction as the vehicles and scenery.

Bridge the center seams with the stacked white words "grand", "theft", and "auto" in heavy squared lettering with a thick dark outline. Behind the wordmark, draw a large "VI" with a pale keyline, a violet-to-hot-pink-to-orange gradient, and faint palm silhouettes. Tuck a small yellow R-star badge at the bottom right. Keep the lettering legible and clear of faces. Carry the dark panel design to the edges.$style_prompt$,
    1,
    'style-references/cover-art.jpg'
  ),
  (
    '91e35d81-5227-4910-b055-681a91912cba',
    'Character',
    $style_prompt$Compose a GTA VI character poster as a single cinematic illustration. Fill the middle and lower frame with the cast, from waist or thigh height up, with the viewpoint slightly below eye level. Anchor the figures beside a car on a palm-lined Vice City street at golden hour. A rooftop or waterfront can serve the same composition. Use a low city horizon, pastel Art Deco facades, and dark palm fronds sweeping in from the edges. Offset shoulders and heads for a layered, confident stance. For a group, widen the scene and stagger faces across shallow rows, with a strong silhouette and a clear line of sight to every face.

Use polished campaign-art illustration with selective tapered outlines, sculpted cheekbones, and strong clean shapes in the hair, clothes, and car. Build faces with simplified planes of color, precise eyes and brows, and small strokes for key identifying details. Use warm apricot rim light, shaded planes of mauve and indigo, and a few mint, teal, or fuchsia accents across contemporary streetwear. Carry cool blue-violet down from the open sky into the distant city, with a band of pink and gold where it meets the horizon. Preserve each person's natural complexion and proportions through the stylization.

Place the solid-white "grand", "theft", and "auto" wordmark on three compact lines in the upper sky. Put a separate thin white outlined "VI" near the lower center, overlapping the car or clothing, and place a small yellow R-star badge in the lower right. Keep the title above the cast and let the illustrated scene fill the sheet.$style_prompt$,
    2,
    'style-references/character.jpg'
  ),
  (
    '6140eddf-6834-4fe2-b510-384db9b06706',
    'The Album',
    $style_prompt$Make a GTA VI soundtrack sleeve with an expansive sunset and an understated waterfront scene. Start with slate blue at the top, shading through lavender and dusty pink to coral, apricot, and a thin buttery glow at the horizon. Silhouette dark purple palms along the left, put a few small birds in the open sky, and keep the distant skyline low and hazy. Run a vintage muscle car broadside through the lower frame, with long warm reflections across its dark body and windows. Pose the cast close to the car with casual weight shifts or arms resting on the bodywork. A larger group can spread along the car or nearby pavement, with a mix of seated and standing heights and room for each likeness.

Use a quiet, guarded mood and graphic hand-drawn figures. Model faces and clothing with broad blue-violet shadow shapes, crisp cheek and jaw planes, sparse fine contours, and narrow peach or gold highlights. Use muted indigo, periwinkle, charcoal, and salmon in the foreground, with smoother transitions in the sky and reflected light. Let the figures look toward the same distant point or hold a steady gaze, with the restrained expression of the soundtrack reference.

Leave the upper half open for the typography. Set "GRAND THEFT AUTO" in small, widely spaced white capitals near the top. Below it, draw an oversized hollow "VI" in a thin luminous outline. Lay "The Album" diagonally across it in connected white brush script with a long sweeping underline and a soft pale-pink halo. Place a small white outlined R-star badge in the lower right. Keep the title readable above the figures and let the car and shoreline continue off the sheet.$style_prompt$,
    3,
    'style-references/the-album.jpg'
  )
on conflict (id) do update
set name = excluded.name,
    prompt = excluded.prompt,
    rank = excluded.rank,
    reference_path = excluded.reference_path;

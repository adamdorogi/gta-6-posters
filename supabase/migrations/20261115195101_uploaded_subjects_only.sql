-- Apply the uploaded cast restriction to every part of each poster.
with cast_direction (prefix) as (
  values ($cast_direction$Every person depicted anywhere in the artwork must be a subject from the uploaded photos. Use the style reference for visual treatment only. Keep backgrounds, vehicles, reflections, and any secondary panels free of extra people, including crowds, bystanders, and distant human silhouettes.$cast_direction$ || E'\n\n')
)
update public.styles as style
set prompt = cast_direction.prefix || style.prompt
from cast_direction
where style.id in (
  '6e723982-219f-49aa-bc40-f9d562ea954c',
  '91e35d81-5227-4910-b055-681a91912cba',
  '6140eddf-6834-4fe2-b510-384db9b06706'
)
and not starts_with(style.prompt, cast_direction.prefix);

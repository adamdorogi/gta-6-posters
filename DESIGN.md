---
name: GTA 6 Posters
description: "Coastal dusk, original poster art, and a dark interface for creating and ordering portraits."
colors:
  primary: "#f6b7ce"
  primary-hover: "#ffcede"
  primary-foreground: "#28182a"
  primary-accent: "#392942"
  accent: "#ffc99f"
  accent-foreground: "#29192a"
  background: "#161322"
  foreground: "#fff4ed"
  surface: "#221a30"
  muted: "#2b2238"
  muted-foreground: "#cebfce"
  border: "#51405b"
  input: "#1d172a"
  ring: "#ffb9d2"
  destructive: "#ffacbe"
typography:
  display:
    fontFamily: "Barlow Condensed, sans-serif"
    fontWeight: 900
    lineHeight: 0.94
    letterSpacing: "-0.015em"
  display-accent:
    fontFamily: "Barlow Condensed, sans-serif"
    fontWeight: 900
    lineHeight: 0.89
    letterSpacing: "-0.015em"
  headline:
    fontFamily: "Barlow Condensed, sans-serif"
    fontWeight: 900
    lineHeight: 0.95
    letterSpacing: "-0.018em"
  title:
    fontFamily: "Barlow Condensed, sans-serif"
    fontSize: "1.5rem"
    fontWeight: 700
    lineHeight: 1
  body:
    fontFamily: "Inter, sans-serif"
    fontWeight: 400
    lineHeight: 1.65
  label:
    fontFamily: "Inter, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 700
    lineHeight: "1rem"
    letterSpacing: "0.11em"
  button-label:
    fontFamily: "Inter, sans-serif"
    fontSize: "0.9375rem"
    fontWeight: 700
rounded:
  field: "0.5rem"
  thumbnail: "0.4rem"
  image: "0.65rem"
  portrait: "0.7rem"
  upload: "0.75rem"
  plan: "0.85rem"
  dialog: "1rem"
spacing:
  content-width: "77rem"
  gutter-min: "1.125rem"
  gutter-max: "3.25rem"
  section-min: "3.25rem"
  section-max: "7rem"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.primary-foreground}"
    typography: "{typography.button-label}"
    padding: "0.625rem 1.25rem"
  button-primary-hover:
    backgroundColor: "{colors.primary-hover}"
  button-outline:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.foreground}"
    typography: "{typography.button-label}"
    padding: "0.625rem 1.25rem"
  button-outline-hover:
    backgroundColor: "{colors.primary-accent}"
  icon-button:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.foreground}"
    size: "2.75rem"
  prompt-field:
    backgroundColor: "{colors.input}"
    textColor: "{colors.foreground}"
    rounded: "{rounded.field}"
    padding: "0.75rem 6rem 0.75rem 1rem"
  navigation:
    backgroundColor: "#191525"
    textColor: "{colors.foreground}"
  credits-chip:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.muted-foreground}"
    padding: "0.375rem 0.75rem"
  purchase-plan:
    backgroundColor: "{colors.surface}"
    rounded: "{rounded.plan}"
  style-option:
    backgroundColor: "#20182d"
    textColor: "{colors.foreground}"
    rounded: "{rounded.image}"
  style-option-selected:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.primary-foreground}"
  upload-target:
    backgroundColor: "#251934"
    textColor: "{colors.foreground}"
    rounded: "{rounded.upload}"
    padding: "0.85rem"
  preview-art:
    backgroundColor: "#1e172b"
    rounded: "{rounded.image}"
  edit-dialog:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.foreground}"
    rounded: "{rounded.dialog}"
---

# Design System: GTA 6 Posters

## Overview

**Creative North Star: "The Coastal Poster Studio"**

Original illustrated posters bring coastal sunsets, palm silhouettes, and saturated color into a deep plum interface. The homepage lets the artwork meet the controls at the edge of the hero. The generation preview gives one portrait a clearly framed place beside its options.

Large, tightly set headings give sections the weight of a poster title. Controls sit close together around the task at hand. Generous space between sections gives each image and heading room.

**Key Characteristics:**

- Original illustration for the poster samples and coastal backdrop, with a photographic poster mockup.
- Deep plum surfaces with warm ivory text, blush selection, and peach sale details.
- Condensed uppercase headings and Inter for reading and controls.
- Compact form controls, room for portrait images, and visible carousel controls.

## Colors

### Primary

- **Blush** fills primary actions and selected style labels. It also marks active carousel dots, selected unit controls, and occasional words in headings.
- **Pale blush** lightens the filled button on hover. **Dark plum text** pairs with the blush fill.
- **Tinted plum** fills hovered outlined controls and the optional field label. The **pink focus ring** outlines the active keyboard control.
- **Error pink** marks form and generation errors.

### Secondary

- **Peach** highlights sale details and the featured print price, with **dark peach-label text** on the peach pill.
- A lilac, pink, and peach gradient spans the announcement bar (`linear-gradient(105deg, #bca5da, #efb2ce 42%, #ffc69f 67%, #dab0d9)`). The wordmark uses three separate stripes in the same hues.

### Neutral

- **Deep plum** is the page background. **Surface plum** defines panels and secondary controls. **Muted plum** and **input plum** provide quieter fills.
- **Warm ivory** carries primary text. **Muted lavender** supports descriptions, metadata, and secondary text. **Plum borders** separate rows, panels, and control edges.

**The Accent Rule.** Use blush to identify the main action or active choice. Use peach to call out a sale or price.

## Typography

Barlow Condensed supplies the wordmark, headlines, feature titles, and prices. It uses 900 for display text and 700 for smaller titles. Inter supplies paragraph text, fields, labels, and action text. Both fall back to sans-serif.

- **Display** uses uppercase Barlow Condensed at 900. The main line scales from `1.75rem` to `4.125rem` with `10.8cqi` inside the hero copy container. The blush line scales from `2.875rem` to `6rem` with `17.6cqi` and a tighter 0.89 line height.
- **Headlines** use uppercase Barlow Condensed at 900, a 0.95 line height, and balanced wrapping. Section headings use `clamp(2.5rem, 5.4vw, 4.875rem)`. The purchase heading uses `clamp(2.5rem, 4.4vw, 4.45rem)`.
- **Titles** use Barlow Condensed at 700 for feature rows. Plan names and prices use 900. Feature titles reach `1.5rem`, and purchase prices sit at `2.5rem` with tabular numerals.
- **Body** uses Inter. Section leads use `clamp(0.9375rem, 1.45vw, 1.0625rem)` with a 1.65 line height and a limit of `58ch`.
- **Labels** use Inter at 700. The style legend is uppercase at `0.75rem` with `0.11em` tracking. Button labels use `0.9375rem` at 700. Style names and action labels stay in their existing case.

**The Heading Rule.** Use Barlow Condensed for titles and prices. Keep directions, option names, and buttons in Inter.

## Layout

Center page content in a container capped at `77rem`. Side gutters follow `clamp(1.125rem, 4vw, 3.25rem)`. Sections use vertical padding of `clamp(3.25rem, 7.25vw, 7rem)`. The backdrop and carousel can extend to the page edge.

The hero uses a single column below `64rem`. The form comes before the horizontal poster strip. At `64rem` the hero becomes a two-column layout with the form beside the vertical poster wall.

The preview and print sections split into two columns at `60rem`. Below this width, the preview gallery sits above purchase options and the print section follows heading, image, details. At `41rem` purchase features become two columns and the bottom purchase cards can sit side by side.

## Elevation & Depth

Plum fills and one-pixel borders separate controls, rows, and cards. Dark gradients let the coastal image remain visible around the hero copy and behind the closing section. The preview stage starts with a diagonal plum gradient, and the editor uses a translucent dark backdrop.

The preview artwork uses a broad, soft shadow (`0 1.4rem 3rem -1.75rem #0c0715`).

**The Layering Rule.** Define panels with tonal fills and borders. Use a soft shadow beneath the large preview artwork.

## Shapes

Text actions use fully rounded ends, and icon-only controls are circular (`2.75rem` square). Text fields, style tiles, plan cards, and the editor use modest corner radii. The upload area uses a dashed border with a `0.75rem` radius.

Hero posters are square-cornered `5 / 7` tiles. The vertical wall is skewed by `-3deg`, with its right track offset and the pause control counter-skewed. The showcase uses lightly rounded `5 / 7` slides. The full preview and its thumbnail slots use the A-series ratio of `1 / 1.41421356` and contain the complete image.

## Components

### Buttons and navigation

Filled and outlined text buttons have a `3.125rem` minimum height and `0.625rem 1.25rem` padding. Filled buttons lighten on hover. Outlined buttons take a blush border and tinted plum fill on hover. Disabled buttons retain their shape at 55% opacity.

The navigation pairs the link to the homepage with a compact credits pill when the credit countdown is shown. Its counter uses tabular numerals and wraps onto a second line when space is tight. Keyboard focus uses a `2px` pink outline with a `3px` offset.

### Style picker and fields

Style choices share a horizontal strip of illustrated radio tiles with a `1.48` image crop and a text row underneath. The selected tile uses a blush border and label fill. Hover raises the border contrast. Keyboard focus outlines the full tile.

Give the upload target a full-width dashed edge, a centered blush upload icon, and a minimum height of `4.875rem`. It accepts a photo drop or opens the file picker when activated. The keyboard outline follows the full target.

The editor reuses the style picker inside a centered dialog that caps at `33rem` wide and scrolls internally when needed. Its optional text field uses an input plum fill, a blush border on focus, and a small status pill on the right.

### Carousels and preview gallery

The homepage poster wall loops continuously across two vertical tracks moving in opposite directions. On mobile it becomes one horizontal track. Both have a pause and play control. With reduced motion the poster track holds still and the control is hidden.

The separate showcase scrolls with touch or trackpad and snaps the active portrait to the center. Its arrows and indicator buttons move between portraits, and selecting a neighboring portrait centers it. The active image reaches full opacity with a thin blush edge. Surrounding portraits sit at 70% opacity and edge fades soften the cropping. The blush indicator grows from a dot into a short pill. Navigation centers the selected portrait instantly with reduced motion.

The generation gallery contains the full poster in its frame. A scrollable thumbnail row beneath it uses a blush border for the selected version. The outlined Edit or Retry action sits beside that row.

### Purchase options

Use plum cards, a one-pixel outline, and condensed plan titles. The print plan has a warmer fill and border, a peach sale pill, and a filled action. Four compact size buttons use a blush border on hover and a plum tint when selected. The unit switch uses a blush pill for the active unit. Digital-only uses the standard plum surface and an outlined action.

## Do's and Don'ts

- **Do** use original artwork for new site imagery and keep the exact generation prompt with each asset in `public/posters`.
- **Do** keep the whole poster visible in the preview and allow sample images to crop for their tiles.
- **Do** show selection and keyboard focus with distinct outlines or fills.
- **Do** preserve the existing copy and the scrolling behavior of both homepage carousels.
- **Don't** cover the upload and style controls with bright artwork. Use the dark edge of the backdrop or its plum gradient beneath text.

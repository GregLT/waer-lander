# Handoff: WAER Waitlist / Landing Page

## Overview
A single-page waitlist (pre-launch) marketing site for **WAER** — a 15-fragrance "scent wardrobe" brand. The page introduces the proposition, captures email sign-ups for early access ("Founding Rotation"), and surfaces the brand's signature duotone family-colour visual device. Doors open A/W '26.

## About the Design Files
The files in this bundle are **design references created in HTML** — a prototype showing the intended look, layout, copy, and behaviour. They are **not production code** to ship as-is.

The task is to **recreate this design in the target codebase's existing environment** (Next.js, Astro, Shopify Hydrogen, Remix, etc.), using that codebase's component patterns, layout primitives, font loading conventions, and analytics. If no codebase exists yet, **Next.js (App Router) + a typed component library** is the recommended starting point: server-rendered, fast, and trivial to wire to a waitlist provider (Klaviyo, Resend, Mailchimp, Loops).

## Fidelity
**High-fidelity.** The HTML is pixel-considered: exact colours, typographic scale, spacing rhythm, and interaction states all match the WAER brand guidelines. Recreate the UI pixel-perfectly. All copy is final and approved.

## Screens / Views

There is **one screen** — a long single-page scroll. Sections, in order:

### 1. Site header (sticky)
- Three-column grid: `1fr auto 1fr`. Background `#EBE6E0` (core grey), bottom hairline `rgba(17,17,17,0.08)`.
- Padding `22px 36px`. Sticky to top, z-index 10.
- **Left:** nav links — `Shop`, `The Wardrobe`, `Journal`. 12px TO Leaf, uppercase, letter-spacing 0.1em, gap 28px.
- **Centre:** WAER wordmark `<img>` from `/assets/WAER_Wordmark_Black.png`, height 20px.
- **Right:** utility links — `Search`, `Account`, `Bag (0)`. Same treatment as nav.

### 2. Hero
- Background image: `/assets/product-detail-2.jpg` (orange-ground product shot of WAER case), `center / cover`, no repeat.
- Height: `calc(100vh - 64px)`, `min-height: 640px`, `max-height: 860px`.
- Foreground text positioned absolutely `top: 88px; left: 56px` (away from the case which sits bottom-right).
- **Eyebrow:** `A/W '26 — By invitation` — TO Leaf, 13px, uppercase, letter-spacing 0.22em, color `rgba(17,17,17,0.75)`.
- **Headline (H1):** `One scent was<br/>never enough.` — F37 Ginger, weight 500, font-size `clamp(48px, 7.2vw, 108px)`, line-height 0.96, letter-spacing -0.01em, uppercase, ink `#111`.
- **Hero meta strip** at `bottom: 40px; padding: 0 56px`, flex space-between: `WAER — Curate. Layer. Rotate.` and `Scroll to join`. 11px TO Leaf, uppercase, letter-spacing 0.2em.

### 3. Strap
- Padding `160px 36px 140px`, centered.
- Eyebrow `The Waitlist`, 28px margin-bottom.
- H2: `Fifteen scents.<br/>One considered<br/>rotation.` — F37 Ginger 500, `clamp(40px, 6.2vw, 92px)`, line-height 1.02, uppercase.
- Lede paragraph: TO Leaf 18px, line-height 1.55, color `--fg-soft`, max-width 560px, margin-top 36px. Copy: *"Your morning isn't your evening. Your Tuesday isn't your Saturday. A wardrobe of fragrance — styled, layered and rotated, matched to mood, moment and season. Doors open this autumn. First access is earned, not bought."*

### 4. Duotone strip (signature device)
- 8-cell horizontal grid (4 cells on mobile). Each cell `aspect-ratio: 1/1.3`. Bordered top + bottom hairline.
- Each cell is a 50/50 vertical split of two family colours, with `WAER` in F37 Ginger (uppercase, 500, ~28px) centered, in the **opposing** family colour, and an `n.NN` tag bottom-left.
- Family-colour pairs (left → right):
  1. Fougère `#8CB07D` / Spicy `#E82020` — wordmark spicy red, blend-mode screen
  2. Floral `#E050B0` / Fougère `#8CB07D` — wordmark white
  3. Amber `#B06820` / Vanilla `#F0D080` — wordmark ink
  4. Chypre `#607078` / Floral `#E050B0` — wordmark `#F7CDE6`
  5. Fresh `#4A90C8` / Citrus `#D8E040` — wordmark ink
  6. Green `#1A5030` / Moss `#68A850` — wordmark `#F5F1EA`
  7. Aldehydic `#387888` / Tropical `#40C8A0` — wordmark ink
  8. Woody `#761205` / Amber `#B06820` — wordmark `#F0D080`

### 5. Join (form + image, two-up)
- 2-column grid, min-height 720px. Stacks to single column under 900px.
- **Left pane** (`#FFFFFF`, padding `128px 80px`):
  - Eyebrow `Founding Rotation`.
  - H2 `Join the list.` (F37 Ginger 500, `clamp(36px, 3.8vw, 60px)`, max-width 11ch).
  - Body paragraph (TO Leaf 16px, max-width 46ch): *"We're letting a small group in first — to pair, layer and rotate before the doors open to anyone else. No launch emails. No countdowns. One note when your vials are ready."*
  - **Form row:** flex with bottom 1px ink border. Email `<input type="email">` (transparent, no border, 16px) + submit `<button>` (`Request access →`, 11px uppercase, letter-spacing 0.18em, hover opacity 0.55). On submit replaces button text with `You're on the list.`
  - Fine print: *"We only write when it matters. Unsubscribe any time."*
  - **Waitlist meta row** at margin-top 64px, hairline-top, three items, gap 48px:
    - `n.1,284` / `On the list`
    - `15` / `Named scents`
    - `A/W '26` / `Doors open`
    - Numbers: F37 Ginger 36px 500. Labels: TO Leaf 11px uppercase letter-spacing 0.14em color `--fg-muted`.
- **Right pane:** `<div>` with background `/assets/art-direction-vial-2.jpg`, `center/cover`.

### 6. Manifesto rows
- Centered intro: eyebrow `The System`, H2 `Built to be lived in.` (F37 Ginger 500, `clamp(36px, 5vw, 72px)`).
- Then a hairline-ruled stack of 4 rows, each: 4-column grid `80px 1.4fr 2fr 120px`, padding `36px`, hover `background: rgba(17,17,17,0.02)` (260ms standard ease).
  - **n.01** — `One case. Fifteen moods.` — *"A single refillable case, debossed with the monogram. Vials seat in, vials swap out. Carried like a decision — changed like an outfit."* — tag `The object`
  - **n.02** — `Paired, not signed.` — *"Every scent belongs to two olfactory families — a duotone, not a monogram. Wear one. Layer two. Rotate through the week."* — tag `The system`
  - **n.03** — `Ten millilitres. Full-bodied.` — *"Our signature vial format. Portable, refillable, long-lasting. Developed with perfumers in Grasse — made in France, built to last."* — tag `The vial`
  - **n.04** — `Refillable by design.` — *"Buy the case once. The scents rotate. No throwaway glass, no drawers of half-finished bottles — only the part you're wearing today."* — tag `The principle`
- Number col: TO Leaf 12px uppercase muted. Title col: F37 Ginger 500 `clamp(22px, 2.2vw, 32px)`. Desc col: TO Leaf 15px `--fg-soft`. Tag col: 11px uppercase muted, right-aligned.

### 7. Pull quote (full-bleed dark)
- Background ink `#111`, color core grey `#EBE6E0`, padding `160px 36px`, centered.
- `<blockquote>`: F37 Ginger 500, `clamp(36px, 5vw, 80px)`, line-height 1.04, letter-spacing -0.01em, uppercase, max-width 22ch.
  - Copy: *"The part of your outfit no one sees. Everyone notices."*
- Attribution: `— Atmosphere no. 07`, 11px TO Leaf uppercase letter-spacing 0.2em, margin-top 48px, color `rgba(235,230,224,0.6)`.

### 8. FAQ
- Padding `140px 36px`.
- Two-column header: H3 `A few things, before you ask.` (left) + lede paragraph (right). Hairline below.
- Then 5× `<details>` rows with bottom hairline:
  - `When do the doors open?` — *"Autumn / Winter 2026. The waitlist gets forty-eight hours of exclusive access before anything is public, and the first hundred cases are reserved for the founding rotation."*
  - `What arrives in the box?` (open by default) — *"One case, three vials of your choosing, and a single-fold card with the pairing notes. The case is yours for life. Vials rotate through the seasons — refill, swap, layer, or save."*
  - `How long does a vial last?` — *"A 10ml vial holds roughly 160 sprays — six to eight hours of longevity on skin. Most wearers rotate through two or three in a season."*
  - `Where is it made?` — *"France, in partnership with two independent perfumery houses in Grasse and Versailles. 100% natural eau de parfum, vegan, never tested on animals."*
  - `Can I change my mind?` — *"Always. Unsubscribe from the list with one click. If you've ordered, thirty days to return — we cover the postage."*
- Summary: F37 Ginger 500, `clamp(18px, 1.8vw, 24px)`, uppercase. Plus glyph rotates 45° to × on open (260ms standard ease). Body: TO Leaf 15px `--fg-soft` max-width 60ch.

### 9. Footer (dark)
- Background ink, padding `100px 36px 40px`, color core grey.
- **CTA row** (2-col, gap 80px, hairline-bottom 72px down):
  - H3 `We look forward to seeing your rotations.` (F37 Ginger 500, `clamp(32px, 3.8vw, 56px)`).
  - Second email form + fine print *"No launch blasts. One letter when doors open."*
- **Link cols** (4 columns, gap 48px, padding `56px 0 80px`):
  - Brand col: `WAER` heading + paragraph (*"A considered collection of fragrances designed to be styled, layered and rotated. Curate. Layer. Rotate."*).
  - `Follow` — Instagram, TikTok, Substack
  - `About` — Our story, Perfumers, Journal
  - `Support` — Contact, Shipping, Terms
- **Oversized wordmark:** `WAER` set in F37 Ginger 500, `clamp(96px, 18vw, 280px)`, line-height 0.9, centered, margin `24px 0 36px`.
- **Fine bar:** hairline-top, flex space-between, 11px uppercase muted: `© WAER 2026 — Made in France` and `n.01 → n.15`.

## Interactions & Behavior

- **Hover:** all `<a>` and `<button>` drop opacity to 0.6 over 160ms (`cubic-bezier(0.2, 0, 0, 1)`).
- **Press:** subtle `translateY(1px)` on buttons.
- **Form submit:** prevent default; replace button text with `You're on the list.` (top form) or `Added.` (footer form). In production, POST to your waitlist endpoint and show a real success state — keep the **same in-place text-replacement pattern** rather than a modal or page nav.
- **FAQ:** native `<details>`. Custom plus glyph rotates 45° on open (260ms standard ease).
- **Manifesto rows:** background tint on hover (`rgba(17,17,17,0.02)`, 260ms).
- **Sticky header.** No scroll-jacking, no parallax, no fancy animations. WAER's motion is restrained.

## State Management

Minimal. The only stateful piece is the **waitlist form**:
- `email` (string, required, validate format).
- `submitting` (bool).
- `submitted` (bool — flips button text and disables input).
- On submit: POST to `/api/waitlist` (or your provider's endpoint). On success, show inline confirmation. On error, show inline error message under the form (TO Leaf 12px, color `#761205` woody/red).

Recommended endpoint shape: `POST { email } → { ok: true, position: 1285 }`. The returned `position` could be reflected back into the meta `n.X,XXX` counter to make it feel live.

## Design Tokens

All tokens are in `colors_and_type.css` — import that file and use the CSS custom properties directly, OR translate to your design-token system (Tailwind theme, Style Dictionary, etc.).

### Colours
| Token | Value | Use |
|---|---|---|
| `--waer-core-grey` | `#EBE6E0` | Primary surface |
| `--waer-white` | `#FFFFFF` | Secondary surface (form panel) |
| `--waer-ink` | `#111111` | Type, dark surfaces |
| `--waer-ink-soft` | `#2A2724` | Body copy |
| `--fg-muted` | `#6F6A64` | Secondary labels |
| `--rule` | `rgba(17,17,17,0.14)` | Hairlines on light |
| `--rule-soft` | `rgba(17,17,17,0.08)` | Soft hairlines |

### Fragrance family palette (used in duotone strip)
Floral `#E050B0` · Fougère `#8CB07D` · Chypre `#607078` · Woody `#761205` · Citrus `#D8E040` · Gourmand `#E8A840` · Fruity `#E87848` · Fresh `#4A90C8` · Spicy `#E82020` · Musk `#D4A090` · Ozonic `#60B0E0` · Green `#1A5030` · Moss `#68A850` · Aromatic `#A8C870` · Leather `#B09078` · Dry `#B8B098` · Aldehydic `#387888` · Tropical `#40C8A0` · Vanilla `#F0D080` · Amber `#B06820` · White-Floral `#F8F0F4` · Powdery `#C8B8B0`

### Typography
- **Display — F37 Ginger** (uppercase only, weight 500, letter-spacing -0.005em, leading 1.04). Bundled `fonts/F37Ginger-Regular.otf` is the **trial cut** — replace with the licensed production file before going live.
- **Body — TO Leaf** (sentence case, weight 400, letter-spacing 0). Bundled `fonts/ToLeaf-Regular.otf`.
- Load with `@font-face` (see `colors_and_type.css`) or with `next/font/local`.

### Spacing scale (8px base, 4px fine step)
0, 4, 8, 12, 16, 24, 32, 48, 64, 96, 144 px.

### Radii
Mostly **0**. Rectilinear is the brand. Only pills/buttons use `999px` (none on this page).

### Shadows
Effectively none. Photography carries any softness.

### Motion
- `--ease-standard: cubic-bezier(0.2, 0, 0, 1)` — UI transitions.
- `--ease-out: cubic-bezier(0.16, 1, 0.3, 1)` — content enter.
- Durations: 160ms / 260ms / 520ms.

## Assets

All in `assets/`:
- `WAER_Wordmark_Black.png` — header wordmark (3000×734, will need responsive sizing).
- `WAER_Wordmark_White.png` — included for dark surfaces (currently unused on waitlist — footer uses type-set "WAER" instead).
- `product-detail-2.jpg` — hero background. Orange-ground product shot.
- `art-direction-vial-2.jpg` — Join section right-pane image.
- `favicon-grey-black.png` — favicon.

In production, convert PNGs/JPGs to AVIF/WebP, generate `srcset` for responsive widths, and lazy-load below-the-fold images.

## Responsive

Single breakpoint at **900px**. Below:
- Header collapses (hide `.nav`, leave wordmark + utils).
- Hero text reflows to 24px gutter, smaller meta strip stacked.
- Duotone strip becomes 4 columns.
- Join becomes single column (image stacks above form, min-height 420px).
- Manifesto rows become single-column (no num/tag side cols).
- Footer CTA stacks. Footer cols become 2×2.

For production, recommend introducing an additional **600px** breakpoint for tighter type scales and stack adjustments.

## Files

In this bundle:
- `Waitlist.html` — the design reference. Self-contained except for the `colors_and_type.css` import.
- `colors_and_type.css` — design tokens + base type styles.
- `fonts/` — F37 Ginger (trial) + TO Leaf.
- `assets/` — images referenced by the page.

## Notes for the developer

1. **Headings are uppercase via `text-transform`**, not in source. Keep it that way for screen-reader correctness.
2. **The "+" glyph in FAQ** is a literal `+` character rotated, not an icon. Keep this; SVG would be overkill.
3. **Wordmark assets are 3000px wide** — always cap with `height` + `max-width` and `width: auto`. We had a footgun where unconstrained `<img>` tags blew out their containers.
4. **Voice is non-negotiable.** Copy is final and approved by brand. Don't paraphrase, don't add adjectives, don't insert emoji. If you need additional copy for a state we missed (e.g. error states), match the tone: declarative, intimate, sentence case body, all-caps display, no exclamation marks.
5. **No analytics events are wired up.** Wire your standard event taxonomy: `waitlist_view`, `waitlist_submit`, `waitlist_success`, `waitlist_error`. Include `position_in_section` on submit.

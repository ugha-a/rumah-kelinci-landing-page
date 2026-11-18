---
name: Rumah Kelinci Padel
description: A padel club and cafe in central Makassar, laid out on the court's own plan.
colors:
  court: "#1c4fa8"
  court-deep: "#173f88"
  surround: "#0b1b33"
  surround-raised: "#11264a"
  line: "#f7f9fc"
  line-soft: "#c9d6ee"
  ball: "#ddeb3b"
  ink: "#0b1b33"
typography:
  display:
    fontFamily: "Big Shoulders Display, Arial Narrow, ui-sans-serif, sans-serif"
    fontSize: "clamp(3.5rem, 6.6cqw, 6rem)"
    fontWeight: 900
    lineHeight: 0.86
    letterSpacing: "-0.01em"
  headline:
    fontFamily: "Big Shoulders Display, Arial Narrow, ui-sans-serif, sans-serif"
    fontSize: "clamp(2.6rem, 5vw, 4.2rem)"
    fontWeight: 900
    lineHeight: 0.9
  figure:
    fontFamily: "Big Shoulders Display, Arial Narrow, ui-sans-serif, sans-serif"
    fontSize: "clamp(2.4rem, 4.4cqw, 4rem)"
    fontWeight: 800
    lineHeight: 0.95
    fontFeature: "\"tnum\" 1"
  title:
    fontFamily: "Big Shoulders Display, Arial Narrow, ui-sans-serif, sans-serif"
    fontSize: "2rem"
    fontWeight: 800
    lineHeight: 1
  lead:
    fontFamily: "Archivo, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(1.1rem, 1.65cqw, 1.45rem)"
    fontWeight: 500
    lineHeight: 1.375
  body:
    fontFamily: "Archivo, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.125rem"
    fontWeight: 400
    lineHeight: 1.625
  label:
    fontFamily: "Archivo, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.7rem"
    fontWeight: 600
    lineHeight: 1.5
    letterSpacing: "0.12em"
rounded:
  none: "0px"
  full: "9999px"
spacing:
  gutter-phone: "16px"
  gutter-tablet: "24px"
  gutter-desktop: "40px"
  block: "56px"
  section: "80px"
  section-lg: "112px"
components:
  action-ball:
    backgroundColor: "{colors.ball}"
    textColor: "{colors.ink}"
    rounded: "{rounded.full}"
    padding: "0 20px"
    height: "44px"
  action-ball-lg:
    backgroundColor: "{colors.ball}"
    textColor: "{colors.ink}"
    rounded: "{rounded.full}"
    padding: "0 28px"
    height: "52px"
  action-ball-hover:
    backgroundColor: "{colors.line}"
    textColor: "{colors.ink}"
  action-line:
    backgroundColor: "transparent"
    textColor: "{colors.line}"
    rounded: "{rounded.full}"
    padding: "0 20px"
    height: "44px"
  action-line-hover:
    backgroundColor: "{colors.line}"
    textColor: "{colors.ink}"
  field-underline:
    backgroundColor: "transparent"
    textColor: "{colors.line}"
    rounded: "{rounded.none}"
    padding: "0"
    height: "44px"
  nav-bar:
    backgroundColor: "{colors.surround}"
    textColor: "{colors.line-soft}"
    height: "64px"
  court-surface:
    backgroundColor: "{colors.court}"
    textColor: "{colors.line}"
    rounded: "{rounded.none}"
  photo-slot:
    backgroundColor: "{colors.surround-raised}"
    textColor: "{colors.line-soft}"
    rounded: "{rounded.none}"
    padding: "20px"
---

# Design System: Rumah Kelinci Padel

## Overview

**Creative North Star: "The Court Plan"**

The page is a padel court seen from above. Its ground is the drenched blue of the playing surface, its structure is painted white line work drawn to the real 10 × 20 m geometry, and everything outside the court sits in a deep navy surround, the way the floor around a court reads at night. Content is placed into the court's own zones (back zones, service boxes, the net) rather than into cards, and later sections keep the same grammar: thick painted rules divide, short line dashes mark lists, and the surface alternates between surround and court blue as the visitor walks "on" and "off" court.

The voice is sign-painted and athletic: a condensed, very heavy uppercase display face for names, headings, prices and scores; a sturdy grotesque for reading. Density is low and confident. One yellow, the colour of the ball, is the only warm thing on the page and it only appears where the ball would: the actions, the served ball, the ball mark, and interactive state.

Motion is a single sporting gesture: on load the court lines draw themselves in play order, the net drops in, then the ball is served once across the net into the opposite service box and stays there. Nothing loops.

**Key Characteristics:**
- Court blue drench on a navy surround; no light theme (`color-scheme: dark`).
- White line work at true court proportions; lines, not boxes.
- Ball yellow is rare and always means "the ball" or "act here".
- Condensed black-weight uppercase display over a plain, readable grotesque.
- Square everything, except the pill-shaped actions.
- Flat; depth comes from surface change, not shadow.

## Colors

A two-blue world with a white line layer and a single yellow ball.

### Primary
- **Ball Yellow** (`ball`): the padel ball. Fills every primary action (Booking, Booking di AYO, Cari sesi di Reclub), the served ball and its dashed trail and target ring, and the wordmark's ball mark. Also the interaction state colour: 3px focus outline, text selection, caret, and the underline of a focused form field.

### Neutral
- **Court Blue** (`court`): the playing surface. The hero court and the drenched "on court" sections (Lapangan, Komunitas).
- **Deep Court** (`court-deep`): the four small court tiles in the Lapangan section, and the chip that masks the net behind each court number.
- **Night Surround** (`surround`): the page ground, the nav bar, everything outside the court.
- **Raised Surround** (`surround-raised`): placeholder photo slots and the map frame before tiles load.
- **Court Line White** (`line`): all painted lines, headings and primary text; also the hover fill of every action.
- **Faded Line** (`line-soft`): secondary text, captions, units ("/ sesi"), sources. Used at 80% for fine print.
- **Ink** (`ink`): text on ball yellow and on white hover fills. Same value as Night Surround; kept as a separate role.

### Named Rules
**The Only-The-Ball Rule.** Ball yellow appears only where the ball is: actions, the served ball, the ball mark, and focus/selection/caret/active-field state. Never as a heading colour, a section fill, a decorative accent or a highlight on facts.

**The On-Court / Off-Court Rule.** A section is either on court (court blue fill) or off court (navy surround). There is no third surface colour for sections; raised surround is only for empty media slots.

## Typography

**Display Font:** Big Shoulders Display (with Arial Narrow, sans-serif), weights 700–900 loaded, 800 and 900 used.
**Body Font:** Archivo (with ui-sans-serif, system-ui), weights 400–700 loaded, 400/500/600 used.

Both are self-hosted through the Vite fonts pipeline (Bunny source), exposed as `--font-display` and `--font-sans`.

**Character:** A tall, sign-painted condensed face that reads like stencilled court markings and scoreboard numerals, paired with a neutral, slightly wide grotesque that stays quiet and legible on phones.

### Hierarchy
- **Display** (900, clamp(3.5rem, 6.6cqw, 6rem) on the landscape court, 12.5cqw on the portrait court, line-height 0.86, uppercase): the venue name inside the court only. Sized in container units so it scales with the court, not the viewport.
- **Headline** (900, clamp(2.6rem, 5vw, 4.2rem), line-height 0.9, uppercase, balanced): one per section, in plain Indonesian ("Papan skor dari pemain", "Semua yang ada di luar garis").
- **Figure** (800–900, tabular numerals, line-height 0.95–1): prices and scores. Price clamp(2.4rem, 4.4cqw, 4rem); headline score 900 clamp(3rem, 6vw, 4.6rem); sub-scores 800 clamp(2rem, 3.6vw, 2.8rem); court numbers 900 up to 6rem.
- **Title** (800, 2rem, line-height 1, uppercase): sub-group headings such as the facility columns; the booking block heading runs 900 at 2.4rem.
- **Lead** (500, clamp(1.1rem, 1.65cqw, 1.45rem), line-height 1.375, max 28ch): the hero hook below the centre line.
- **Body** (400, 1.125rem, line-height 1.625, 42–48ch): section copy, mostly in Faded Line on surround and Court Line White on court blue.
- **Label** (600, 0.7rem, 0.12em tracking, uppercase): form field labels only. Scoreboard row labels use 600 uppercase at clamp(1rem, 1.6vw, 1.2rem); court captions 600 uppercase with 0.06–0.1em tracking.

### Named Rules
**The Painted-Numbers Rule.** Every number that matters (price, score, court number) is set in the display face with tabular numerals. Body copy never carries the key figure alone.

**The No-Kicker Rule.** Headings stand alone; no eyebrow labels above them. Uppercase tracked small text is reserved for form labels and captions under objects.

## Layout

**The court is the grid.** The hero is a court plan with the content grid laid over it at the court's own proportions: back zone 3.05 m and service box 6.95 m of a 20 m length, so the landscape grid is 15.25% / 34.75% / 34.75% / 15.25% across two rows (left and right halves of the court), and the portrait grid is the same four values down two columns.

- **Landscape court (≥1024px):** 2:1, width `min(100%, (100svh − 9.5rem) × 2)` so the whole court fits the first screen, minimum 960px. Zones: left back zone = address; left service box top = venue name; left service box bottom = hook; right service box top = price + Booking di AYO; right service box bottom = WhatsApp zone; right back zone = hours, route, Instagram.
- **Portrait court (<1024px, tablets included):** 1:2, max 440px wide, centred. Top back zone = venue name; first service boxes = price + Booking and the hook; second service boxes = WhatsApp and hospitality line; bottom back zone = address + Rute.
- **Zones** pad in container units (1.6–2.4cqw landscape, 5cqw portrait) so text keeps its distance from the painted lines at every size.

Below the hero the page runs on a 1200px container (nav 1440px) with side gutters of 16 / 24 / 40px (phone / sm / lg). Sections pad 80px vertically, 112px from lg (the Komunitas band 96px). Headline to content is 48–56px. Two-column sections split asymmetrically (1.1–1.35fr : 1fr) and align to the bottom edge; they stack below 1024px. The four mini courts stay in a four-column row at every width.

## Elevation & Depth

Flat. Depth is surface change (navy surround versus court blue) and the weight of painted lines, not shadow. Two shadows exist and both are small, functional exceptions.

### Shadow Vocabulary
- **Ball lift** (`box-shadow: 0 6px 14px -6px rgb(6 13 26 / 0.6)`): under ball-yellow actions only, so the ball sits on the surface.
- **Court slab** (`box-shadow: 0 40px 80px -40px rgb(0 0 0 / 0.6)`): under the landscape hero court only, to lift the court off the surround.

The sticky nav is Night Surround at 90% with a medium backdrop blur and a 1px Court Line White hairline at 10% below it.

### Named Rules
**The Painted-Not-Lifted Rule.** Surfaces never float. New elements get structure from a line, not from a shadow.

## Shapes

Square corners everywhere: court surfaces, photo and map frames, form fields (`rounded-none`). The one round shape is the ball, and actions borrow it: every action is a full pill. Inside the court plan, line ends are square-capped like painted tape; only the serve trail has round caps.

**Line weights** are the world's material:
- **Court lines:** stroke 10 units on a 2000 × 1000 plan (5 cm, the real line width), square caps. Mini court tiles use 16 units so they survive at small sizes.
- **Net:** 2.4 × the line weight at 85% opacity, overhanging each sideline by 18 units.
- **Structural rules:** 2px solid Court Line White (scoreboard top and bottom, facility column dividers, Komunitas band, media frames, booking block divider).
- **Hairlines:** 1px Court Line White at 10–30% (nav and footer edges, table rows, hospitality list top rule).
- **List dashes:** 12 × 2px Court Line White bars in place of bullets, like short painted line segments.
- **Field rule:** a 2px underline at 70% white, turning ball yellow on focus.

### Named Rules
**The Lines-Not-Boxes Rule.** Content is framed by lines (a top rule, a divider, a court zone), never by a filled, padded, rounded card. A 2px frame is reserved for media (photo, map) where the frame is the court line around a picture.

## Components

### Buttons (ActionLink)
Pill-shaped and ball-coloured: actions are the ball on the court.
- **Shape:** full pill (`rounded.full`), semibold Archivo, icon gap 10px, no wrapping.
- **Ball (primary):** Ball Yellow fill, Ink text, ball lift shadow. Sizes md (44px, 0.95rem) and lg (52px, 1rem); the nav and small zone variants run 40px at 0.875rem.
- **Line (secondary):** transparent, Court Line White text, 2px inset ring at 80% white. Used for WhatsApp, Instagram, Google Maps and "Cek slot di AYO".
- **Hover:** both variants fill Court Line White with Ink text; 300ms on the expo-out curve. Pressed: 1px down.
- **External links** carry a trailing up-right arrow (16px, 1.8 stroke) that nudges 2px up-right on hover and open in a new tab.
- **Focus:** global 3px Ball Yellow outline, 3px offset.

### Inputs / Fields (BookingComposer)
Fields are court lines you write on.
- **Style:** no box, no fill, square; a 2px underline at 70% white; 44px tall; 1rem medium Archivo with tabular numerals. Native date/time pickers have their indicators inverted to white.
- **Label:** Label style above each field (Tanggal, Jam, Durasi), Faded Line.
- **Focus:** the underline turns Ball Yellow; no outline ring.
- **Live message:** the composed WhatsApp text sits under a 1px 60% white left rule, updating as fields change (`aria-live="polite"`). The compact variant inside the hero drops it.
- **Pending state:** while no WhatsApp number is configured, the composer is replaced by a short note and a line-variant "Cek slot di AYO" action.

### Navigation (SiteNav)
- **Style:** slim 64px Night Surround bar above the court, sticky, never painted on the court.
- **Wordmark:** ball mark + "RUMAH KELINCI" in display 800 at 1.45rem, "PADEL" in Faded Line.
- **Links:** Archivo 500 at 0.95rem, Faded Line, turning Court Line White with an underline on hover; hidden below 1024px.
- **Action:** a 40px ball Booking pill, always present at every width.

### Court Plan (signature)
An SVG plan of the real court, used for the hero and the four mini courts.
- **Geometry:** 2000 × 1000 units (cm). Back walls, sidelines, service lines 305 units from each wall (6.95 m from the net), centre service line overrunning each service line by 20, net across the middle. Portrait is the same plan rotated, not redrawn.
- **Serve:** a straight cross-court line from the left back zone (lower half) to the opposite service box, crossing the net, drawn as a 3px dashed Ball Yellow trail at 75%; the ball (radius 15) comes to rest inside a 2px target ring at 55%.
- **Variants:** `animated` (draws on mount, hero), `animateInView` (draws when 15% visible, mini courts), `showServe`, `lineWidth`.

### Court Zones
Zones are bare grid cells over the plan: no background, no border; the painted lines are their edges. Text inside a zone uses container-unit padding and sizes.

### Scoreboard
A typographic table, not a widget: 2px rules top and bottom, 1px 25% row dividers, uppercase semibold row labels left, display figures right (overall 4,9 largest, sub-scores two decimals). Source link and check date sit beside it.

### Media Frames (VenuePhoto, map)
Square, 2px Court Line White frame, 4:3 (5:4 for the cafe on desktop). Empty slots are Raised Surround with an honest caption naming the file the owner should drop in. The map iframe is slightly desaturated (saturate 0.75, contrast 1.05).

### Motion
- **Line draw:** each court line draws via stroke-dashoffset over 1.1s on the expo-out curve, in play order (outline 0–0.24s, service lines 0.32s, centre line 0.44s, net 0.56s).
- **Serve once:** at 1.05s the ball travels the serve path over 0.95s (spline 0.3 0.1 0.35 1), its radius swelling to 1.7× at mid-flight to read as the top of the arc; the trail reveals with it; the target ring rises in at 1.95s. Then everything holds still.
- **In-view draw:** mini courts start hidden-but-pending and draw when 15% visible; if the observer never fires, they draw anyway after 6s so lines are never lost.
- **Reduced motion:** no drawing, lines render complete; the ball is placed at rest on its target with the ring; smooth scrolling is off.

## Do's and Don'ts

### Do:
- **Do** place hero content into court zones at the court's real proportions (15.25 / 34.75 / 34.75 / 15.25).
- **Do** use landscape court from 1024px and the portrait court below it, so the whole court is the first screen.
- **Do** frame and divide with 2px Court Line White rules, 1px hairlines at 10–30%, and 12 × 2px dashes for lists.
- **Do** keep Ball Yellow for actions, the served ball, the ball mark and interactive state.
- **Do** set prices, scores and court numbers in the display face with tabular numerals.
- **Do** alternate on-court (court blue) and off-court (navy) sections.
- **Do** keep motion to one gesture: lines draw, the ball is served once, then stillness; honour reduced motion with the finished state.

### Don't:
- **Don't** use rounded, filled or shadowed cards; lines, not boxes.
- **Don't** round anything except actions (pills) and the ball itself.
- **Don't** use Ball Yellow for headings, fills, highlights or decoration.
- **Don't** add a third section surface colour or a light theme.
- **Don't** paint the nav on the court; the nav belongs to the surround.
- **Don't** add shadows beyond the ball lift and the hero court slab.
- **Don't** loop or repeat the serve, or animate lines on every scroll.
- **Don't** put eyebrow labels above headings.

---
version: 1
slug: 'resources-js-pages-welcome-tsx'
primary_target: 'resources/js/pages/welcome.tsx'
related_targets: []
---

# Landing page — Rumah Kelinci Padel

Scope: `/` (welcome page). Mode: Persuade.

Audience: Makassar players of every level plus cafe visitors, mostly on phones from Instagram/TikTok/Reclub/Maps. Job: decide to come and book. Action: book on AYO (primary), ask for a slot on WhatsApp (secondary, composed in-page). Proof: AYO rating 4.9 (94 ratings) and its sub-scores, 4 international-standard courts, verified facility list, price "mulai Rp150.000/sesi". Constraints: hours, WA number, photos unknown → placeholders in `resources/js/data/venue.ts`; no invented testimonials or events.

Memorable moment: the first screen is a padel court seen from above, drawn to the real 10×20 m geometry, lying sideways on desktop and upright on phones; the booking form sits in the service boxes.

Unresolved: real photos, logo, opening hours, WhatsApp number.

## Direction contract

THESIS: The page is laid out on a padel court's own geometry — the 10×20 m plan, the net, the service lines — instead of the category's photo hero over a row of facility cards.

OWN-WORLD: Drenched court blue (#1C4FA8) as the ground, painted white line work at true court proportions, deep navy (#0B1B33) for the surround outside the court, ball yellow (#DDEB3B) for the only actions. Condensed sign-painted display face (Big Shoulders Display), Archivo for reading. Lines, not boxes: content is framed by court lines, never cards.

STORY: Visitor sees a real court and an obvious "Booking" action, learns 4 courts + cafe under one roof, sees AYO's 4.9 score, scans what's included before/during/after play, finds the place, books.

FIRST VIEWPORT: Full-width court plan, landscape from 1024px and portrait below (under 1024px the landscape service boxes are too small for the booking zone, so tablets get the portrait court). Landscape: venue name huge in the left service box, hook below the centre line, address in the left back zone; net down the centre with the straight serve line crossing it; right service boxes hold price + AYO button (ball yellow) and the WhatsApp zone. Portrait: name in the top back zone, price + AYO in the first service box, so the whole court is the first screen. Nav is a slim navy bar above the court (the surround), not painted on the court.

FORM: Denah Lapangan — padel court plan; candidate 1 of 7 on the ordered list (user picked it over the rolled #4 "Papan Kedai"). seed:d1037df6e3afaed4

Signature interaction: on load the court lines draw themselves, then the ball travels the serve path once; WhatsApp composer writes the message live as fields change.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance

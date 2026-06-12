# Prompt for Codex / Replit AI: Update Onedays Plumbing Services Website

Copy everything below into Codex / Replit's AI assistant. The existing repo
contains `index.html`, `app.js`, `robots.txt`, and `sitemap.xml`. Upload the
following assets to the project root (or an `/assets` folder) before running
this prompt:

- `logo.png` — Onedays Plumbing Services logo (blue pipe + water drop logo)
- `bathroom-install.jpg` — completed bathroom installation photo
- `heat-pump-install.jpg` — Aqua Heat hot water heat pump installation photo
- `team-member.jpg` — photo of plumber on site holding a pipe (team/about photo)
- `job-video-1.mp4` — site work video clip
- `job-video-2.mp4` — site work video clip

---

## TASK OVERVIEW

Update the existing single-page Tailwind/vanilla-JS website for "Onedays
Plumbing Services" (a Cape Town plumbing company). Keep the existing dark
"brandDark/brandAccent" design system, fonts (Inter + JetBrains Mono), color
palette, and overall visual style — extend it, don't replace it. The site
must remain fully responsive and mobile-first; test all new sections at
320px, 375px, 768px, 1024px, and 1440px widths.

---

## 1. LOGO & BRAND IMAGERY

- Replace the current placeholder SVG circle logo in the navbar (`<header
  id="navbar">`) and footer with the uploaded `logo.png`. Size it
  appropriately (e.g. `h-9 w-auto` in the navbar, slightly larger in the
  footer), keep it crisp on retina screens, and ensure it has proper
  `alt="Onedays Plumbing Services logo"` text.
- Use `logo.png` as the favicon (generate appropriate `<link rel="icon">`
  tags / sizes) and as the Open Graph image (`og:image`) if no better photo
  is available.
- Add a new "Our Work" / "Recent Projects" gallery section (place it after
  the "Why Onedays" section and before "Testimonials"). In this section:
  - Display `bathroom-install.jpg` and `heat-pump-install.jpg` as a 2-column
    (stacking to 1-column on mobile) image grid inside `feature-card`
    styled containers, each with a short caption (e.g. "Full Bathroom
    Renovation — Cape Town" and "Heat Pump Geyser Installation —
    Aqua Heat").
  - Include `team-member.jpg` in an "About Our Team" sub-section with a
    short paragraph about the team being hands-on, hardworking, and
    locally based.
  - Embed `job-video-1.mp4` and `job-video-2.mp4` as responsive `<video>`
    elements (with `controls`, `playsinline`, `muted`, `loop` disabled,
    and a `poster` attribute if possible) inside the same gallery section,
    captioned "Onedays Plumbing in Action". Ensure videos don't autoplay
    and don't break layout on mobile (use `w-full h-auto rounded-2xl`).
  - Use `loading="lazy"` on all images and `preload="metadata"` on videos
    for performance.

---

## 2. ADD NEW SERVICES: PAINTING & ELECTRICAL

In the `#services` "Core Specialties" grid (currently 6 cards), add two new
`feature-card` articles matching the existing style (icon, title,
description, accent bullet):

- **Painting Services** — Interior and exterior painting, waterproofing
  touch-ups after plumbing repairs, wall patch-and-paint after pipe access
  work, and full property repaints. Bullet: "Free color consultation".
- **Electrical Services** — Qualified electrical repairs and installations,
  geyser element & thermostat wiring, plug points, light fittings, DB board
  inspections, and COC (Certificate of Compliance) issuing. Bullet:
  "Certified & COC compliant".

Use simple line-icon SVGs consistent with the existing icon style (stroke
`#00C8FF`, `stroke-width="1.8"`, 22x22 viewbox) — e.g. a paint roller icon
for Painting and a lightning bolt/plug icon for Electrical.

Update the footer "Services" list to include "Painting" and "Electrical"
links pointing to `#services`.

---

## 3. FLOATING WHATSAPP BUTTON & STICKY CALL BUTTON

Add a fixed-position floating action button cluster (bottom-right corner,
`fixed bottom-5 right-5 z-50 flex flex-col gap-3`) visible on all pages and
all screen sizes:

- **WhatsApp button**: circular button (`w-14 h-14 rounded-full`), green
  background (`#25D366`) with the existing WhatsApp SVG icon, linking to
  `https://wa.me/27653270980`. Add a subtle pulse/glow animation consistent
  with the existing `.live-dot` pulse style. Include `aria-label="Chat on
  WhatsApp"`.
- **Call button**: circular button (`w-14 h-14 rounded-full`) using the
  `btn-primary` gradient style, with a phone icon, linking to
  `tel:+27653270980`. Include `aria-label="Call Onedays Plumbing"`.
- On mobile, ensure these buttons don't overlap the urgency radio buttons or
  form fields — add bottom padding to the page body if needed (e.g.
  `padding-bottom: 5rem` on mobile only) so the floating buttons never cover
  content.
- These buttons should be added once in a shared location (e.g. just before
  `</body>` in `index.html`, and replicated in the new Privacy/Terms/FAQ
  pages) so they appear site-wide.

---

## 4. UPDATE ALL CONTACT NUMBERS TO 065 327 0980

Replace **every** instance of the placeholder phone number `000 000 0000`
and `tel:+27000000000` throughout `index.html`, `app.js`, and any new pages
with the real number: **065 327 0980** (formatted for display) and
`tel:+27653270980` (for `tel:` links). This includes:

- Navbar "Call Now" button
- Hero "Call Direct" CTA
- Emergency banner "Emergency Line" button
- WhatsApp links (`https://wa.me/27653270980`)
- Contact section direct-contact card
- Form success message
- Footer contact list
- New floating Call/WhatsApp buttons

Double-check the WhatsApp `wa.me` links use the international format without
the leading 0 (i.e. `27653270980`).

---

## 5. CONTACT / QUOTE FORM — NETLIFY FORMS

The existing `#lead-capture-form` (in the Contact section) is already wired
for Netlify Forms (`data-netlify="true"`, `netlify-honeypot="bot-field"`,
hidden `form-name` input) and has a fetch-based submit handler in `app.js`.
Keep this form and:

- Ensure the static HTML form exists **unmodified and uncommented** in
  `index.html` at build time so Netlify's build bot can detect it (Netlify
  scans the raw HTML for forms with `data-netlify="true"` — do not render
  this form purely via JS).
- Add a `<form name="onedays-lead-form" netlify hidden></form>` static
  duplicate placed once near the top of `index.html` (e.g. just inside
  `<body>`, visually hidden with `class="hidden"`) ONLY IF the existing form
  isn't being detected — otherwise skip this, since the visible form should
  be sufficient.
- Confirm `app.js`'s `initLeadForm()` submission logic (Netlify fetch POST
  to `/`, fallback to native form submit, GA4 `generate_lead` event) still
  works correctly and is referenced from any new pages that might also need
  a mini contact CTA.
- Create a proper `/thank-you` page (`thank-you.html`) matching the site's
  dark theme, with a success message and a link back home, since the form
  `action="/thank-you"` currently points to a route with no page. Keep this
  page `noindex` (add `<meta name="robots" content="noindex">`) and ensure
  `robots.txt`/`sitemap.xml` settings (already disallow `/thank-you`) remain
  consistent.

---

## 6. NEW PAGES: PRIVACY POLICY & TERMS AND CONDITIONS

Create two new static pages — `privacy.html` and `terms.html` — matching the
site's existing dark theme (same navbar, footer, fonts, color variables,
floating buttons). Link them from the footer (`/privacy` and `/terms` links
already exist in `index.html` — point them to these new files).

**Privacy Policy (`privacy.html`)** should cover, in plain language suited
for a South African small business and POPIA (Protection of Personal
Information Act) compliance:

- What personal information is collected (name, phone number, email,
  suburb/address, service request details) via the contact/quote form.
- Why it's collected (to respond to quote requests, schedule jobs,
  communicate about bookings).
- How it's stored and processed (via Netlify Forms / form submissions),
  and that it is not sold or shared with third parties except as required
  to provide the service (e.g. scheduling).
- Data retention — how long enquiries are kept.
- User rights under POPIA (right to access, correct, or request deletion
  of their information), and contact details (info@onedaysplumbing.co.za)
  for such requests.
- Cookies/analytics disclosure — mention Google Analytics (GA4) is used to
  understand site traffic, and that users can opt out via browser settings.
- Effective date and a note that the policy may be updated periodically.

**Terms and Conditions (`terms.html`)** should cover:

- General terms of using the website (informational purposes, quote
  requests do not constitute a binding contract until confirmed).
- Service terms — quotes are estimates pending an on-site assessment;
  final pricing confirmed in writing before work begins.
- Payment terms (placeholder: payment due on completion unless otherwise
  agreed in writing).
- Workmanship guarantee — reference the existing "12-month workmanship
  guarantee" mentioned on the homepage, with conditions (covers
  workmanship/parts installed by Onedays, excludes damage from unrelated
  causes or third-party work).
- Liability limitations (standard reasonable-care disclaimer; Onedays not
  liable for pre-existing issues, third-party pipework, or damage from
  factors outside its control).
- Cancellation/rescheduling policy (placeholder reasonable terms — e.g.
  notice required to avoid call-out fees).
- Governing law — laws of the Republic of South Africa.
- Contact details for queries about these terms.

Both pages should be clearly marked as **template/placeholder legal text**
with a note at the top such as: *"This document is a general template and
should be reviewed by a qualified legal professional before publishing."*

---

## 7. NEW FAQ PAGE

Create `faq.html` (or an `#faq` section embedded in `index.html` — your
choice, but a standalone page linked from the nav is preferred to keep the
homepage from getting too long). Add an "FAQs" link to both the desktop and
mobile nav menus (between "Reviews" and "Contact").

Use an accordion-style expand/collapse UI consistent with the site's design
(feature-card styling, smooth expand/collapse via simple vanilla JS — add
the logic to `app.js` as a new `initFaqAccordion()` function, called from
`init()`). Include at least these 8 FAQs (rewrite/expand wording as needed
to match brand tone):

1. What areas do you service? (Cape Town and surrounding suburbs)
2. Do you offer 24/7 emergency call-outs?
3. How quickly can you respond to an emergency?
4. Do you provide written quotes before starting work?
5. Are your plumbers certified and insured?
6. Do you handle electrical and painting work too, or just plumbing?
7. Do you issue a Certificate of Compliance (CoC) for geyser/electrical
   installations?
8. What is your workmanship guarantee?
9. How can I get a quote — do I need to be home for an assessment?
10. What payment methods do you accept?

Add appropriate `FAQPage` JSON-LD structured data (`<script
type="application/ld+json">`) to `faq.html` for SEO, mapping each question
to its answer using the `FAQPage`/`Question`/`Answer` schema.

---

## 8. NAVIGATION & SITEMAP UPDATES

- Update both desktop and mobile nav menus in `index.html` (and replicate
  in new pages) to include: Home, Services, 24/7 Emergency, Reviews, FAQs,
  Contact.
- Update `sitemap.xml` to add entries for `/faq`, `/privacy`, and `/terms`
  (with `noindex` consideration for privacy/terms is optional — typically
  these are indexed at low priority, e.g. `0.3`).
- Update `robots.txt` if any new non-indexable routes are introduced (e.g.
  if a hidden duplicate Netlify form page is used).

---

## 9. RESPONSIVENESS & QA CHECKLIST

- Audit every new section (gallery, painting/electrical cards, floating
  buttons, FAQ accordion, new pages) at mobile (320–414px), tablet
  (768px), and desktop (1024px+) widths.
- Ensure images and videos never overflow their containers and use
  `object-cover`/`object-contain` with fixed aspect ratios where needed
  (e.g. `aspect-video` for videos, `aspect-[4/3]` for photos).
- Ensure the floating WhatsApp/Call buttons don't obscure form fields or
  footer content on small screens, and remain tappable (min 44x44px touch
  target).
- Verify the mobile menu includes all new nav links and that anchor-scroll
  offsets (`NAV_HEIGHT` in `app.js`) still work correctly with any added
  sections.
- Run a basic Lighthouse/accessibility pass: alt text on all images, aria
  labels on icon-only buttons, sufficient color contrast on new text against
  the dark background.

---

## DELIVERABLES SUMMARY

- Updated `index.html` (logo, gallery section with images/videos, new
  Painting & Electrical service cards, floating WhatsApp/Call buttons,
  updated phone numbers, updated nav, updated footer links)
- Updated `app.js` (FAQ accordion logic, any new init functions)
- New `thank-you.html`
- New `privacy.html`
- New `terms.html`
- New `faq.html`
- Updated `sitemap.xml` and `robots.txt`
- All asset files referenced from an `/assets` (or root) folder with
  correct relative paths

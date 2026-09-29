# Sri Vengamamba Tours & Travels

Source code and media for the Sri Vengamamba Tours & Travels website — a static, no-build site (plain HTML, CSS, and JavaScript).

## Project structure

```
public/                      Deployable web root (upload this folder as-is)
├─ index.html                Home page: Hero, brand intro, gateways to all pages
├─ services.html             Fleet & Tour Packages: 15-item catalog with interactive filters
├─ gallery.html              Vehicle Gallery: 13-photo mosaic, modal lightbox, video cinema
├─ about.html                About Us: Founding story, 6+ years trust card, core principles
├─ reviews.html              Customer Reviews: 4.6★ ratings bar, marquee, verified review grid
├─ contact.html              Contact & Bookings: 24/7 lines, interactive WhatsApp form, map
├─ css/
│  ├─ theme.css              Base styling and typography
│  └─ cinema.css             Cinematic design: top navbar, subpage heroes, cards, reviews
├─ js/
│  ├─ main.js                Navigation toggle, scroll interactions, category filters
│  └─ cinema.js              Video playback, motion controls, lightbox viewer
└─ assets/
   ├─ images/
   │  ├─ brand/              Logo variants & rating badges
   │  ├─ hero/               Hero background photos
   │  ├─ fleet/              Fleet gallery photos
   │  ├─ vehicles/           Full vehicle photo library
   │  └─ packages/           Tour-package destination images
   └─ video/                 Vehicle walkthrough videos (MP4)

.openai/hosting.json         Static hosting configuration (serves the public/ folder)
README.md                    This file
```

## View locally

No build step is required. Either open `public/index.html` directly in a browser, or run a local web server from this folder:

```
python -m http.server 8000 --directory public
```

Then visit http://localhost:8000.

## Deploy

Upload the contents of the `public/` folder to any static website host. The `.openai/` folder is only needed for the existing Sites hosting association.

## Notes

- Fonts load from Google Fonts when online, with a system-font fallback.
- Photos and videos are bundled locally under `public/assets/`.
- Phone, WhatsApp, Google Maps, and Justdial links point to external services.
- Social profile links (Instagram, YouTube) are placeholders — replace them with the client's real profile URLs.
- Stylesheet/script links use a `?v=` cache-busting query; bump it when you change `css/` or `js/` files.

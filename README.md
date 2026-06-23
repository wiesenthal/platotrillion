# Plato Trillion — Landing Page

Marketing landing page for **Plato Trillion**, a visual monitoring infrastructure company
serving warehousing, logistics, events, and industrial operations.

A single-page static site — no build step, no framework, no dependencies.

## Stack

- Static HTML / CSS / vanilla JS
- [Inter](https://rsms.me/inter/) via Google Fonts
- Deployed on [Vercel](https://vercel.com/)

## Structure

```
index.html      # Page markup + meta/SEO/structured data
styles.css      # All styles (design tokens at top of file)
script.js       # Mobile nav, scroll-reveal, footer year
favicon.svg     # Brand mark
og-image.svg    # Social share card
robots.txt      # Crawl rules
sitemap.xml     # Sitemap
```

## Local development

It's a static site — open the file or run any static server:

```bash
# Python
python3 -m http.server 8000

# or Node
npx serve .
```

Then visit http://localhost:8000.

## Deployment

Pushed to GitHub and deployed on Vercel. Any push to the default branch triggers a
production deploy automatically.

```bash
vercel        # preview deploy
vercel --prod # production deploy
```

# Learnings — Plato Trillion

A running log of friction points, root causes, and fixes for this repo.

## Project notes

- **Stack:** static HTML/CSS/JS, no build step. Deployed on Vercel as a static site
  (zero-config — Vercel serves `index.html` from the repo root, no framework preset).
- **Tooling present:** `gh` (authed as `wiesenthal`), `vercel` (authed as `miles-6547`),
  node 18, git.
- **Design tokens** live in `:root` at the top of `styles.css`. Change brand color via
  `--accent`.

## Friction log

_(Append new entries here: date — symptom — root cause — fix.)_

- 2026-06-22 — Typo in CSS (`color: #5d6szép`) slipped into `.logos li:hover`. Root cause:
  manual hand-edit. Fix: removed the invalid declaration. Lesson: scan generated CSS for
  stray non-ASCII / invalid token values before committing.

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

- 2026-06-22 — Vercel deploy blocked: account `miles-6547` is on the "northstar" model with
  `defaultTeamId: null` and zero teams. `vercel deploy` returns
  `{status: action_required, reason: missing_scope, "No teams available."}`, and
  `vercel teams ls` crashes (`Cannot read properties of undefined (reading 'value')`) on both
  v50 and v54. The account id is NOT a usable team scope (`forbidden`). Fix path: a team must
  exist first — either create one (account change, needs user consent) or import the repo at
  vercel.com/new (dashboard handles team creation + GitHub connect + first deploy). The token
  lives at `~/Library/Application Support/com.vercel.cli/auth.json`.

- 2026-06-22 — `npx plugins add <repo>` (vercel-labs `plugins` CLI) is interactive and aborts
  on EOF in a non-TTY shell. Use the `-y` flag to install non-interactively. After install it
  prints "Restart your agent tools to load the plugins" — new skills/agents/MCP are NOT
  available until Claude Code is restarted.

- 2026-06-22 — Shell gotcha: `UID` is a read-only variable in zsh/bash; assigning to it fails
  with "failed to change user ID: operation not permitted". Use a different var name.

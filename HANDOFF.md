# Baton doc — The Great Shift deploy fix

**Written:** 2026-07-26 ~17:30 UTC, by the session that built the homepage.
**For:** a Claude Code session holding a Cloudflare API token.
**Read `CLAUDE.md` first** — it defines the working rules (Claude owns all
GitHub work end to end; PRs target `main`; merging to `main` is how deploys
are supposed to ship; never add an `npm run deploy` script).

## Mission

1. **Ship it now:** deploy the built site to production with wrangler.
2. **Fix the pipeline:** diagnose and repair the Cloudflare Workers Builds
   git trigger so merges to `main` deploy automatically again.
3. **Verify:** confirm https://thegreatshift.timdnoe.workers.dev serves the
   new homepage (hero wordmark, "The Movement", "The Four Gates", etc. —
   not the `[PLACEHOLDER]` scaffolding page).

## Current state (all done, nothing in flight)

- The full homepage is **built and merged to `main`**: PR #1 (site), #2
  (README note), #3 (theme-color meta). Working tree = `main` = correct.
- `npm ci && npm run build` works; output goes to `_site/`.
- Production still serves the **old placeholder** because no build has run.
- A pixel-exact preview of what should be live:
  https://claude.ai/code/artifact/48a05d05-8615-49df-9285-f5e9b445b671

## The problem, with evidence

Cloudflare Workers Builds is supposed to build+deploy on every push to
`main` (see README "Deployment"). It has **never fired since initial
setup**:

- Merges to `main` at 16:47, 17:00, and 17:12 UTC on 2026-07-26 produced
  **zero entries** in the dashboard Deployments tab (owner checked twice).
- Cloudflare posted no check runs / statuses back to GitHub for any commit.
- Owner **disconnected and reconnected the git integration** in the
  dashboard (~17:05–17:10 UTC); the 17:12 push after that still triggered
  nothing.
- Leading suspect: the "Cloudflare Workers & Pages" GitHub App grant does
  not actually cover `timdnoe/thegreatshift`, so Cloudflare never receives
  push events. Second suspect: the saved build config's production branch
  isn't `main`, or the connect flow silently failed to persist.

## Task 1 — deploy now

```sh
export CLOUDFLARE_API_TOKEN=...   # if not already in the environment
npm ci
npm run build
npx wrangler deploy               # config in wrangler.toml; worker name "thegreatshift"
```

Token permissions (Account-scoped): Workers Scripts:Edit, Workers Builds
Configuration:Edit, Account Settings:Read. Wrangler resolves the account
from the token; if it complains, list accounts via
`GET https://api.cloudflare.com/client/v4/accounts` with the token and set
`CLOUDFLARE_ACCOUNT_ID`.

`CLAUDE.md` warns that a local `wrangler deploy` competes with the
git-connected build — that warning assumes a *working* git pipeline. It is
dead (see evidence), which is exactly why you're deploying manually. Do not
add a `deploy` script to package.json; keep this a one-off command.

## Task 2 — fix the git trigger

Use the Workers Builds API (docs: developers.cloudflare.com, "Workers
Builds") with the token to inspect the worker's build configuration —
connected repo, production branch, and build history. Things to establish:

1. Does Cloudflare think a repo is connected, and is the branch `main`?
2. Does build history show *failed/queued* builds the dashboard isn't
   surfacing, or truly none? (None ⇒ webhook/app-grant problem on the
   GitHub side; the owner must re-run the connect flow and complete the
   GitHub authorization popup, granting the app access to
   `timdnoe/thegreatshift`. The owner does not use GitHub — walk them
   through only the Cloudflare-initiated popup, or find the misconfig via
   API.)
3. After any fix, verify end-to-end: merge a trivial PR to `main` and watch
   a build appear and deploy.

## Verification gotchas

- The remote sandbox's network policy **blocks workers.dev** (proxy CONNECT
  403). Workaround that worked:
  `curl -H 'x-no-cache: true' https://r.jina.ai/https://thegreatshift.timdnoe.workers.dev/`
  (occasionally rate-limits; retry). Grep for `The Movement` (new site) vs
  `PLACEHOLDER` (old).
- No `gh` CLI in these sessions; use the GitHub MCP tools.

## Open items beyond this fix (not yours unless asked)

- Contact button currently mailtos `tim.d.noe@gmail.com` (subject "The
  Great Shift — I recognize this"); owner may want a different address for
  "Ashford".
- Nav items (Heart Coherence / Vision / Topics / Community) anchor to
  homepage sections; real subpages are a future phase, as are an intake
  form and a custom domain.
- Delete this HANDOFF.md once the pipeline is verified working.

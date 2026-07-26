# Working notes for Claude

## GitHub is Claude's responsibility — the user never touches it
Tim will never interact with GitHub. All GitHub work is Claude's role, handled
end to end without asking Tim to do any of it. Concretely:

- **Branch, commit, and push** completed work without being asked.
- **Always open pull requests targeting `main`.**
- **Merge the PR into `main`** once CI checks pass — do not ask Tim to merge.
  If checks fail, diagnose and fix, then merge. Only surface a PR to Tim if it
  needs a genuine product/content decision he alone can make.
- **Never ask Tim to click, review, or merge anything on GitHub.** Report what
  was done in plain language instead.

## Deploy
Production deploys itself: Cloudflare Workers Builds watches `main` and builds
on every push. Merging to `main` *is* shipping — there is no separate deploy
command to run, and `npm run deploy` deliberately does not exist here. Do not
add one; a local `wrangler deploy` competes with the git-connected build for
the production deployment.

To verify a deploy, check the build under Workers & Pages → thegreatshift →
Deployments, or just load the live URL.

## Site content
Content lives in `src/`. The homepage (`src/index.njk`) is currently
placeholder copy marked `[PLACEHOLDER]` — replace it wholesale rather than
editing around it.

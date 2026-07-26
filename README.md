# thegreatshift

Static site built with [Eleventy](https://www.11ty.dev/), deployed to Cloudflare
Workers.

## Local development

```sh
npm install
npm run dev     # http://localhost:8080, live reload
npm run build   # one-off build into _site/
```

## Deployment

Deployment is automatic. Cloudflare Workers Builds is connected to this repo:
every push to `main` triggers a build and deploy. There is no manual deploy
step and no `wrangler deploy` in `package.json` — running one locally would
race the git-connected build for control of the production deployment.

Production URL: <https://thegreatshift.timdnoe.workers.dev>

Dashboard settings (Workers & Pages → thegreatshift → Settings → Build):

| Setting | Value |
| --- | --- |
| Build command | `npm run build` |
| Deploy command | `npx wrangler deploy` |
| Root directory | `/` |

Everything else lives in `wrangler.toml`, including the build output directory
(`[assets] directory`) — Workers has no dashboard field for it.

This is Workers, not Pages. Cloudflare put Pages into maintenance mode and
directs new projects to [Workers with static assets](https://developers.cloudflare.com/workers/static-assets/);
Pages documentation and its `pages_build_output_dir` setting do not apply here.

## Layout

```
src/            Eleventy input
  _includes/    layouts
  index.njk     homepage
  404.njk       → /404.html, served on unmatched paths
  style.css
_headers        response headers
_redirects      redirect rules
media/          images and other static files
```

`_headers`, `_redirects`, and `robots.txt` sit at the repo root and are copied
into `_site` by `.eleventy.js`. Cloudflare only reads them from inside the
assets directory, so they have to be copied through rather than left here.

## Fonts

Archivo Black and Nunito are self-hosted in `media/fonts/` as woff2 (no
third-party font requests). `_headers` gives them a one-year immutable cache.

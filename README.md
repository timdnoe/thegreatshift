# The Great Shift

A static website deployed with [Cloudflare Pages](https://pages.cloudflare.com/).

## Deploying to Cloudflare Pages (free)

1. Sign in (or sign up, free) at [dash.cloudflare.com](https://dash.cloudflare.com).
2. Go to **Workers & Pages** → **Create** → **Pages** → **Connect to Git**.
3. Authorize Cloudflare to access GitHub and select the `thegreatshift` repository.
4. Configure the build:
   - **Production branch**: `main` (or whichever branch you choose)
   - **Framework preset**: None
   - **Build command**: *(leave empty)*
   - **Build output directory**: `/`
5. Click **Save and Deploy**.

Cloudflare gives the site a free URL like `https://thegreatshift.pages.dev`.
Every push to the production branch automatically redeploys the site, and pushes
to other branches get free preview URLs.

## Local development

It's just static HTML — open `index.html` in a browser, or run a local server:

```sh
python3 -m http.server
```

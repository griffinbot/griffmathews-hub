# griffmathews.com

Marketing site built with Astro and deployed on Cloudflare Pages.

## Local development

```sh
npm install
npm run dev
```

## Build

```sh
npm run build
npm run preview
```


## Deploying the crossword to `games.griffmathews.com/crossword` (Cloudflare Pages Option A)

Keep this repo, and create a **second Cloudflare Pages project** pointed at the same branch:

1. In Cloudflare Dashboard → **Workers & Pages** → **Create application** → **Pages** → **Connect to Git**.
2. Select this repository and branch.
3. Build settings:
   - **Build command:** `npm run build`
   - **Build output directory:** `dist`
4. Open the new Pages project → **Custom domains** → **Set up a custom domain**.
5. Add `games.griffmathews.com` and complete DNS validation in Cloudflare.
6. Visit `https://games.griffmathews.com/crossword`.

Routes in this repo:
- `/crossword` is the live Mini Crossword page.
- `/mini-crossword` permanently redirects to `/crossword` for backward compatibility.

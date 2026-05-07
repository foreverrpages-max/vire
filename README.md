# vire — a small thought

A small atmospheric site curated by **Nachiket**, designed for an Instagram bio link.
One screen, one thought at a time, a fluid Three.js cursor trail, and a keepsake card
visitors can save and share.

---

## Features

- **Curated thoughts** — ~35 hand-picked lines (cosmic facts, sensory cues, untranslatable words from Marathi, Sinhala, Japanese, Welsh).
- **Ghost cursor** — fluid Three.js shader trail, color shifts per thought.
- **Aurora backdrop** — slow CSS-only drifting gradient.
- **Time-of-day greeting** — "good morning" through "late night".
- **Keepsake card** — visitors enter their name → get a 1080×1350 PNG (Instagram-story size) of the thought, ready to share. Card includes "curated by Nachiket" so re-shares always credit you.
- **Guestbook** — visitors can leave a one-line note about which thought stayed with them. Goes straight to your email via [Formspree](https://formspree.io) (free tier: 50 submissions/month).
- **Analytics** — optional [Cloudflare Web Analytics](https://www.cloudflare.com/web-analytics) snippet pre-wired (free, privacy-friendly, no cookies). Shows daily visitors, top countries, referrers — so you'll know when traffic spikes from your IG bio.
- **Tap / space / arrow / enter** — all advance to the next thought.
- **Reduced motion** respected.
- **No tracking, no signups, no ads** for the visitor.

---

## Important: what "knowing who clicked" actually means

GitHub Pages is a **static** host. No website (anywhere) can identify "who" a visitor is unless they sign in or fill in something. Here's what you can practically know:

| What you want | How to get it |
|---|---|
| **How many people clicked** | Cloudflare Web Analytics (configured in `index.html`) |
| **Where they came from** (IG vs. direct vs. WhatsApp share) | Same — referrer column in CF Analytics |
| **Which countries / cities** | Same — country breakdown in CF Analytics |
| **Names of people who liked it** | The **guestbook form** — they choose to leave their name. You'll receive emails. |
| **Who screenshotted / shared the card** | Naturally — the card has "curated by Nachiket" + a soft prompt to tag you, so when people post it, you'll see it on Instagram. |

You can't ethically (or technically) get a list of *all* visitors with names. But the combination above gives you a real, honest picture of engagement.

---

## Quick start (local dev)

```bash
npm install
npm run dev          # http://localhost:5173
npm run build        # outputs to ./dist
```

---

## Configuration (do this once before deploying)

Open **`src/App.tsx`** and edit two constants at the top:

```ts
const INSTAGRAM_HANDLE = 'your_instagram_handle';   // your IG without the @
const FORMSPREE_ENDPOINT = 'https://formspree.io/f/YOUR_FORM_ID';
```

### Getting a Formspree endpoint (for the guestbook):

1. Go to [formspree.io](https://formspree.io) → sign up (free).
2. Create a new form → it gives you an endpoint URL like `https://formspree.io/f/abcd1234`.
3. Paste that into `FORMSPREE_ENDPOINT`.
4. Done. You'll get an email every time someone submits.

### Setting up Cloudflare Web Analytics (optional but recommended):

1. Sign up free at [cloudflare.com/web-analytics](https://www.cloudflare.com/web-analytics).
2. Add your site → it gives you a JavaScript token.
3. Open `index.html` → find the commented-out `<script>` block near the top → paste your token in place of `YOUR_CF_TOKEN` and uncomment the block.

---

## Deploy to GitHub Pages — full walkthrough

### Step 1: Create the GitHub repo

1. Go to [github.com/new](https://github.com/new).
2. Repo name: pick something simple. I'd suggest **`vire`** (matches your domain).
3. Make it **public** (GitHub Pages requires public repos on the free plan, *unless* you have GitHub Pro).
4. Don't add a README / .gitignore from GitHub — we already have them.
5. Click **Create repository**.

### Step 2: Push the code

In your terminal, from inside this project folder:

```bash
git init
git add .
git commit -m "initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/vire.git
git push -u origin main
```

### Step 3: Enable GitHub Pages

1. On GitHub, go to your repo → **Settings** → **Pages**.
2. Under "Build and deployment" → **Source**, select **GitHub Actions** (NOT "Deploy from branch").
3. That's it. The included workflow `.github/workflows/deploy.yml` will automatically build and deploy on every push to `main`.

### Step 4: Wait for the first deploy

Go to the **Actions** tab on your repo. The "Deploy vire to GitHub Pages" workflow will run for ~2 minutes. When it's green, your site is live at:

```
https://YOUR_USERNAME.github.io/vire/
```

> **Note:** If you're using this URL (no custom domain), open `.github/workflows/deploy.yml` and uncomment the `GH_PAGES_BASE: vire` lines so assets load from the correct subpath. Then commit and push again.
>
> If you're using a custom domain (next step), you can skip that — leave the workflow as-is.

---

## Connect a custom domain

### Step 1: Buy the domain

Cheapest registrars in India for 4-letter domains:

| TLD | Best price (₹/yr, approx) | Where |
|---|---|---|
| `.fun` | ₹100–250 | Porkbun |
| `.xyz` | ₹100–200 | Porkbun, Namecheap |
| `.lol` | ₹250–400 | Porkbun |
| `.cc` | ₹800–1,200 | Namecheap |
| `.in` | ₹600–800 | BigRock, GoDaddy India |
| `.space` | ₹100–250 | Porkbun |

**Tip:** check the *renewal* price, not just the first-year price. Porkbun has consistent, honest pricing. Buy in INR if the registrar supports it to avoid forex fees.

I'd suggest **`vire.fun`** or **`vire.xyz`** for the lowest total cost over years.

### Step 2: Configure the CNAME file

Open `public/CNAME` and replace the content with your domain (no `https://`, no trailing slash):

```
vire.fun
```

Commit and push.

### Step 3: Configure DNS at your registrar

Log into your registrar's DNS panel. Add these records:

| Type | Name | Value |
|---|---|---|
| A | @ | 185.199.108.153 |
| A | @ | 185.199.109.153 |
| A | @ | 185.199.110.153 |
| A | @ | 185.199.111.153 |
| CNAME | www | YOUR_USERNAME.github.io |

(These are GitHub Pages' IPs — they're publicly documented and stable.)

DNS can take 10 minutes to a few hours to propagate.

### Step 4: Configure the domain in GitHub

1. Repo → **Settings** → **Pages**.
2. Under "Custom domain", enter `vire.fun` (or whatever you bought) → **Save**.
3. Wait a few minutes, then check the **Enforce HTTPS** box. (It only becomes available once DNS verifies.)

Done. Your site is live at `https://vire.fun`.

---

## File map

```
vire/
├─ .github/workflows/deploy.yml   # auto-deploy on push to main
├─ public/
│  ├─ favicon.svg
│  └─ CNAME                       # custom domain config
├─ src/
│  ├─ main.tsx                    # Vite entry
│  ├─ App.tsx                     # the page itself ★ edit handles here
│  ├─ GhostCursor.tsx             # the shader component
│  ├─ thoughts.ts                 # the curated thought list ★ edit thoughts here
│  ├─ card.ts                     # keepsake PNG generator
│  └─ index.css                   # all styles
├─ index.html                     # ★ paste CF Analytics token here
├─ package.json
├─ vite.config.ts
└─ tsconfig.json
```

---

## Customizing

- **Add/edit thoughts** → `src/thoughts.ts`. Each entry has a `kicker` (small label) and a `line`.
- **Trail color palette** → `src/App.tsx`, look for `palette` inside `trailColor`.
- **Card design** → `src/card.ts`. Layout, colors, fonts.
- **Mood / typography** → `src/index.css`. Currently uses Cormorant Garamond + Inter.

---

## Bundle size

Final production build is roughly:
- HTML/CSS: ~6 KB gzipped
- App JS: ~10 KB gzipped
- Three.js (separate chunk): ~150 KB gzipped

Total first load: ~166 KB gzipped. Well within the GitHub Pages 1 GB repo limit and 100 GB/month bandwidth limit (so even if you go viral, it's free).

---

## Credits

Curated by Nachiket · Built with Three.js, React, Vite · Hosted on GitHub Pages.

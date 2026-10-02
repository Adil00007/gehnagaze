# Gehna Gaze — jewelry storefront + admin panel

A full Next.js e-commerce site for @gehnagaze: browse & buy jewelry, pay by
bank transfer or JazzCash, and manage everything (products, discounts,
orders) from a password-protected admin panel. Built to run entirely on free
hosting — no server to maintain.

**Stack:** Next.js + MySQL. Products, announcements, orders, and uploaded
product images are stored in MySQL.

Nothing here needs coding to operate day-to-day — once deployed, you run the
shop entirely from `/admin`.

---

## 0. What you'll end up with

- A live site at a free address like `gehnagaze.vercel.app` (you can point
  your own domain at it later for free too, if you buy one)
- `/admin` — protected by one password you choose — to upload/replace
  photos, edit prices, post discount banners, and see orders
- Checkout that collects payment via bank transfer or JazzCash (customer
  sends money, enters the transaction ID, you confirm in `/admin`)

This README assumes no coding experience. It's mostly copy-paste.

---

## 1. Create free accounts

You'll need these services:

1. **GitHub** — github.com/signup (to hold the code)
2. **MySQL** — a local MySQL server or hosted provider
3. **Vercel** — vercel.com/signup (hosting) — sign up with your GitHub account,
   it's the fastest option

---

## 2. Set up MySQL

1. Create a database named `gehnagaze` in MySQL.
2. Run `mysql/schema.sql` against that database.
3. Set either `DATABASE_URL` or `MYSQL_HOST`, `MYSQL_PORT`, `MYSQL_USER`,
   `MYSQL_PASSWORD`, and `MYSQL_DATABASE` in `.env.local`.
4. Uploaded images are stored in the `uploads` table, so no separate storage
   service is required.

From `/admin` you can manage:

- `/admin/products` — products, prices, stock, and product images
- `/admin/categories` — multiple category names and category images
- `/admin/content` — logo, homepage banner, hero title, and supporting text
- `/admin/discounts` — announcement banners
- `/admin/orders` — customer orders and order statuses

To verify the live database connection after starting the app, open
`/api/health`. It reports whether MySQL is connected and whether all required
tables exist.
     — keep this one secret, never share it or put it in the browser.

---

## 3. Put the code on GitHub

1. Go to github.com/new, create a new **private** repository, e.g. `gehnagaze`.
2. Upload this whole project folder to it. Easiest way if you're not
   familiar with git: on the new repo page click **uploading an existing
   file**, then drag in every file/folder from this project **except** the
   `node_modules` and `.next` folders (those get rebuilt automatically and
   are intentionally excluded by `.gitignore`).

---

## 4. Deploy to Vercel

1. Go to vercel.com/new, choose **Import** next to the `gehnagaze` repo.
2. Before clicking Deploy, open **Environment Variables** and add these
   (copy names exactly from `.env.example`):

   | Name | Value |
   |---|---|
   | `DATABASE_URL` | MySQL connection URL, or use the `MYSQL_*` variables |
   | `ADMIN_PASSWORD` | a password you choose for `/admin` |
   | `NEXT_PUBLIC_INSTAGRAM_HANDLE` | `gehnagaze` |
   | `NEXT_PUBLIC_INSTAGRAM_URL` | `https://instagram.com/gehnagaze` |
   | `NEXT_PUBLIC_CURRENCY` | `PKR` |
   | `NEXT_PUBLIC_BANK_NAME` | your bank's name |
   | `NEXT_PUBLIC_BANK_ACCOUNT_TITLE` | account holder name |
   | `NEXT_PUBLIC_BANK_ACCOUNT_NUMBER` | your account number |
   | `NEXT_PUBLIC_JAZZCASH_TITLE` | JazzCash account title |
   | `NEXT_PUBLIC_JAZZCASH_NUMBER` | your JazzCash number |
   | `NEXT_PUBLIC_CONTACT_EMAIL` | your email |
   | `NEXT_PUBLIC_WHATSAPP_NUMBER` | optional |

   You can leave the bank or JazzCash rows blank if you only want to accept
   one method — checkout automatically hides whichever one is empty.

3. Click **Deploy**. In about a minute you'll get a live URL like
   `https://gehnagaze.vercel.app` — that's your site.
4. Go to it, open `/admin`, log in with the `ADMIN_PASSWORD` you set, and add
   your first product to make sure everything's connected.

**To update env vars later:** Vercel → your project → Settings →
Environment Variables → edit → then Deployments → Redeploy.

**Free custom domain option:** if you don't want to buy a domain, the
`.vercel.app` address is free forever and fully usable — you can put it
straight in your Instagram bio. If you do buy a domain later (from anywhere,
~$10/year), add it under Vercel → your project → Settings → Domains, free of
charge.

---

## 5. Connect your Instagram feed (2 minutes, no API keys)

This makes your latest Instagram posts appear automatically on the
homepage — the simplest version of the "site mirrors Instagram" idea, live
in minutes:

1. Go to a free embed generator — e.g. **snapwidget.com** or
   **lightwidget.com** — sign in with Instagram, pick a grid layout.
2. It gives you an embed URL (usually ending in something like
   `.snapwidget.com/embed/...` or `.lightwidget.com/widgets/...`).
3. In Vercel env vars, set `NEXT_PUBLIC_INSTAGRAM_EMBED_URL` to that URL,
   redeploy. Your homepage's Instagram section now shows live posts.

Also put your site link in your Instagram bio (Edit Profile → Website) so
visitors can tap through from Instagram to the shop — that's the other half
of "linking" the two.

---

## 6. Later upgrades (optional, not required to launch)

**Automatic JazzCash checkout** (customer redirected to JazzCash, no manual
transaction ID): apply for a JazzCash **Merchant Account** (their business
onboarding, a few days). You'll receive a Merchant ID, Password, and
Integrity Salt — add those to env vars and see the comments at the top of
`lib/integrations/jazzcash.js` for exactly where they plug in.

**Official Instagram two-way sync** (posting on Instagram auto-creates a
product, not just a photo grid): needs your Instagram converted to a
Business/Creator account linked to a Facebook Page, a Meta developer app
reviewed by Meta, and an access token. See the comments at the top of
`lib/integrations/instagram.js` for the exact env vars and what to build once
you have them.

Neither of these blocks you from launching today — they're upgrades to a
site that's already fully functional.

---

## Running it locally (optional, for making changes)

```bash
npm install
cp .env.example .env.local   # fill in the MySQL and site values
npm run dev
```

Open http://localhost:3000. Changes to files show up instantly.

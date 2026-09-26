# Business Overview — setup guide

The **All Businesses** page (`/admin/overview`) shows numbers from every site in one place.
This guide covers the one-off setup it needs. Allow about 20–30 minutes.

---

## How it works (the short version)

Each of your sites keeps its data in its **own database**:

| Site | Database | Supabase project ID |
|---|---|---|
| Daniele Buatti (this site) | Supabase | `shkwqfggbcqtaedfxvwd` |
| Resonance with Daniele | Supabase | `xefifvztgeiuvzibiltj` |
| db-it **and** Billing (Invoicify) — they share one | Supabase | `gjzjrhredmheepmgpnjk` |
| Kinesiology App | Supabase | `xebtjnvfkroiplyzftas` |
| Piano Backings by Daniele | Supabase | `kyfofikkswxtwgtqutdu` |
| The Accompanist Guidebook | Neon (Postgres) | — |

The browser can't (and must never) hold the master keys for those databases. So:

1. A small **server function** called `fetch-business-overview` runs inside *this* site's Supabase project.
2. You give that function a **key for each other database**, stored as a private "secret" in Supabase. Secrets are never in the code, never in GitHub and never sent to the browser.
3. When you open `/admin/overview`, the page asks the function for the numbers. The function checks that you're logged in **and** that your email is on the allowed list, then reads each database and sends back only the totals and recent activity.

The function only **reads** data. It never changes anything on any site.

A site you haven't connected yet just shows **"Needs setup"** with the exact secret names it's waiting for, so you can do this in stages.

---

## Step 1 — Collect a key from each Supabase project

Do this for each of the four *other* Supabase projects: Resonance, db-it/Billing, Kinesiology and Piano Backings. This site's own key is already available to the function automatically.

1. Go to <https://supabase.com/dashboard> and open the project. Match it with the **project ID** in the table above: the ID appears in the browser address bar and in the Project URL.
2. Open **Project Settings** (gear icon, bottom left) → **API Keys**. On older dashboards it's **Project Settings → API**.
3. Copy two things:
   - **Project URL**: looks like `https://xefifvztgeiuvzibiltj.supabase.co`. It's on the same page, or under **Project Settings → Data API**.
   - **Secret key**: either the new-style **secret key** (starts with `sb_secret_…`; click "Create new secret key" if there isn't one, name it `business-overview`) **or** the legacy **`service_role`** key (a long `eyJ…` string under the "Legacy API keys" tab). Either works.

> ⚠️ **Treat these keys like the master password to that site's database.** They bypass all security rules.
> Only paste them into the Supabase secrets screen in Step 3. Never paste them into code, a chat, an email or a GitHub file.
> Creating a separate named secret key (`business-overview`) is the tidiest option, because you can revoke that one key later without affecting the site itself.

Keep a note of what you copied; you'll paste it in Step 3:

| Secret name | Value |
|---|---|
| `RESONANCE_SUPABASE_URL` | Resonance's Project URL |
| `RESONANCE_SERVICE_ROLE_KEY` | Resonance's secret key |
| `DBIT_SUPABASE_URL` | db-it's Project URL (Invoicify uses the same one) |
| `DBIT_SERVICE_ROLE_KEY` | db-it's secret key |
| `KINESIOLOGY_SUPABASE_URL` | Kinesiology App's Project URL |
| `KINESIOLOGY_SERVICE_ROLE_KEY` | Kinesiology App's secret key |
| `PIANO_BACKINGS_SUPABASE_URL` | Piano Backings' Project URL |
| `PIANO_BACKINGS_SERVICE_ROLE_KEY` | Piano Backings' secret key |

---

## Step 2 — Get a connection string for the Accompanist Guidebook (Neon)

The Guidebook uses Neon, not Supabase. It needs one secret: `GUIDEBOOK_DATABASE_URL`.

### Recommended: a read-only login (about 5 minutes)

This gives the overview a login that can **only read** the four tables it needs.

1. Go to <https://console.neon.tech> and open the Guidebook project.
2. Open the **SQL Editor** and run the following, after replacing `choose-a-long-random-password` with a strong password of your own:

   ```sql
   CREATE ROLE overview_reader WITH LOGIN PASSWORD 'choose-a-long-random-password';
   GRANT CONNECT ON DATABASE neondb TO overview_reader;
   GRANT USAGE ON SCHEMA public TO overview_reader;
   GRANT SELECT ON users, purchases, lessons, progress TO overview_reader;
   ```

   If your database isn't called `neondb`, use the name shown in the database dropdown at the top of the SQL Editor.

3. Go to the project **Dashboard** → **Connect**. Choose the `overview_reader` role, then copy the connection string. It looks like:

   ```
   postgresql://overview_reader:PASSWORD@ep-something-123456.ap-southeast-2.aws.neon.tech/neondb?sslmode=require
   ```

### Quicker: reuse the Guidebook's existing connection string

In **Vercel → the Guidebook project → Settings → Environment Variables**, copy the value of `DATABASE_URL`.
This works, but that login can change data as well as read it, which is why the read-only login above is better.

---

## Step 3 — Add the secrets to *this* site's Supabase project

1. Open the **danielebuatti** project in Supabase (ID `shkwqfggbcqtaedfxvwd`).
2. Go to **Edge Functions** (left sidebar) → **Secrets**. On some dashboards it's **Project Settings → Edge Functions**.
3. Add each secret below: enter the name exactly as written (capitals and underscores matter) and paste the value.

| Name | Value | Required? |
|---|---|---|
| `HUB_ADMIN_EMAILS` | The email you use to log in to `/admin`. For more than one person, separate emails with commas. | **Yes.** Without it the page refuses to load, because anyone can create an account on the site. |
| `RESONANCE_SUPABASE_URL` / `RESONANCE_SERVICE_ROLE_KEY` | From Step 1 | For the Resonance card |
| `DBIT_SUPABASE_URL` / `DBIT_SERVICE_ROLE_KEY` | From Step 1 | For the db-it **and** Billing cards |
| `KINESIOLOGY_SUPABASE_URL` / `KINESIOLOGY_SERVICE_ROLE_KEY` | From Step 1 | For the Kinesiology card |
| `PIANO_BACKINGS_SUPABASE_URL` / `PIANO_BACKINGS_SERVICE_ROLE_KEY` | From Step 1 | For the Piano Backings card |
| `GUIDEBOOK_DATABASE_URL` | From Step 2 | For the Guidebook card |
| `BILLING_OWNER_USER_ID` | Your user ID in the db-it/Invoicify project (**Authentication → Users**, copy the UID) | Optional. Only needed if someone else also creates invoices in Invoicify and you want to count only yours. |

You **don't** need to add `SUPABASE_URL`, `SUPABASE_ANON_KEY` or `SUPABASE_SERVICE_ROLE_KEY` for this site. Supabase provides those to every function automatically.

---

## Step 4 — Deploy the function

The function's code is in `supabase/functions/fetch-business-overview/index.ts`. Use whichever method you normally use to deploy this site's functions.

**Option A: Supabase CLI** (if you have it installed):

```bash
supabase login
supabase functions deploy fetch-business-overview --project-ref shkwqfggbcqtaedfxvwd
```

**Option B: Dyad.** If this site is connected to Supabase in Dyad, pulling this change in Dyad deploys new functions for you, the same way your other functions got there.

**Option C: Supabase dashboard.** Go to **Edge Functions → Deploy a new function → Via Editor**. Name it `fetch-business-overview`, paste in the contents of `index.ts`, then click **Deploy**.

Leave **"Verify JWT"** switched **on**, which is the default. The page sends your login with every request.

---

## Step 5 — Check it

1. Make sure the website change is live (merged and deployed on Vercel as usual).
2. Log in at `/login`, then click **All Businesses** in the admin sidebar.
3. Every card you've set up should say **Connected**. Any card that says **Needs setup** lists the secret names it's still missing.

---

## What each card shows

**Totals at the top**
- **Income (last 30 days / this financial year):** the income figures from each site added together. The financial year runs from 1 July.
- **Income over the last 12 months:** one bar per month for the ticked businesses. Hover over or tap a month to see how it splits across sites. "Show as a table" lists every month and site.
- **Needs attention:** overdue invoices, unpaid sessions, open tickets, quotes awaiting a reply and backing requests in the queue.
- **Income by business:** a bar for each site. **Untick a site to leave it out of the totals.** This matters because some money can appear twice. For example, if a quote accepted on this site is also invoiced in Invoicify, it counts in both. Your ticks are remembered in your browser.

**Per site**

| Site | Numbers | "Income" counts |
|---|---|---|
| Daniele Buatti | Accepted quotes, quotes awaiting reply, open leads and pipeline value, gift card sales, upcoming AMEB exams, contact messages | Accepted quotes + paid gift cards |
| Resonance | Members (+new), interest sign-ups, upcoming events, tickets sold, ticket earnings, profit after expenses, song suggestions | Humanitix "your earnings" from imported orders |
| db-it | Open and high-priority tickets, new/resolved tickets, hours logged, IT clients | *(none: invoicing is counted under Billing)* |
| Billing (Invoicify) | Paid (FY / 30 days), outstanding, overdue, drafts, invoice count | Invoices marked **Paid**, by invoice date |
| Kinesiology App | Clients (active, at risk/lapsed), upcoming kinesiology sessions and voice/piano lessons, sessions in the last 30 days, unpaid sessions | Paid kinesiology sessions + voice/piano lessons already held |
| Piano Backings | Sales, shop orders, request queue, unpaid requests, products for sale, customers | Completed shop orders + paid custom requests |
| Accompanist Guidebook | Members, paid members and conversion rate, sales, lessons published, lessons completed | Stripe purchases |

---

## Troubleshooting

| What you see | What it means / how to fix it |
|---|---|
| "HUB_ADMIN_EMAILS secret is not set" | Do Step 3's first row. |
| "Forbidden" | The email you're logged in with isn't in `HUB_ADMIN_EMAILS`. Check for typos; capitals don't matter. |
| "Failed to send a request to the Edge Function" / 404 | The function isn't deployed yet (Step 4), or it was deployed under a different name. |
| A card says **Error** | That database rejected the key or couldn't be reached. Re-copy the URL and key for that site. |
| "N numbers couldn't be loaded" under a card | A table or column that number relies on has been renamed or removed on that site. The rest of the card still works. Open the note to see which one. |
| A number looks wrong | The definitions are in the "What each card shows" table above. They're easy to adjust in `index.ts`. |

## Revoking access later

- **Supabase:** in that project's **API Keys** page, delete the `business-overview` secret key, or roll the `service_role` key if that's what you used.
- **Neon:** run `DROP ROLE overview_reader;`.
- Then delete the matching secret from this site's **Edge Functions → Secrets**.

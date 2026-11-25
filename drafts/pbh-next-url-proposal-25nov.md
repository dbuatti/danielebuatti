# Piano by Heart: stable next link proposal, 25 Nov 2026

Status: DRAFT. Nothing published, scheduled or deployed.

## What I checked

- `https://events.humanitix.com/pianobyheart` is not a stable link. It still renders the past Sat 14 Nov event, with old copy including soft lighting, 15 places and a 5:15pm music start. Do not use it in the Instagram bio.
- `https://danielebuatti.com/pianobyheart` currently renders Page Not Found. The app imports PianoByHeartPage and redirects /piano-by-heart to /pianobyheart, but there is no route for /pianobyheart in src/App.tsx. Both paths 404.
- The site event object in src/constants/piano-by-heart.ts still says Sat 14 Nov 2026, $28 early bird, 15 places, arrive from 5pm. Once the end date passes, the page hides the event and shows announced soon, so it needs updating as well as the route.
- The choir's `https://resonancechoir.danielebuatti.com/next` works through a Vercel serverless function that finds the next event and 302 redirects to Humanitix.

## Options for the Instagram bio link

Option A, recommended: `https://danielebuatti.com/pianobyheart`
- Stable master brand URL, no new DNS or subdomain.
- Once the route and event data are fixed, it shows the current evening and a Book button, then falls back to announced soon between dates.
- Update the one event object in src/constants/piano-by-heart.ts whenever a date changes.

Option B: `https://danielebuatti.com/pianobyheart/next`
- A temporary 307 redirect in the main site vercel.json straight to the current Humanitix event.
- Shorter and direct to booking, useful for stories and QR codes.
- Needs a one line edit in vercel.json each time the event changes, otherwise it goes stale. Mark it non permanent so it is never cached forever.

Option C: `https://pianobyheart.danielebuatti.com/next` like the choir
- Needs a new subdomain at the registrar, a Vercel domain alias and a serverless function reading event data.
- More moving parts and more upkeep than the three dates we have. Not recommended now.

## Recommendation

Put Option A in the Instagram bio. Add Option B as a secondary direct booking link if you want one. Do not use the Humanitix /pianobyheart slug.

## Next steps, awaiting your green light

1. Fix the missing /pianobyheart route and update the site copy and data. Separate draft in `drafts/pbh-website-update-25nov.md`.
2. Deploy to Vercel, then verify the live page in the browser.
3. You add the chosen URL to the Instagram bio. No social post is drafted or scheduled.

No spend, no schedule, no publish.

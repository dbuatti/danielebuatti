# Piano by Heart website update spec, 25 Nov 2026

Status: DRAFT. Apply only after Daniele says go. Deploy is a separate approval.

Source of truth: the 19 Dec Humanitix page Daniele supplied on 25 Nov and `~/Projects/Piano by Heart/COMMS_BRIEF.md`.

## 1. Fix the missing route

File: `~/dyad-apps/daniele buatti/src/App.tsx`
Near the existing line:
`<Route path="piano-by-heart" element={<Navigate to="/pianobyheart" replace />} />`
Add:
`<Route path="pianobyheart" element={<PianoByHeartPage />} />`

Without this, both /pianobyheart and /piano-by-heart render Page Not Found.

## 2. Update the event object

File: `~/dyad-apps/daniele buatti/src/constants/piano-by-heart.ts`, the `nextEvening` object.
Replace the 14 Nov values with:
- date: "Saturday 19 December 2026"
- time: "5:00 to 6:30pm (arrive from 4:45pm)"
- price: "Early bird $35 (5 spots), then $40"
- places: "11 futons"
- shortDate: "Sat 19 Dec 2026, 5pm"
- startDate: "2026-12-19T17:00+11:00"
- endDate: "2026-12-19T18:30+11:00"
- venue.room: "Studio"
- venue.name: "Inner HUMM"
- venue.streetAddress: "144 St Kilda Rd"
- venue.locality: "St Kilda"
- venue.region: "VIC"
- venue.postcode: "3182"
- priceFrom: 35
- status: "on-sale"
- bookingUrl: "https://events.humanitix.com/piano-by-heart-19-dec-2026"

Keep the existing rule that a past endDate hides the event.

## 3. Update page copy

File: `~/dyad-apps/daniele buatti/src/pages/PianoByHeartPage.tsx`
- Hero line: "An hour of improvised piano in a dim, quiet room with soft visuals."
- Intro first paragraph: "Lie back on a futon in a dim, quiet room with soft visuals and let an hour of live, improvised piano move through you. There is nothing to do and nothing to get right. Some people rest the whole time, some drift into sleep, some stretch, sway or hum along. All of it is welcome."
- Add near the intro: "December's theme is REST."
- Run sheet:
  - 4:45pm Doors, settle onto a futon
  - 5:00pm An hour of improvised piano
  - 6:00pm Tea to close
- FAQ running late: "Please arrive by 4:45pm so we can begin together at 5pm."
- FAQ refund: "Refunds follow the venue terms. More than 2 weeks before, 80% back. 1 to 2 weeks before, 50%. Within 72 hours, no refund. Special consideration may be possible, please get in touch."
- Keep: "come as you are", "tea to close", 11 places.
- Remove or avoid: candles, candlelit, lit by candlelight, about 90 minutes, soft lighting, 15 places, 5:15pm start, em dashes.

## 4. Fix remaining em dashes in site copy

File: `~/dyad-apps/daniele buatti/src/seo/pages.ts`
- The /pianobyheart title currently reads "Piano by Heart [em dash] Live improvised piano to rest | Daniele Buatti". Change to "Piano by Heart, live improvised piano to rest | Daniele Buatti".

File: `~/dyad-apps/daniele buatti/src/constants/piano-by-heart.ts`
- enquiry subject: "Piano by Heart, next evening"
- artwork alt: "Piano by Heart, abstract indigo and pink artwork"

## 5. Optional short booking link

File: `~/dyad-apps/daniele buatti/vercel.json`, add to redirects:
`{ "source": "/pianobyheart/next", "destination": "https://events.humanitix.com/piano-by-heart-19-dec-2026", "permanent": false }`
Only add this if Daniele wants the direct /next link. Update the destination when the event changes.

## 6. Verify after apply

- Run the project's production build locally.
- Deploy to Vercel is a separate step, needs approval.
- Check https://danielebuatti.com/pianobyheart in the browser: correct date, price, venue, Book button, no Page Not Found.
- Check the Instagram bio link only after Daniele adds it.

Nothing published or scheduled.

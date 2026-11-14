-- Correct voucher pack prices (Nov 2026).
-- 60-minute voice/piano lessons are $95 each, so a pack of three is $285 (was $295).
UPDATE public.voucher_packs SET price_cents = 28500 WHERE key IN ('PIANO_60', 'VOICE_60');

-- Kinesiology vouchers sell at the $95/hour rate now: 3 x $95 = $285.
-- The scheduled 1 Jan 2027 rise is no longer needed.
UPDATE public.voucher_packs
   SET price_cents = 28500, next_price_cents = NULL, next_price_from = NULL
 WHERE key = 'KINESIOLOGY_60';

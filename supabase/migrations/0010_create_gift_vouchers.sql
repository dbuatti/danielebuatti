-- Gift vouchers for lesson and session packs.
--
-- Three tables:
--   voucher_packs        the editable price list (prices are data, not code)
--   gift_vouchers        one row per voucher issued or sold
--   voucher_redemptions  the history of sessions used against a voucher
--   voucher_admins       email allowlist, so RLS can enforce "admins only"
--
-- Note on voucher_admins: Postgres row level security cannot read Supabase
-- Edge Function secrets, so HUB_ADMIN_EMAILS is mirrored into this table.
-- The admin UI writes to it; RLS policies check it via auth.jwt().

-- ---------------------------------------------------------------- packs

CREATE TABLE IF NOT EXISTS public.voucher_packs (
  key TEXT PRIMARY KEY,
  label TEXT NOT NULL,
  discipline TEXT NOT NULL,          -- piano | voice | kinesiology | credit
  description TEXT,
  sessions_total INTEGER,            -- NULL for custom-amount credit
  session_length_minutes INTEGER,
  price_cents INTEGER NOT NULL DEFAULT 0,
  -- A future price lets a rise (e.g. kinesiology on 1 Jan 2027) be scheduled
  -- as data instead of a code change. NULL until a rise is configured.
  next_price_cents INTEGER,
  next_price_from DATE,
  is_custom_amount BOOLEAN NOT NULL DEFAULT FALSE,
  min_cents INTEGER,
  max_cents INTEGER,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE public.voucher_packs IS
  'Voucher products and their prices. Editable from the admin; no prices are hard-coded in the app.';

-- ------------------------------------------------------------- vouchers

-- status lifecycle:
--   pending -> paid -> partly_used -> used
--                        \-> expired
--   pending -> cancelled
CREATE TYPE public.voucher_status AS ENUM (
  'pending', 'paid', 'partly_used', 'used', 'expired', 'cancelled'
);

CREATE TABLE IF NOT EXISTS public.gift_vouchers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Readable, human-quotable code, e.g. DB-PIANO-7K3Q. Unique so a voucher can
  -- never be redeemed against the wrong record.
  code TEXT NOT NULL UNIQUE,

  pack_key TEXT REFERENCES public.voucher_packs(key),
  discipline TEXT NOT NULL,
  label TEXT NOT NULL,               -- snapshot of the pack name at purchase time
  description TEXT,

  sessions_total INTEGER,            -- NULL for a custom dollar credit
  sessions_remaining INTEGER,
  session_length_minutes INTEGER,
  amount_cents INTEGER,              -- set for custom-amount / credit vouchers

  buyer_name TEXT NOT NULL,
  buyer_email TEXT NOT NULL,

  recipient_name TEXT,
  recipient_email TEXT,
  message TEXT,

  -- When set, the recipient email is held back until this date (birthday
  -- surprises). NULL means "email the buyer only".
  send_recipient_on DATE,
  recipient_sent_at TIMESTAMPTZ,
  buyer_receipt_sent_at TIMESTAMPTZ,

  status public.voucher_status NOT NULL DEFAULT 'pending',
  paid_at TIMESTAMPTZ,               -- income is dated by this, not created_at
  cancelled_at TIMESTAMPTZ,
  expires_at DATE NOT NULL,

  -- Exactly one voucher per Stripe Checkout session. The unique index below is
  -- what stops a Stripe retry from creating a duplicate voucher.
  stripe_checkout_session_id TEXT UNIQUE,

  issued_manually BOOLEAN NOT NULL DEFAULT FALSE,
  internal_notes TEXT,

  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE public.gift_vouchers IS
  'One row per gift voucher. Income is counted from paid_at so the date a voucher was paid is the date it counts.';

COMMENT ON COLUMN public.gift_vouchers.code IS
  'Human-readable code quoted when booking, e.g. DB-PIANO-7K3Q.';

COMMENT ON COLUMN public.gift_vouchers.paid_at IS
  'The date payment cleared. Used for income reporting instead of created_at.';

CREATE INDEX IF NOT EXISTS gift_vouchers_status_idx ON public.gift_vouchers (status);
CREATE INDEX IF NOT EXISTS gift_vouchers_paid_at_idx ON public.gift_vouchers (paid_at);
CREATE INDEX IF NOT EXISTS gift_vouchers_recipient_email_idx ON public.gift_vouchers (recipient_email);
CREATE INDEX IF NOT EXISTS gift_vouchers_buyer_email_idx ON public.gift_vouchers (buyer_email);

-- ---------------------------------------------------------- redemptions

CREATE TABLE IF NOT EXISTS public.voucher_redemptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  voucher_id UUID NOT NULL REFERENCES public.gift_vouchers(id) ON DELETE CASCADE,
  sessions_used INTEGER NOT NULL DEFAULT 1 CHECK (sessions_used > 0),
  used_on DATE NOT NULL DEFAULT CURRENT_DATE,
  note TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE public.voucher_redemptions IS
  'Append-only history of sessions used against a voucher. Deleting a voucher cascades.';

CREATE INDEX IF NOT EXISTS voucher_redemptions_voucher_idx
  ON public.voucher_redemptions (voucher_id, used_on DESC);

-- -------------------------------------------------------- admin allowlist

CREATE TABLE IF NOT EXISTS public.voucher_admins (
  email TEXT PRIMARY KEY,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE public.voucher_admins IS
  'Mirror of the HUB_ADMIN_EMAILS secret. Postgres RLS cannot read Edge Function secrets, so the allowlist lives here.';

-- Helper used by the policies. SECURITY DEFINER so it can read the allowlist
-- without the caller needing a policy on voucher_admins itself.
CREATE OR REPLACE FUNCTION public.is_voucher_admin()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.voucher_admins a
    WHERE a.email = lower(coalesce(auth.jwt() ->> 'email', ''))
  );
$$;

-- ------------------------------------------------------------------ RLS

ALTER TABLE public.voucher_packs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gift_vouchers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.voucher_redemptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.voucher_admins ENABLE ROW LEVEL SECURITY;

-- Packs are public so the /gift page can render the price list without logging
-- in. Only active packs are visible.
DROP POLICY IF EXISTS "Anyone can view active packs" ON public.voucher_packs;
CREATE POLICY "Anyone can view active packs"
  ON public.voucher_packs FOR SELECT
  USING (is_active);

DROP POLICY IF EXISTS "Admins manage packs" ON public.voucher_packs;
CREATE POLICY "Admins manage packs"
  ON public.voucher_packs FOR ALL
  TO authenticated
  USING (public.is_voucher_admin())
  WITH CHECK (public.is_voucher_admin());

-- Vouchers: the public may only create a PENDING, UNPAID purchase. It cannot
-- mark it paid, read it back, or change it. Payment status is set exclusively
-- by the Stripe webhook, which uses the service role and bypasses RLS.
DROP POLICY IF EXISTS "Anyone can create a pending voucher" ON public.gift_vouchers;
CREATE POLICY "Anyone can create a pending voucher"
  ON public.gift_vouchers FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    status = 'pending'
    AND paid_at IS NULL
    AND stripe_checkout_session_id IS NOT NULL
  );

DROP POLICY IF EXISTS "Admins read vouchers" ON public.gift_vouchers;
CREATE POLICY "Admins read vouchers"
  ON public.gift_vouchers FOR SELECT
  TO authenticated
  USING (public.is_voucher_admin());

DROP POLICY IF EXISTS "Admins update vouchers" ON public.gift_vouchers;
CREATE POLICY "Admins update vouchers"
  ON public.gift_vouchers FOR UPDATE
  TO authenticated
  USING (public.is_voucher_admin())
  WITH CHECK (public.is_voucher_admin());

DROP POLICY IF EXISTS "Admins delete vouchers" ON public.gift_vouchers;
CREATE POLICY "Admins delete vouchers"
  ON public.gift_vouchers FOR DELETE
  TO authenticated
  USING (public.is_voucher_admin());

-- Redemptions are written by the redeem function (SECURITY DEFINER) and read by
-- admins. No public access at all.
DROP POLICY IF EXISTS "Admins read redemptions" ON public.voucher_redemptions;
CREATE POLICY "Admins read redemptions"
  ON public.voucher_redemptions FOR SELECT
  TO authenticated
  USING (public.is_voucher_admin());

-- Admins may read the allowlist so the settings UI can show it, but not edit it
-- from the browser: it must be changed in Supabase to stay in step with the
-- HUB_ADMIN_EMAILS secret.
DROP POLICY IF EXISTS "Admins read admin allowlist" ON public.voucher_admins;
CREATE POLICY "Admins read admin allowlist"
  ON public.voucher_admins FOR SELECT
  TO authenticated
  USING (public.is_voucher_admin());

-- ------------------------------------------------------------- functions

-- Generates a readable code like DB-PIANO-7K3Q. Retries on the (rare) chance of
-- a collision with the unique index.
CREATE OR REPLACE FUNCTION public.generate_voucher_code(p_discipline TEXT)
RETURNS TEXT
LANGUAGE plpgsql
AS $$
DECLARE
  v_prefix TEXT;
  v_alphabet TEXT := 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; -- no I, O, 0, 1
  v_suffix TEXT := '';
  v_code TEXT;
  i INTEGER;
BEGIN
  v_prefix := CASE lower(coalesce(p_discipline, ''))
    WHEN 'piano' THEN 'DB-PIANO'
    WHEN 'voice' THEN 'DB-VOICE'
    WHEN 'kinesiology' THEN 'DB-KIN'
    WHEN 'credit' THEN 'DB-CREDIT'
    ELSE 'DB-GIFT'
  END;

  FOR i IN 1..4 LOOP
    v_suffix := v_suffix || substr(v_alphabet, 1 + floor(random() * length(v_alphabet))::int, 1);
  END LOOP;

  v_code := v_prefix || '-' || v_suffix;

  -- Guard against the vanishingly unlikely collision.
  IF EXISTS (SELECT 1 FROM public.gift_vouchers g WHERE g.code = v_code) THEN
    RETURN public.generate_voucher_code(p_discipline);
  END IF;

  RETURN v_code;
END;
$$;

-- Uses one session (or more) of a voucher and records it in the history.
-- Recomputes the voucher status from what is left.
CREATE OR REPLACE FUNCTION public.redeem_voucher_session(
  p_voucher_id UUID,
  p_used_on DATE DEFAULT CURRENT_DATE,
  p_note TEXT DEFAULT NULL,
  p_sessions INTEGER DEFAULT 1
)
RETURNS public.gift_vouchers
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_voucher public.gift_vouchers;
  v_remaining INTEGER;
  v_new_status public.voucher_status;
BEGIN
  SELECT * INTO v_voucher FROM public.gift_vouchers WHERE id = p_voucher_id FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Voucher % not found', p_voucher_id;
  END IF;

  IF v_voucher.status = 'cancelled' THEN
    RAISE EXCEPTION 'Voucher % is cancelled', v_voucher.code;
  END IF;

  IF v_voucher.status = 'pending' THEN
    RAISE EXCEPTION 'Voucher % is not paid yet', v_voucher.code;
  END IF;

  IF v_voucher.expires_at < (p_used_on) THEN
    RAISE EXCEPTION 'Voucher % expired on %', v_voucher.code, v_voucher.expires_at;
  END IF;

  IF v_voucher.sessions_total IS NULL THEN
    RAISE EXCEPTION 'Voucher % is a dollar credit and has no sessions to use', v_voucher.code;
  END IF;

  IF v_voucher.sessions_remaining < p_sessions THEN
    RAISE EXCEPTION 'Voucher % only has % session(s) left', v_voucher.code, v_voucher.sessions_remaining;
  END IF;

  INSERT INTO public.voucher_redemptions (voucher_id, sessions_used, used_on, note)
  VALUES (p_voucher_id, p_sessions, coalesce(p_used_on, CURRENT_DATE), p_note);

  v_remaining := v_voucher.sessions_remaining - p_sessions;

  v_new_status := CASE WHEN v_remaining <= 0 THEN 'used'::public.voucher_status ELSE 'partly_used'::public.voucher_status END;

  UPDATE public.gift_vouchers
     SET sessions_remaining = v_remaining,
         status = v_new_status,
         updated_at = NOW()
   WHERE id = p_voucher_id
  RETURNING * INTO v_voucher;

  RETURN v_voucher;
END;
$$;

-- Marks a voucher paid. Shared by the Stripe webhook and manual issue so both
-- paths produce identical rows.
CREATE OR REPLACE FUNCTION public.mark_voucher_paid(
  p_voucher_id UUID,
  p_paid_at TIMESTAMPTZ DEFAULT NOW()
)
RETURNS public.gift_vouchers
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_voucher public.gift_vouchers;
BEGIN
  UPDATE public.gift_vouchers
     SET status = CASE WHEN sessions_total IS NOT NULL AND sessions_remaining = sessions_total
                       THEN 'paid' ELSE status END,
         paid_at = coalesce(paid_at, p_paid_at),
         updated_at = NOW()
   WHERE id = p_voucher_id
     AND status = 'pending'
  RETURNING * INTO v_voucher;

  IF NOT FOUND THEN
    SELECT * INTO v_voucher FROM public.gift_vouchers WHERE id = p_voucher_id;
    IF NOT FOUND THEN
      RAISE EXCEPTION 'Voucher % not found', p_voucher_id;
    END IF;
  END IF;

  RETURN v_voucher;
END;
$$;

-- Refreshes the status of any paid voucher whose expiry has passed.
CREATE OR REPLACE FUNCTION public.expire_stale_vouchers()
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_count INTEGER;
BEGIN
  WITH updated AS (
    UPDATE public.gift_vouchers
       SET status = 'expired', updated_at = NOW()
     WHERE status IN ('paid', 'partly_used')
       AND expires_at < CURRENT_DATE
    RETURNING 1
  )
  SELECT count(*) INTO v_count FROM updated;

  RETURN v_count;
END;
$$;

-- ------------------------------------------------------------ timestamps

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at := NOW();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS gift_vouchers_set_updated_at ON public.gift_vouchers;
CREATE TRIGGER gift_vouchers_set_updated_at
  BEFORE UPDATE ON public.gift_vouchers
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS voucher_packs_set_updated_at ON public.voucher_packs;
CREATE TRIGGER voucher_packs_set_updated_at
  BEFORE UPDATE ON public.voucher_packs
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ------------------------------------------------------------------ seed

INSERT INTO public.voucher_packs
  (key, label, discipline, description, sessions_total, session_length_minutes, price_cents, sort_order)
VALUES
  ('PIANO_30', 'Piano · 3 × 30 min', 'piano',
   'Three 30-minute piano lessons.', 3, 30, 15000, 10),
  ('PIANO_45', 'Piano · 3 × 45 min', 'piano',
   'Three 45-minute piano lessons.', 3, 45, 22500, 20),
  ('PIANO_60', 'Piano · 3 × 60 min', 'piano',
   'Three 60-minute piano lessons.', 3, 60, 29500, 30),
  ('VOICE_30', 'Voice · 3 × 30 min', 'voice',
   'Three 30-minute voice lessons.', 3, 30, 15000, 40),
  ('VOICE_45', 'Voice · 3 × 45 min', 'voice',
   'Three 45-minute voice lessons.', 3, 45, 22500, 50),
  ('VOICE_60', 'Voice · 3 × 60 min', 'voice',
   'Three 60-minute voice lessons.', 3, 60, 29500, 60),
  ('KINESIOLOGY_60', 'Kinesiology · 3 × 60 min', 'kinesiology',
   'Three 60-minute kinesiology sessions.',
   3, 60, 21000, 70)
ON CONFLICT (key) DO NOTHING;

-- Kinesiology rises to $285 on 1 January 2027. Scheduling it as data means the
-- price changes itself with no deploy on the day.
INSERT INTO public.voucher_packs
  (key, label, discipline, description, sessions_total, session_length_minutes,
   price_cents, next_price_cents, next_price_from, sort_order)
VALUES
  ('KINESIOLOGY_60', 'Kinesiology · 3 × 60 min', 'kinesiology',
   'Three 60-minute kinesiology sessions.',
   3, 60, 21000, 28500, DATE '2027-01-01', 70)
ON CONFLICT (key) DO UPDATE
   SET next_price_cents = EXCLUDED.next_price_cents,
       next_price_from = EXCLUDED.next_price_from;

-- Custom dollar credit. Price comes from the buyer within min/max.
INSERT INTO public.voucher_packs
  (key, label, discipline, description, sessions_total, session_length_minutes,
   price_cents, is_custom_amount, min_cents, max_cents, sort_order)
VALUES
  ('CUSTOM', 'Custom amount', 'credit',
   'A dollar credit to put towards any session.',
   NULL, NULL, 0, TRUE, 5000, 500000, 90)
ON CONFLICT (key) DO NOTHING;
INSERT INTO invoices (
  id,
  client_name,
  client_email,
  invoice_type,
  event_title,
  event_date,
  event_location,
  prepared_by,
  total_amount,
  status,
  slug,
  details,
  created_at
) VALUES (
  gen_random_uuid(),
  'Tommy Clarke',
  'tommyclarkemail@gmail.com',
  'Quote',
  'Elly''s 50th Birthday "Splendide"',
  '2026-07-31',
  '9 Duke St Brunswick East',
  'Daniele Buatti',
  1250.00,
  'Draft',
  'ellys-50th-birthday-splendide-' || lower(replace(gen_random_uuid()::text, '-', '')),
  jsonb_build_object(
    'versions', jsonb_build_array(
      jsonb_build_object(
        'versionId', 'v1',
        'versionName', 'Initial Proposal',
        'created_at', now(),
        'is_active', true,
        'status', 'Draft',
        'accepted_at', null,
        'rejected_at', null,
        'total_amount', 1250.00,
        'depositPercentage', 50,
        'discountPercentage', 0,
        'discountAmount', 0,
        'paymentTerms', 'Payment due within 7 days of acceptance.',
        'bankDetails', jsonb_build_object(
          'bsb', '923100',
          'acc', '301110875'
        ),
        'compulsoryItems', jsonb_build_array(
          jsonb_build_object(
            'id', 'base-fee',
            'name', 'Base Performance Fee',
            'description', '3 hours of live piano performance (6:00pm - 9:00pm). Includes Acoustic Arrival, Feature Transition, and Piano Bar Sing-along. I will utilize your house upright for the initial atmosphere and my professional stage setup for the interactive sets to ensure perfect sound balance.',
            'price', 1250.00,
            'quantity', 1,
            'showQuantity', true,
            'showRate', true,
            'showScheduleDates', false
          )
        ),
        'addOns', jsonb_build_array(
          jsonb_build_object(
            'id', 'overtime-30',
            'name', 'Overtime (per 30 min)',
            'description', 'Additional performance time beyond 9:00pm.',
            'price', 150.00,
            'quantity', 0,
            'showQuantity', true,
            'showRate', true,
            'showScheduleDates', false
          )
        ),
        'currencySymbol', 'A$',
        'eventTime', '18:00',
        'theme', 'default',
        'headerImageUrl', '/whitepinkquoteimage1.jpeg',
        'preparationNotes', 'This fee covers 7 hours of commitment, including preparation, travel, setup, performance, and pack down.'
      )
    )
  ),
  now()
);
UPDATE invoices 
SET details = jsonb_set(
  details, 
  '{versions,0,compulsoryItems,0,description}', 
  '"3 hours of live piano performance (6:00pm - 9:00pm). Includes Acoustic Arrival, Feature Transition, and Piano Bar Sing-along. I will utilise your house upright for the initial atmosphere and my professional stage setup for the interactive sets to ensure perfect sound balance."'
)
WHERE client_name = 'Tommy Clarke' AND event_title = 'Elly''s 50th Birthday "Splendide"';
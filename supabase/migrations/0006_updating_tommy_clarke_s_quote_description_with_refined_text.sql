UPDATE invoices 
SET details = jsonb_set(
  details, 
  '{versions,0,compulsoryItems,0,description}', 
  '"3 hours of live piano and vocal performance from 6:00 PM to 9:00 PM, tailored to fit the evening''s flow. This may include ambient background piano as guests arrive, followed by more interactive singing and piano bar-style moments as the energy increases. The performance aims to create a \"cocktails to piano bar to sing-along\" atmosphere, adjusting in real time to the room and your event schedule. I can provide a microphone and small amplification for vocals. Please note that the piano will stay acoustic, so its presence will depend on its placement and the instrument."'
)
WHERE client_name = 'Tommy Clarke' AND event_title = 'Elly''s 50th Birthday "Splendide"';
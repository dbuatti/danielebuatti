UPDATE invoices 
SET details = jsonb_set(
  jsonb_set(
    details, 
    '{versions,0,compulsoryItems,0,description}', 
    '"3 hours of live piano and vocal performance (6:00pm to 9:00pm), tailored to the flow of the evening. This may include ambient background piano as guests arrive, followed by more interactive singing and piano bar-style moments as the energy builds.\n\nThe performance is designed to support a \"cocktails to piano bar to sing-along\" atmosphere, adapting in real time to the room and your event schedule.\n\nI can provide a microphone and small amplification for vocals. Please note the piano will remain acoustic, so its presence will depend on placement and the instrument."'
  ),
  '{versions,0,preparationNotes}',
  '"This fee covers the full professional commitment for the evening, including bespoke repertoire preparation, travel, equipment setup, performance, and pack down. Final structure and timing can be refined once event details are confirmed."'
)
WHERE client_name = 'Tommy Clarke' AND event_title = 'Elly''s 50th Birthday "Splendide"';
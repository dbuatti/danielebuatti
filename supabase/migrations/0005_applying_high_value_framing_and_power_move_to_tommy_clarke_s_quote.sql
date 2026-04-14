UPDATE invoices 
SET details = jsonb_set(
  jsonb_set(
    details, 
    '{versions,0,compulsoryItems,0,description}', 
    '"3 hours of live piano and vocal performance (6:00pm to 9:00pm), tailored to the flow of the evening.\n\nI approach these events not just as a performer, but as someone shaping the musical atmosphere of the night. This includes reading the room, supporting key moments, and building energy naturally as the event unfolds.\n\nThe evening may begin with ambient background piano as guests arrive, before developing into more interactive piano bar-style performance and sing-along moments as the energy lifts. When the moment is right, I can guide the room into a relaxed, high-energy sing-along experience that feels natural and engaging.\n\nThe performance adapts in real time to guest interaction, speeches, and the overall flow of the event, helping create a seamless transition from cocktails through to a more lively, celebratory atmosphere.\n\nDrawing on my experience performing at events such as NGV galas and private functions, my focus is always on creating an experience that feels both musically polished and socially intuitive.\n\nI can provide a microphone and small amplification for vocals. Please note the piano will remain acoustic, so its presence will depend on placement and the instrument."'
  ),
  '{versions,0,preparationNotes}',
  '"This fee covers the full professional commitment for the evening, including bespoke repertoire preparation, travel, equipment setup, performance, and pack down. I’m also happy to coordinate lightly with you on timing and flow to ensure key moments land well."'
)
WHERE client_name = 'Tommy Clarke' AND event_title = 'Elly''s 50th Birthday "Splendide"';
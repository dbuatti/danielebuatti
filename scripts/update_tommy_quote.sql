-- 1. Clean up Tommy's slug and status for a professional presentation
UPDATE public.invoices 
SET 
  slug = 'ellys-50th-birthday',
  status = 'Created'
WHERE client_name = 'Tommy Clarke';

-- 2. Remove the test quote to keep the dashboard clean
DELETE FROM public.invoices 
WHERE event_title = 'Test Quote';
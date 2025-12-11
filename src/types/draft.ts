import { QuoteFormValues } from '@/components/admin/QuoteForm';

export interface Draft {
  id: string;
  user_id: string;
  title: string;
  data: QuoteFormValues; // Stores the full form data
  created_at: string;
  updated_at: string;
}
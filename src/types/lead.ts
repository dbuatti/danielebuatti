export interface Lead {
  id: string;
  user_id: string;
  company_name: string;
  contact_name: string | null;
  email: string | null;
  phone: string | null;
  venue: string | null;
  source: string | null;
  outcome: string | null;
  notes: string | null;
  goal: string | null;
  status: 'New' | 'Contacted' | 'Qualified' | 'Lost' | 'Converted';
  lead_type: 'Music' | 'Tech';
  sector: string | null; // NEW
  estimated_value: number;
  probability: number;
  follow_up_date: string | null;
  priority: 'Low' | 'Medium' | 'High';
  created_at: string;
  updated_at: string;
}
export interface AddOnItem {
  id: string;
  name: string;
  description?: string;
  cost: number;
  quantity: number;
}

export interface QuoteDetails {
  baseService?: {
    description: string;
    amount: number;
  };
  currencySymbol?: string;
  depositPercentage?: number;
  bankDetails?: { bsb: string; acc: string };
  eventTime?: string;
  paymentTerms?: string;
  addOns?: AddOnItem[];
  final_total_amount?: number;
  client_selected_add_ons?: AddOnItem[];
  requiredDeposit?: number;
}

export interface Quote {
  id: string;
  client_name: string;
  client_email: string;
  invoice_type: string;
  event_title?: string;
  event_date?: string | null;
  event_location?: string;
  prepared_by?: string;
  total_amount: number;
  details: QuoteDetails;
  accepted_at: string | null;
  rejected_at: string | null;
  slug?: string | null;
  created_at: string;
}
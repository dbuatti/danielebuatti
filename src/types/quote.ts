export type QuoteTheme = 'default' | 'black-gold';

export interface QuoteItem {
  id: string;
  name: string;
  description: string;
  quantity: number;
  price: number; // Unit price/cost
}

export interface QuoteDetails {
  depositPercentage: number;
  paymentTerms: string;
  bankDetails: {
    bsb: string;
    acc: string;
  };
  addOns: QuoteItem[];
  compulsoryItems: QuoteItem[];
  currencySymbol: string;
  eventTime: string;
  theme: QuoteTheme; // Updated to use specific theme type
  headerImageUrl: string;
  contentImageUrl1?: string; // New: First content image URL
  contentImageUrl2?: string; // New: Second content image URL
  preparationNotes: string;
  client_selected_add_ons?: QuoteItem[]; // Added missing property
}

export interface Quote {
  id: string;
  slug: string;
  client_name: string;
  client_email: string;
  event_title: string;
  invoice_type: 'Quote' | 'Invoice';
  event_date: string;
  event_location: string;
  prepared_by: string;
  total_amount: number;
  accepted_at: string | null;
  rejected_at: string | null;
  created_at: string;
  details: QuoteDetails;
}
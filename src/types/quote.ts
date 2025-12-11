export type QuoteItem = {
  id: string;
  name: string;
  description: string;
  quantity: number;
  price: number;
};

export type BankDetails = {
  bsb: string;
  acc: string;
};

export type QuoteDetails = {
  compulsoryItems: QuoteItem[];
  addOns: QuoteItem[];
  depositPercentage: number;
  paymentTerms: string;
  bankDetails: BankDetails;
  eventTime?: string;
  currencySymbol: string;
  theme: 'default' | 'black-gold'; // Added black-gold theme
  headerImageUrl?: string;
  preparationNotes?: string; // Added new field
};

export type Quote = {
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
};
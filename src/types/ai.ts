export interface ExtractedQuoteItem {
  name: string;
  description?: string;
  amount: number; // Used for compulsory items
}

export interface ExtractedAddOnItem {
  name: string;
  description?: string;
  cost: number; // Used for add-ons
}

export interface ExtractedQuoteContent {
  clientName: string;
  clientEmail: string;
  invoiceType: 'Quote' | 'Invoice';
  eventTitle: string;
  eventDate: string; // YYYY-MM-DD (e.g., 2025-12-11)
  eventTime: string; // HH:MM (e.g., 18:00)
  eventLocation: string;
  paymentTerms: string;
  preparationNotes: string;
  compulsoryItems: ExtractedQuoteItem[];
  addOns: ExtractedAddOnItem[];
}
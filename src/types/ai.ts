export type ExtractedQuoteItem = {
  name: string; // The concise title of the item (e.g., 'Minimum Performance Fee')
  description: string; // The detailed explanation of the item
  amount?: number; // Used for compulsory items
  cost?: number; // Used for add-ons
  quantity?: number; // Used for add-ons
};

export type ExtractedQuoteContent = {
  clientName: string;
  clientEmail: string;
  invoiceType: 'Quote' | 'Invoice';
  eventTitle: string;
  eventDate: string;
  eventTime?: string;
  eventLocation: string;
  paymentTerms: string;
  preparationNotes: string;
  compulsoryItems: ExtractedQuoteItem[];
  addOns: ExtractedQuoteItem[];
};
export interface ExtractedQuoteContent {
  clientName: string;
  clientEmail: string;
  invoiceType: string;
  eventTitle: string;
  eventDate: string; // YYYY-MM-DD format
  eventTime?: string;
  eventLocation: string;
  compulsoryItems: { description: string; amount: number; }[];
  addOns: { description: string; cost: number; quantity: number; }[];
  paymentTerms: string;
}
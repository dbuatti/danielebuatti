export interface AIQuoteContent {
  compulsoryItems: { description: string; amount: number; }[];
  addOns: { description: string; cost: number; quantity: number; }[];
  paymentTerms: string;
}
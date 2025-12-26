export type QuoteTheme = 'default' | 'black-gold';

export interface QuoteItem {
  id?: string; // Made optional to align with form schema
  name: string;
  description?: string; // Made optional
  quantity: number;
  price: number; // Unit price/cost (replaces 'amount' and 'cost' from form context)
  scheduleDates?: string; // NEW: Schedule/Dates field
  // NEW: Item-level visibility toggles
  showScheduleDates: boolean;
  showQuantity: boolean;
  showRate: boolean;
}

export interface QuoteVersion {
  versionId: string; // e.g., 'v1', 'v2'
  versionName: string; // e.g., 'Initial Proposal', 'Revision 1 (Client Request)'
  created_at: string;
  is_active: boolean; // Only one version can be active at a time
  status: 'Draft' | 'Created' | 'Sent' | 'Accepted' | 'Rejected';
  accepted_at: string | null;
  rejected_at: string | null;
  
  // Core content of the quote version
  total_amount: number; // Final amount after all calculations
  
  // --- Discount Fields ---
  discountPercentage: number;
  discountAmount: number;
  // -----------------------
  
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
  theme: QuoteTheme;
  headerImageUrl: string;
  headerImagePosition?: string;
  preparationNotes: string;
  scopeOfWorkUrl?: string;
  client_selected_add_ons?: QuoteItem[]; // Final selected items list (only if accepted)
}

export interface QuoteDetails {
  // The main quote record now holds an array of versions
  versions: QuoteVersion[];
}

// The main Quote interface is simplified, as most details are now inside the active version
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
  
  // These fields will now reflect the ACTIVE version's data for quick access/filtering
  total_amount: number; 
  accepted_at: string | null;
  rejected_at: string | null;
  created_at: string;
  status: 'Draft' | 'Created' | 'Sent' | 'Accepted' | 'Rejected';
  
  // The JSONB column now holds the version history
  details: QuoteDetails;
}
export type QuoteTheme = 'black-gold' | 'default';

export interface QuoteItem {
    id: string;
    name: string;
    description?: string;
    price: number;
    quantity: number;
}

export interface QuoteDetails {
    depositPercentage: number;
    paymentTerms: string;
    bankDetails: { bsb: string; acc: string };
    currencySymbol: string;
    eventTime?: string;
    theme: QuoteTheme;
    headerImageUrl?: string;
    headerImagePosition?: string;
    preparationNotes?: string;
    compulsoryItems: QuoteItem[];
    addOns: QuoteItem[];
    client_selected_add_ons?: QuoteItem[];
}

export interface Quote {
    id: string;
    client_name: string;
    client_email: string;
    invoice_type: 'Quote' | 'Invoice';
    event_title: string;
    event_date: string;
    event_location: string;
    prepared_by: string;
    total_amount: number;
    slug: string;
    // Updated status to include 'Created'
    status: 'Draft' | 'Created' | 'Sent' | 'Accepted' | 'Rejected';
    // Updated dates to allow null, matching database/API response
    accepted_at?: string | null;
    rejected_at?: string | null;
    created_at: string;
}
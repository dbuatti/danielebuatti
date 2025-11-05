"use client";

import React from 'react';
import { useParams } from 'react-router-dom';
import QuoteDisplay from '@/components/admin/QuoteDisplay'; // Import the fixed component
import { cn, formatCurrency } from '@/lib/utils'; // Assuming cn and formatCurrency are available

// Define a simplified Quote type for DynamicQuotePage if it fetches it
interface DynamicQuotePageQuote {
  id: string;
  total_amount: number;
  requiredDeposit: number;
  depositPercentage: number;
  client_name?: string;
  client_email?: string;
  event_title?: string;
  invoice_type?: string;
  event_date?: string;
  paymentTerms?: string;
  bankDetails?: { bsb: string; acc: string };
  addOns?: { name: string; description?: string; cost: number; quantity: number }[];
  currencySymbol?: string;
  theme?: string; // To determine isLivePianoTheme
  isErinKennedyQuote?: boolean; // To determine isErinKennedyQuote
}

const DynamicQuotePage: React.FC = () => {
  const { quoteId } = useParams<{ quoteId: string }>();
  // In a real app, you would fetch the quote data based on quoteId
  // For this example, let's mock a quote object
  const mockQuote: DynamicQuotePageQuote = {
    id: quoteId || 'mock-id',
    total_amount: 1000,
    requiredDeposit: 200,
    depositPercentage: 20,
    client_name: "John Doe",
    client_email: "john.doe@example.com",
    event_title: "Wedding Ceremony",
    invoice_type: "Wedding Quote",
    event_date: "2024-12-25",
    paymentTerms: "Remaining balance due 7 days before event.",
    bankDetails: { bsb: "062-000", acc: "12345678" },
    addOns: [
      { name: "Extra Microphone", description: "For speeches", cost: 50, quantity: 1 },
      { name: "Lighting Package", description: "Uplighting for venue", cost: 200, quantity: 1 },
    ],
    currencySymbol: "$",
    theme: "livePiano", // or "brand"
    isErinKennedyQuote: false,
  };

  const quote = mockQuote; // Use the mocked quote for now

  const isLivePianoTheme = quote.theme === "livePiano";
  const isErinKennedyQuote = quote.isErinKennedyQuote || false;

  return (
    <div className={cn(
      "min-h-screen",
      isLivePianoTheme ? "bg-livePiano-background" : "bg-brand-background dark:bg-brand-dark"
    )}>
      <main className="container mx-auto py-12 px-4">
        {/* Optional Add-Ons Section (Generic) - This was the problematic section */}
        {/* This section should likely be handled by QuoteDisplay, but if DynamicQuotePage
            also needs to display addOns directly, it should use quote.addOns */}
        {quote.addOns && quote.addOns.length > 0 && ( // Fix: use quote.addOns
          <section className={cn(
            "p-8 rounded-xl border space-y-8 overflow-hidden",
            isLivePianoTheme ? "bg-livePiano-darker border-livePiano-primary/50" : "bg-brand-light dark:bg-brand-dark-alt border-brand-primary/50"
          )}>
            <h4 className={cn(
              "text-2xl font-bold text-center font-display",
              isLivePianoTheme ? "text-livePiano-light" : "text-brand-dark dark:text-brand-light"
            )}>Optional Add-Ons (from DynamicQuotePage)</h4>
            {/* Render add-ons here if needed, otherwise remove this section */}
            <ul className="list-disc list-inside">
              {quote.addOns.map((addon, index) => (
                <li key={index}>{addon.name}: {addon.quantity} x {formatCurrency(addon.cost, quote.currencySymbol)}</li>
              ))}
            </ul>
          </section>
        )}

        {/* Render the QuoteDisplay component */}
        <QuoteDisplay quote={quote} isLivePianoTheme={isLivePianoTheme} isErinKennedyQuote={isErinKennedyQuote} />
      </main>
    </div>
  );
};

export default DynamicQuotePage;
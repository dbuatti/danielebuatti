"use client";

import React from 'react';
import { Quote, QuoteItem } from '@/types/quote';
import { format } from 'date-fns';

interface QuoteDisplayProps {
  quote: Quote;
}

const QuoteDisplay: React.FC<QuoteDisplayProps> = ({ quote }) => {
  const { details } = quote;
  const isLivePianoTheme = details.theme === 'livePiano';

  // Define theme colors based on provided designs
  const themeClasses = isLivePianoTheme
    ? {
        // Gold/Black Theme (Live Piano)
        bg: 'bg-gray-900',
        cardBg: 'bg-gray-800',
        text: 'text-gray-100',
        primary: 'text-amber-400', // Gold color
        secondary: 'text-gray-400',
        border: 'border-amber-400/50',
        separator: 'bg-amber-400 h-0.5',
        headerText: 'text-gray-100',
      }
    : {
        // White/Pink Theme (Default)
        bg: 'bg-white',
        cardBg: 'bg-white',
        text: 'text-gray-800',
        primary: 'text-fuchsia-600', // Proper vibrant pink
        secondary: 'text-gray-500',
        border: 'border-fuchsia-600/50',
        separator: 'bg-fuchsia-600 h-0.5',
        headerText: 'text-gray-800',
      };

  const formatCurrency = (amount: number) => {
    return `${details.currencySymbol}${amount.toFixed(2)}`;
  };

  const calculateItemTotal = (item: QuoteItem) => {
    return item.price * item.quantity;
  };

  const compulsoryTotal = details.compulsoryItems.reduce((sum, item) => sum + calculateItemTotal(item), 0);
  const addOnTotal = details.addOns.reduce((sum, item) => sum + calculateItemTotal(item), 0);
  const subtotal = compulsoryTotal + addOnTotal;
  const depositAmount = subtotal * (details.depositPercentage / 100);
  
  const eventDateFormatted = quote.event_date ? format(new Date(quote.event_date), 'EEEE dd MMMM yyyy') : 'TBD';

  return (
    <div className={`min-h-screen p-4 sm:p-8 ${themeClasses.bg}`}>
      <div className={`max-w-4xl mx-auto p-6 sm:p-10 shadow-2xl rounded-lg ${themeClasses.cardBg}`}>
        
        {/* Header Image */}
        {details.headerImageUrl && (
          <div className="mb-8">
            <img 
              src={details.headerImageUrl} 
              alt="Quote Header" 
              className="w-full h-64 object-cover rounded-lg shadow-md"
            />
          </div>
        )}

        {/* Logo Placeholder (Based on design images) */}
        <div className="text-center mb-8">
          {/* Placeholder for logo/branding */}
          <div className={`text-4xl font-serif font-bold ${themeClasses.primary}`}>
            {isLivePianoTheme ? 'Live Piano Services' : 'Daniele Buatti'}
          </div>
        </div>

        <header className="mb-8 text-center space-y-1">
          <h1 className={`text-4xl font-extrabold mb-4 ${themeClasses.primary}`}>{quote.event_title}</h1>
          
          <p className={`text-lg ${themeClasses.headerText}`}>Prepared for: <span className="font-semibold">{quote.prepared_by}</span></p>
          <p className={`text-lg ${themeClasses.headerText}`}>Client Email: <span className="font-semibold">{quote.client_email}</span></p>
          <p className={`text-lg ${themeClasses.headerText}`}>Date of Event: <span className="font-semibold">{eventDateFormatted}</span></p>
          {details.eventTime && <p className={`text-lg ${themeClasses.headerText}`}>Time: <span className="font-semibold">{details.eventTime}</span></p>}
          <p className={`text-lg ${themeClasses.headerText}`}>Location: <span className="font-semibold">{quote.event_location}</span></p>
          <p className={`text-lg ${themeClasses.headerText}`}>Prepared by: <span className="font-semibold">{quote.prepared_by}</span></p>
          
          {/* Custom Separator Line */}
          <div className="flex justify-center pt-4">
            <div className={`w-1/3 ${themeClasses.separator}`}></div>
          </div>
        </header>

        {/* Main Content / Description Block (Based on design images) */}
        <section className="text-center mb-10">
          {/* This is where the main descriptive text from the design would go, 
              but since we don't have a field for it, we'll use a placeholder based on the quote type. */}
          <p className={`text-lg font-semibold ${themeClasses.headerText}`}>
            {quote.invoice_type} Details
          </p>
          <p className={`text-sm ${themeClasses.secondary} mt-2`}>
            This fee secures a premium, seamless musical experience for your event.
          </p>
        </section>

        {/* Items Section */}
        <section className="mt-8 space-y-6">
          <h2 className={`text-2xl font-bold text-center ${themeClasses.primary}`}>Service Components</h2>

          {/* Compulsory Items */}
          {details.compulsoryItems.length > 0 && (
            <div className="space-y-4">
              {details.compulsoryItems.map((item, index) => (
                <div key={index} className="pb-3">
                  <div className="flex justify-between items-start">
                    <div className="flex-1 pr-4">
                      <p className={`font-medium ${themeClasses.text} flex items-center`}>
                        <span className={`mr-2 ${themeClasses.primary}`}>&bull;</span>
                        {item.name}
                      </p>
                      {item.description && <p className={`text-sm italic ml-4 ${themeClasses.secondary}`}>{item.description}</p>}
                    </div>
                    {/* Only show price if it's a fixed item, otherwise show total below */}
                  </div>
                </div>
              ))}
              
              {/* All-Inclusive Total (Based on design) */}
              <div className="text-center pt-4">
                <p className={`text-2xl font-extrabold ${themeClasses.primary}`}>
                  All-Inclusive Engagement Fee: {formatCurrency(compulsoryTotal)}
                </p>
              </div>
            </div>
          )}

          {/* Add-Ons (If any, displayed separately) */}
          {details.addOns.length > 0 && (
            <div className="space-y-4 pt-8 border-t border-dashed">
              <h3 className={`text-xl font-semibold text-center ${themeClasses.text}`}>Optional Add-Ons</h3>
              {details.addOns.map((item, index) => (
                <div key={index} className="pb-3">
                  <div className="flex justify-between items-start">
                    <div className="flex-1 pr-4">
                      <p className={`font-medium ${themeClasses.text} flex items-center`}>
                        <span className={`mr-2 ${themeClasses.primary}`}>&bull;</span>
                        {item.name}
                      </p>
                      {item.description && <p className={`text-sm italic ml-4 ${themeClasses.secondary}`}>{item.description}</p>}
                      <p className={`text-xs ml-4 ${themeClasses.secondary}`}>{formatCurrency(item.price)} x {item.quantity}</p>
                    </div>
                    <p className={`font-semibold ${themeClasses.primary}`}>{formatCurrency(calculateItemTotal(item))}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Important Booking Details Section */}
        <section className={`mt-12 p-6 rounded-lg ${isLivePianoTheme ? 'bg-gray-700' : 'bg-gray-100'}`}>
          <h2 className={`text-2xl font-bold text-center mb-4 ${themeClasses.headerText}`}>Important Booking Details</h2>
          
          <ul className={`space-y-3 text-sm ${themeClasses.headerText}`}>
            <li>
              <span className={`font-bold ${themeClasses.primary}`}>&bull;</span> A non-refundable <span className="font-bold">{details.depositPercentage}% deposit ({formatCurrency(depositAmount)})</span> is required immediately to formally secure the booking.
            </li>
            <li>
              <span className={`font-bold ${themeClasses.primary}`}>&bull;</span> The remaining balance is due 7 days prior to the event.
            </li>
            <li>
              <span className={`font-bold ${themeClasses.primary}`}>&bull;</span> Bank Details for Payment: BSB: {details.bankDetails.bsb}, ACC: {details.bankDetails.acc}
            </li>
            <li>
              <span className={`font-bold ${themeClasses.primary}`}>&bull;</span> Terms: {details.paymentTerms}
            </li>
          </ul>
        </section>

        <footer className="mt-10 text-center text-xs italic">
          <p className={themeClasses.secondary}>This is a preview. The final quote will include acceptance options.</p>
        </footer>
      </div>
    </div>
  );
};

export default QuoteDisplay;
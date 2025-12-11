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
        totalBoxBg: 'bg-gray-700',
        totalBoxText: 'text-amber-400',
        acceptBoxBorder: 'border-amber-400/50',
      }
    : {
        // White/Pink Theme (Default)
        bg: 'bg-white',
        cardBg: 'bg-white',
        text: 'text-gray-800',
        primary: 'text-pink-600', // Corrected pink color
        secondary: 'text-gray-500',
        border: 'border-pink-600/50',
        separator: 'bg-pink-600 h-0.5',
        headerText: 'text-gray-800',
        totalBoxBg: 'bg-pink-50', // Light pink background
        totalBoxText: 'text-pink-600',
        acceptBoxBorder: 'border-pink-600/50',
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
  const eventDateShort = quote.event_date ? format(new Date(quote.event_date), 'EEEE dd MMMM yyyy') : 'the event date'; // For use in terms

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
          
          {/* Metadata matching design structure */}
          <p className={`text-lg ${themeClasses.headerText}`}>Client Email: <span className={`font-semibold ${themeClasses.primary}`}>{quote.client_email}</span></p>
          <p className={`text-lg ${themeClasses.headerText}`}>Date of Event: <span className="font-semibold">{eventDateFormatted}</span></p>
          {details.eventTime && <p className={`text-lg ${themeClasses.headerText}`}>Time: <span className="font-semibold">{details.eventTime}</span></p>}
          <p className={`text-lg ${themeClasses.headerText}`}>Location: <span className="font-semibold">{quote.event_location}</span></p>
          <p className={`text-lg ${themeClasses.headerText}`}>Prepared by: <span className="font-semibold">{quote.prepared_by}</span></p>
          
          {/* Custom Separator Line */}
          <div className="flex justify-center pt-4">
            <div className={`w-1/3 ${themeClasses.separator}`}></div>
          </div>
        </header>

        {/* Main Content / Description Block (Mimicking large bold text from design) */}
        <section className="text-center mb-10">
          <p className={`text-xl font-extrabold ${themeClasses.text} max-w-3xl mx-auto`}>
            This fee covers 7 hours of commitment, including the performance call, soundcheck, and all essential preparation required for a seamless, high-energy performance.
          </p>
          <p className={`text-sm ${themeClasses.secondary} mt-4`}>
            This fee secures a premium, seamless musical experience for your event.
          </p>
        </section>

        {/* Important Booking Details Section */}
        <section className={`mt-12 p-6 rounded-lg ${isLivePianoTheme ? 'bg-gray-700' : 'bg-white border border-gray-200'}`}>
          <h2 className={`text-2xl font-extrabold text-center mb-4 ${themeClasses.headerText}`}>Important Booking Details</h2>
          
          <ul className={`space-y-3 text-sm ${themeClasses.headerText}`}>
            <li>
              <span className={`font-bold ${themeClasses.primary}`}>&bull;</span> A non-refundable <span className="font-bold">{details.depositPercentage}% deposit ({formatCurrency(depositAmount)})</span> is required immediately to formally secure {isLivePianoTheme ? `the ${eventDateShort} date` : 'the booking'}.
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
        
        {/* Final Total Cost Box (Matching design) */}
        <div className={`mt-8 p-6 rounded-lg text-center ${themeClasses.totalBoxBg}`}>
          <h3 className={`text-3xl font-extrabold ${themeClasses.totalBoxText}`}>
            Final Total Cost: {formatCurrency(subtotal)}
          </h3>
          <p className={`text-sm ${isLivePianoTheme ? themeClasses.secondary : themeClasses.text}`}>
            This includes your selected add-ons and the base quote amount.
          </p>
        </div>

        {/* Accept Your Quote Section (Matching design) */}
        <div className={`mt-8 p-6 rounded-lg text-center border-2 ${themeClasses.acceptBoxBorder}`}>
          <h2 className={`text-2xl font-extrabold mb-6 ${themeClasses.text}`}>Accept Your Quote</h2>
          
          {/* Optional Add-Ons Section */}
          {details.addOns.length > 0 && (
            <div className="space-y-4 pt-4">
              <h3 className={`text-xl font-extrabold text-center ${themeClasses.text}`}>Optional Add-Ons</h3>
              {details.addOns.map((item, index) => (
                <div key={index} className="pb-3">
                  <div className="flex justify-between items-start">
                    <div className="flex-1 pr-4 text-left">
                      <p className={`font-bold ${themeClasses.text}`}>{item.name}:</p>
                      {item.description && <p className={`text-xs italic ${themeClasses.secondary}`}>Unit Cost: {formatCurrency(item.price)}</p>}
                      {item.description && <p className={`text-sm italic ${themeClasses.secondary}`}>{item.description}</p>}
                    </div>
                    <div className="flex items-center space-x-4">
                      {/* Placeholder for quantity controls (since this is just a display component) */}
                      <div className="flex items-center border rounded-md">
                        <button className="px-2 py-1 text-gray-400">-</button>
                        <span className="px-3 py-1 border-l border-r text-sm">{item.quantity}</span>
                        <button className="px-2 py-1 text-gray-400">+</button>
                      </div>
                      <p className={`font-semibold ${themeClasses.primary}`}>{formatCurrency(calculateItemTotal(item))}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {/* Placeholder for Acceptance Button */}
          <div className="mt-8">
            <button className={`px-6 py-3 rounded-lg font-bold text-white ${isLivePianoTheme ? 'bg-amber-400 text-gray-900' : 'bg-pink-600'}`}>
              Accept Quote (Preview)
            </button>
          </div>
        </div>

        <footer className="mt-10 text-center text-xs italic">
          <p className={themeClasses.secondary}>This is a preview. The final quote will include acceptance options.</p>
        </footer>
      </div>
    </div>
  );
};

export default QuoteDisplay;
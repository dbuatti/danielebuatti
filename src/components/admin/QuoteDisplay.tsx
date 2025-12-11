"use client";

import React from 'react';
import { Quote, QuoteItem } from '@/types/quote';
import { Separator } from '@/components/ui/separator';

interface QuoteDisplayProps {
  quote: Quote;
}

const QuoteDisplay: React.FC<QuoteDisplayProps> = ({ quote }) => {
  const { details } = quote;
  const isLivePianoTheme = details.theme === 'livePiano';

  // Define theme colors
  const themeClasses = isLivePianoTheme
    ? {
        bg: 'bg-gray-900 text-yellow-400',
        text: 'text-gray-100',
        primary: 'text-yellow-400',
        secondary: 'text-gray-400',
        border: 'border-yellow-400/50',
      }
    : {
        bg: 'bg-white text-gray-800',
        text: 'text-gray-800',
        primary: 'text-pink-600',
        secondary: 'text-gray-500',
        border: 'border-pink-600/50',
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

  return (
    <div className={`min-h-screen p-4 sm:p-8 ${themeClasses.bg}`}>
      <div className={`max-w-4xl mx-auto p-6 sm:p-10 shadow-2xl rounded-lg ${isLivePianoTheme ? 'bg-gray-800' : 'bg-white'}`}>
        
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

        <header className="mb-8">
          <h1 className={`text-4xl font-extrabold mb-2 ${themeClasses.primary}`}>{quote.event_title}</h1>
          <p className={`${themeClasses.secondary} text-lg`}>{quote.invoice_type} prepared by {quote.prepared_by}</p>
        </header>

        <section className="grid grid-cols-2 gap-4 mb-8 text-sm">
          <div>
            <h3 className={`font-semibold ${themeClasses.primary}`}>Client Details</h3>
            <p className={themeClasses.text}>{quote.client_name}</p>
            <p className={themeClasses.secondary}>{quote.client_email}</p>
          </div>
          <div>
            <h3 className={`font-semibold ${themeClasses.primary}`}>Event Details</h3>
            <p className={themeClasses.text}>Date: {quote.event_date}</p>
            {details.eventTime && <p className={themeClasses.text}>Time: {details.eventTime}</p>}
            <p className={themeClasses.text}>Location: {quote.event_location}</p>
          </div>
        </section>

        <Separator className={themeClasses.border} />

        {/* Items Section */}
        <section className="mt-8 space-y-6">
          <h2 className={`text-2xl font-bold ${themeClasses.primary}`}>Quote Breakdown</h2>

          {/* Compulsory Items */}
          {details.compulsoryItems.length > 0 && (
            <div className="space-y-4">
              <h3 className={`text-xl font-semibold ${themeClasses.text}`}>Required Services</h3>
              {details.compulsoryItems.map((item, index) => (
                <div key={index} className="border-b pb-3 last:border-b-0">
                  <div className="flex justify-between items-start">
                    <div className="flex-1 pr-4">
                      <p className={`font-medium ${themeClasses.text}`}>{item.name}</p>
                      {item.description && <p className={`text-sm italic ${themeClasses.secondary}`}>{item.description}</p>}
                    </div>
                    <p className={`font-semibold ${themeClasses.primary}`}>{formatCurrency(item.price)}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Add-Ons */}
          {details.addOns.length > 0 && (
            <div className="space-y-4 pt-4 border-t">
              <h3 className={`text-xl font-semibold ${themeClasses.text}`}>Optional Add-Ons</h3>
              {details.addOns.map((item, index) => (
                <div key={index} className="border-b pb-3 last:border-b-0">
                  <div className="flex justify-between items-start">
                    <div className="flex-1 pr-4">
                      <p className={`font-medium ${themeClasses.text}`}>{item.name}</p>
                      {item.description && <p className={`text-sm italic ${themeClasses.secondary}`}>{item.description}</p>}
                      <p className={`text-xs ${themeClasses.secondary}`}>{formatCurrency(item.price)} x {item.quantity}</p>
                    </div>
                    <p className={`font-semibold ${themeClasses.primary}`}>{formatCurrency(calculateItemTotal(item))}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <Separator className={`my-8 ${themeClasses.border}`} />

        {/* Totals */}
        <div className="flex justify-end">
          <div className="w-full max-w-xs space-y-2">
            <div className="flex justify-between">
              <span className={themeClasses.text}>Subtotal:</span>
              <span className={themeClasses.text}>{formatCurrency(subtotal)}</span>
            </div>
            <div className="flex justify-between font-bold text-lg">
              <span className={themeClasses.primary}>Total Quote Amount:</span>
              <span className={themeClasses.primary}>{formatCurrency(subtotal)}</span>
            </div>
            <div className="flex justify-between pt-2 border-t">
              <span className={themeClasses.text}>Required Deposit ({details.depositPercentage}%):</span>
              <span className={themeClasses.text}>{formatCurrency(depositAmount)}</span>
            </div>
          </div>
        </div>

        <Separator className={`my-8 ${themeClasses.border}`} />

        {/* Terms and Bank Details */}
        <section className="text-sm space-y-4">
          <h3 className={`text-lg font-semibold ${themeClasses.primary}`}>Payment Information</h3>
          <p className={themeClasses.secondary}>Terms: {details.paymentTerms}</p>
          {(details.bankDetails.bsb || details.bankDetails.acc) && (
            <div className={themeClasses.secondary}>
              <p>Bank Details:</p>
              {details.bankDetails.bsb && <p>BSB: {details.bankDetails.bsb}</p>}
              {details.bankDetails.acc && <p>Account: {details.bankDetails.acc}</p>}
            </div>
          )}
        </section>

        <footer className="mt-10 text-center text-xs italic">
          <p className={themeClasses.secondary}>This is a preview. The final quote will include acceptance options.</p>
        </footer>
      </div>
    </div>
  );
};

export default QuoteDisplay;
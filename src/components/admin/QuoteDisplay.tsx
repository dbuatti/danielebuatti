"use client";

import React from 'react';
import { Quote } from '@/types/quote';
import { formatCurrency } from '@/lib/utils';
import { 
  Calendar, 
  MapPin, 
  User, 
  Clock,
  FileText
} from 'lucide-react';

interface QuoteDisplayProps {
  quote: Quote;
}

const QuoteDisplay: React.FC<QuoteDisplayProps> = ({ quote }) => {
  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (timeString: string | undefined) => {
    if (!timeString) return '';
    // Assuming timeString is in HH:MM format
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours, 10);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const formattedHour = hour % 12 || 12;
    return `${formattedHour}:${minutes} ${ampm}`;
  };

  const calculateSubtotal = () => {
    const compulsoryTotal = quote.details.compulsoryItems.reduce(
      (sum, item) => sum + (item.price * item.quantity), 
      0
    );
    
    const addOnsTotal = quote.details.addOns.reduce(
      (sum, item) => sum + (item.price * item.quantity), 
      0
    );
    
    return compulsoryTotal + addOnsTotal;
  };

  const calculateDeposit = () => {
    const subtotal = calculateSubtotal();
    return subtotal * (quote.details.depositPercentage / 100);
  };

  return (
    <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-brand-primary to-brand-secondary p-8 text-white">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold">{quote.invoice_type}</h1>
            <p className="text-brand-light/90 mt-2">
              Prepared for {quote.client_name}
            </p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold">#{quote.quote_number || 'N/A'}</p>
            <p className="mt-2">{formatDate(quote.event_date)}</p>
          </div>
        </div>
      </div>

      {/* Details */}
      <div className="p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
          {/* Client Info */}
          <div>
            <h2 className="text-xl font-bold text-brand-dark dark:text-brand-light mb-4">Client Information</h2>
            <div className="space-y-2">
              <p className="font-medium">{quote.client_name}</p>
              <p className="text-gray-600 dark:text-gray-300">{quote.client_email}</p>
            </div>
          </div>

          {/* Event Info */}
          <div>
            <h2 className="text-xl font-bold text-brand-dark dark:text-brand-light mb-4">Event Details</h2>
            <div className="space-y-3">
              <div className="flex items-start">
                <FileText className="h-5 w-5 text-brand-primary mt-0.5 mr-3 flex-shrink-0" />
                <div>
                  <p className="font-medium">{quote.event_title}</p>
                  <p className="text-gray-600 dark:text-gray-300">{quote.invoice_type}</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <Calendar className="h-5 w-5 text-brand-primary mt-0.5 mr-3 flex-shrink-0" />
                <div>
                  <p className="font-medium">{formatDate(quote.event_date)}</p>
                  {quote.details.eventTime && (
                    <p className="text-gray-600 dark:text-gray-300">
                      {formatTime(quote.details.eventTime)}
                    </p>
                  )}
                </div>
              </div>
              
              <div className="flex items-start">
                <MapPin className="h-5 w-5 text-brand-primary mt-0.5 mr-3 flex-shrink-0" />
                <p className="text-gray-600 dark:text-gray-300">{quote.event_location}</p>
              </div>
              
              <div className="flex items-start">
                <User className="h-5 w-5 text-brand-primary mt-0.5 mr-3 flex-shrink-0" />
                <p className="text-gray-600 dark:text-gray-300">Prepared by: {quote.prepared_by}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Preparation Notes */}
        {quote.details.preparationNotes && (
          <div className="mb-10 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <h3 className="text-lg font-bold text-brand-dark dark:text-brand-light mb-2">Preparation Notes</h3>
            <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">
              {quote.details.preparationNotes}
            </p>
          </div>
        )}

        {/* Items */}
        <div className="mb-10">
          <h2 className="text-xl font-bold text-brand-dark dark:text-brand-light mb-4">Quote Items</h2>
          
          {/* Compulsory Items */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-brand-dark dark:text-brand-light mb-3">Service Fees</h3>
            <div className="border rounded-lg overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Description</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Amount</th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {quote.details.compulsoryItems.map((item) => (
                    <tr key={item.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-medium text-gray-900 dark:text-white">{item.name}</div>
                        {item.description && (
                          <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                            {item.description}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right font-medium">
                        {formatCurrency(item.price * item.quantity, quote.details.currencySymbol)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Add-Ons */}
          {quote.details.addOns.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-brand-dark dark:text-brand-light mb-3">Add-On Services</h3>
              <div className="border rounded-lg overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Description</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Quantity</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Unit Price</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Total</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {quote.details.addOns.map((item) => (
                      <tr key={item.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="font-medium text-gray-900 dark:text-white">{item.name}</div>
                          {item.description && (
                            <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                              {item.description}
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-gray-500 dark:text-gray-400">
                          {item.quantity}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-gray-500 dark:text-gray-400">
                          {formatCurrency(item.price, quote.details.currencySymbol)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right font-medium">
                          {formatCurrency(item.price * item.quantity, quote.details.currencySymbol)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Totals */}
        <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
          <div className="flex justify-end">
            <div className="w-full md:w-1/2">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-300">Subtotal:</span>
                  <span className="font-medium">{formatCurrency(calculateSubtotal(), quote.details.currencySymbol)}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-300">Deposit ({quote.details.depositPercentage}%):</span>
                  <span className="font-medium">{formatCurrency(calculateDeposit(), quote.details.currencySymbol)}</span>
                </div>
                
                <div className="flex justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                  <span className="text-lg font-bold text-brand-dark dark:text-brand-light">Total:</span>
                  <span className="text-lg font-bold">{formatCurrency(quote.total_amount || 0, quote.details.currencySymbol)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Terms */}
        <div className="mt-10 pt-6 border-t border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-bold text-brand-dark dark:text-brand-light mb-3">Payment Terms</h3>
          <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">
            {quote.details.paymentTerms}
          </p>
          
          {/* Bank Details */}
          {(quote.details.bankDetails.bsb || quote.details.bankDetails.acc) && (
            <div className="mt-4">
              <h4 className="font-medium text-brand-dark dark:text-brand-light mb-2">Bank Details:</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                {quote.details.bankDetails.bsb && (
                  <p className="text-gray-600 dark:text-gray-300">
                    <span className="font-medium">BSB:</span> {quote.details.bankDetails.bsb}
                  </p>
                )}
                {quote.details.bankDetails.acc && (
                  <p className="text-gray-600 dark:text-gray-300">
                    <span className="font-medium">Account:</span> {quote.details.bankDetails.acc}
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuoteDisplay;
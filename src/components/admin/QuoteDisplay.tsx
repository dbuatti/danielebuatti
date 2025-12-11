"use client";

import { Quote } from '@/types/quote';

interface QuoteDisplayProps {
  quote: Quote;
  isLivePianoTheme?: boolean;
  isErinKennedyQuote?: boolean;
}

const QuoteDisplay: React.FC<QuoteDisplayProps> = ({ 
  quote, 
  isLivePianoTheme = false,
  isErinKennedyQuote = false 
}) => {
  // Ensure cost is a number before formatting
  const formatCost = (cost: any): string => {
    const numericCost = typeof cost === 'string' ? parseFloat(cost) : cost;
    if (typeof numericCost !== 'number' || isNaN(numericCost)) {
      return '0.00';
    }
    return numericCost.toFixed(2);
  };

  // Calculate totals
  const compulsoryTotal = quote.details.compulsoryItems?.reduce(
    (sum, item) => sum + (typeof item.amount === 'string' ? parseFloat(item.amount) : item.amount || 0), 
    0
  ) || 0;

  const addOnsTotal = quote.details.addOns?.reduce(
    (sum, addOn) => sum + ((typeof addOn.cost === 'string' ? parseFloat(addOn.cost) : addOn.cost || 0) * (addOn.quantity || 1)), 
    0
  ) || 0;

  const totalAmount = compulsoryTotal + addOnsTotal;

  // Calculate deposit amount
  const depositPercentage = quote.details.depositPercentage || 50;
  const depositAmount = totalAmount * (depositPercentage / 100);

  return (
    <div className="w-full max-w-4xl mx-auto p-4 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">
          {isErinKennedyQuote ? 'Erin Kennedy Music' : 'Musical Services Quote'}
        </h1>
        <p className="text-lg">
          {isErinKennedyQuote 
            ? 'Professional Music Services' 
            : isLivePianoTheme 
              ? 'Live Piano Entertainment' 
              : 'Custom Musical Performance'}
        </p>
      </div>

      {/* Client and Event Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div>
          <h2 className="text-xl font-semibold mb-3">Client Information</h2>
          <p className="mb-1"><span className="font-medium">Name:</span> {quote.client_name}</p>
          <p className="mb-1"><span className="font-medium">Email:</span> {quote.client_email}</p>
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-3">Event Details</h2>
          <p className="mb-1"><span className="font-medium">Event:</span> {quote.event_title}</p>
          <p className="mb-1"><span className="font-medium">Date:</span> {quote.event_date}</p>
          {quote.details.eventTime && (
            <p className="mb-1"><span className="font-medium">Time:</span> {quote.details.eventTime}</p>
          )}
          <p className="mb-1"><span className="font-medium">Location:</span> {quote.event_location}</p>
        </div>
      </div>

      {/* Quote Items */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Quote Breakdown</h2>
        
        {/* Compulsory Items */}
        <div className="mb-6">
          <h3 className="text-xl font-medium mb-3">Main Services</h3>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100 dark:bg-gray-800">
                  <th className="border p-2 text-left">Description</th>
                  <th className="border p-2 text-right">Amount</th>
                </tr>
              </thead>
              <tbody>
                {quote.details.compulsoryItems?.map((item, index) => (
                  <tr key={item.id || index} className={index % 2 === 0 ? 'bg-white dark:bg-gray-900' : 'bg-gray-50 dark:bg-gray-800'}>
                    <td className="border p-2">{item.description}</td>
                    <td className="border p-2 text-right">
                      {quote.details.currencySymbol || '$'}
                      {formatCost(item.amount)}
                    </td>
                  </tr>
                ))}
                <tr>
                  <td className="border p-2 font-medium">Subtotal</td>
                  <td className="border p-2 text-right font-medium">
                    {quote.details.currencySymbol || '$'}
                    {compulsoryTotal.toFixed(2)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Add-ons */}
        {quote.details.addOns && quote.details.addOns.length > 0 && (
          <div>
            <h3 className="text-xl font-medium mb-3">Additional Services</h3>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-100 dark:bg-gray-800">
                    <th className="border p-2 text-left">Description</th>
                    <th className="border p-2 text-right">Quantity</th>
                    <th className="border p-2 text-right">Unit Price</th>
                    <th className="border p-2 text-right">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {quote.details.addOns.map((addOn, index) => (
                    <tr key={addOn.id || index} className={index % 2 === 0 ? 'bg-white dark:bg-gray-900' : 'bg-gray-50 dark:bg-gray-800'}>
                      <td className="border p-2">{addOn.description}</td>
                      <td className="border p-2 text-right">{addOn.quantity || 1}</td>
                      <td className="border p-2 text-right">
                        {quote.details.currencySymbol || '$'}
                        {formatCost(addOn.cost)}
                      </td>
                      <td className="border p-2 text-right">
                        {quote.details.currencySymbol || '$'}
                        {(typeof addOn.cost === 'string' ? parseFloat(addOn.cost) : addOn.cost || 0) * (addOn.quantity || 1) 
                          ? ((typeof addOn.cost === 'string' ? parseFloat(addOn.cost) : addOn.cost || 0) * (addOn.quantity || 1)).toFixed(2) 
                          : '0.00'}
                      </td>
                    </tr>
                  ))}
                  <tr>
                    <td colSpan={3} className="border p-2 font-medium text-right">Additional Services Subtotal</td>
                    <td className="border p-2 text-right font-medium">
                      {quote.details.currencySymbol || '$'}
                      {addOnsTotal.toFixed(2)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Total and Payment Terms */}
      <div className="mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h2 className="text-xl font-semibold mb-3">Payment Terms</h2>
            <p className="mb-2"><span className="font-medium">Deposit:</span> {depositPercentage}% required to confirm booking</p>
            <p className="mb-2"><span className="font-medium">Deposit Amount:</span> {quote.details.currencySymbol || '$'}{depositAmount.toFixed(2)}</p>
            <p className="mb-2"><span className="font-medium">Balance Due:</span> {quote.details.currencySymbol || '$'}{(totalAmount - depositAmount).toFixed(2)} before event</p>
            {quote.details.paymentTerms && (
              <p className="mt-3"><span className="font-medium">Terms:</span> {quote.details.paymentTerms}</p>
            )}
          </div>
          <div>
            <h2 className="text-xl font-semibold mb-3">Bank Details</h2>
            {quote.details.bankDetails?.bsb && (
              <p className="mb-1"><span className="font-medium">BSB:</span> {quote.details.bankDetails.bsb}</p>
            )}
            {quote.details.bankDetails?.acc && (
              <p className="mb-1"><span className="font-medium">Account:</span> {quote.details.bankDetails.acc}</p>
            )}
          </div>
        </div>
      </div>

      {/* Total Amount */}
      <div className="text-center py-6 bg-gray-100 dark:bg-gray-800 rounded-lg mb-8">
        <h2 className="text-2xl font-bold">Total Amount: {quote.details.currencySymbol || '$'}{totalAmount.toFixed(2)}</h2>
      </div>

      {/* Footer */}
      <div className="text-center text-sm text-gray-600 dark:text-gray-400">
        <p>Prepared by: {quote.prepared_by || 'Musical Services'}</p>
        <p className="mt-2">Thank you for considering our services!</p>
      </div>
    </div>
  );
};

export default QuoteDisplay;
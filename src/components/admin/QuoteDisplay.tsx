"use client";

import React from 'react';
import { Quote, QuoteItem } from '@/types/quote';
import { formatCurrency } from '@/lib/utils';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Separator } from '@/components/ui/separator';

interface QuoteDisplayProps {
  quote: Quote;
}

// Helper component for rendering a single item row
const QuoteItemRow: React.FC<{ item: QuoteItem; currencySymbol: string; isOptional: boolean }> = ({
  item,
  currencySymbol,
  isOptional,
}) => {
  const totalAmount = item.price * item.quantity;
  
  // Logic to display unit cost for optional items with quantity 0
  const displayAmount = () => {
    if (isOptional && item.quantity === 0) {
      // If optional and quantity is 0, show the unit price with a strikethrough 
      // in the unit price column (which is always shown), and indicate 'Unselected' 
      // in the Amount column.
      return (
        <div className="text-right">
          <span className="text-sm text-muted-foreground line-through">
            {formatCurrency(item.price, currencySymbol)}
          </span>
          <p className="text-xs text-red-500">Unselected</p>
        </div>
      );
    }
    
    // Otherwise, show the calculated total amount
    return formatCurrency(totalAmount, currencySymbol);
  };

  return (
    <TableRow className={isOptional && item.quantity === 0 ? 'opacity-60' : ''}>
      <TableCell className="font-medium">
        {item.name}
        {item.description && (
          <p className="text-sm text-muted-foreground mt-1">{item.description}</p>
        )}
      </TableCell>
      <TableCell className="text-center w-[100px]">{item.quantity}</TableCell>
      <TableCell className="text-right w-[120px]">
        {formatCurrency(item.price, currencySymbol)}
      </TableCell>
      <TableCell className="text-right font-semibold w-[120px]">
        {displayAmount()}
      </TableCell>
    </TableRow>
  );
};

const QuoteDisplay: React.FC<QuoteDisplayProps> = ({ quote }) => {
  const { details, total_amount } = quote;
  const currencySymbol = details.currencySymbol || '$';

  const subtotal = total_amount; // Assuming no tax/discount applied here for simplicity

  // Calculate deposit amount
  const depositAmount = subtotal * (details.depositPercentage / 100);
  const remainingBalance = subtotal - depositAmount;

  return (
    <div className={`p-8 max-w-4xl mx-auto space-y-8 ${details.theme === 'black-gold' ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}`}>
      
      {/* Header Image */}
      {details.headerImageUrl && (
        <div className="mb-8">
          <img 
            src={details.headerImageUrl} 
            alt="Quote Header" 
            className="w-full h-48 object-cover rounded-lg shadow-md"
          />
        </div>
      )}

      {/* Quote/Invoice Details */}
      <div className="flex justify-between items-start border-b pb-4 border-gray-700">
        <div>
          <h1 className="text-4xl font-extrabold text-brand-primary">{quote.invoice_type}</h1>
          <p className="text-lg mt-2">Prepared By: {quote.prepared_by}</p>
        </div>
        <div className="text-right">
          <h2 className="text-2xl font-semibold">{quote.event_title}</h2>
          <p className="mt-1">{quote.event_date} {details.eventTime}</p>
          <p>{quote.event_location}</p>
        </div>
      </div>

      {/* Client Details */}
      <div className="pt-4">
        <h3 className="text-xl font-semibold mb-2">Client:</h3>
        <p>{quote.client_name}</p>
        <p>{quote.client_email}</p>
      </div>

      {/* Items Table */}
      <div className="pt-4">
        <h3 className="text-xl font-semibold mb-4">Items Included</h3>
        <Table className="border border-gray-700">
          <TableHeader>
            <TableRow className="bg-gray-800 hover:bg-gray-800">
              <TableHead className="text-white">Description</TableHead>
              <TableHead className="text-center text-white w-[100px]">Qty</TableHead>
              <TableHead className="text-right text-white w-[120px]">Unit Price</TableHead>
              <TableHead className="text-right text-white w-[120px]">Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {/* Compulsory Items */}
            {details.compulsoryItems.map((item) => (
              <QuoteItemRow 
                key={item.id} 
                item={item} 
                currencySymbol={currencySymbol} 
                isOptional={false} 
              />
            ))}

            {/* Add-Ons (Optional Items) */}
            {details.addOns.length > 0 && (
              <TableRow className="bg-gray-700/50 hover:bg-gray-700/50">
                <TableCell colSpan={4} className="font-bold text-brand-secondary">Optional Add-Ons</TableCell>
              </TableRow>
            )}
            {details.addOns.map((item) => (
              <QuoteItemRow 
                key={item.id} 
                item={item} 
                currencySymbol={currencySymbol} 
                isOptional={true} 
              />
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Totals and Notes */}
      <div className="flex justify-end">
        <div className="w-full max-w-sm space-y-2">
          <div className="flex justify-between font-medium">
            <span>Subtotal:</span>
            <span>{formatCurrency(subtotal, currencySymbol)}</span>
          </div>
          
          <Separator className="bg-gray-700" />

          <div className="flex justify-between font-bold text-xl">
            <span>Total:</span>
            <span>{formatCurrency(subtotal, currencySymbol)}</span>
          </div>

          <Separator className="bg-gray-700" />

          {/* Deposit Section */}
          <div className="pt-4 space-y-2">
            <div className="flex justify-between text-lg font-semibold">
              <span>Deposit Required ({details.depositPercentage}%):</span>
              <span>{formatCurrency(depositAmount, currencySymbol)}</span>
            </div>
            <div className="flex justify-between text-lg font-semibold text-brand-secondary">
              <span>Remaining Balance:</span>
              <span>{formatCurrency(remainingBalance, currencySymbol)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Preparation Notes */}
      {details.preparationNotes && (
        <div className="pt-4 border-t border-gray-700">
          <h3 className="text-xl font-semibold mb-2">Preparation Notes</h3>
          <p className="whitespace-pre-wrap text-sm text-muted-foreground">{details.preparationNotes}</p>
        </div>
      )}

      {/* Payment Terms */}
      <div className="pt-4 border-t border-gray-700">
        <h3 className="text-xl font-semibold mb-2">Payment Terms</h3>
        <p className="text-sm text-muted-foreground">{details.paymentTerms}</p>
        <p className="text-sm text-muted-foreground mt-2">
          Bank Details: BSB {details.bankDetails.bsb}, ACC {details.bankDetails.acc}
        </p>
      </div>
    </div>
  );
};

export default QuoteDisplay;
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
const QuoteItemRow: React.FC<{ item: QuoteItem; currencySymbol: string; isOptional: boolean; isSelected?: boolean }> = ({
  item,
  currencySymbol,
  isOptional,
  isSelected = true, // Default to true unless explicitly set to false (for unselected optional items)
}) => {
  const totalAmount = item.price * item.quantity;
  
  // Logic to display unit cost for optional items that were NOT selected (quantity 0)
  const displayAmount = () => {
    if (isOptional && !isSelected) {
      // If optional and not selected, show the unit price with a strikethrough 
      // in the unit price column, and indicate 'Unselected' in the Amount column.
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
    <TableRow className={isOptional && !isSelected ? 'opacity-60' : ''}>
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
  const { details, total_amount, accepted_at } = quote;
  const currencySymbol = details.currencySymbol || '$';
  
  // Determine which list of add-ons to display
  const isAccepted = !!accepted_at;
  
  // If accepted, use the client_selected_add_ons from details if available, otherwise fall back to original addOns
  const finalAddOns = isAccepted && details.client_selected_add_ons 
    ? details.client_selected_add_ons 
    : details.addOns;

  // Calculate totals based on the items displayed
  const compulsoryTotal = details.compulsoryItems.reduce((sum: number, item: QuoteItem) => sum + item.price * item.quantity, 0);
  const addOnTotal = finalAddOns.reduce((sum: number, item: QuoteItem) => sum + item.price * item.quantity, 0);
  
  // If accepted, the total_amount from the DB is the final total. Otherwise, calculate based on proposal.
  const subtotal = isAccepted ? total_amount : (compulsoryTotal + addOnTotal); 

  // Calculate deposit amount
  const depositAmount = subtotal * (details.depositPercentage / 100);
  const remainingBalance = subtotal - depositAmount;

  // Theme classes (simplified for display component)
  const isBlackGoldTheme = details.theme === 'black-gold';
  const bgClass = isBlackGoldTheme ? 'bg-gray-900 text-white' : 'bg-white text-gray-900';
  const tableHeaderClass = isBlackGoldTheme ? 'bg-gray-800 hover:bg-gray-800 text-white' : 'bg-gray-100 hover:bg-gray-100 text-gray-900';
  const separatorClass = isBlackGoldTheme ? 'bg-gray-700' : 'bg-gray-300';
  const primaryColor = isBlackGoldTheme ? 'text-amber-400' : 'text-pink-600';
  const secondaryColor = isBlackGoldTheme ? 'text-gray-400' : 'text-gray-500';

  return (
    <div className={`p-8 max-w-4xl mx-auto space-y-8 ${bgClass}`}>
      
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
          <h1 className={`text-4xl font-extrabold ${primaryColor}`}>{quote.invoice_type}</h1>
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
            <TableRow className={tableHeaderClass}>
              <TableHead className="text-current">Description</TableHead>
              <TableHead className="text-center text-current w-[100px]">Qty</TableHead>
              <TableHead className="text-right text-current w-[120px]">Unit Price</TableHead>
              <TableHead className="text-right text-current w-[120px]">Amount</TableHead>
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
                <TableCell colSpan={4} className={`font-bold ${primaryColor}`}>
                  Optional Add-Ons {isAccepted && `(Client Selected: ${finalAddOns.length} of ${details.addOns.length})`}
                </TableCell>
              </TableRow>
            )}
            
            {/* Display all original add-ons, marking unselected ones if pending/rejected */}
            {details.addOns.map((item) => {
              const isSelected = finalAddOns.some((finalItem: QuoteItem) => finalItem.id === item.id);
              
              // If accepted, only show selected items from the original list
              if (isAccepted && !isSelected) return null;

              // If pending/rejected, show all, marking unselected ones
              return (
                <QuoteItemRow 
                  key={item.id} 
                  item={item} 
                  currencySymbol={currencySymbol} 
                  isOptional={true} 
                  isSelected={isSelected}
                />
              );
            })}
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
          
          <Separator className={separatorClass} />

          <div className="flex justify-between font-bold text-xl">
            <span>Total:</span>
            <span>{formatCurrency(subtotal, currencySymbol)}</span>
          </div>

          <Separator className={separatorClass} />

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
          <p className={`whitespace-pre-wrap text-sm ${secondaryColor}`}>{details.preparationNotes}</p>
        </div>
      )}

      {/* Payment Terms */}
      <div className="pt-4 border-t border-gray-700">
        <h3 className="text-xl font-semibold mb-2">Payment Terms</h3>
        <p className={`text-sm ${secondaryColor}`}>{details.paymentTerms}</p>
        <p className={`text-sm ${secondaryColor} mt-2`}>
          Bank Details: BSB {details.bankDetails.bsb}, ACC {details.bankDetails.acc}
        </p>
      </div>
    </div>
  );
};

export default QuoteDisplay;
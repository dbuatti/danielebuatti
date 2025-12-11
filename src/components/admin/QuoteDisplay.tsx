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
import DynamicImage from '../DynamicImage'; // Import DynamicImage

interface QuoteDisplayProps {
  quote: Quote;
}

// Helper component for rendering a single item row
const QuoteItemRow: React.FC<{ item: QuoteItem; currencySymbol: string; isOptional: boolean; isSelected?: boolean; themeClasses: any }> = ({
  item,
  currencySymbol,
  isOptional,
  isSelected = true, // Default to true unless explicitly set to false (for unselected optional items)
  themeClasses,
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
    <TableRow className={isOptional && !isSelected ? 'opacity-60' : 'hover:bg-current/5'}>
      <TableCell className="font-medium border-r border-current/10">
        {item.name}
        {item.description && (
          <p className={`text-sm ${themeClasses.secondary} mt-1`}>{item.description}</p>
        )}
      </TableCell>
      <TableCell className="text-center w-[100px] border-r border-current/10">{item.quantity}</TableCell>
      <TableCell className="text-right w-[120px] border-r border-current/10">
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

  // Theme setup
  const isBlackGoldTheme = details.theme === 'black-gold';
  
  const themeClasses = isBlackGoldTheme
    ? {
        // Black & Gold Theme (Premium Dark)
        bg: 'bg-brand-dark',
        text: 'text-brand-light',
        primary: 'text-brand-yellow', // Gold
        secondary: 'text-brand-light/70',
        tableHeaderBg: 'bg-brand-dark-alt',
        tableBorder: 'border-brand-dark-alt',
        separator: 'bg-brand-yellow',
        totalBoxBg: 'bg-brand-dark-alt',
        totalBoxText: 'text-brand-yellow',
        tableText: 'text-brand-light',
        contentImageBorder: 'border-brand-yellow/50',
      }
    : {
        // Default Theme (Premium Light/Pink)
        bg: 'bg-brand-light',
        text: 'text-brand-dark',
        primary: 'text-brand-primary', // Pink
        secondary: 'text-brand-dark/70',
        tableHeaderBg: 'bg-brand-secondary/30',
        tableBorder: 'border-brand-secondary',
        separator: 'bg-brand-primary',
        totalBoxBg: 'bg-brand-secondary/20',
        totalBoxText: 'text-brand-primary',
        tableText: 'text-brand-dark',
        contentImageBorder: 'border-brand-primary/50',
      };

  return (
    <div className={`p-8 max-w-4xl mx-auto space-y-8 ${themeClasses.bg} ${themeClasses.text}`}>
      
      {/* Header Image */}
      {details.headerImageUrl && (
        <div className="mb-8">
          <DynamicImage 
            src={details.headerImageUrl} 
            alt="Quote Header" 
            className="w-full h-48 object-cover rounded-lg shadow-xl"
            width={800}
            height={192}
          />
        </div>
      )}

      {/* Quote/Invoice Details */}
      <div className={`flex justify-between items-start border-b pb-4 border-current/20`}>
        <div>
          <h1 className={`text-5xl font-extrabold ${themeClasses.primary}`}>{quote.invoice_type}</h1>
          <p className="text-lg mt-2">Prepared By: {quote.prepared_by}</p>
        </div>
        <div className="text-right">
          <h2 className="text-2xl font-semibold">{quote.event_title}</h2>
          <p className="mt-1 text-sm">{quote.event_date} {details.eventTime}</p>
          <p className="text-sm">{quote.event_location}</p>
        </div>
      </div>

      {/* Client Details */}
      <div className="pt-4">
        <h3 className={`text-xl font-semibold mb-2 ${themeClasses.primary}`}>Client:</h3>
        <p>{quote.client_name}</p>
        <p>{quote.client_email}</p>
      </div>
      
      {/* Content Images (Render for both themes now) */}
      {(details.contentImageUrl1 || details.contentImageUrl2) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
          {details.contentImageUrl1 && (
            <DynamicImage 
              src={details.contentImageUrl1} 
              alt="Quote Content Image 1" 
              className={`w-full h-48 object-cover rounded-lg shadow-lg border ${themeClasses.contentImageBorder}`}
              width={400}
              height={192}
            />
          )}
          {details.contentImageUrl2 && (
            <DynamicImage 
              src={details.contentImageUrl2} 
              alt="Quote Content Image 2" 
              className={`w-full h-48 object-cover rounded-lg shadow-lg border ${themeClasses.contentImageBorder}`}
              width={400}
              height={192}
            />
          )}
        </div>
      )}

      {/* Items Table */}
      <div className="pt-4">
        <h3 className={`text-xl font-semibold mb-4 ${themeClasses.primary}`}>Items Included</h3>
        <Table className={`border ${themeClasses.tableBorder} ${themeClasses.tableText}`}>
          <TableHeader>
            <TableRow className={themeClasses.tableHeaderBg}>
              <TableHead className={`font-bold ${themeClasses.primary} border-r border-current/10`}>Description</TableHead>
              <TableHead className={`text-center font-bold ${themeClasses.primary} w-[100px] border-r border-current/10`}>Qty</TableHead>
              <TableHead className={`text-right font-bold ${themeClasses.primary} w-[120px] border-r border-current/10`}>Unit Price</TableHead>
              <TableHead className={`text-right font-bold ${themeClasses.primary} w-[120px]`}>Amount</TableHead>
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
                themeClasses={themeClasses}
              />
            ))}

            {/* Add-Ons (Optional Items) */}
            {details.addOns.length > 0 && (
              <TableRow className={`${themeClasses.tableHeaderBg} hover:${themeClasses.tableHeaderBg}`}>
                <TableCell colSpan={4} className={`font-bold ${themeClasses.primary}`}>
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
                  themeClasses={themeClasses}
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
          
          <Separator className={themeClasses.separator} />

          <div className={`flex justify-between font-bold text-xl p-2 ${themeClasses.totalBoxBg} rounded-md`}>
            <span className={themeClasses.totalBoxText}>Total:</span>
            <span className={themeClasses.totalBoxText}>{formatCurrency(subtotal, currencySymbol)}</span>
          </div>

          <Separator className={themeClasses.separator} />

          {/* Deposit Section */}
          <div className="pt-4 space-y-2">
            <div className="flex justify-between text-lg font-semibold">
              <span className={themeClasses.primary}>Deposit Required ({details.depositPercentage}%):</span>
              <span className={themeClasses.primary}>{formatCurrency(depositAmount, currencySymbol)}</span>
            </div>
            <div className="flex justify-between text-lg font-semibold">
              <span className={themeClasses.secondary}>Remaining Balance:</span>
              <span className={themeClasses.secondary}>{formatCurrency(remainingBalance, currencySymbol)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Preparation Notes */}
      {details.preparationNotes && (
        <div className={`pt-4 border-t border-current/20`}>
          <h3 className={`text-xl font-semibold mb-2 ${themeClasses.primary}`}>Preparation & Service Notes</h3>
          <p className={`whitespace-pre-wrap text-sm ${themeClasses.secondary}`}>{details.preparationNotes}</p>
        </div>
      )}

      {/* Payment Terms */}
      <div className={`pt-4 border-t border-current/20`}>
        <h3 className={`text-xl font-semibold mb-2 ${themeClasses.primary}`}>Payment Terms</h3>
        <p className={`text-sm ${themeClasses.secondary}`}>{details.paymentTerms}</p>
        <p className={`text-sm ${themeClasses.secondary} mt-2`}>
          Bank Details: BSB {details.bankDetails.bsb}, ACC {details.bankDetails.acc}
        </p>
      </div>
    </div>
  );
};

export default QuoteDisplay;
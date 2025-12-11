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
import { Button } from '../ui/button'; // Import Button for interactive controls

interface QuoteDisplayProps {
  quote: Quote;
  isClientView?: boolean; // New prop: true if rendered on the client-facing page
  onQuantityChange?: (itemId: string, delta: number) => void; // New prop: handler for quantity change
  mutableAddOns?: QuoteItem[]; // New prop: used for pending client view to show current selections
}

// Helper component for rendering a single item row
const QuoteItemRow: React.FC<{ 
  item: QuoteItem; 
  currencySymbol: string; 
  isOptional: boolean; 
  themeClasses: any; 
  isClientView: boolean; 
  isFinalized: boolean;
  onQuantityChange?: (itemId: string, delta: number) => void 
}> = ({
  item,
  currencySymbol,
  isOptional,
  themeClasses,
  isClientView,
  isFinalized,
  onQuantityChange,
}) => {
  const isSelected = item.quantity > 0;
  const totalAmount = item.price * item.quantity;
  
  // Logic to display unit cost for optional items that were NOT selected (quantity 0)
  const displayAmount = () => {
    if (isOptional && !isSelected && !isFinalized) {
      // If optional and not selected (quantity 0) in pending view, show unit price and 'Unselected'
      return (
        <div className="text-right">
          <span className="text-sm text-muted-foreground">
            {formatCurrency(item.price, currencySymbol)}
          </span>
          <p className="text-xs text-red-500">Unselected</p>
        </div>
      );
    }
    
    // Otherwise, show the calculated total amount
    return formatCurrency(totalAmount, currencySymbol);
  };
  
  const displayQuantity = () => {
    if (isOptional && isClientView && !isFinalized && onQuantityChange) {
        // Interactive controls for client view (pending state)
        return (
            <div className="flex items-center justify-center border rounded-md border-current/30 mx-auto w-24">
                <Button 
                    type="button" 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => onQuantityChange(item.id, -1)}
                    disabled={item.quantity <= 0}
                    className={`h-8 w-8 ${themeClasses.text} hover:bg-current/10 p-0`}
                >
                    -
                </Button>
                <span className={`w-8 text-center font-semibold ${themeClasses.text}`}>
                    {item.quantity}
                </span>
                <Button 
                    type="button" 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => onQuantityChange(item.id, 1)}
                    className={`h-8 w-8 ${themeClasses.text} hover:bg-current/10 p-0`}
                >
                    +
                </Button>
            </div>
        );
    }
    
    // Static quantity display (Admin view or Finalized Client view)
    if (isOptional && !isSelected && !isFinalized) {
        return <span className="text-muted-foreground">0</span>;
    }
    return item.quantity;
  }

  return (
    <TableRow className={isOptional && !isSelected && !isFinalized ? 'opacity-60' : 'hover:bg-current/5'}>
      <TableCell className="font-medium border-r border-current/10">
        {item.name}
        {item.description && (
          <p className={`text-sm ${themeClasses.secondary} mt-1`}>{item.description}</p>
        )}
      </TableCell>
      <TableCell className="text-center w-[100px] border-r border-current/10">{displayQuantity()}</TableCell>
      <TableCell className="text-right w-[120px] border-r border-current/10">
        {formatCurrency(item.price, currencySymbol)}
      </TableCell>
      <TableCell className="text-right font-semibold w-[120px]">
        {displayAmount()}
      </TableCell>
    </TableRow>
  );
};

const QuoteDisplay: React.FC<QuoteDisplayProps> = ({ quote, isClientView = false, onQuantityChange, mutableAddOns }) => {
  const { details, total_amount, accepted_at, rejected_at } = quote;
  const currencySymbol = details.currencySymbol || '$';
  
  const isAccepted = !!accepted_at;
  const isRejected = !!rejected_at;
  const isFinalized = isAccepted || isRejected;
  
  // Determine which list of add-ons to display and calculate totals
  let optionalItemsToDisplay: QuoteItem[];
  let subtotal: number;
  
  if (isClientView && !isFinalized && mutableAddOns) {
      // Client view, pending: use mutable state for display and calculation
      optionalItemsToDisplay = mutableAddOns;
  } else if (isAccepted && details.client_selected_add_ons) {
      // Finalized (Accepted): use the final selected list
      optionalItemsToDisplay = details.client_selected_add_ons;
  } else {
      // Admin preview or Rejected: use original addOns list
      optionalItemsToDisplay = details.addOns;
  }
  
  // Calculate totals based on the items being displayed/calculated
  const compulsoryTotal = details.compulsoryItems.reduce((sum: number, item: QuoteItem) => sum + item.price * item.quantity, 0);
  const addOnTotal = optionalItemsToDisplay.reduce((sum: number, item: QuoteItem) => sum + item.price * item.quantity, 0);
  
  // If accepted, the total_amount from the DB is the final total. Otherwise, calculate based on current proposal/selection.
  subtotal = isAccepted ? total_amount : (compulsoryTotal + addOnTotal); 

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
        tableHeaderBg: 'bg-brand-dark-alt/50',
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
      
  const headerImagePositionClass = details.headerImagePosition || 'object-center';

  return (
    <div className={`p-4 sm:p-8 max-w-4xl mx-auto space-y-8 ${themeClasses.bg} ${themeClasses.text}`}>
      
      {/* Header Image */}
      {details.headerImageUrl && (
        <div className="mb-4">
          <DynamicImage 
            src={details.headerImageUrl} 
            alt="Quote Header" 
            className={`w-full h-48 object-cover rounded-lg shadow-xl ${headerImagePositionClass}`}
            width={800}
            height={192}
          />
        </div>
      )}

      {/* Quote/Invoice Details */}
      <div className={`flex flex-col sm:flex-row justify-between items-start border-b pb-4 border-current/20`}>
        <div>
          <h1 className={`text-4xl font-extrabold ${themeClasses.primary}`}>{quote.invoice_type}</h1>
          <p className="text-lg mt-2">Prepared By: {quote.prepared_by}</p>
        </div>
        <div className="text-right mt-4 sm:mt-0">
          <h2 className="text-2xl font-semibold">{quote.event_title}</h2>
          <p className="mt-1 text-sm">{quote.event_date} {details.eventTime}</p>
          <p className="text-sm">{quote.event_location}</p>
        </div>
      </div>

      {/* Client Details (Only show if finalized or in admin view) */}
      {(isFinalized || !isClientView) && (
        <div className="pt-4">
          <h3 className={`text-xl font-semibold mb-2 ${themeClasses.primary}`}>Client:</h3>
          <p>{quote.client_name}</p>
          <p>{quote.client_email}</p>
        </div>
      )}
      
      {/* Items Table */}
      <div className="pt-4 overflow-x-auto"> {/* Added overflow-x-auto for responsiveness */}
        <h3 className={`text-xl font-semibold mb-4 ${themeClasses.primary}`}>Items Included</h3>
        <Table className={`min-w-full border ${themeClasses.tableBorder} ${themeClasses.tableText}`}>
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
                isClientView={isClientView}
                isFinalized={isFinalized}
              />
            ))}

            {/* Add-Ons (Optional Items) */}
            {details.addOns.length > 0 && (
              <TableRow className={`${themeClasses.tableHeaderBg} hover:${themeClasses.tableHeaderBg}`}>
                <TableCell colSpan={4} className={`font-bold ${themeClasses.primary}`}>
                  Optional Add-Ons {isAccepted && `(Client Selected: ${optionalItemsToDisplay.filter(i => i.quantity > 0).length} of ${details.addOns.length})`}
                </TableCell>
              </TableRow>
            )}
            
            {/* Display all optional items */}
            {optionalItemsToDisplay.map((item) => {
                // If finalized and client view, only show selected items
                if (isClientView && isFinalized && item.quantity === 0) return null;
                
                return (
                    <QuoteItemRow 
                        key={item.id} 
                        item={item} 
                        currencySymbol={currencySymbol} 
                        isOptional={true} 
                        themeClasses={themeClasses}
                        isClientView={isClientView}
                        isFinalized={isFinalized}
                        onQuantityChange={onQuantityChange}
                    />
                );
            })}
          </TableBody>
        </Table>
      </div>
      
      {/* NEW: Image Section for Black & Gold Theme */}
      {isBlackGoldTheme && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
          <DynamicImage 
            src="/blackgoldquoteimage1.jpg" 
            alt="Daniele Buatti playing piano" 
            className={`w-full h-64 object-cover rounded-lg shadow-lg border-2 ${themeClasses.contentImageBorder}`}
            width={400}
            height={256}
          />
          <DynamicImage 
            src="/blackgoldquoteimage2.jpg" 
            alt="Daniele Buatti performing live" 
            className={`w-full h-64 object-cover rounded-lg shadow-lg border-2 ${themeClasses.contentImageBorder}`}
            width={400}
            height={256}
          />
        </div>
      )}

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
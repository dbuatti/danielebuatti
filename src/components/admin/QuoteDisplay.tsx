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
import DynamicImage from '../DynamicImage';
import QuoteItemMobileList from './QuoteItemMobileList';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Minus, Plus, FileText } from 'lucide-react';
import { format } from 'date-fns';

interface QuoteDisplayProps {
  quote: Quote;
  isClientView?: boolean;
  onQuantityChange?: (itemId: string, delta: number) => void;
  mutableAddOns?: QuoteItem[];
}

// Helper function to format dates consistently
const formatDate = (dateString: string | undefined, formatStr: string = 'PPP') => {
  if (!dateString) return 'N/A';
  try {
    // Handle ISO date strings (YYYY-MM-DD)
    return format(new Date(dateString), formatStr);
  } catch (e) {
    // Handle non-standard date strings (like "15–18 June")
    return dateString;
  }
};

// Helper function to parse simple markdown lists (using - or *)
const renderRichText = (text: string, themeClasses: any) => {
  if (!text) return null;

  const lines = text.split('\n');
  let inList = false;
  const elements: React.ReactNode[] = [];
  let currentListItems: React.ReactNode[] = [];

  const processList = () => {
    if (currentListItems.length > 0) {
      elements.push(
        <ul key={elements.length} className={`list-disc list-inside ml-4 space-y-1 ${themeClasses.secondary}`}>
          {currentListItems}
        </ul>
      );
      currentListItems = [];
    }
  };

  lines.forEach((line, index) => {
    const trimmedLine = line.trim();
    const isListItem = trimmedLine.startsWith('- ') || trimmedLine.startsWith('* ');

    if (isListItem) {
      if (!inList) {
        inList = true;
      }
      const content = trimmedLine.substring(2).trim();
      currentListItems.push(<li key={index}>{content}</li>);
    } else {
      if (inList) {
        processList();
        inList = false;
      }
      if (trimmedLine) {
        // Render as a paragraph, preserving line breaks within the paragraph using pre-wrap
        elements.push(
          <p key={index} className={`whitespace-pre-wrap ${themeClasses.secondary}`}>
            {line}
          </p>
        );
      } else {
        // Preserve empty lines as breaks
        elements.push(<br key={index} />);
      }
    }
  });

  processList(); // Process any remaining list items

  return <>{elements}</>;
};

// Helper component for rendering a single item row (used only for desktop table view)
const QuoteItemRow: React.FC<{ 
  item: QuoteItem; 
  currencySymbol: string; 
  isOptional: boolean; 
  themeClasses: any; 
  isClientView: boolean; 
  isFinalized: boolean;
  onQuantityChange?: (itemId: string, delta: number) => void;
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

  // Determine if controls should be shown (Client view, optional, not finalized)
  const showControls = isOptional && isClientView && !isFinalized && onQuantityChange;

  // Logic to display unit cost for optional items that were NOT selected (quantity 0)
  const displayAmount = () => {
    if (isOptional && !isSelected && !isFinalized && isClientView) {
      // If optional and not selected (quantity 0) in pending client view, show unit price and 'Unselected'
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
    // If controls are shown, the quantity is handled by the controls block below.
    if (showControls) return null;

    // Static quantity display (Admin view or Finalized Client view)
    if (isOptional && !isSelected && !isFinalized && isClientView) {
        return <span className="text-muted-foreground">0</span>;
    }
    return item.quantity;
  }

  return (
    <TableRow className={isOptional && !isSelected && !isFinalized && isClientView ? 'opacity-60' : 'hover:bg-current/5'}>
      <TableCell className="font-medium border-r border-current/10 py-3">
        {item.name}
        {item.description && (
          <div className={`text-sm mt-1`}>
            {renderRichText(item.description, themeClasses)}
          </div>
        )}
      </TableCell>

      {/* Schedule / Dates Column */}
      {item.showScheduleDates && ( // Use item.showScheduleDates
        <TableCell className="text-center w-[120px] border-r border-current/10 py-3 text-sm">
          {item.scheduleDates || 'N/A'}
        </TableCell>
      )}

      {/* Quantity Column */}
      {item.showQuantity && ( // Use item.showQuantity
        <TableCell className="text-center w-[100px] border-r border-current/10 py-3">
          {showControls ? (
            <div className={`flex items-center justify-center border rounded-full border-current/30 h-8 ${themeClasses.inputBg}`}>
                <Button 
                    type="button" 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => onQuantityChange!(item.id, -1)}
                    disabled={item.quantity <= 0}
                    className={`h-7 w-7 ${themeClasses.primaryText} ${themeClasses.primaryHoverBg} p-0 rounded-full`}
                >
                    <Minus className="h-3 w-3" />
                </Button>
                <span className={`w-6 text-center font-semibold text-sm ${themeClasses.text}`}>
                    {item.quantity}
                </span>
                <Button 
                    type="button" 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => onQuantityChange!(item.id, 1)}
                    className={`h-7 w-7 ${themeClasses.primaryText} ${themeClasses.primaryHoverBg} p-0 rounded-full`}
                >
                    <Plus className="h-3 w-3" />
                </Button>
            </div>
          ) : (
              displayQuantity()
          )}
        </TableCell>
      )}

      {/* Rate (Unit Price) Column */}
      {item.showRate && ( // Use item.showRate
        <TableCell className="text-right w-[120px] border-r border-current/10 py-3">
          {formatCurrency(item.price, currencySymbol)}
        </TableCell>
      )}

      {/* Amount Column (Always visible) */}
      <TableCell className="text-right font-semibold w-[120px] py-3">
        {displayAmount()}
      </TableCell>
    </TableRow>
  );
};

const QuoteDisplay: React.FC<QuoteDisplayProps> = ({ quote, isClientView = false, onQuantityChange, mutableAddOns }) => {
  
  // --- 1. Extract Active Version Data ---
  const activeVersion = quote.details.versions.find(v => v.is_active);
  
  if (!activeVersion) {
    // Fallback if no active version is set (e.g., in Admin Preview mode where we pass a single version)
    if (quote.details.versions.length === 1) {
        // Use the single version provided (e.g., from getPreviewData)
        const singleVersion = quote.details.versions[0];
        if (singleVersion.versionId === 'v-preview') {
            // If it's a preview, we treat it as pending/draft
            singleVersion.status = 'Draft';
            singleVersion.accepted_at = null;
            singleVersion.rejected_at = null;
        }
        // Temporarily treat this single version as the active one for rendering
        Object.assign(quote, { 
            total_amount: singleVersion.total_amount,
            accepted_at: singleVersion.accepted_at,
            rejected_at: singleVersion.rejected_at,
            status: singleVersion.status,
        });
    } else {
        return <div className="p-8 text-center text-red-500">Error: No active quote version found.</div>;
    }
  }
  
  const version = activeVersion || quote.details.versions[0]; // Use the found active version or the first one as fallback

  const { 
    total_amount, 
    accepted_at, 
    rejected_at, 
    depositPercentage, 
    theme, 
    currencySymbol, 
    eventTime, 
    headerImageUrl, 
    headerImagePosition, 
    preparationNotes, 
    paymentTerms, 
    bankDetails, 
    compulsoryItems, 
    addOns, 
    client_selected_add_ons,
    scopeOfWorkUrl,
    discountPercentage, // NEW
    discountAmount, // NEW
  } = version;
  
  const { event_title, event_date, event_location, prepared_by } = quote;

  const isAccepted = !!accepted_at;
  const isRejected = !!rejected_at;
  const isFinalized = isAccepted || isRejected;

  // Determine which list of add-ons to display and calculate totals
  let optionalItemsToDisplay: QuoteItem[];

  if (isClientView && !isFinalized && mutableAddOns) {
      // Client view, pending: use mutable state for display and calculation
      optionalItemsToDisplay = mutableAddOns;
  } else if (isAccepted && client_selected_add_ons) {
      // Finalized (Accepted): use the final selected list
      optionalItemsToDisplay = client_selected_add_ons || []; // Defensive check
  } else {
      // Admin preview or Rejected: use original addOns list
      optionalItemsToDisplay = addOns || []; // Defensive check
  }

  // Calculate totals based on the items being displayed/calculated
  const compulsoryTotal = (compulsoryItems || []).reduce((sum: number, item: QuoteItem) => sum + item.price * item.quantity, 0);
  const addOnTotal = optionalItemsToDisplay.reduce((sum: number, item: QuoteItem) => sum + item.price * item.quantity, 0);

  // Calculate pre-discount subtotal
  const preDiscountTotal = compulsoryTotal + addOnTotal;

  // Apply discount logic
  let finalTotal = preDiscountTotal;
  if (discountPercentage > 0) {
      finalTotal *= (1 - discountPercentage / 100);
  }
  if (discountAmount > 0) {
      finalTotal = finalTotal - discountAmount;
  }
  finalTotal = Math.max(0, finalTotal);

  // If accepted, use the total_amount from the DB (which should be the final total). Otherwise, use calculated finalTotal.
  const finalDisplayTotal = isAccepted ? total_amount : finalTotal;
  const totalDiscountApplied = preDiscountTotal - finalDisplayTotal;

  // Calculate deposit amount
  const depositAmount = finalDisplayTotal * (depositPercentage / 100);
  const remainingBalance = finalDisplayTotal - depositAmount;

  // Theme setup (unchanged)
  const isBlackGoldTheme = theme === 'black-gold';

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
        inputBg: 'bg-brand-dark-alt',
        primaryText: 'text-brand-yellow',
        primaryHoverBg: 'hover:bg-brand-yellow/20',
        image1: '/blackgoldquoteimage1.jpg',
        image2: '/blackgoldquoteimage2.jpg',
      }
    : {
        // Default Theme (Premium Light/Pink) - Images removed
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
        inputBg: 'bg-brand-light',
        primaryText: 'text-brand-primary',
        primaryHoverBg: 'hover:bg-brand-primary/10',
        image1: undefined,
        image2: undefined,
      };

  const headerImagePositionClass = headerImagePosition || 'object-center';

  // Determine header visibility based on the first compulsory item (or default to false)
  const firstCompulsoryItem = compulsoryItems?.[0];
  const headerShowScheduleDates = firstCompulsoryItem?.showScheduleDates ?? false;
  const headerShowQuantity = firstCompulsoryItem?.showQuantity ?? true;
  const headerShowRate = firstCompulsoryItem?.showRate ?? true;

  const visibleColumns = 1 + // Description (always visible)
                         (headerShowScheduleDates ? 1 : 0) +
                         (headerShowQuantity ? 1 : 0) +
                         (headerShowRate ? 1 : 0) +
                         1; // Amount (always visible)

  return (
    <div className={`p-4 sm:p-8 max-w-4xl mx-auto space-y-8 ${themeClasses.bg} ${themeClasses.text}`}>

      {/* Header Image */}
      {headerImageUrl && (
        <div className="mb-4">
          <DynamicImage
            src={headerImageUrl}
            alt="Quote Header"
            className={cn(
              `w-full h-48 object-cover rounded-lg shadow-xl`,
              headerImagePositionClass
            )}
            width={800}
            height={192}
          />
        </div>
      )}

      {/* Quote/Invoice Details */}
      <div className={`flex flex-col sm:flex-row justify-between items-start border-b pb-4 border-current/20`}>
        <div>
          <h1 className={`text-4xl font-extrabold font-display ${themeClasses.primary}`}>{quote.invoice_type}</h1>
          <p className="text-lg mt-2 font-medium">Prepared By: {prepared_by}</p>
        </div>
        <div className="text-right mt-4 sm:mt-0">
          <h2 className="text-2xl font-semibold font-display">{event_title}</h2>
          {/* Date Formatting Consistency Fix */}
          <p className="mt-1 text-sm">{formatDate(event_date)} {eventTime}</p>
          <p className="text-sm">{event_location}</p>
        </div>
      </div>

      {/* Scope of Work Link */}
      {scopeOfWorkUrl && (
        <div className="text-center pt-4">
          <a
            href={scopeOfWorkUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              "inline-flex items-center justify-center gap-2 px-6 py-3 text-lg font-semibold rounded-full shadow-md transition-colors",
              isBlackGoldTheme
                ? "bg-brand-yellow text-brand-dark hover:bg-brand-yellow/90"
                : "bg-brand-primary text-brand-light hover:bg-brand-primary/90"
            )}
          >
            <FileText className="h-5 w-5" />
            View Scope of Work Document
          </a>
        </div>
      )}

      {/* Client Details (Only show if finalized or in admin view) */}
      {(isFinalized || !isClientView) && (
        <div className="pt-4">
          <h3 className={`text-xl font-semibold mb-2 ${themeClasses.primary}`}>Client:</h3>
          <p>{quote.client_name}</p>
          <p>{quote.client_email}</p>
        </div>
      )}

      {/* Items Section */}
      <div className="pt-4">
        <h3 className={`text-xl font-semibold mb-4 ${themeClasses.primary}`}>Items Included</h3>

        {/* Mobile List View (Hidden on md and up) */}
        <div className="md:hidden space-y-6">
            <QuoteItemMobileList
                items={compulsoryItems || []}
                currencySymbol={currencySymbol}
                themeClasses={themeClasses}
                isClientView={isClientView}
                isFinalized={isFinalized}
                isOptionalSection={false}
            />

            {addOns && addOns.length > 0 && (
                <>
                    <h4 className={`text-lg font-bold ${themeClasses.primary} pt-4`}>Optional Add-Ons</h4>
                    <QuoteItemMobileList
                        items={optionalItemsToDisplay}
                        currencySymbol={currencySymbol}
                        themeClasses={themeClasses}
                        isClientView={isClientView}
                        isFinalized={isFinalized}
                        isOptionalSection={true}
                        onQuantityChange={onQuantityChange}
                    />
                </>
            )}
        </div>

        {/* Desktop Table View (Hidden below md) */}
        <div className="hidden md:block overflow-x-auto">
          <Table className={`min-w-full border ${themeClasses.tableBorder} ${themeClasses.tableText}`}>
            <TableHeader>
              <TableRow className={themeClasses.tableHeaderBg}>
                <TableHead className={`font-bold ${themeClasses.primary} border-r border-current/10 py-3`}>Description</TableHead>
                {headerShowScheduleDates && <TableHead className={`text-center font-bold ${themeClasses.primary} w-[120px] border-r border-current/10 py-3`}>Schedule / Dates</TableHead>}
                {headerShowQuantity && <TableHead className={`text-center font-bold ${themeClasses.primary} w-[100px] border-r border-current/10 py-3`}>Qty</TableHead>}
                {headerShowRate && <TableHead className={`text-right font-bold ${themeClasses.primary} w-[120px] border-r border-current/10 py-3`}>Rate</TableHead>}
                <TableHead className={`text-right font-bold ${themeClasses.primary} w-[120px] py-3`}>Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {/* Compulsory Items */}
              {(compulsoryItems || []).map((item) => (
                <QuoteItemRow
                  key={item.id}
                  item={item}
                  currencySymbol={currencySymbol}
                  isOptional={false}
                  themeClasses={themeClasses}
                  isClientView={isClientView}
                  isFinalized={isFinalized}
                  onQuantityChange={onQuantityChange}
                />
              ))}

              {/* Add-Ons (Optional Items) */}
              {addOns && addOns.length > 0 && (
                <TableRow className={`${themeClasses.tableHeaderBg} hover:${themeClasses.tableHeaderBg}`}>
                  <TableCell colSpan={visibleColumns} className={`font-bold ${themeClasses.primary} py-3`}>
                    Optional Add-Ons {isClientView && !isFinalized && <span className="text-sm font-normal"> (Select Quantity Below)</span>}
                    {isAccepted && `(Client Selected: ${optionalItemsToDisplay.filter(i => i.quantity > 0).length} of ${addOns.length})`}
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
      </div>

      {/* NEW: Image Section for Black & Gold Theme */}
      {isBlackGoldTheme && themeClasses.image1 && ( // Check if image1 exists
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
          <DynamicImage
            src={themeClasses.image1}
            alt="Daniele Buatti playing piano"
            className={`w-full h-64 object-cover rounded-lg shadow-lg border-2 ${themeClasses.contentImageBorder}`}
            width={400}
            height={256}
          />
          <DynamicImage
            src={themeClasses.image2}
            alt="Daniele Buatti performing live"
            className={`w-full h-64 object-cover rounded-lg shadow-lg border-2 ${themeClasses.contentImageBorder}`}
            width={400}
            height={256}
          />
        </div>
      )}

      {/* NEW: Image Section for Default Theme (Only renders if images are explicitly set) */}
      {!isBlackGoldTheme && headerImageUrl && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
          <DynamicImage
            src={headerImageUrl}
            alt="Daniele Buatti playing piano"
            className={`w-full h-64 object-cover rounded-lg shadow-lg border-2 ${themeClasses.contentImageBorder}`}
            width={400}
            height={256}
          />
          <DynamicImage
            src={headerImageUrl}
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
            <span>Subtotal (Pre-Discount):</span>
            <span>{formatCurrency(preDiscountTotal, currencySymbol)}</span>
          </div>
          
          {/* Discount Row */}
          {totalDiscountApplied > 0.01 && (
            <div className="flex justify-between font-medium text-red-500 dark:text-red-400">
              <span>Discount ({discountPercentage > 0 ? `${discountPercentage}%` : ''}{discountPercentage > 0 && discountAmount > 0 ? ' + ' : ''}{discountAmount > 0 ? formatCurrency(discountAmount, currencySymbol) : ''}):</span>
              <span>
                - {formatCurrency(totalDiscountApplied, currencySymbol)}
              </span>
            </div>
          )}

          {/* Display Add-on total if applicable */}
          {addOns && addOns.length > 0 && (
            <div className="flex justify-between font-medium text-sm">
              <span>Selected Add-ons Total:</span>
              <span>{formatCurrency(addOnTotal, currencySymbol)}</span>
            </div>
          )}

          <Separator className={themeClasses.separator} />

          <div className={`flex justify-between font-bold text-xl p-2 ${themeClasses.totalBoxBg} rounded-md`}>
            <span className={themeClasses.totalBoxText}>Final Total:</span>
            <span className={themeClasses.totalBoxText}>{formatCurrency(finalDisplayTotal, currencySymbol)}</span>
          </div>

          <Separator className={themeClasses.separator} />

          {/* Deposit Section */}
          <div className="pt-4 space-y-2">
            <div className="flex justify-between text-lg font-semibold">
              <span className={themeClasses.primary}>Deposit Required ({depositPercentage}%):</span>
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
      {preparationNotes && (
        <div className={`pt-4 border-t border-current/20`}>
          <h3 className={`text-xl font-semibold mb-2 ${themeClasses.primary}`}>Preparation & Service Notes</h3>
          <div className={`text-sm ${themeClasses.secondary}`}>
            {renderRichText(preparationNotes, themeClasses)}
          </div>
        </div>
      )}

      {/* Payment Terms */}
      {paymentTerms && (
        <div className={`pt-4 border-t border-current/20`}>
          <h3 className={`text-xl font-semibold mb-2 ${themeClasses.primary}`}>Payment Terms</h3>
          <p className={`whitespace-pre-wrap text-sm ${themeClasses.secondary}`}>{paymentTerms}</p>
          <p className={`text-sm ${themeClasses.secondary} mt-2`}>
            Bank Details: BSB {bankDetails.bsb}, ACC {bankDetails.acc}
          </p>
        </div>
      )}
    </div>
  );
};

export default QuoteDisplay;
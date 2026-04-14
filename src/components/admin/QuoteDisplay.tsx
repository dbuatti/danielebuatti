"use client";

import React from 'react';
import { Quote, QuoteItem } from '@/types/quote';
import { formatCurrency, cn } from '@/lib/utils';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import DynamicImage from '../DynamicImage';
import QuoteItemMobileList from './QuoteItemMobileList';
import { Button } from '@/components/ui/button';
import { Minus, Plus, FileText, Sparkles } from 'lucide-react';
import { format } from 'date-fns';
import { renderQuoteRichText } from '@/lib/rich-text-utils';

interface QuoteDisplayProps {
  quote: Quote;
  isClientView?: boolean;
  onQuantityChange?: (itemId: string, delta: number) => void;
  mutableAddOns?: QuoteItem[];
}

const formatDate = (dateString: string | undefined, formatStr: string = 'PPP') => {
  if (!dateString) return 'N/A';
  try {
    return format(new Date(dateString), formatStr);
  } catch (e) {
    return dateString;
  }
};

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
  const showControls = isOptional && isClientView && !isFinalized && onQuantityChange;

  const displayAmount = () => {
    if (isOptional && !isSelected && !isFinalized && isClientView) {
      return (
        <div className="text-right">
          <span className="text-sm opacity-50">
            {formatCurrency(item.price, currencySymbol)}
          </span>
          <p className="text-[10px] uppercase tracking-widest text-red-500 mt-1">Unselected</p>
        </div>
      );
    }
    return formatCurrency(totalAmount, currencySymbol);
  };

  return (
    <TableRow className={cn(
      "border-b border-current/10 transition-colors",
      isOptional && !isSelected && !isFinalized && isClientView ? 'opacity-40' : 'hover:bg-white/5',
      themeClasses.isPremium ? "border-white/5" : ""
    )}>
      <TableCell className="py-6 pr-4">
        <div className={cn("font-bold text-lg", themeClasses.isPremium ? "font-montserrat tracking-tight" : "")}>
          {item.name}
        </div>
        {item.description && (
          <div className={cn("text-sm mt-2 leading-relaxed", themeClasses.secondary)}>
            {renderQuoteRichText(item.description, themeClasses)}
          </div>
        )}
      </TableCell>

      {item.showScheduleDates && (
        <TableCell className="text-center w-[140px] py-6 text-sm opacity-80">
          {item.scheduleDates || '—'}
        </TableCell>
      )}

      {item.showQuantity && (
        <TableCell className="text-center w-[120px] py-6">
          {showControls ? (
            <div className={cn("flex items-center justify-center border rounded-full h-9 px-1", themeClasses.inputBorder, themeClasses.inputBg)}>
                <Button 
                    type="button" 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => onQuantityChange!(item.id as string, -1)}
                    disabled={item.quantity <= 0}
                    className={cn("h-7 w-7 p-0 rounded-full", themeClasses.primaryText, themeClasses.primaryHoverBg)}
                >
                    <Minus className="h-3 w-3" />
                </Button>
                <span className="w-8 text-center font-bold text-sm">
                    {item.quantity}
                </span>
                <Button 
                    type="button" 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => onQuantityChange!(item.id as string, 1)}
                    className={cn("h-7 w-7 p-0 rounded-full", themeClasses.primaryText, themeClasses.primaryHoverBg)}
                >
                    <Plus className="h-3 w-3" />
                </Button>
            </div>
          ) : (
              <span className="font-medium">{item.quantity}</span>
          )}
        </TableCell>
      )}

      {item.showRate && (
        <TableCell className="text-right w-[120px] py-6 opacity-80">
          {formatCurrency(item.price, currencySymbol)}
        </TableCell>
      )}

      <TableCell className={cn("text-right font-bold text-lg w-[140px] py-6", themeClasses.primary)}>
        {displayAmount()}
      </TableCell>
    </TableRow>
  );
};

const QuoteDisplay: React.FC<QuoteDisplayProps> = ({ quote, isClientView = false, onQuantityChange, mutableAddOns }) => {
  const activeVersion = quote.details.versions.find(v => v.is_active);
  
  if (!activeVersion && quote.details.versions.length !== 1) {
    return <div className="p-8 text-center text-red-500">Error: No active quote version found.</div>;
  }
  
  const version = activeVersion || quote.details.versions[0];

  const { 
    total_amount, accepted_at, rejected_at, depositPercentage, theme, currencySymbol, 
    eventTime, headerImageUrl, headerImagePosition, preparationNotes, paymentTerms, 
    bankDetails, compulsoryItems, addOns, client_selected_add_ons, scopeOfWorkUrl,
    discountPercentage, discountAmount,
  } = version;
  
  const { event_title, event_date, event_location, prepared_by } = quote;
  const isAccepted = !!accepted_at;
  const isRejected = !!rejected_at;
  const isFinalized = isAccepted || isRejected;

  let optionalItemsToDisplay = (isClientView && !isFinalized && mutableAddOns) 
    ? mutableAddOns 
    : (isAccepted && client_selected_add_ons) 
      ? client_selected_add_ons 
      : (addOns || []);

  const compulsoryTotal = (compulsoryItems || []).reduce((sum: number, item: QuoteItem) => sum + item.price * item.quantity, 0);
  const addOnTotal = optionalItemsToDisplay.reduce((sum: number, item: QuoteItem) => sum + item.price * item.quantity, 0);
  const preDiscountTotal = compulsoryTotal + addOnTotal;

  let finalTotal = preDiscountTotal;
  if (discountPercentage > 0) finalTotal *= (1 - discountPercentage / 100);
  if (discountAmount > 0) finalTotal -= discountAmount;
  finalTotal = Math.max(0, finalTotal);

  const finalDisplayTotal = isAccepted ? total_amount : finalTotal;
  const totalDiscountApplied = preDiscountTotal - finalDisplayTotal;
  const hasDiscount = totalDiscountApplied > 0.01;
  const depositAmount = finalDisplayTotal * (depositPercentage / 100);
  const remainingBalance = finalDisplayTotal - depositAmount;

  const isBlackGoldTheme = theme === 'black-gold';

  const themeClasses = isBlackGoldTheme
    ? {
        isPremium: true,
        bg: 'bg-black',
        text: 'text-white',
        primary: 'text-yellow-500',
        secondary: 'text-gray-400',
        tableHeaderBg: 'bg-zinc-900/50',
        tableBorder: 'border-white/10',
        separator: 'bg-yellow-500/30',
        totalBoxBg: 'bg-zinc-900',
        totalBoxText: 'text-yellow-500',
        tableText: 'text-white',
        contentImageBorder: 'border-white/10',
        inputBg: 'bg-black',
        inputBorder: 'border-yellow-500/30',
        primaryText: 'text-yellow-500',
        primaryHoverBg: 'hover:bg-yellow-500/10',
        image1: '/blackgoldquoteimage1.jpg',
        image2: '/blackgoldquoteimage2.jpg',
      }
    : {
        isPremium: false,
        bg: 'bg-brand-light',
        text: 'text-brand-dark',
        primary: 'text-brand-primary',
        secondary: 'text-brand-dark/70',
        tableHeaderBg: 'bg-brand-secondary/30',
        tableBorder: 'border-brand-secondary',
        separator: 'bg-brand-primary',
        totalBoxBg: 'bg-brand-secondary/20',
        totalBoxText: 'text-brand-primary',
        tableText: 'text-brand-dark',
        contentImageBorder: 'border-brand-primary/50',
        inputBg: 'bg-brand-light',
        inputBorder: 'border-brand-secondary/50',
        primaryText: 'text-brand-primary',
        primaryHoverBg: 'hover:bg-brand-primary/10',
        image1: undefined,
        image2: undefined,
      };

  return (
    <div className={cn("p-6 sm:p-12 max-w-5xl mx-auto space-y-12", themeClasses.bg, themeClasses.text)}>
      
      {/* Premium Badge for Black/Gold */}
      {isBlackGoldTheme && (
        <div className="flex justify-center">
          <div className="flex items-center gap-2 px-4 py-2 rounded-full border border-yellow-500/30 bg-yellow-500/5 text-yellow-500 text-[10px] uppercase tracking-[0.3em] font-bold">
            <Sparkles className="w-3 h-3 fill-current" />
            Performance Proposal
          </div>
        </div>
      )}

      {/* Header Image */}
      {headerImageUrl && (
        <div className="relative rounded-[2rem] overflow-hidden shadow-2xl border border-yellow-500/10">
          <DynamicImage
            src={headerImageUrl}
            alt="Quote Header"
            className={cn("w-full h-[450px] object-cover", headerImagePosition || 'object-[center_15%]')}
            width={2000}
            height={900}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        </div>
      )}

      {/* Quote/Invoice Details */}
      <div className="flex flex-col md:flex-row justify-between items-end gap-8 border-b border-current/10 pb-10">
        <div className="space-y-2 text-left w-full md:w-auto">
          <h1 className={cn("text-5xl font-light tracking-tight", isBlackGoldTheme ? "font-montserrat uppercase" : "font-display text-brand-primary")}>
            {quote.invoice_type}
          </h1>
          <p className={cn("text-lg font-light", themeClasses.secondary)}>
            Prepared by <span className={cn("font-medium", themeClasses.text)}>{prepared_by}</span>
          </p>
        </div>
        <div className="text-left md:text-right space-y-1 w-full md:w-auto">
          <h2 className={cn("text-2xl font-serif italic", themeClasses.primary)}>{event_title}</h2>
          <p className="text-sm tracking-widest uppercase opacity-60">{formatDate(event_date, 'EEEE d MMMM yyyy')} • {eventTime}</p>
          <p className="text-sm opacity-60">{event_location}</p>
        </div>
      </div>

      {/* Scope of Work Link */}
      {scopeOfWorkUrl && (
        <div className="flex justify-center">
          <Button asChild variant="outline" className={cn(
            "rounded-full px-8 py-6 text-sm uppercase tracking-[0.2em] font-bold transition-all hover:scale-105",
            isBlackGoldTheme ? "border-yellow-500/30 text-yellow-500 hover:bg-yellow-500/10" : "border-brand-primary/30 text-brand-primary"
          )}>
            <a href={scopeOfWorkUrl} target="_blank" rel="noopener noreferrer">
              <FileText className="mr-2 h-4 w-4" /> View Scope of Work
            </a>
          </Button>
        </div>
      )}

      {/* Items Section */}
      <div className="space-y-8">
        <div className="flex items-center gap-4">
          <h3 className={cn("text-2xl font-light uppercase tracking-widest", isBlackGoldTheme ? "font-montserrat" : "font-display")}>
            Service Details
          </h3>
          <div className="flex-grow h-[1px] bg-current/10" />
        </div>

        <div className="md:hidden">
            <QuoteItemMobileList
                items={compulsoryItems || []}
                currencySymbol={currencySymbol}
                themeClasses={themeClasses}
                isClientView={isClientView}
                isFinalized={isFinalized}
                isOptionalSection={false}
            />
            {addOns && addOns.length > 0 && (
                <div className="mt-10 space-y-6">
                    <h4 className={cn("text-lg font-serif italic", themeClasses.primary)}>Additional Services</h4>
                    <QuoteItemMobileList
                        items={optionalItemsToDisplay}
                        currencySymbol={currencySymbol}
                        themeClasses={themeClasses}
                        isClientView={isClientView}
                        isFinalized={isFinalized}
                        isOptionalSection={true}
                        onQuantityChange={onQuantityChange}
                    />
                </div>
            )}
        </div>

        <div className="hidden md:block">
          <Table className="border-none">
            <TableHeader>
              <TableRow className="border-b border-current/20 hover:bg-transparent">
                <TableHead className="text-xs uppercase tracking-[0.2em] font-bold py-4">Description</TableHead>
                {compulsoryItems?.[0]?.showScheduleDates && <TableHead className="text-center text-xs uppercase tracking-[0.2em] font-bold py-4">Schedule</TableHead>}
                {compulsoryItems?.[0]?.showQuantity && <TableHead className="text-center text-xs uppercase tracking-[0.2em] font-bold py-4">Qty</TableHead>}
                {compulsoryItems?.[0]?.showRate && <TableHead className="text-right text-xs uppercase tracking-[0.2em] font-bold py-4">Rate</TableHead>}
                <TableHead className="text-right text-xs uppercase tracking-[0.2em] font-bold py-4">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {compulsoryItems.map((item) => (
                <QuoteItemRow key={item.id} item={item} currencySymbol={currencySymbol} isOptional={false} themeClasses={themeClasses} isClientView={isClientView} isFinalized={isFinalized} onQuantityChange={onQuantityChange} />
              ))}

              {addOns && addOns.length > 0 && (
                <TableRow className="hover:bg-transparent">
                  <TableCell colSpan={5} className="pt-12 pb-4">
                    <div className="flex items-center gap-4">
                      <span className={cn("text-lg font-serif italic", themeClasses.primary)}>Additional Services</span>
                      <div className="flex-grow h-[1px] bg-current/5" />
                    </div>
                  </TableCell>
                </TableRow>
              )}

              {optionalItemsToDisplay.map((item) => {
                  if (isClientView && isFinalized && item.quantity === 0) return null;
                  return <QuoteItemRow key={item.id} item={item} currencySymbol={currencySymbol} isOptional={true} themeClasses={themeClasses} isClientView={isClientView} isFinalized={isFinalized} onQuantityChange={onQuantityChange} />;
              })}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Premium Image Grid */}
      {isBlackGoldTheme && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="rounded-[2rem] overflow-hidden border border-white/10 shadow-xl aspect-[4/3]">
            <DynamicImage src="/blackgoldquoteimage1.jpg" alt="Performance" className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700 transform-gpu" width={1200} height={900} />
          </div>
          <div className="rounded-[2rem] overflow-hidden border border-white/10 shadow-xl aspect-[4/3]">
            <DynamicImage src="/blackgoldquoteimage2.jpg" alt="Performance" className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700 transform-gpu" width={1200} height={900} />
          </div>
        </div>
      )}

      {/* Totals Summary */}
      <div className="flex justify-end pt-8">
        <div className={cn("w-full max-w-md p-8 rounded-[2rem] border", themeClasses.tableBorder, themeClasses.totalBoxBg)}>
          <div className="space-y-4">
            <div className="flex justify-between text-sm uppercase tracking-widest opacity-60">
              <span>Subtotal</span>
              <span>{formatCurrency(preDiscountTotal, currencySymbol)}</span>
            </div>
            
            {hasDiscount && (
              <div className="flex justify-between text-sm font-bold text-red-500">
                <span>Special Applied</span>
                <span>- {formatCurrency(totalDiscountApplied, currencySymbol)}</span>
              </div>
            )}

            <div className="h-[1px] bg-current/10 my-4" />

            <div className="flex justify-between items-baseline">
              <span className="text-xs uppercase tracking-[0.3em] font-bold opacity-60">Total Fee</span>
              <span className={cn("text-4xl font-light", themeClasses.primary)}>
                {formatCurrency(finalDisplayTotal, currencySymbol)}
              </span>
            </div>

            <div className="pt-6 space-y-3">
              <div className="flex justify-between text-sm font-medium">
                <span className="opacity-60">Deposit Required ({depositPercentage}%)</span>
                <span className={themeClasses.primary}>{formatCurrency(depositAmount, currencySymbol)}</span>
              </div>
              <div className="flex justify-between text-sm font-medium">
                <span className="opacity-60">Remaining Balance</span>
                <span>{formatCurrency(remainingBalance, currencySymbol)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Preparation Notes */}
      {preparationNotes && (
        <div className="pt-12 border-t border-current/10 text-left">
          <h3 className={cn("text-xl font-serif italic mb-6", themeClasses.primary)}>Service & Preparation Notes</h3>
          <div className={cn("text-base leading-relaxed space-y-4", themeClasses.secondary)}>
            {renderQuoteRichText(preparationNotes, themeClasses)}
          </div>
        </div>
      )}

      {/* Footer / Terms */}
      <div className="pt-12 border-t border-current/10 text-center space-y-6">
        <div className="flex justify-center mb-4">
          <DynamicImage src={isBlackGoldTheme ? "/gold-36.png" : "/blue-pink-ontrans.png"} alt="Logo" className="h-12 w-auto opacity-40" width={48} height={48} />
        </div>
        <div className={cn("text-sm max-w-2xl mx-auto leading-relaxed", themeClasses.secondary)}>
          <p className="font-bold uppercase tracking-widest mb-2 text-current opacity-80">Terms & Conditions</p>
          <p className="italic">{paymentTerms}</p>
          <p className="mt-4 font-mono text-xs opacity-50">
            BANK: BSB {bankDetails.bsb} / ACC {bankDetails.acc}
          </p>
        </div>
      </div>
    </div>
  );
};

export default QuoteDisplay;
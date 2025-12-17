"use client";

import React from 'react';
import { QuoteItem } from '@/types/quote';
import { formatCurrency } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Minus, Plus } from 'lucide-react';
// import { cn } from '@/lib/utils'; // Removed unused import

interface QuoteItemMobileListProps {
  items: QuoteItem[];
  currencySymbol: string;
  themeClasses: any;
  isClientView: boolean;
  isFinalized: boolean;
  isOptionalSection: boolean;
  onQuantityChange?: (itemId: string, delta: number) => void;
  showScheduleDates: boolean; // NEW
  showQuantity: boolean;      // NEW
  showRate: boolean;          // NEW
}

const QuoteItemMobileList: React.FC<QuoteItemMobileListProps> = ({
  items,
  currencySymbol,
  themeClasses,
  isClientView,
  isFinalized,
  isOptionalSection,
  onQuantityChange,
  showScheduleDates,
  showQuantity,
  showRate,
}) => {
  return (
    <div className="space-y-4">
      {items.map((item) => {
        const isOptional = isOptionalSection;
        const isSelected = item.quantity > 0;
        
        // If finalized client view, only show selected items
        if (isClientView && isFinalized && isOptional && item.quantity === 0) return null;

        const totalAmount = item.price * item.quantity;
        const showControls = isOptional && isClientView && !isFinalized && onQuantityChange;
        
        const itemClasses = isOptional && !isSelected && !isFinalized && isClientView
          ? `opacity-60 ${themeClasses.secondary}`
          : themeClasses.text;

        return (
          <div 
            key={item.id} 
            className={`p-4 rounded-lg border border-current/20 shadow-sm ${themeClasses.tableHeaderBg} ${itemClasses}`}
          >
            <div className="flex justify-between items-start mb-2">
              <h4 className={`font-semibold text-lg ${themeClasses.primary}`}>{item.name}</h4>
              {isOptional && (
                <span className={`text-xs font-medium px-2 py-1 rounded-full ${themeClasses.primaryText} border border-current/30`}>
                  Optional
                </span>
              )}
            </div>
            
            {item.description && (
              <p className={`text-sm mb-3 ${themeClasses.secondary} whitespace-pre-wrap`}>{item.description}</p>
            )}
            
            {showScheduleDates && item.scheduleDates && (
                <div className={`text-sm mb-3 ${themeClasses.secondary}`}>
                    <span className="font-semibold">Schedule / Dates:</span> {item.scheduleDates}
                </div>
            )}

            <div className="flex justify-between items-center border-t border-current/10 pt-3">
              <div className="flex flex-col space-y-1">
                <span className={`text-xs font-medium ${themeClasses.secondary}`}>Total Amount</span>
                <span className={`font-bold text-lg ${isSelected ? themeClasses.primary : themeClasses.secondary}`}>
                  {formatCurrency(totalAmount, currencySymbol)}
                </span>
              </div>
              
              <div className="flex items-center space-x-4">
                {showRate && (
                    <div className="flex flex-col items-end">
                        <span className={`text-xs font-medium ${themeClasses.secondary}`}>Rate</span>
                        <span className="font-semibold">{formatCurrency(item.price, currencySymbol)}</span>
                    </div>
                )}

                {showQuantity && (
                    <div className="flex flex-col items-end">
                        <span className={`text-xs font-medium ${themeClasses.secondary}`}>Qty</span>
                        {showControls ? (
                            <div className={`flex items-center justify-center mt-1 border rounded-full border-current/30 h-8 ${themeClasses.inputBg}`}>
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
                            <span className="font-semibold mt-1">{item.quantity}</span>
                        )}
                    </div>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default QuoteItemMobileList;
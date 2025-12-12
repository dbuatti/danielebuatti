"use client";

import React from 'react';
import { QuoteItem } from '@/types/quote';
import { formatCurrency } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Minus, Plus } from 'lucide-react';

interface QuoteItemMobileListProps {
  items: QuoteItem[];
  currencySymbol: string;
  themeClasses: any;
  isClientView: boolean;
  isFinalized: boolean;
  isOptionalSection: boolean;
  onQuantityChange?: (itemId: string, delta: number) => void;
}

const QuoteItemMobileList: React.FC<QuoteItemMobileListProps> = ({
  items,
  currencySymbol,
  themeClasses,
  isClientView,
  isFinalized,
  isOptionalSection,
  onQuantityChange,
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
              <p className={`text-sm mb-3 ${themeClasses.secondary}`}>{item.description}</p>
            )}

            <div className="grid grid-cols-3 gap-4 border-t border-current/10 pt-3">
              {/* Quantity */}
              <div className="flex flex-col items-center">
                <span className={`text-xs font-medium ${themeClasses.secondary}`}>Qty</span>
                {showControls ? (
                  <div className={`flex items-center justify-center mt-1 border rounded-full border-current/30 w-full h-8 ${themeClasses.inputBg}`}>
                    <Button 
                        type="button" 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => onQuantityChange(item.id, -1)}
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
                        onClick={() => onQuantityChange(item.id, 1)}
                        className={`h-7 w-7 ${themeClasses.primaryText} ${themeClasses.primaryHoverBg} p-0 rounded-full`}
                    >
                        <Plus className="h-3 w-3" />
                    </Button>
                  </div>
                ) : (
                  <span className="font-semibold mt-1">{item.quantity}</span>
                )}
              </div>

              {/* Unit Price */}
              <div className="flex flex-col items-center">
                <span className={`text-xs font-medium ${themeClasses.secondary}`}>Unit Price</span>
                <span className="font-semibold mt-1">{formatCurrency(item.price, currencySymbol)}</span>
              </div>

              {/* Amount */}
              <div className="flex flex-col items-center">
                <span className={`text-xs font-medium ${themeClasses.secondary}`}>Amount</span>
                <span className={`font-bold mt-1 ${isSelected ? themeClasses.primary : themeClasses.secondary}`}>
                  {formatCurrency(totalAmount, currencySymbol)}
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default QuoteItemMobileList;
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
              <div className={`text-sm mb-3`}>
                {renderRichText(item.description, themeClasses)}
              </div>
            )}

            {/* Use item.showScheduleDates */}
            {item.showScheduleDates && item.scheduleDates && (
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
                {/* Use item.showRate */}
                {item.showRate && (
                    <div className="flex flex-col items-end">
                        <span className={`text-xs font-medium ${themeClasses.secondary}`}>Rate</span>
                        <span className="font-semibold">{formatCurrency(item.price, currencySymbol)}</span>
                    </div>
                )}

                {/* Use item.showQuantity */}
                {item.showQuantity && (
                    <div className="flex flex-col items-end">
                        <span className={`text-xs font-medium ${themeClasses.secondary}`}>Qty</span>
                        {showControls ? (
                            <div className={`flex items-center justify-center mt-1 border rounded-full border-current/30 h-8 ${themeClasses.inputBg}`}>
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => onQuantityChange!(item.id as string, -1)}
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
                                    onClick={() => onQuantityChange!(item.id as string, 1)}
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
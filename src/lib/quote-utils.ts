import { QuoteFormValues } from '@/components/admin/QuoteForm';
import { QuoteItem } from '@/types/quote'; // Import QuoteItem

/**
 * Calculates the final total amount for a quote based on items and discounts.
 * Rounded to 2 decimal places.
 */
export const calculateQuoteTotal = (values: QuoteFormValues): number => {
  const compulsoryTotal = values.compulsoryItems.reduce(
    (sum, item) => sum + (item.price ?? 0) * (item.quantity ?? 1),
    0
  );
  const addOnTotal = values.addOns.reduce(
    (sum, item) => sum + (item.price ?? 0) * (item.quantity ?? 0),
    0
  );

  let total = compulsoryTotal + addOnTotal;

  if (values.discountPercentage > 0) {
    total *= 1 - values.discountPercentage / 100;
  }
  if (values.discountAmount > 0) {
    total -= values.discountAmount;
  }

  // Round to 2 decimal places
  return Math.max(0, Math.round(total * 100) / 100);
};

/**
 * Calculates the pre-discount subtotal for a quote.
 */
export const calculatePreDiscountTotal = (compulsoryItems: QuoteItem[], addOns: QuoteItem[]): number => {
  const compulsoryTotal = compulsoryItems.reduce(
    (sum, item) => sum + (item.price ?? 0) * (item.quantity ?? 1),
    0
  );
  const addOnTotal = addOns.reduce(
    (sum, item) => sum + (item.price ?? 0) * (item.quantity ?? 0),
    0
  );
  return compulsoryTotal + addOnTotal;
};
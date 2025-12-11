import React from 'react';
import { Quote, QuoteItem } from '@/types/quote';
import { CheckCircle, XCircle, Clock, MapPin, Calendar, User } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

interface QuoteDisplayProps {
  quote: Quote;
}

// --- Theme Definitions ---
const themes = {
  'default': {
    bg: 'bg-white',
    text: 'text-gray-800',
    primary: 'text-[#D350A8]', // Pink accent
    primaryBg: 'bg-[#D350A8]',
    cardBg: 'bg-gray-50',
    border: 'border-gray-200',
    shadow: 'shadow-lg',
    separator: 'bg-gray-200',
  },
  'black-gold': {
    bg: 'bg-[#1B1B1B]',
    text: 'text-white',
    primary: 'text-[#FDBA16]', // Gold accent
    primaryBg: 'bg-[#FDBA16]',
    cardBg: 'bg-[#141414]',
    border: 'border-[#FDBA16]/30',
    shadow: 'shadow-2xl shadow-black/50',
    separator: 'bg-[#FDBA16]/50',
  }
};

const formatCurrency = (amount: number, symbol: string) => {
  return `${symbol}${amount.toFixed(2)}`;
};

const QuoteDisplay: React.FC<QuoteDisplayProps> = ({ quote }) => {
  const { 
    client_name, 
    event_title, 
    invoice_type, 
    event_date, 
    event_location, 
    prepared_by, 
    accepted_at, 
    rejected_at,
    details 
  } = quote;

  const theme = themes[details.theme] || themes['default'];
  const isBlackGold = details.theme === 'black-gold';

  const compulsoryTotal = details.compulsoryItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const addOnTotal = details.addOns.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const subtotal = compulsoryTotal + addOnTotal;
  const depositAmount = subtotal * (details.depositPercentage / 100);
  const balanceDue = subtotal - depositAmount;

  const renderItemRow = (item: QuoteItem) => (
    <div key={item.id} className={`grid grid-cols-12 py-3 ${isBlackGold ? 'border-b border-white/10' : 'border-b border-gray-100'}`}>
      <div className="col-span-7 pr-4">
        <p className={`font-semibold ${theme.text}`}>{item.name}</p>
        {item.description && <p className={`text-sm ${isBlackGold ? 'text-gray-400' : 'text-gray-600'}`}>{item.description}</p>}
      </div>
      <p className="col-span-2 text-right">{item.quantity}</p>
      <p className="col-span-3 text-right font-medium">
        {formatCurrency(item.price * item.quantity, details.currencySymbol)}
      </p>
    </div>
  );

  return (
    <div className={`min-h-screen p-4 sm:p-8 ${theme.bg} ${theme.text}`}>
      <div className={`max-w-4xl mx-auto ${theme.shadow} ${theme.cardBg} rounded-xl overflow-hidden`}>
        
        {/* Header Image */}
        {details.headerImageUrl && (
          <div className="h-48 w-full bg-cover bg-center" style={{ backgroundImage: `url(${details.headerImageUrl})` }}>
            <div className="h-full w-full bg-black/30 flex items-center justify-center">
              <h1 className={`text-4xl font-extrabold uppercase tracking-widest text-white drop-shadow-lg`}>
                {event_title}
              </h1>
            </div>
          </div>
        )}

        <div className="p-6 sm:p-10 space-y-10">
          
          {/* Title and Status */}
          <div className="flex justify-between items-start border-b pb-4">
            <div>
              <h1 className={`text-4xl font-bold ${theme.primary}`}>{invoice_type}</h1>
              <h2 className={`text-2xl font-semibold mt-1 ${theme.text}`}>{event_title}</h2>
            </div>
            <div className="text-right">
              {accepted_at ? (
                <div className="flex items-center text-green-500 font-bold">
                  <CheckCircle className="h-5 w-5 mr-1" /> Accepted
                </div>
              ) : rejected_at ? (
                <div className="flex items-center text-red-500 font-bold">
                  <XCircle className="h-5 w-5 mr-1" /> Rejected
                </div>
              ) : (
                <div className="flex items-center text-yellow-500 font-bold">
                  <Clock className="h-5 w-5 mr-1" /> Pending
                </div>
              )}
              <p className={`text-sm mt-1 ${isBlackGold ? 'text-gray-400' : 'text-gray-600'}`}>
                Prepared by: {prepared_by}
              </p>
            </div>
          </div>

          {/* Event Details */}
          <div className={`grid grid-cols-2 md:grid-cols-4 gap-4 p-4 rounded-lg ${isBlackGold ? 'bg-[#1B1B1B]' : 'bg-gray-100'}`}>
            <div className="flex items-center space-x-2">
              <Calendar className={`h-5 w-5 ${theme.primary}`} />
              <div>
                <p className="text-xs uppercase font-medium">Date</p>
                <p className="font-semibold">{event_date}</p>
              </div>
            </div>
            {details.eventTime && (
              <div className="flex items-center space-x-2">
                <Clock className={`h-5 w-5 ${theme.primary}`} />
                <div>
                  <p className="text-xs uppercase font-medium">Time</p>
                  <p className="font-semibold">{details.eventTime}</p>
                </div>
              </div>
            )}
            <div className="flex items-center space-x-2">
              <MapPin className={`h-5 w-5 ${theme.primary}`} />
              <div>
                <p className="text-xs uppercase font-medium">Location</p>
                <p className="font-semibold">{event_location}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <User className={`h-5 w-5 ${theme.primary}`} />
              <div>
                <p className="text-xs uppercase font-medium">Client</p>
                <p className="font-semibold">{client_name}</p>
              </div>
            </div>
          </div>

          {/* Compulsory Items Section */}
          <div className="space-y-4">
            <h3 className={`text-xl font-bold border-b pb-2 ${theme.primary}`}>Compulsory Services</h3>
            
            {/* Table Header */}
            <div className={`grid grid-cols-12 font-bold uppercase text-sm pb-2 ${isBlackGold ? 'text-gray-300' : 'text-gray-500'}`}>
              <p className="col-span-7">Service / Item</p>
              <p className="col-span-2 text-right">Qty</p>
              <p className="col-span-3 text-right">Amount</p>
            </div>

            {/* Items */}
            {details.compulsoryItems.map(item => renderItemRow(item))}
            
            {/* Preparation Notes (New Feature) */}
            {details.preparationNotes && (
              <div className={`mt-4 p-4 rounded-lg ${isBlackGold ? 'bg-[#1B1B1B] border border-white/10' : 'bg-gray-50 border border-gray-200'}`}>
                <h4 className={`font-semibold mb-2 ${theme.primary}`}>Preparation & Service Notes</h4>
                {/* Use whitespace-pre-wrap to respect line breaks from the textarea input */}
                <p className={`text-sm whitespace-pre-wrap ${isBlackGold ? 'text-gray-300' : 'text-gray-700'}`}>{details.preparationNotes}</p>
              </div>
            )}

            {/* Compulsory Total */}
            <div className="flex justify-end pt-4">
              <div className={`w-full md:w-1/2 p-4 rounded-lg ${isBlackGold ? 'bg-[#1B1B1B]' : 'bg-gray-100'}`}>
                <div className="flex justify-between font-semibold">
                  <p>Subtotal (Compulsory)</p>
                  <p>{formatCurrency(compulsoryTotal, details.currencySymbol)}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Add-Ons Section */}
          {details.addOns.length > 0 && (
            <div className="space-y-4 pt-6">
              <h3 className={`text-xl font-bold border-b pb-2 ${theme.primary}`}>Optional Add-Ons</h3>
              
              {/* Table Header */}
              <div className={`grid grid-cols-12 font-bold uppercase text-sm pb-2 ${isBlackGold ? 'text-gray-300' : 'text-gray-500'}`}>
                <p className="col-span-7">Add-On / Item</p>
                <p className="col-span-2 text-right">Qty</p>
                <p className="col-span-3 text-right">Amount</p>
              </div>

              {/* Items */}
              {details.addOns.map(item => renderItemRow(item))}

              {/* Add-On Total */}
              <div className="flex justify-end pt-4">
                <div className={`w-full md:w-1/2 p-4 rounded-lg ${isBlackGold ? 'bg-[#1B1B1B]' : 'bg-gray-100'}`}>
                  <div className="flex justify-between font-semibold">
                    <p>Subtotal (Add-Ons)</p>
                    <p>{formatCurrency(addOnTotal, details.currencySymbol)}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          <Separator className={theme.separator} />

          {/* Summary and Payment */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Payment Terms */}
            <div className="space-y-4">
              <h3 className={`text-xl font-bold ${theme.primary}`}>Payment Terms</h3>
              <p className={`whitespace-pre-wrap ${isBlackGold ? 'text-gray-300' : 'text-gray-700'}`}>{details.paymentTerms}</p>
              
              <div className={`p-4 rounded-lg ${isBlackGold ? 'bg-[#1B1B1B] border border-white/10' : 'bg-gray-100'}`}>
                <h4 className={`font-semibold mb-2 ${theme.primary}`}>Bank Details</h4>
                <p className="text-sm">BSB: <span className="font-mono">{details.bankDetails.bsb}</span></p>
                <p className="text-sm">ACC: <span className="font-mono">{details.bankDetails.acc}</span></p>
              </div>
            </div>

            {/* Totals */}
            <div className="space-y-3">
              <div className={`p-4 rounded-lg ${isBlackGold ? 'bg-[#1B1B1B]' : 'bg-gray-100'}`}>
                <div className="flex justify-between text-lg font-bold">
                  <p>Total Subtotal</p>
                  <p>{formatCurrency(subtotal, details.currencySymbol)}</p>
                </div>
              </div>

              <div className="flex justify-between text-lg">
                <p>Deposit Required ({details.depositPercentage}%)</p>
                <p className={theme.primary}>{formatCurrency(depositAmount, details.currencySymbol)}</p>
              </div>

              <Separator className={theme.separator} />

              <div className="flex justify-between text-2xl font-extrabold">
                <p>Balance Due</p>
                <p className={theme.primary}>{formatCurrency(balanceDue, details.currencySymbol)}</p>
              </div>
            </div>
          </div>

          {/* Action Buttons (Only visible in preview/admin context, not client view) */}
          {/* In a real client view, this would be replaced by Accept/Reject buttons */}
          <div className="pt-8 text-center">
            <p className={`text-sm ${isBlackGold ? 'text-gray-500' : 'text-gray-400'}`}>
              This is a preview. Client actions (Accept/Reject) are not available here.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default QuoteDisplay;
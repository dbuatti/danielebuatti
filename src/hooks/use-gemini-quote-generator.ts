import { GoogleGenAI } from '@google/genai';
import { useState } from 'react';
import { AddOnItem } from '@/types/quote';

// Define the expected structure of the AI response
interface AiQuoteResponse {
  clientName: string;
  clientEmail: string;
  eventTitle: string;
  eventDate: string;
  eventTime: string;
  eventLocation: string;
  currencySymbol: string;
  paymentTerms: string;
  baseServiceDescription: string;
  baseServiceAmount: number;
  addOns: Omit<AddOnItem, 'id' | 'quantity'>[]; // AddOns without ID/Quantity initially
}

// Initialize Gemini client outside of the hook for efficiency
const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

export function useGeminiQuoteGenerator() {
  const [isGenerating, setIsGenerating] = useState(false);

  const generateQuote = async (emailContent: string): Promise<AiQuoteResponse | null> => {
    if (!ai) {
      console.error("Gemini API Key is missing or AI client failed to initialize.");
      return null;
    }

    setIsGenerating(true);

    const prompt = `
      Analyze the following email conversation content and extract the necessary details to create a structured quote proposal.
      The output MUST be a single JSON object that strictly adheres to the following TypeScript interface structure:

      interface AiQuoteResponse {
        clientName: string;
        clientEmail: string;
        eventTitle: string;
        eventDate: string; // Format YYYY-MM-DD
        eventTime: string; // e.g., "6:00 PM - 9:00 PM"
        eventLocation: string;
        currencySymbol: string; // e.g., "A$"
        paymentTerms: string; // Detailed payment terms
        baseServiceDescription: string; // Description of the main service
        baseServiceAmount: number; // Cost of the main service
        addOns: { name: string; description?: string; cost: number; }[]; // Array of optional add-ons
      }

      If a field is missing or cannot be determined, use a reasonable placeholder (e.g., "TBD" for strings, 0 for numbers, or today's date for eventDate if only the year is mentioned).
      Focus on extracting the core service, its price, and any clearly defined optional add-ons and their prices.

      Email Content:
      ---
      ${emailContent}
      ---
    `;

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          responseMimeType: "application/json",
        },
      });

      if (!response.text) {
        console.error("Gemini API returned no text content.");
        setIsGenerating(false);
        return null;
      }

      const jsonText = response.text.trim();
      const result = JSON.parse(jsonText);
      
      // Basic validation and type coercion
      if (typeof result.baseServiceAmount === 'string') {
        result.baseServiceAmount = parseFloat(result.baseServiceAmount.replace(/[^0-9.]/g, '')) || 0;
      }
      result.addOns = result.addOns.map((addon: any) => ({
        ...addon,
        cost: typeof addon.cost === 'string' ? parseFloat(addon.cost.replace(/[^0-9.]/g, '')) || 0 : addon.cost || 0,
      }));

      setIsGenerating(false);
      return result as AiQuoteResponse;

    } catch (error) {
      console.error("Gemini API call failed:", error);
      setIsGenerating(false);
      return null;
    }
  };

  return { generateQuote, isGenerating };
}
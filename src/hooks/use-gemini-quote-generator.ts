"use client";

import { useState, useCallback } from 'react';
import { GoogleGenAI } from '@google/genai';
import { showError } from '@/utils/toast';

// Initialize Gemini client outside of the hook for efficiency
const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

interface GeneratedQuote {
  clientName: string;
  clientEmail: string;
  eventTitle: string;
  eventDate: string; // YYYY-MM-DD format
  eventTime: string;
  eventLocation: string;
  baseServiceDescription: string;
  baseServiceAmount: number;
  addOns: {
    name: string;
    description: string;
    cost: number
  }[];
}

export function useGeminiQuoteGenerator() {
  const [isGenerating, setIsGenerating] = useState(false);

  const generateQuote = useCallback(async (emailContent: string): Promise<GeneratedQuote | null> => {
    if (!ai) {
      showError("Gemini API Key is missing. Please set VITE_GEMINI_API_KEY in your .env file and restart the app.");
      return null;
    }

    setIsGenerating(true);

    const prompt = `
      You are an expert quote generator. Analyze the following email conversation to extract key quote details.
      
      1. Extract the Client Name, Client Email, Event Title, Event Date (in YYYY-MM-DD format), Event Time, and Event Location. If a specific fee is mentioned for the base service (e.g., $1000), use that as the baseServiceAmount.
      2. Based on the conversation, generate a detailed baseServiceDescription.
      3. Suggest up to two relevant optional add-ons (name, description, cost in AUD) that enhance the service, especially if the conversation mentions potential extra work (like extra songs or rehearsals). Add-on costs should be between A$50 and A$200.
      
      Email Conversation:
      ---
      ${emailContent}
      ---
      
      Return the response strictly as a single JSON object matching the following TypeScript interface. If a field cannot be extracted, use a placeholder like 'TBD' for strings or 0 for numbers, but try your best to infer from context.
      
      interface GeneratedQuote {
        clientName: string;
        clientEmail: string;
        eventTitle: string;
        eventDate: string; // YYYY-MM-DD format
        eventTime: string;
        eventLocation: string;
        baseServiceDescription: string;
        baseServiceAmount: number;
        addOns: { 
          name: string; 
          description: string; 
          cost: number 
        }[];
      }
      
      Ensure the JSON is valid and contains only the object. Do not include any markdown formatting (like \`\`\`json) or explanatory text.
    `;

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        config: {
          responseMimeType: "application/json",
        },
      });

      if (!response.text) {
        throw new Error("AI response failed to return content.");
      }

      const jsonText = response.text.trim();
      const result: GeneratedQuote = JSON.parse(jsonText);

      // Basic validation
      if (typeof result.baseServiceDescription !== 'string' || typeof result.baseServiceAmount !== 'number') {
        throw new Error("Invalid structure returned by AI.");
      }

      return result;

    } catch (error) {
      console.error("Gemini API Error:", error);
      showError("Failed to auto-generate quote details. Check console for details, or ensure the Gemini API key is valid.");
      return null;
    } finally {
      setIsGenerating(false);
    }
  }, []);

  return { generateQuote, isGenerating };
}
"use client";

import { useState, useCallback } from 'react';
import { GoogleGenAI } from '@google/genai';
import { showError } from '@/utils/toast';

// Initialize Gemini client
const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

interface GeneratedQuote {
  baseServiceDescription: string;
  baseServiceAmount: number;
  addOns: { name: string; description: string; cost: number }[];
}

export function useGeminiQuoteGenerator() {
  const [isGenerating, setIsGenerating] = useState(false);

  const generateQuote = useCallback(async (eventTitle: string, clientName: string): Promise<GeneratedQuote | null> => {
    if (!ai) {
      showError("Gemini API Key is missing. Please set VITE_GEMINI_API_KEY in your .env file.");
      return null;
    }

    setIsGenerating(true);

    const prompt = `
      You are an expert music director and embodied coach creating a quote for a client.
      Generate a base service description, a base service amount (in AUD, as a number), and up to two optional add-ons for a quote based on the following event details.
      
      Event Title: "${eventTitle}"
      Client Name: "${clientName}"
      
      The base service should typically be between A$300 and A$800. Add-ons should be between A$50 and A$200.
      
      Return the response strictly as a single JSON object matching the following TypeScript interface:
      
      interface GeneratedQuote {
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
      showError("Failed to auto-generate quote details. Please check the API key and try again.");
      return null;
    } finally {
      setIsGenerating(false);
    }
  }, []);

  return { generateQuote, isGenerating };
}
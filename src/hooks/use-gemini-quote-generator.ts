import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { showError } from '@/utils/toast';
import { ExtractedQuoteContent } from '@/types/ai';

interface UseGeminiQuoteGeneratorResult {
  extractedContent: ExtractedQuoteContent | null;
  loading: boolean;
  error: string | null;
  extractQuote: (emailContent: string) => Promise<void>;
}

export const useGeminiQuoteGenerator = (): UseGeminiQuoteGeneratorResult => {
  const [extractedContent, setExtractedContent] = useState<ExtractedQuoteContent | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const extractQuote = async (emailContent: string) => {
    setLoading(true);
    setError(null);
    setExtractedContent(null);

    try {
      const { data, error: invokeError } = await supabase.functions.invoke('extract-quote-content', {
        body: { emailContent },
      });

      if (invokeError) {
        throw invokeError;
      }

      const content = data as ExtractedQuoteContent;
      setExtractedContent(content);

    } catch (err: any) {
      console.error('Gemini extraction error:', err);
      const errorMessage = err.message || 'Failed to extract quote content using AI.';
      setError(errorMessage);
      showError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return { extractedContent, loading, error, extractQuote };
};
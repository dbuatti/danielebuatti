"use client";

import React, { useState } from 'react';
import { Brain, Zap } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface AIQuoteExtractorProps {
  onExtract: (emailContent: string) => Promise<void>;
  isSubmitting: boolean;
}

const AIQuoteExtractor: React.FC<AIQuoteExtractorProps> = ({ onExtract, isSubmitting }) => {
  const [emailContent, setEmailContent] = useState('');

  const handleExtract = () => {
    if (emailContent.trim()) {
      onExtract(emailContent);
    }
  };

  return (
    <Card className="bg-brand-light dark:bg-brand-dark-alt shadow-lg border-brand-secondary/50 mb-8">
      <CardHeader>
        <CardTitle className="text-xl text-brand-primary flex items-center">
          <Zap className="h-5 w-5 mr-2 text-purple-500" /> AI Quote Extractor
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <h3 className="font-semibold text-lg">Paste Email Conversation Here</h3>
        <Textarea
          placeholder="Paste the full email thread (Client/Event/Fee details) here to auto-populate the form."
          rows={10}
          value={emailContent}
          onChange={(e) => setEmailContent(e.target.value)}
          disabled={isSubmitting}
        />
        <Button
          type="button"
          onClick={handleExtract}
          disabled={isSubmitting || !emailContent.trim()}
          className="w-full bg-indigo-500 hover:bg-indigo-600 text-white"
        >
          <Brain className="h-4 w-4 mr-2" /> Auto-Generate Quote from Email
        </Button>
      </CardContent>
    </Card>
  );
};

export default AIQuoteExtractor;
"use client";

import React from 'react';
import { cn } from '@/lib/utils';
import { renderQuoteRichText } from '@/lib/rich-text-utils';

interface RichTextPreviewProps {
  text: string;
  className?: string;
}

const RichTextPreview: React.FC<RichTextPreviewProps> = ({ text, className }) => {
  // Define default theme classes for the preview
  const defaultThemeClasses = {
    secondary: 'text-brand-dark/70 dark:text-brand-light/70'
  };

  return (
    <div className={cn(
      "p-3 border border-brand-secondary/50 rounded-md bg-brand-light dark:bg-brand-dark",
      "min-h-[50px] overflow-y-auto",
      className
    )}>
      {renderQuoteRichText(text, defaultThemeClasses)}
    </div>
  );
};

export default RichTextPreview;
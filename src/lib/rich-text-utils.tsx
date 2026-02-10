import React from 'react';

// Helper function to parse simple markdown lists (using - or *) and paragraphs
export const renderQuoteRichText = (text: string, themeClasses: { secondary: string }): React.ReactNode => {
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
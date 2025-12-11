import { useState, useCallback } from 'react';

type CopyStatus = 'idle' | 'success' | 'error';

/**
 * Custom hook to copy text to the clipboard.
 * @returns [copiedText, copy, status]
 */
export const useCopyToClipboard = (): [string | null, (text: string) => void, CopyStatus] => {
  const [copiedText, setCopiedText] = useState<string | null>(null);
  const [status, setStatus] = useState<CopyStatus>('idle');

  const copy = useCallback((text: string) => {
    if (typeof window === 'undefined' || !navigator.clipboard) {
      console.warn('Clipboard API not available.');
      setStatus('error');
      return;
    }

    navigator.clipboard.writeText(text)
      .then(() => {
        setCopiedText(text);
        setStatus('success');
        // Optionally reset status after a delay
        setTimeout(() => setStatus('idle'), 2000);
      })
      .catch((err) => {
        console.error('Failed to copy text: ', err);
        setCopiedText(null);
        setStatus('error');
      });
  }, []);

  return [copiedText, copy, status];
};
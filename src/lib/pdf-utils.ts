import * as pdfjsLib from 'pdfjs-dist';

// Use Vite's ?url suffix to get a stable local path for the worker
// This is the most reliable way to handle PDF.js workers in a modern React/Vite app
import pdfWorker from 'pdfjs-dist/build/pdf.worker.mjs?url';

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker;

export interface PDFData {
  previewUrl: string;
  text: string;
}

export const processPDF = async (file: File): Promise<PDFData> => {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  
  // Get first page for preview and text extraction
  const page = await pdf.getPage(1);
  
  // Extract text from the first page (usually contains title/composer)
  const textContent = await page.getTextContent();
  const text = textContent.items.map((item: any) => ('str' in item ? item.str : '')).join(' ');

  // Generate preview image
  const viewport = page.getViewport({ scale: 1.0 });
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  
  if (!context) {
    throw new Error('Could not create canvas context');
  }

  canvas.height = viewport.height;
  canvas.width = viewport.width;

  // @ts-ignore - The render function expects a specific context type that matches our canvas
  await page.render({ canvasContext: context, viewport }).promise;
  const previewUrl = canvas.toDataURL('image/jpeg', 0.8);

  return { previewUrl, text };
};
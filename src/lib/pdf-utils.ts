import * as pdfjsLib from 'pdfjs-dist';

// Use Vite's ?url suffix to get a stable local path for the worker
import pdfWorker from 'pdfjs-dist/build/pdf.worker.mjs?url';

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker;

export interface PDFData {
  previewUrl: string;
  text: string;
}

export const processPDF = async (file: File): Promise<PDFData> => {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  
  let fullText = '';
  
  // Loop through all pages to extract text for full context
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const textContent = await page.getTextContent();
    const pageText = textContent.items.map((item: any) => ('str' in item ? item.str : '')).join(' ');
    fullText += ` [Page ${i}] ${pageText}`;
  }

  // Generate preview image from the first page only
  const firstPage = await pdf.getPage(1);
  const viewport = firstPage.getViewport({ scale: 1.0 });
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  
  if (!context) {
    throw new Error('Could not create canvas context');
  }

  canvas.height = viewport.height;
  canvas.width = viewport.width;

  // @ts-ignore
  await firstPage.render({ canvasContext: context, viewport }).promise;
  const previewUrl = canvas.toDataURL('image/jpeg', 0.8);

  return { previewUrl, text: fullText.trim() };
};
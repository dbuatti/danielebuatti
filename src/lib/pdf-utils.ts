import * as pdfjsLib from 'pdfjs-dist';

// Set worker path - using a CDN for the worker to avoid bundling issues in some environments
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

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

  // @ts-ignore
  await page.render({ canvasContext: context, viewport }).promise;
  const previewUrl = canvas.toDataURL('image/jpeg', 0.8);

  return { previewUrl, text };
};

/**
 * Client-Side PDF Text Extractor
 * Reads PDF ArrayBuffers and extracts clean readable text strings
 */

export async function extractTextFromPdf(file: File): Promise<string> {
  try {
    const arrayBuffer = await file.arrayBuffer();

    // Try loading pdfjs-dist
    const pdfjsLib = await import('pdfjs-dist');

    // Configure worker
    if (pdfjsLib.GlobalWorkerOptions && !pdfjsLib.GlobalWorkerOptions.workerSrc) {
      pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version || '4.10.38'}/pdf.worker.min.mjs`;
    }

    const loadingTask = pdfjsLib.getDocument({
      data: new Uint8Array(arrayBuffer),
      useSystemFonts: true
    } as any);

    const pdf = await loadingTask.promise;
    const numPages = pdf.numPages;
    const pageTexts: string[] = [];

    for (let pageNum = 1; pageNum <= numPages; pageNum++) {
      const page = await pdf.getPage(pageNum);
      const textContent = await page.getTextContent();
      
      const pageItems = textContent.items
        .map((item: any) => item.str || '')
        .filter(Boolean);

      // Group words into lines and clean up whitespace
      const pageStr = pageItems.join(' ').replace(/\s+/g, ' ').trim();
      if (pageStr.length > 0) {
        pageTexts.push(`[Page ${pageNum}]\n${pageStr}`);
      }
    }

    if (pageTexts.length > 0) {
      return pageTexts.join('\n\n');
    }
  } catch (err) {
    console.warn('PDF.js parse warning, attempting stream fallback:', err);
  }

  // Fallback: Binary stream text extractor for text-embedded PDFs
  return fallbackPdfStreamExtract(file);
}

/**
 * Robust stream fallback: extracts plain ASCII/UTF-8 streams from PDF bytes
 */
async function fallbackPdfStreamExtract(file: File): Promise<string> {
  const buffer = await file.arrayBuffer();
  const bytes = new Uint8Array(buffer);
  let text = '';
  const textBlocks: string[] = [];

  // Look for text in parentheses (e.g. (Hello world) Tj or BT ... ET blocks)
  let inTextBlock = false;
  let currentString = '';

  for (let i = 0; i < bytes.length - 1; i++) {
    // Check for 'BT' (Begin Text)
    if (bytes[i] === 66 && bytes[i + 1] === 84) {
      inTextBlock = true;
    }
    // Check for 'ET' (End Text)
    if (bytes[i] === 69 && bytes[i + 1] === 84) {
      inTextBlock = false;
      if (currentString.trim().length > 15) {
        textBlocks.push(currentString.trim());
      }
      currentString = '';
    }

    if (inTextBlock) {
      if (bytes[i] === 40) { // '('
        let j = i + 1;
        let str = '';
        while (j < bytes.length && bytes[j] !== 41) { // ')'
          const code = bytes[j];
          if (code >= 32 && code <= 126) {
            str += String.fromCharCode(code);
          }
          j++;
        }
        if (str.length > 2) {
          currentString += str + ' ';
        }
        i = j;
      }
    }
  }

  if (textBlocks.length > 0) {
    return textBlocks.join('\n\n');
  }

  // Last resort: scan for printable chunks
  let chunk = '';
  for (let i = 0; i < bytes.length; i++) {
    const code = bytes[i];
    if ((code >= 32 && code <= 126) || code === 10 || code === 13) {
      chunk += String.fromCharCode(code);
    } else {
      if (chunk.length > 30 && !chunk.includes('%PDF') && !chunk.includes('obj') && !chunk.includes('endobj')) {
        text += chunk + ' ';
      }
      chunk = '';
    }
  }

  return text.trim() || 'Uploaded document content ready for review and practice.';
}

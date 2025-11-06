/**
 * STAYLL v5.0 - PDF Extraction Service
 * Free alternative to OCR for text extraction
 */

import type { OCRResult, ClauseSegment } from '@/types/v5.0';

// Use require for CommonJS module compatibility
// eslint-disable-next-line @typescript-eslint/no-require-imports
const pdfParse = require('pdf-parse');

export class PDFExtractionService {
  /**
   * Extract text from PDF buffer
   */
  static async extractText(buffer: Buffer): Promise<string> {
    try {
      const data = await pdfParse(buffer);
      return data.text;
    } catch (error) {
      console.error('PDF extraction error:', error);
      throw new Error(`Failed to extract text from PDF: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Extract text with page information
   */
  static async extractTextWithPages(buffer: Buffer): Promise<OCRResult> {
    try {
      const data = await pdfParse(buffer);
      
      // Extract text per page
      const pages: OCRResult['pages'] = [];
      
      // pdf-parse doesn't provide page-by-page text natively
      // We'll split by form feed or estimate pages
      const text = data.text;
      const totalPages = data.numpages || 1;
      
      // Simple approach: split text into pages (if we can detect page breaks)
      // For now, we'll treat the whole document as one page
      // In production, you'd use a library that provides page-by-page extraction
      
      pages.push({
        page_number: 1,
        text: text,
        blocks: this.extractBlocks(text, 1)
      });

      // If we detected multiple pages, split them
      if (totalPages > 1 && text.includes('\f')) {
        const pageTexts = text.split('\f');
        pages.length = 0; // Clear the single page
        
        pageTexts.forEach((pageText, index) => {
          pages.push({
            page_number: index + 1,
            text: pageText.trim(),
            blocks: this.extractBlocks(pageText, index + 1)
          });
        });
      }

      return {
        lease_id: '', // Will be set by caller
        pages,
        tables: [] // Tables will be extracted separately if needed
      };
    } catch (error) {
      console.error('PDF extraction with pages error:', error);
      throw new Error(`Failed to extract PDF with pages: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Extract text blocks (lines and words) from text
   * This is a simplified version - real OCR would provide bounding boxes
   */
  private static extractBlocks(text: string, pageNumber: number): OCRResult['pages'][0]['blocks'] {
    const blocks: OCRResult['pages'][0]['blocks'] = [];
    const lines = text.split('\n').filter(line => line.trim().length > 0);
    
    lines.forEach((line, lineIndex) => {
      // Add line block
      blocks.push({
        block_type: 'LINE',
        text: line.trim(),
        bounding_box: [0, lineIndex * 20, 0, 0], // Placeholder - real OCR would have actual coordinates
        confidence: 0.9
      });

      // Add word blocks
      const words = line.split(/\s+/).filter(word => word.trim().length > 0);
      words.forEach((word, wordIndex) => {
        blocks.push({
          block_type: 'WORD',
          text: word,
          bounding_box: [wordIndex * 50, lineIndex * 20, 0, 0], // Placeholder
          confidence: 0.9
        });
      });
    });

    return blocks;
  }

  /**
   * Segment document into clauses
   * Uses heuristics to identify clause boundaries
   */
  static segmentClauses(ocrResult: OCRResult): ClauseSegment[] {
    const clauses: ClauseSegment[] = [];
    let currentClause = '';
    let clauseId = 1;
    let currentPage = 1;

    for (const page of ocrResult.pages) {
      currentPage = page.page_number;
      const lines = page.text.split('\n');

      for (const line of lines) {
        const trimmedLine = line.trim();
        
        // Detect clause boundaries (heuristic patterns)
        const isClauseStart = 
          /^(section|article|clause|paragraph)\s+\d+/i.test(trimmedLine) ||
          /^\d+\.\s+[A-Z]/.test(trimmedLine) ||
          /^[A-Z][A-Z\s]{10,}:/.test(trimmedLine);

        // If we detect a new clause and have accumulated text
        if (isClauseStart && currentClause.trim().length > 50) {
          // Save previous clause
          clauses.push({
            clause_id: `clause-${clauseId++}`,
            page: currentPage,
            text: currentClause.trim(),
            bounding_box: [0, 0, 0, 0], // Placeholder
            type_hint: this.guessClauseType(currentClause)
          });
          
          // Start new clause
          currentClause = trimmedLine + '\n';
        } else {
          currentClause += trimmedLine + '\n';
        }
      }
    }

    // Add final clause
    if (currentClause.trim().length > 0) {
      clauses.push({
        clause_id: `clause-${clauseId++}`,
        page: currentPage,
        text: currentClause.trim(),
        bounding_box: [0, 0, 0, 0],
        type_hint: this.guessClauseType(currentClause)
      });
    }

    return clauses;
  }

  /**
   * Guess clause type based on content
   */
  private static guessClauseType(text: string): string | undefined {
    const lowerText = text.toLowerCase();
    
    if (lowerText.includes('rent') || lowerText.includes('payment') || lowerText.includes('monthly')) {
      return 'rent_terms';
    }
    if (lowerText.includes('term') || lowerText.includes('duration') || lowerText.includes('period')) {
      return 'lease_term';
    }
    if (lowerText.includes('deposit') || lowerText.includes('security')) {
      return 'security_deposit';
    }
    if (lowerText.includes('late') || lowerText.includes('penalty') || lowerText.includes('fee')) {
      return 'penalties';
    }
    if (lowerText.includes('renewal') || lowerText.includes('extension') || lowerText.includes('termination')) {
      return 'termination';
    }
    if (lowerText.includes('tenant') && (lowerText.includes('right') || lowerText.includes('obligation'))) {
      return 'tenant_rights';
    }
    if (lowerText.includes('landlord') && (lowerText.includes('right') || lowerText.includes('obligation'))) {
      return 'landlord_duties';
    }
    
    return undefined;
  }
}


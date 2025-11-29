/**
 * STAYLL v5.0 - Clause-Level Chunking Service
 * Structure detection and clause segmentation
 */

import type { ClauseSegment, OCRResult, DocumentIndex } from '@/types/leaseSchema';

export class ClauseChunkingService {
  /**
   * Detect structure and segment document into clauses
   */
  static segmentClauses(ocrResult: OCRResult): {
    clauses: ClauseSegment[];
    documentIndex: DocumentIndex;
  } {
    const clauses: ClauseSegment[] = [];
    const clauseHeadings: DocumentIndex['clause_headings'] = [];
    
    let currentClause = '';
    let currentClauseId = 1;
    let currentPage = 1;
    let currentType: ClauseSegment['type'] = 'misc_section';
    let currentTitle = '';
    let clauseStartPage = 1;

    // Patterns for detecting clause boundaries
    const clauseStartPatterns = [
      /^(section|article|clause|paragraph)\s+(\d+[a-z]?)[:.\s]/i,
      /^(\d+[a-z]?)[:.\s]+[A-Z]/,
      /^[A-Z][A-Z\s]{10,}:/,
      /^ARTICLE\s+\d+/i,
      /^SECTION\s+\d+/i,
    ];

    // Keywords for clause type detection
    const typeKeywords: Record<ClauseSegment['type'], string[]> = {
      term_section: ['term', 'duration', 'period', 'commencement', 'expiration', 'lease term'],
      base_rent_section: ['rent', 'base rent', 'monthly rent', 'rental', 'rent amount'],
      options_section: ['renewal', 'option', 'extension', 'termination right'],
      cam_section: ['cam', 'common area', 'operating expense', 'maintenance'],
      escalation_section: ['escalation', 'increase', 'adjustment', 'cpi', 'index'],
      notice_section: ['notice', 'notification', 'deadline', 'requirement'],
      misc_section: []
    };

    for (const page of ocrResult.lease_pages) {
      currentPage = page.page_number;
      const lines = page.text.split('\n');

      for (const line of lines) {
        const trimmedLine = line.trim();
        
        // Check if this line starts a new clause
        let isClauseStart = false;
        let detectedTitle = '';

        for (const pattern of clauseStartPatterns) {
          const match = trimmedLine.match(pattern);
          if (match) {
            isClauseStart = true;
            detectedTitle = trimmedLine;
            break;
          }
        }

        // If we detect a new clause and have accumulated text
        if (isClauseStart && currentClause.trim().length > 50) {
          // Save previous clause
          const clauseType = this.detectClauseType(currentClause);
          const clauseId = `clause-${currentClauseId++}`;
          
          clauses.push({
            clause_id: clauseId,
            type: clauseType,
            title: currentTitle || undefined,
            text: currentClause.trim(),
            page_range: {
              start: clauseStartPage,
              end: currentPage - 1
            }
          });

          // Record heading in document index
          if (currentTitle) {
            clauseHeadings.push({
              heading: currentTitle,
              page_number: clauseStartPage,
              clause_id: clauseId
            });
          }

          // Start new clause
          currentClause = trimmedLine + '\n';
          currentTitle = detectedTitle;
          clauseStartPage = currentPage;
          currentType = this.detectClauseType(trimmedLine);
        } else {
          currentClause += trimmedLine + '\n';
          
          // Update title if we find a better one
          if (trimmedLine.length > 5 && trimmedLine.length < 100 && 
              /^[A-Z]/.test(trimmedLine) && !currentTitle) {
            currentTitle = trimmedLine;
          }
        }
      }
    }

    // Add final clause
    if (currentClause.trim().length > 0) {
      const clauseType = this.detectClauseType(currentClause);
      const clauseId = `clause-${currentClauseId++}`;
      
      clauses.push({
        clause_id: clauseId,
        type: clauseType,
        title: currentTitle || undefined,
        text: currentClause.trim(),
        page_range: {
          start: clauseStartPage,
          end: currentPage
        }
      });

      if (currentTitle) {
        clauseHeadings.push({
          heading: currentTitle,
          page_number: clauseStartPage,
          clause_id: clauseId
        });
      }
    }

    return {
      clauses,
      documentIndex: {
        clause_headings: clauseHeadings
      }
    };
  }

  /**
   * Detect clause type based on content
   */
  private static detectClauseType(text: string): ClauseSegment['type'] {
    const lowerText = text.toLowerCase();
    
    // Check each type in order of specificity
    const checks: Array<{ type: ClauseSegment['type']; keywords: string[] }> = [
      { 
        type: 'base_rent_section', 
        keywords: ['base rent', 'monthly rent', 'rental amount', 'rent schedule', 'rent payment'] 
      },
      { 
        type: 'escalation_section', 
        keywords: ['escalation', 'rent increase', 'cpi adjustment', 'annual increase', 'index'] 
      },
      { 
        type: 'options_section', 
        keywords: ['renewal option', 'option to renew', 'extension', 'termination right', 'early termination'] 
      },
      { 
        type: 'cam_section', 
        keywords: ['common area maintenance', 'cam', 'operating expense', 'triple net', 'nnn'] 
      },
      { 
        type: 'notice_section', 
        keywords: ['notice', 'notification', 'deadline', 'days prior', 'written notice'] 
      },
      { 
        type: 'term_section', 
        keywords: ['lease term', 'commencement', 'expiration', 'duration', 'period', 'possession'] 
      }
    ];

    for (const check of checks) {
      if (check.keywords.some(keyword => lowerText.includes(keyword))) {
        return check.type;
      }
    }

    return 'misc_section';
  }

  /**
   * Get clauses by type
   */
  static getClausesByType(clauses: ClauseSegment[], type: ClauseSegment['type']): ClauseSegment[] {
    return clauses.filter(c => c.type === type);
  }

  /**
   * Get clauses containing search terms
   */
  static getClausesContaining(clauses: ClauseSegment[], searchTerms: string[]): ClauseSegment[] {
    const lowerTerms = searchTerms.map(t => t.toLowerCase());
    return clauses.filter(c => 
      lowerTerms.some(term => c.text.toLowerCase().includes(term))
    );
  }

  /**
   * Merge related clauses (e.g., rent-related clauses)
   */
  static mergeRelatedClauses(clauses: ClauseSegment[]): ClauseSegment[] {
    const merged: ClauseSegment[] = [];
    const processed = new Set<string>();

    for (const clause of clauses) {
      if (processed.has(clause.clause_id)) continue;

      // Find related clauses (same type, adjacent pages)
      const related = clauses.filter(c => 
        !processed.has(c.clause_id) &&
        c.type === clause.type &&
        Math.abs(c.page_range.start - clause.page_range.end) <= 2
      );

      if (related.length > 1) {
        // Merge related clauses
        const mergedText = [clause, ...related]
          .sort((a, b) => a.page_range.start - b.page_range.start)
          .map(c => c.text)
          .join('\n\n');

        merged.push({
          clause_id: clause.clause_id,
          type: clause.type,
          title: clause.title,
          text: mergedText,
          page_range: {
            start: Math.min(...related.map(c => c.page_range.start)),
            end: Math.max(...related.map(c => c.page_range.end))
          }
        });

        related.forEach(c => processed.add(c.clause_id));
      } else {
        merged.push(clause);
        processed.add(clause.clause_id);
      }
    }

    return merged;
  }
}


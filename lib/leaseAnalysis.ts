export interface LeaseData {
  tenant_name?: string;
  property_address?: string;
  monthly_rent?: string;
  lease_start?: string;
  lease_end?: string;
  due_date?: string;
  late_fee?: string;
  security_deposit?: string;
  utilities?: string;
  parking?: string;
  pets?: string;
  smoking?: string;
}

export interface AnalysisResult {
  success: boolean;
  data: LeaseData;
  confidence: number;
  raw_text: string;
  errors?: string[];
}

// Basic regex patterns for extracting lease information
const PATTERNS = {
  // Rent amounts
  rent: /(?:rent|monthly rent|monthly payment)[:\s]*\$?([0-9,]+(?:\.[0-9]{2})?)/gi,
  
  // Dates
  date: /(\d{1,2}\/\d{1,2}\/\d{2,4}|\d{4}-\d{2}-\d{2}|\w+ \d{1,2},? \d{4})/gi,
  
  // Addresses
  address: /(\d+\s+[A-Za-z\s]+(?:Street|St|Avenue|Ave|Road|Rd|Boulevard|Blvd|Lane|Ln|Drive|Dr|Place|Pl|Court|Ct|Way|Circle|Cir|Terrace|Ter|Highway|Hwy|Parkway|Pkwy)[,\s]*[A-Za-z\s,]+(?:[A-Z]{2}\s*\d{5}(?:-\d{4})?|\d{5}(?:-\d{4})?))/gi,
  
  // Names
  name: /(?:tenant|lessee|resident)[:\s]*([A-Z][a-z]+ [A-Z][a-z]+)/gi,
  
  // Late fees
  late_fee: /(?:late fee|late charge|late payment)[:\s]*\$?([0-9,]+(?:\.[0-9]{2})?)/gi,
  
  // Security deposit
  security_deposit: /(?:security deposit|deposit)[:\s]*\$?([0-9,]+(?:\.[0-9]{2})?)/gi,
  
  // Due dates
  due_date: /(?:due|payment due|rent due)[:\s]*(\d{1,2}(?:st|nd|rd|th)?\s+(?:day|of each month|monthly))/gi,
};

export async function analyzeLeasePDF(file: File): Promise<AnalysisResult> {
  try {
    // Convert file to buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    // Dynamically import pdf-parse to avoid build-time issues
    const pdf = (await import('pdf-parse')).default;
    
    // Extract text from PDF
    const pdfData = await pdf(buffer);
    const text = pdfData.text;
    
    console.log('Extracted text length:', text.length);
    console.log('First 500 characters:', text.substring(0, 500));
    
    // Use AI analysis with fallback to basic analysis
    const { analyzeLeaseWithAI } = await import('./aiLeaseAnalysis');
    const analysis = await analyzeLeaseWithAI(text);
    
    return analysis;
    
  } catch (error) {
    console.error('PDF analysis error:', error);
    return {
      success: false,
      data: {},
      confidence: 0,
      raw_text: '',
      errors: [error instanceof Error ? error.message : 'Unknown error'],
    };
  }
}

function extractLeaseData(text: string): LeaseData {
  const data: LeaseData = {};
  
  // Extract rent amount
  const rentMatches = text.match(PATTERNS.rent);
  if (rentMatches && rentMatches.length > 0) {
    data.monthly_rent = `$${rentMatches[0].replace(/[^\d.]/g, '')}`;
  }
  
  // Extract dates
  const dateMatches = text.match(PATTERNS.date);
  if (dateMatches && dateMatches.length >= 2) {
    // Assume first date is start, second is end
    data.lease_start = formatDate(dateMatches[0]);
    data.lease_end = formatDate(dateMatches[1]);
  }
  
  // Extract address
  const addressMatches = text.match(PATTERNS.address);
  if (addressMatches && addressMatches.length > 0) {
    data.property_address = addressMatches[0].trim();
  }
  
  // Extract tenant name
  const nameMatches = text.match(PATTERNS.name);
  if (nameMatches && nameMatches.length > 0) {
    data.tenant_name = nameMatches[0].trim();
  }
  
  // Extract late fee
  const lateFeeMatches = text.match(PATTERNS.late_fee);
  if (lateFeeMatches && lateFeeMatches.length > 0) {
    data.late_fee = `$${lateFeeMatches[0].replace(/[^\d.]/g, '')}`;
  }
  
  // Extract security deposit
  const depositMatches = text.match(PATTERNS.security_deposit);
  if (depositMatches && depositMatches.length > 0) {
    data.security_deposit = `$${depositMatches[0].replace(/[^\d.]/g, '')}`;
  }
  
  // Extract due date
  const dueDateMatches = text.match(PATTERNS.due_date);
  if (dueDateMatches && dueDateMatches.length > 0) {
    data.due_date = dueDateMatches[0].trim();
  }
  
  // Extract additional information
  data.utilities = extractUtilities(text);
  data.parking = extractParking(text);
  data.pets = extractPets(text);
  data.smoking = extractSmoking(text);
  
  return data;
}

function formatDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  } catch {
    return dateString;
  }
}

function extractUtilities(text: string): string {
  const lowerText = text.toLowerCase();
  if (lowerText.includes('utilities included') || lowerText.includes('all utilities')) {
    return 'Included';
  } else if (lowerText.includes('tenant pays utilities') || lowerText.includes('utilities not included')) {
    return 'Tenant pays';
  }
  return 'Not specified';
}

function extractParking(text: string): string {
  const lowerText = text.toLowerCase();
  if (lowerText.includes('parking included') || lowerText.includes('parking provided')) {
    return 'Included';
  } else if (lowerText.includes('no parking') || lowerText.includes('parking not included')) {
    return 'Not included';
  }
  return 'Not specified';
}

function extractPets(text: string): string {
  const lowerText = text.toLowerCase();
  if (lowerText.includes('no pets') || lowerText.includes('pets not allowed')) {
    return 'Not allowed';
  } else if (lowerText.includes('pets allowed') || lowerText.includes('pet friendly')) {
    return 'Allowed';
  }
  return 'Not specified';
}

function extractSmoking(text: string): string {
  const lowerText = text.toLowerCase();
  if (lowerText.includes('no smoking') || lowerText.includes('smoking not allowed')) {
    return 'Not allowed';
  } else if (lowerText.includes('smoking allowed')) {
    return 'Allowed';
  }
  return 'Not specified';
}

function calculateConfidence(data: LeaseData): number {
  let score = 0;
  let total = 0;
  
  // Check each field and give points for found data
  if (data.monthly_rent) { score += 20; }
  if (data.lease_start) { score += 15; }
  if (data.lease_end) { score += 15; }
  if (data.property_address) { score += 20; }
  if (data.tenant_name) { score += 15; }
  if (data.due_date) { score += 10; }
  if (data.late_fee) { score += 5; }
  
  total = 100;
  
  return Math.min(score, 100);
} 
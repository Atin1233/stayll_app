// Simple test script for Vertex AI integration
// Run with: node test-vertex-ai.js

const testLease = `
LEASE AGREEMENT

This Lease Agreement is made on January 1, 2024, between:

LANDLORD: ABC Property Management LLC
123 Business Street, Suite 100
Anytown, CA 12345

TENANT: John Smith and Jane Smith
456 Residential Avenue
Anytown, CA 12345

PROPERTY: 789 Oak Street, Unit 2A, Anytown, CA 12345

TERMS:
- Monthly Rent: $2,500.00
- Lease Term: 12 months
- Start Date: February 1, 2024
- End Date: January 31, 2025
- Security Deposit: $2,500.00
- Late Fee: $75.00 (after 5-day grace period)
- Rent Due Date: 1st of each month

ADDITIONAL TERMS:
- Tenant responsible for utilities (electric, gas, water)
- Parking: One assigned space included
- Pets: Not allowed
- Smoking: Prohibited in unit and common areas
- Subletting: Not permitted without written consent

This lease shall be binding upon the parties and their successors.
`;

async function testVertexAI() {
  console.log('🧪 Testing Vertex AI Integration...\n');
  
  try {
    // Test different endpoints
    const baseUrl = 'http://localhost:3000';
    
    // Test 1: Check configuration
    console.log('1. Checking configuration...');
    const configResponse = await fetch(`${baseUrl}/api/test-vertex-ai`);
    const config = await configResponse.json();
    console.log('Configuration:', config);
    
    if (!config.configured) {
      console.log('❌ Vertex AI not configured. Please set up environment variables.');
      console.log('See VERTEX_AI_SETUP.md for instructions.');
      return;
    }
    
    // Test 2: Extract lease data
    console.log('\n2. Testing lease data extraction...');
    const extractResponse = await fetch(`${baseUrl}/api/test-vertex-ai`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        text: testLease,
        task: 'extract_lease_data'
      })
    });
    const extractResult = await extractResponse.json();
    console.log('Extract Result:', JSON.stringify(extractResult, null, 2));
    
    // Test 3: Risk assessment
    console.log('\n3. Testing risk assessment...');
    const riskResponse = await fetch(`${baseUrl}/api/test-vertex-ai`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        text: testLease,
        task: 'assess_risk'
      })
    });
    const riskResult = await riskResponse.json();
    console.log('Risk Assessment:', JSON.stringify(riskResult, null, 2));
    
    // Test 4: Comprehensive analysis
    console.log('\n4. Testing comprehensive analysis...');
    const comprehensiveResponse = await fetch(`${baseUrl}/api/test-vertex-ai`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        text: testLease,
        task: 'comprehensive_analysis'
      })
    });
    const comprehensiveResult = await comprehensiveResponse.json();
    console.log('Comprehensive Analysis:', JSON.stringify(comprehensiveResult, null, 2));
    
    console.log('\n✅ All tests completed!');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
    console.log('\nMake sure your Next.js development server is running:');
    console.log('npm run dev');
  }
}

// Run the test
testVertexAI();

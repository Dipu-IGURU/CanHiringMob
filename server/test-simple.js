// Test the simple endpoint first
async function testSimpleEndpoint() {
  try {
    console.log('🔗 Testing simple endpoint...');
    
    const testData = {
      jobId: 'test123',
      fullName: 'Test User',
      email: 'test@example.com',
      phone: '1234567890',
      currentLocation: 'Test City',
      experience: '2 years',
      education: 'Bachelor\'s',
      coverLetter: 'Test cover letter'
    };
    
    console.log('📤 Sending request to simple endpoint...');
    
    const response = await fetch('http://localhost:5001/api/applications/simple', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData)
    });
    
    console.log('📥 Response status:', response.status);
    
    const result = await response.json();
    console.log('📥 Response body:', JSON.stringify(result, null, 2));
    
    if (response.ok && result.success) {
      console.log('✅ Simple endpoint test successful!');
    } else {
      console.log('❌ Simple endpoint test failed!');
    }
    
  } catch (error) {
    console.error('❌ Simple endpoint test error:', error.message);
  }
}

testSimpleEndpoint();


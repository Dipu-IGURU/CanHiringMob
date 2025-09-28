// Test the API endpoint directly
async function testAPIEndpoint() {
  try {
    console.log('🔗 Testing API endpoint...');
    
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
    
    console.log('📤 Sending request to API...');
    console.log('📤 Data:', JSON.stringify(testData, null, 2));
    
    const response = await fetch('http://localhost:5001/api/applications', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData)
    });
    
    console.log('📥 Response status:', response.status);
    console.log('📥 Response headers:', Object.fromEntries(response.headers.entries()));
    
    const result = await response.json();
    console.log('📥 Response body:', JSON.stringify(result, null, 2));
    
    if (response.ok && result.success) {
      console.log('✅ API endpoint test successful!');
      console.log('📄 Application ID:', result.data?._id);
    } else {
      console.log('❌ API endpoint test failed!');
    }
    
  } catch (error) {
    console.error('❌ API test error:', error.message);
  }
}

testAPIEndpoint();


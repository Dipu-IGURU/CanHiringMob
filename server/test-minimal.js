const fetch = require('node-fetch').default;

async function testMinimalApplication() {
  try {
    const applicationData = {
      jobId: "68d0e23db1ecf7d693aa7d99",
      fullName: "Test User",
      email: "test@example.com",
      phone: "1234567890",
      currentLocation: "Test City",
      experience: "2 years",
      education: "Bachelor's",
      coverLetter: "Test cover letter"
    };

    console.log('Testing minimal application submission...');

    const response = await fetch('http://192.168.1.14:5002/test-application', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(applicationData)
    });

    console.log('Response status:', response.status);
    const result = await response.text();
    console.log('Response body:', result);

  } catch (error) {
    console.error('Error testing minimal application:', error);
  }
}

testMinimalApplication();

const fetch = require('node-fetch').default;

async function testApplicationSubmission() {
  try {
    const applicationData = {
      jobId: "68d0e23db1ecf7d693aa7d99", // The test job ID we created
      fullName: "Test User",
      email: "test@example.com",
      phone: "1234567890",
      currentLocation: "Test City",
      experience: "2 years",
      education: "Bachelor's",
      coverLetter: "Test cover letter"
    };

    console.log('Testing application submission with data:', applicationData);

    const response = await fetch('http://192.168.1.14:5001/api/applications', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(applicationData)
    });

    console.log('Response status:', response.status);
    const result = await response.text();
    console.log('Response body:', result);

    if (response.ok) {
      console.log('✅ Application submitted successfully!');
    } else {
      console.log('❌ Application submission failed');
    }

  } catch (error) {
    console.error('Error testing application:', error);
  }
}

testApplicationSubmission();

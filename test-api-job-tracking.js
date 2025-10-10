// Test script for API job tracking system
const API_BASE_URL = 'https://canhiringmob.onrender.com';

// Test credentials
const testCredentials = {
  email: 'kasic80249@bllibl.com',
  password: 'kasic80249@bllibl.comA'
};

// Test API job data
const testApiJob = {
  job_id: 'test_api_job_123',
  title: 'Software Engineer',
  company: 'Test Company',
  location: 'Remote',
  type: 'Full-time',
  apply_url: 'https://example.com/apply'
};

async function testApiJobTracking() {
  console.log('🧪 Testing API Job Tracking System...\n');

  try {
    // Step 1: Test backend health
    console.log('1️⃣ Testing backend health...');
    const healthResponse = await fetch(`${API_BASE_URL}/api/health`);
    const healthData = await healthResponse.json();
    console.log('✅ Backend Status:', healthData.status);
    console.log('✅ Database:', healthData.database);
    console.log('✅ Environment:', healthData.environment);
    console.log('');

    // Step 2: Test login
    console.log('2️⃣ Testing user login...');
    const loginResponse = await fetch(`${API_BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testCredentials)
    });

    if (!loginResponse.ok) {
      throw new Error(`Login failed: ${loginResponse.status}`);
    }

    const loginData = await loginResponse.json();
    console.log('✅ Login successful');
    console.log('✅ User:', loginData.user.firstName, loginData.user.lastName);
    console.log('✅ Role:', loginData.user.role);
    console.log('');

    const token = loginData.token;

    // Step 3: Check application limits
    console.log('3️⃣ Checking application limits...');
    const limitsResponse = await fetch(`${API_BASE_URL}/api/applications/limits`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      }
    });

    if (!limitsResponse.ok) {
      throw new Error(`Limits check failed: ${limitsResponse.status}`);
    }

    const limitsData = await limitsResponse.json();
    console.log('✅ Current applications:', limitsData.data.current);
    console.log('✅ Max applications:', limitsData.data.max);
    console.log('✅ Remaining:', limitsData.data.remaining);
    console.log('✅ Limit reached:', limitsData.data.isLimitReached);
    console.log('');

    // Step 4: Test API job tracking
    console.log('4️⃣ Testing API job application tracking...');
    const trackResponse = await fetch(`${API_BASE_URL}/api/applications/track-api-job`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        jobId: testApiJob.job_id,
        jobTitle: testApiJob.title,
        company: testApiJob.company,
        location: testApiJob.location,
        jobType: testApiJob.type,
        applyUrl: testApiJob.apply_url,
        source: 'api'
      })
    });

    if (!trackResponse.ok) {
      const errorText = await trackResponse.text();
      console.log('❌ Tracking failed:', errorText);
      return;
    }

    const trackData = await trackResponse.json();
    console.log('✅ API job application tracked successfully');
    console.log('✅ Application ID:', trackData.application.id);
    console.log('✅ Job Title:', trackData.application.jobTitle);
    console.log('✅ Company:', trackData.application.company);
    console.log('✅ Status:', trackData.application.status);
    console.log('');

    // Step 5: Check updated limits
    console.log('5️⃣ Checking updated application limits...');
    const updatedLimitsResponse = await fetch(`${API_BASE_URL}/api/applications/limits`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      }
    });

    const updatedLimitsData = await updatedLimitsResponse.json();
    console.log('✅ Updated applications:', updatedLimitsData.data.current);
    console.log('✅ Updated remaining:', updatedLimitsData.data.remaining);
    console.log('');

    console.log('🎉 All tests passed! API job tracking system is working correctly.');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.log('\n🔧 Troubleshooting:');
    console.log('1. Check if backend is running');
    console.log('2. Verify user credentials');
    console.log('3. Check network connection');
  }
}

// Run the test
testApiJobTracking();

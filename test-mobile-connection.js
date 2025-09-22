// Test script to verify mobile connection to server
const fetch = require('node-fetch').default;

const testConnection = async () => {
  try {
    console.log('🧪 Testing mobile connection to server...');
    
    // Test the server endpoint
    const response = await fetch('http://192.168.1.14:5001/api/health');
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Server is accessible from mobile IP!');
      console.log('📊 Response:', data);
    } else {
      console.log('❌ Server responded with error:', response.status);
    }
  } catch (error) {
    console.log('❌ Connection failed:', error.message);
    console.log('💡 Make sure:');
    console.log('   1. Server is running on port 5001');
    console.log('   2. Both devices are on the same WiFi network');
    console.log('   3. Firewall allows connections on port 5001');
  }
};

testConnection();

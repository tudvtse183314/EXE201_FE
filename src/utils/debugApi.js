// Debug utility for API testing
import axios from 'axios';
import API_CONFIG from '../config/api';

export const debugApiCall = async (endpoint, data) => {
  console.log('🔍 Debug API Call:');
  console.log('URL:', `${API_CONFIG.BASE_URL}${endpoint}`);
  console.log('Data:', data);
  console.log('Headers:', {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  });

  try {
    const response = await axios.post(`${API_CONFIG.BASE_URL}${endpoint}`, data, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      timeout: API_CONFIG.TIMEOUT // 30 seconds for backend cold start
    });

    console.log('✅ Success Response:');
    console.log('Status:', response.status);
    console.log('Data:', response.data);
    console.log('Headers:', response.headers);

    return response;
  } catch (error) {
    console.log('❌ Error Response:');
    console.log('Status:', error.response?.status);
    console.log('Status Text:', error.response?.statusText);
    console.log('Data:', error.response?.data);
    console.log('Headers:', error.response?.headers);
    console.log('Full Error:', error);

    throw error;
  }
};

// Test different login formats
export const testLoginFormats = async (phone, password) => {
  console.log('🧪 Testing different login formats...');

  const formats = [
    { phone, password }, // Backend expects { phone, password } format
    { username: phone, password },
    { email: phone, password },
    { phoneNumber: phone, password },
    { user: phone, pass: password },
    { login: phone, password },
    { identifier: phone, password }
  ];

  for (let i = 0; i < formats.length; i++) {
    console.log(`\n--- Test ${i + 1}: ${JSON.stringify(formats[i])} ---`);
    try {
      await debugApiCall('/login', formats[i]);
      console.log('✅ This format works!');
      return formats[i];
    } catch (error) {
      console.log('❌ This format failed');
    }
  }

  console.log('❌ All formats failed');
  return null;
};

export default debugApiCall;

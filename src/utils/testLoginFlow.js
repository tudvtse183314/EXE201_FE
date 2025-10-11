// Test complete login flow
import { authApi } from '../api/authApi';

export const testCompleteLoginFlow = async (phone, password) => {
  console.log('🧪 Testing complete login flow...');
  
  try {
    // Step 1: Login
    console.log('Step 1: Attempting login...');
    const loginResponse = await authApi.login(phone, password);
    console.log('✅ Login successful:', loginResponse);
    
    // Step 2: Verify response structure
    console.log('Step 2: Verifying response structure...');
    const requiredFields = ['token', 'id', 'email', 'phone', 'role'];
    const missingFields = requiredFields.filter(field => !loginResponse[field]);
    
    if (missingFields.length > 0) {
      console.log('❌ Missing required fields:', missingFields);
      return { success: false, error: `Missing fields: ${missingFields.join(', ')}` };
    }
    
    // Step 3: Extract user data
    console.log('Step 3: Extracting user data...');
    const userData = {
      id: loginResponse.id,
      fullName: loginResponse.fullName,
      email: loginResponse.email,
      phone: loginResponse.phone,
      role: loginResponse.role,
      petName: loginResponse.petName,
      petAge: loginResponse.petAge,
      petType: loginResponse.petType,
      petSize: loginResponse.petSize
    };
    
    console.log('✅ User data extracted:', userData);
    
    // Step 4: Verify token
    console.log('Step 4: Verifying token...');
    const token = loginResponse.token;
    if (!token || typeof token !== 'string') {
      console.log('❌ Invalid token:', token);
      return { success: false, error: 'Invalid token format' };
    }
    
    console.log('✅ Token valid:', token.substring(0, 20) + '...');
    
    return {
      success: true,
      data: {
        token,
        user: userData,
        loginResponse
      }
    };
    
  } catch (error) {
    console.log('❌ Login flow failed:', error.message);
    return {
      success: false,
      error: error.message,
      details: error.response?.data
    };
  }
};

export const testLoginWithCredentials = async () => {
  console.log('🧪 Testing login with registered credentials...');
  
  const credentials = [
    { phone: '0707070708', password: '123123123' },
    { phone: '0808080808', password: '123123123' }
  ];
  
  for (const cred of credentials) {
    console.log(`\n--- Testing ${cred.phone} ---`);
    const result = await testCompleteLoginFlow(cred.phone, cred.password);
    
    if (result.success) {
      console.log('✅ Login successful with', cred.phone);
      return result;
    } else {
      console.log('❌ Login failed with', cred.phone, ':', result.error);
    }
  }
  
  return { success: false, error: 'All credentials failed' };
};

export default testCompleteLoginFlow;

// Debug utility cho login flow
export const debugLoginFlow = () => {
  console.log('🔍 Debugging Login Flow...');
  
  // Check localStorage
  const token = localStorage.getItem("authToken");
  const user = localStorage.getItem("user");
  
  console.log('📦 LocalStorage:');
  console.log('  - Token:', token ? '✅ Present' : '❌ Missing');
  console.log('  - User:', user ? '✅ Present' : '❌ Missing');
  
  if (user) {
    try {
      const userData = JSON.parse(user);
      console.log('👤 User Data:', userData);
      console.log('  - Name:', userData.name || '❌ No name');
      console.log('  - Email:', userData.email || '❌ No email');
      console.log('  - Role:', userData.role || '❌ No role');
      console.log('  - AccountId:', userData.accountId || '❌ No accountId');
    } catch (error) {
      console.error('❌ Error parsing user data:', error);
    }
  }
  
  // Check API endpoints
  console.log('🌐 API Configuration:');
  console.log('  - Base URL:', process.env.REACT_APP_API_BASE_URL || 'https://exe201-be-uhno.onrender.com/api');
  
  return { token, user };
};

// Test login với mock data
export const testLogin = () => {
  const mockUserData = {
    id: '12345',
    name: 'Test User',
    email: 'test@example.com',
    phone: '0123456789',
    role: 'CUSTOMER',
    accountId: '12345',
    petName: 'Buddy',
    petAge: 3,
    petType: 'Dog',
    petSize: 'Medium'
  };
  
  const mockToken = 'mock-jwt-token-12345';
  
  localStorage.setItem("authToken", mockToken);
  localStorage.setItem("user", JSON.stringify(mockUserData));
  
  console.log('✅ Test login completed with mock data');
  return mockUserData;
};

// Clear login data
export const clearLoginData = () => {
  localStorage.removeItem("authToken");
  localStorage.removeItem("user");
  console.log('✅ Login data cleared');
};

// Check if user is properly authenticated
export const checkAuthStatus = () => {
  const token = localStorage.getItem("authToken");
  const user = localStorage.getItem("user");
  
  if (!token || !user) {
    console.log('❌ Not authenticated - missing token or user data');
    return false;
  }
  
  try {
    const userData = JSON.parse(user);
    if (!userData.name && !userData.email) {
      console.log('❌ Not authenticated - invalid user data');
      return false;
    }
    
    console.log('✅ User is properly authenticated');
    return true;
  } catch (error) {
    console.log('❌ Not authenticated - error parsing user data:', error);
    return false;
  }
};

// Simulate API call
export const simulateLoginAPI = async (phone, password) => {
  console.log('🔄 Simulating login API call...');
  console.log('  - Phone:', phone);
  console.log('  - Password:', password ? '***' : 'empty');
  
  // Simulate delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Mock response
  const mockResponse = {
    id: '12345',
    fullName: 'Test User',
    name: 'Test User',
    email: 'test@example.com',
    phone: phone,
    role: 'CUSTOMER',
    accountId: '12345',
    token: 'mock-jwt-token-12345',
    petName: 'Buddy',
    petAge: 3,
    petType: 'Dog',
    petSize: 'Medium'
  };
  
  console.log('✅ Mock API response:', mockResponse);
  return mockResponse;
};

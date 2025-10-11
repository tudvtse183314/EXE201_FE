// Test credentials for different scenarios
export const testCredentials = {
  // Common test credentials
  valid: [
    { phone: '0707070708', password: '123123123' }, // Working credentials from register
    { phone: '0808080808', password: '123123123' },
    { phone: 'admin', password: 'admin123' },
    { phone: 'test', password: 'test123' },
    { phone: 'user', password: 'user123' },
    { phone: 'demo', password: 'demo123' }
  ],
  
  // Phone number formats
  phoneFormats: [
    { phone: '0808080808', password: '123123123' },
    { phone: '0123456789', password: '123123123' },
    { phone: '0987654321', password: '123123123' }
  ],
  
  // Email formats
  emailFormats: [
    { phone: 'admin@example.com', password: 'admin123' },
    { phone: 'test@test.com', password: 'test123' },
    { phone: 'user@user.com', password: 'user123' }
  ],
  
  // Common passwords
  commonPasswords: [
    '123456',
    'password',
    '123123',
    'admin',
    'test',
    'user',
    '123123123'
  ]
};

// Function to test multiple credentials
export const testMultipleCredentials = async (debugApiCall) => {
  console.log('🧪 Testing multiple credentials...');
  
  const allCredentials = [
    ...testCredentials.valid,
    ...testCredentials.phoneFormats,
    ...testCredentials.emailFormats
  ];
  
  for (let i = 0; i < allCredentials.length; i++) {
    const cred = allCredentials[i];
    console.log(`\n--- Testing Credential ${i + 1}: ${JSON.stringify(cred)} ---`);
    
    try {
      const response = await debugApiCall('/login', cred);
      console.log('✅ SUCCESS! Working credentials found:', cred);
      return { success: true, credentials: cred, response: response.data };
    } catch (error) {
      console.log('❌ Failed:', error.response?.data || error.message);
    }
  }
  
  console.log('❌ No working credentials found');
  return { success: false, message: 'No working credentials found' };
};

export default testCredentials;

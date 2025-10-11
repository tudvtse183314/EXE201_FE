// Test register API with correct format
import { debugApiCall } from './debugApi';

export const testRegisterFormat = async () => {
  console.log('🧪 Testing register API format...');
  
  const testRegisterData = {
    fullName: "Test User",
    email: "test@example.com",
    phone: "0808080808",
    password: "123123123",
    role: "CUSTOMER",
    petName: "Buddy",
    petAge: "2 years",
    petType: "dog",
    petSize: "medium"
  };
  
  try {
    console.log('Testing register with data:', testRegisterData);
    const response = await debugApiCall('/register', testRegisterData);
    console.log('✅ Register test successful:', response.data);
    return { success: true, data: response.data };
  } catch (error) {
    console.log('❌ Register test failed:', error.response?.data || error.message);
    return { success: false, error: error.response?.data || error.message };
  }
};

export const testRegisterWithMinimalData = async () => {
  console.log('🧪 Testing register with minimal required data...');
  
  const minimalData = {
    fullName: "Test User",
    email: "test@example.com",
    phone: "0808080808",
    password: "123123123",
    role: "CUSTOMER",
    petName: "Buddy",
    petAge: "2 years",
    petType: "dog",
    petSize: "medium"
  };
  
  try {
    const response = await debugApiCall('/register', minimalData);
    console.log('✅ Minimal register test successful:', response.data);
    return { success: true, data: response.data };
  } catch (error) {
    console.log('❌ Minimal register test failed:', error.response?.data || error.message);
    return { success: false, error: error.response?.data || error.message };
  }
};

export default testRegisterFormat;

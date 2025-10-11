// Backend discovery utility to find correct endpoints and formats
import axios from 'axios';
import API_CONFIG from '../config/api';

export const discoverBackend = async () => {
  console.log('🔍 Starting backend discovery...');
  
  const baseUrl = API_CONFIG.BASE_URL;
  const results = {
    baseUrl,
    endpoints: {},
    formats: {},
    errors: []
  };

  // Test different login endpoints
  const loginEndpoints = [
    '/login',
    '/auth/login',
    '/user/login',
    '/api/login',
    '/authenticate',
    '/signin'
  ];

  // Test different data formats
  const testData = {
    phone: '0808080808',
    password: '123123123'
  };

  console.log('🧪 Testing login endpoints...');
  
  for (const endpoint of loginEndpoints) {
    try {
      console.log(`Testing endpoint: ${endpoint}`);
      const response = await axios.post(`${baseUrl}${endpoint}`, testData, {
        timeout: 5000,
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      results.endpoints[endpoint] = {
        status: response.status,
        data: response.data,
        success: true
      };
      
      console.log(`✅ ${endpoint} - Status: ${response.status}`);
      
    } catch (error) {
      const status = error.response?.status;
      const data = error.response?.data;
      
      results.endpoints[endpoint] = {
        status,
        data,
        success: false,
        error: error.message
      };
      
      console.log(`❌ ${endpoint} - Status: ${status}, Error: ${data || error.message}`);
      
      // If it's not a 404, it might be the right endpoint with wrong format
      if (status !== 404) {
        results.errors.push({
          endpoint,
          status,
          data,
          message: 'Endpoint exists but format might be wrong'
        });
      }
    }
  }

  // Test health/status endpoints
  const healthEndpoints = [
    '/health',
    '/status',
    '/ping',
    '/api/health',
    '/api/status'
  ];

  console.log('🧪 Testing health endpoints...');
  
  for (const endpoint of healthEndpoints) {
    try {
      const response = await axios.get(`${baseUrl}${endpoint}`, {
        timeout: 5000
      });
      
      results.endpoints[endpoint] = {
        status: response.status,
        data: response.data,
        success: true
      };
      
      console.log(`✅ ${endpoint} - Status: ${response.status}`);
      
    } catch (error) {
      console.log(`❌ ${endpoint} - ${error.response?.status || error.message}`);
    }
  }

  // Test different data formats for the most promising endpoint
  const promisingEndpoints = Object.entries(results.endpoints)
    .filter(([_, result]) => !result.success && result.status !== 404)
    .map(([endpoint, _]) => endpoint);

  if (promisingEndpoints.length > 0) {
    console.log('🧪 Testing different data formats...');
    
    const formats = [
      { phone: '0808080808', password: '123123123' }, // Backend expects this format
      { username: '0808080808', password: '123123123' },
      { email: '0808080808', password: '123123123' },
      { user: '0808080808', pass: '123123123' },
      { login: '0808080808', password: '123123123' },
      { identifier: '0808080808', password: '123123123' }
    ];

    for (const endpoint of promisingEndpoints.slice(0, 2)) { // Test top 2 promising endpoints
      for (const format of formats) {
        try {
          const response = await axios.post(`${baseUrl}${endpoint}`, format, {
            timeout: 5000,
            headers: {
              'Content-Type': 'application/json'
            }
          });
          
          results.formats[`${endpoint}_${JSON.stringify(format)}`] = {
            success: true,
            data: response.data
          };
          
          console.log(`✅ ${endpoint} with ${JSON.stringify(format)} - SUCCESS!`);
          
        } catch (error) {
          console.log(`❌ ${endpoint} with ${JSON.stringify(format)} - ${error.response?.data || error.message}`);
        }
      }
    }
  }

  console.log('🔍 Backend discovery complete:', results);
  return results;
};

export default discoverBackend;

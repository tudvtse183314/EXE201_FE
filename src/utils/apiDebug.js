// src/utils/apiDebug.js - API Debug Utilities
import axiosInstance from '../api/axios';

export const testCategoriesAPI = async () => {
  console.log('🧪 Testing Categories API...');
  
  const results = {
    getAll: null,
    create: null,
    update: null,
    delete: null
  };

  try {
    // Test GET /categories/getAll
    console.log('1. Testing GET /categories/getAll');
    const getAllRes = await axiosInstance.get('/categories/getAll');
    results.getAll = { success: true, data: getAllRes.data, count: getAllRes.data?.length || 0 };
    console.log('✅ GET /categories/getAll success:', getAllRes.data);
  } catch (error) {
    results.getAll = { success: false, error: error.message };
    console.error('❌ GET /categories/getAll failed:', error);
  }

  try {
    // Test POST /categories
    console.log('2. Testing POST /categories');
    const testCategory = {
      name: `Test Category ${Date.now()}`,
      description: 'Test description for API debugging'
    };
    const createRes = await axiosInstance.post('/categories', testCategory);
    results.create = { success: true, data: createRes.data };
    console.log('✅ POST /categories success:', createRes.data);
    
    // Store created ID for update/delete tests
    const createdId = createRes.data?.id;
    
    if (createdId) {
      // Test PUT /categories/{id}
      try {
        console.log('3. Testing PUT /categories/{id}');
        const updateData = {
          name: `Updated Test Category ${Date.now()}`,
          description: 'Updated test description'
        };
        const updateRes = await axiosInstance.put(`/categories/${createdId}`, updateData);
        results.update = { success: true, data: updateRes.data, method: 'PUT' };
        console.log('✅ PUT /categories/{id} success:', updateRes.data);
      } catch (putError) {
        console.log('❌ PUT failed, trying PATCH...');
        try {
          const updateData = {
            name: `Updated Test Category ${Date.now()}`,
            description: 'Updated test description'
          };
          const updateRes = await axiosInstance.patch(`/categories/${createdId}`, updateData);
          results.update = { success: true, data: updateRes.data, method: 'PATCH' };
          console.log('✅ PATCH /categories/{id} success:', updateRes.data);
        } catch (patchError) {
          results.update = { success: false, error: `PUT: ${putError.message}, PATCH: ${patchError.message}` };
          console.error('❌ Both PUT and PATCH failed');
        }
      }
      
      // Test DELETE /categories/{id}
      try {
        console.log('4. Testing DELETE /categories/{id}');
        const deleteRes = await axiosInstance.delete(`/categories/${createdId}`);
        results.delete = { success: true, data: deleteRes.data };
        console.log('✅ DELETE /categories/{id} success:', deleteRes.data);
      } catch (error) {
        results.delete = { success: false, error: error.message };
        console.error('❌ DELETE /categories/{id} failed:', error);
      }
    }
  } catch (error) {
    results.create = { success: false, error: error.message };
    console.error('❌ POST /categories failed:', error);
  }

  console.log('🧪 Categories API Test Results:', results);
  return results;
};

export const testProductsAPI = async () => {
  console.log('🧪 Testing Products API...');
  
  const results = {
    getAll: null,
    create: null,
    update: null,
    delete: null
  };

  try {
    // Test GET /products/getAll
    console.log('1. Testing GET /products/getAll');
    const getAllRes = await axiosInstance.get('/products/getAll');
    results.getAll = { success: true, data: getAllRes.data, count: getAllRes.data?.length || 0 };
    console.log('✅ GET /products/getAll success:', getAllRes.data);
  } catch (error) {
    results.getAll = { success: false, error: error.message };
    console.error('❌ GET /products/getAll failed:', error);
  }

  try {
    // Test POST /products
    console.log('2. Testing POST /products');
    const testProduct = {
      name: `Test Product ${Date.now()}`,
      description: 'Test product description for API debugging',
      price: 100000,
      stock: 10,
      imageUrl: 'https://via.placeholder.com/300x300?text=Test+Product',
      type: 'Test Type',
      categoryId: 1 // Assuming category ID 1 exists
    };
    const createRes = await axiosInstance.post('/products', testProduct);
    results.create = { success: true, data: createRes.data };
    console.log('✅ POST /products success:', createRes.data);
    
    // Store created ID for update/delete tests
    const createdId = createRes.data?.id;
    
    if (createdId) {
      // Test PUT /products/{id}
      try {
        console.log('3. Testing PUT /products/{id}');
        const updateData = {
          name: `Updated Test Product ${Date.now()}`,
          description: 'Updated test product description',
          price: 150000,
          stock: 15,
          imageUrl: 'https://via.placeholder.com/300x300?text=Updated+Product',
          type: 'Updated Type',
          categoryId: 1
        };
        const updateRes = await axiosInstance.put(`/products/${createdId}`, updateData);
        results.update = { success: true, data: updateRes.data, method: 'PUT' };
        console.log('✅ PUT /products/{id} success:', updateRes.data);
      } catch (putError) {
        console.log('❌ PUT failed, trying PATCH...');
        try {
          const updateData = {
            name: `Updated Test Product ${Date.now()}`,
            description: 'Updated test product description',
            price: 150000,
            stock: 15,
            imageUrl: 'https://via.placeholder.com/300x300?text=Updated+Product',
            type: 'Updated Type',
            categoryId: 1
          };
          const updateRes = await axiosInstance.patch(`/products/${createdId}`, updateData);
          results.update = { success: true, data: updateRes.data, method: 'PATCH' };
          console.log('✅ PATCH /products/{id} success:', updateRes.data);
        } catch (patchError) {
          results.update = { success: false, error: `PUT: ${putError.message}, PATCH: ${patchError.message}` };
          console.error('❌ Both PUT and PATCH failed');
        }
      }
      
      // Test DELETE /products/{id}
      try {
        console.log('4. Testing DELETE /products/{id}');
        const deleteRes = await axiosInstance.delete(`/products/${createdId}`);
        results.delete = { success: true, data: deleteRes.data };
        console.log('✅ DELETE /products/{id} success:', deleteRes.data);
      } catch (error) {
        results.delete = { success: false, error: error.message };
        console.error('❌ DELETE /products/{id} failed:', error);
      }
    }
  } catch (error) {
    results.create = { success: false, error: error.message };
    console.error('❌ POST /products failed:', error);
  }
  
  console.log('🧪 Products API Test Results:', results);
  return results;
};

export const testOrdersAPI = async () => {
  console.log('🧪 Testing Orders API...');
  
  const results = {
    getAll: null,
    create: null,
    getById: null,
    getByAccount: null,
    getByStatus: null,
    getPaymentQR: null,
    cancel: null,
    updateStatus: null
  };

  try {
    // Test GET /orders/all (Admin)
    console.log('1. Testing GET /orders/all');
    const getAllRes = await axiosInstance.get('/orders/all');
    results.getAll = { success: true, data: getAllRes.data, count: getAllRes.data?.length || 0 };
    console.log('✅ GET /orders/all success:', getAllRes.data);
  } catch (error) {
    results.getAll = { success: false, error: error.message };
    console.error('❌ GET /orders/all failed:', error);
  }

  try {
    // Test POST /orders (User)
    console.log('2. Testing POST /orders');
    const testOrder = {
      accountId: 1, // Assuming account ID 1 exists
      shippingAddress: "123 Test Street, Ho Chi Minh City",
      phoneContact: "0123456789",
      note: "Test order for API debugging",
      items: [
        { productId: 1, quantity: 2 }, // Assuming product ID 1 exists
        { productId: 2, quantity: 1 }  // Assuming product ID 2 exists
      ]
    };
    const createRes = await axiosInstance.post('/orders', testOrder);
    results.create = { success: true, data: createRes.data };
    console.log('✅ POST /orders success:', createRes.data);
    
    // Store created order ID for other tests
    const createdOrderId = createRes.data?.orderId;
    
    if (createdOrderId) {
      // Test GET /orders/{id}
      try {
        console.log('3. Testing GET /orders/{id}');
        const getByIdRes = await axiosInstance.get(`/orders/${createdOrderId}`);
        results.getById = { success: true, data: getByIdRes.data };
        console.log('✅ GET /orders/{id} success:', getByIdRes.data);
      } catch (error) {
        results.getById = { success: false, error: error.message };
        console.error('❌ GET /orders/{id} failed:', error);
      }
      
      // Test GET /orders/account/{id}
      try {
        console.log('4. Testing GET /orders/account/{id}');
        const getByAccountRes = await axiosInstance.get(`/orders/account/${testOrder.accountId}`);
        results.getByAccount = { success: true, data: getByAccountRes.data };
        console.log('✅ GET /orders/account/{id} success:', getByAccountRes.data);
      } catch (error) {
        results.getByAccount = { success: false, error: error.message };
        console.error('❌ GET /orders/account/{id} failed:', error);
      }
      
      // Test GET /orders/status/{status}
      try {
        console.log('5. Testing GET /orders/status/{status}');
        const getByStatusRes = await axiosInstance.get('/orders/status/PENDING');
        results.getByStatus = { success: true, data: getByStatusRes.data };
        console.log('✅ GET /orders/status/{status} success:', getByStatusRes.data);
      } catch (error) {
        results.getByStatus = { success: false, error: error.message };
        console.error('❌ GET /orders/status/{status} failed:', error);
      }
      
      // Test GET /orders/{id}/payment-qr
      try {
        console.log('6. Testing GET /orders/{id}/payment-qr');
        const getPaymentQRRes = await axiosInstance.get(`/orders/${createdOrderId}/payment-qr`);
        results.getPaymentQR = { success: true, data: getPaymentQRRes.data };
        console.log('✅ GET /orders/{id}/payment-qr success:', getPaymentQRRes.data);
      } catch (error) {
        results.getPaymentQR = { success: false, error: error.message };
        console.error('❌ GET /orders/{id}/payment-qr failed:', error);
      }
      
      // Test PATCH /orders/{id}/cancel (only if status is PENDING)
      try {
        console.log('7. Testing PATCH /orders/{id}/cancel');
        const cancelRes = await axiosInstance.patch(`/orders/${createdOrderId}/cancel`);
        results.cancel = { success: true, data: cancelRes.data };
        console.log('✅ PATCH /orders/{id}/cancel success:', cancelRes.data);
      } catch (error) {
        results.cancel = { success: false, error: error.message };
        console.error('❌ PATCH /orders/{id}/cancel failed:', error);
      }
      
      // Test PATCH /orders/{id}/status (Admin)
      try {
        console.log('8. Testing PATCH /orders/{id}/status');
        const updateStatusRes = await axiosInstance.patch(`/orders/${createdOrderId}/status`, { 
          status: 'PROCESSING' 
        });
        results.updateStatus = { success: true, data: updateStatusRes.data };
        console.log('✅ PATCH /orders/{id}/status success:', updateStatusRes.data);
      } catch (error) {
        results.updateStatus = { success: false, error: error.message };
        console.error('❌ PATCH /orders/{id}/status failed:', error);
      }
    }
  } catch (error) {
    results.create = { success: false, error: error.message };
    console.error('❌ POST /orders failed:', error);
  }
  
  console.log('🧪 Orders API Test Results:', results);
  return results;
};

export const runAllAPITests = async () => {
  console.log('🚀 Running all API tests...');
  
  const categoriesResults = await testCategoriesAPI();
  const productsResults = await testProductsAPI();
  const ordersResults = await testOrdersAPI();
  
  const summary = {
    categories: categoriesResults,
    products: productsResults,
    orders: ordersResults,
    timestamp: new Date().toISOString()
  };
  
  console.log('📊 API Test Summary:', summary);
  return summary;
};

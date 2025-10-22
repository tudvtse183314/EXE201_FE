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

export const runAllAPITests = async () => {
  console.log('🚀 Running all API tests...');
  
  const categoriesResults = await testCategoriesAPI();
  const productsResults = await testProductsAPI();
  
  const summary = {
    categories: categoriesResults,
    products: productsResults,
    timestamp: new Date().toISOString()
  };
  
  console.log('📊 API Test Summary:', summary);
  return summary;
};

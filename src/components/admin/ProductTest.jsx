// src/components/admin/ProductTest.jsx - Test component for Products API
import React, { useState } from 'react';
import { Button, Card, Form, Input, InputNumber, Select, Space, message, Typography, Alert, Divider } from 'antd';
import { createProduct, updateProduct, deleteProduct, getAllProducts } from '../../services/products';
import { getAllCategories } from '../../services/categories';
import { testProductsAPI } from '../../utils/apiDebug';

const { Title, Text } = Typography;
const { Option } = Select;

export default function ProductTest() {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [testResults, setTestResults] = useState(null);

  const loadData = async () => {
    try {
      setLoading(true);
      const [productsData, categoriesData] = await Promise.all([
        getAllProducts(),
        getAllCategories()
      ]);
      setProducts(productsData);
      setCategories(categoriesData);
      message.success(`Loaded ${productsData.length} products and ${categoriesData.length} categories`);
    } catch (error) {
      message.error('Failed to load data: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (values) => {
    try {
      setLoading(true);
      const result = await createProduct(values);
      message.success('Product created successfully!');
      form.resetFields();
      loadData(); // Reload list
    } catch (error) {
      message.error('Failed to create product: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (id, values) => {
    try {
      setLoading(true);
      const result = await updateProduct(id, values);
      message.success('Product updated successfully!');
      loadData(); // Reload list
    } catch (error) {
      message.error('Failed to update product: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      setLoading(true);
      const result = await deleteProduct(id);
      message.success('Product deleted successfully!');
      loadData(); // Reload list
    } catch (error) {
      message.error('Failed to delete product: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const runAPITest = async () => {
    try {
      setLoading(true);
      const results = await testProductsAPI();
      setTestResults(results);
      message.success('Products API test completed! Check console for details.');
    } catch (error) {
      message.error('Products API test failed: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '24px' }}>
      <Title level={2}>🧪 Products API Test</Title>
      
      <Card title="API Debug Tools" style={{ marginBottom: '24px' }}>
        <Space direction="vertical" style={{ width: '100%' }}>
          <Space wrap>
            <Button type="primary" onClick={loadData} loading={loading}>
              Load Products & Categories
            </Button>
            <Button onClick={runAPITest} loading={loading}>
              Test Products API
            </Button>
          </Space>
          
          {testResults && (
            <Alert
              message="Products API Test Results"
              description={
                <div>
                  <Text strong>Products API:</Text>
                  <ul>
                    <li>GET: {testResults.getAll?.success ? '✅' : '❌'} {testResults.getAll?.count || 0} items</li>
                    <li>POST: {testResults.create?.success ? '✅' : '❌'}</li>
                    <li>UPDATE: {testResults.update?.success ? '✅' : '❌'} {testResults.update?.method || ''}</li>
                    <li>DELETE: {testResults.delete?.success ? '✅' : '❌'}</li>
                  </ul>
                </div>
              }
              type={testResults.getAll?.success ? 'success' : 'error'}
              showIcon
            />
          )}
        </Space>
      </Card>
      
      <Card title="Manual Test Products API" style={{ marginBottom: '24px' }}>
        <Space direction="vertical" style={{ width: '100%' }}>
          <div>
            <Text strong>Current Products ({products.length}):</Text>
            <div style={{ marginTop: '8px', maxHeight: '300px', overflowY: 'auto' }}>
              {products.map(product => (
                <Card key={product.id} size="small" style={{ marginBottom: '8px' }}>
                  <Space>
                    <Text>ID: {product.id}</Text>
                    <Text strong>{product.name}</Text>
                    <Text type="secondary">{product.price?.toLocaleString('vi-VN')} VNĐ</Text>
                    <Text type="secondary">Stock: {product.stock}</Text>
                    <Text type="secondary">Category: {product.category?.name || 'N/A'}</Text>
                    <Button 
                      size="small" 
                      onClick={() => handleUpdate(product.id, { 
                        name: product.name + ' (Updated)', 
                        description: product.description + ' - Updated',
                        price: product.price + 10000,
                        stock: product.stock + 1,
                        categoryId: product.category?.id || 1
                      })}
                    >
                      Test Update
                    </Button>
                    <Button 
                      size="small" 
                      danger 
                      onClick={() => handleDelete(product.id)}
                    >
                      Test Delete
                    </Button>
                  </Space>
                </Card>
              ))}
            </div>
          </div>
        </Space>
      </Card>

      <Card title="Create New Product">
        <Form
          form={form}
          layout="vertical"
          onFinish={handleCreate}
          initialValues={{
            name: '',
            description: '',
            price: 0,
            stock: 0,
            imageUrl: '',
            type: '',
            categoryId: undefined
          }}
        >
          <Form.Item
            name="name"
            label="Product Name"
            rules={[{ required: true, message: 'Please enter product name!' }]}
          >
            <Input placeholder="Enter product name..." />
          </Form.Item>
          
          <Form.Item
            name="description"
            label="Description"
          >
            <Input.TextArea placeholder="Enter description..." />
          </Form.Item>

          <Form.Item
            name="categoryId"
            label="Category"
            rules={[{ required: true, message: 'Please select category!' }]}
          >
            <Select placeholder="Select category...">
              {categories.map(category => (
                <Option key={category.id} value={category.id}>
                  {category.name}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="price"
            label="Price (VNĐ)"
            rules={[{ required: true, message: 'Please enter price!' }]}
          >
            <InputNumber 
              placeholder="0"
              style={{ width: '100%' }}
              formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              parser={value => value.replace(/\$\s?|(,*)/g, '')}
            />
          </Form.Item>

          <Form.Item
            name="stock"
            label="Stock"
            rules={[{ required: true, message: 'Please enter stock!' }]}
          >
            <InputNumber 
              placeholder="0"
              style={{ width: '100%' }}
              min={0}
            />
          </Form.Item>

          <Form.Item
            name="type"
            label="Type"
          >
            <Input placeholder="Enter product type..." />
          </Form.Item>

          <Form.Item
            name="imageUrl"
            label="Image URL"
          >
            <Input placeholder="https://example.com/image.jpg" />
          </Form.Item>
          
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading}>
              Create Product
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}

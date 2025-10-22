// src/components/admin/CategoryTest.jsx - Test component for Categories API
import React, { useState } from 'react';
import { Button, Card, Form, Input, Space, message, Typography, Alert, Divider } from 'antd';
import { createCategory, updateCategory, deleteCategory, getAllCategories } from '../../services/categories';
import { testCategoriesAPI, runAllAPITests } from '../../utils/apiDebug';

const { Title, Text } = Typography;

export default function CategoryTest() {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [testResults, setTestResults] = useState(null);

  const loadCategories = async () => {
    try {
      setLoading(true);
      const data = await getAllCategories();
      setCategories(data);
      message.success(`Loaded ${data.length} categories`);
    } catch (error) {
      message.error('Failed to load categories: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (values) => {
    try {
      setLoading(true);
      const result = await createCategory(values);
      message.success('Category created successfully!');
      form.resetFields();
      loadCategories(); // Reload list
    } catch (error) {
      message.error('Failed to create category: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (id, values) => {
    try {
      setLoading(true);
      const result = await updateCategory(id, values);
      message.success('Category updated successfully!');
      loadCategories(); // Reload list
    } catch (error) {
      message.error('Failed to update category: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      setLoading(true);
      const result = await deleteCategory(id);
      message.success('Category deleted successfully!');
      loadCategories(); // Reload list
    } catch (error) {
      message.error('Failed to delete category: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const runAPITest = async () => {
    try {
      setLoading(true);
      const results = await testCategoriesAPI();
      setTestResults(results);
      message.success('API test completed! Check console for details.');
    } catch (error) {
      message.error('API test failed: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const runAllTests = async () => {
    try {
      setLoading(true);
      const results = await runAllAPITests();
      setTestResults(results);
      message.success('All API tests completed! Check console for details.');
    } catch (error) {
      message.error('API tests failed: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '24px' }}>
      <Title level={2}>🧪 Categories API Test</Title>
      
      <Card title="API Debug Tools" style={{ marginBottom: '24px' }}>
        <Space direction="vertical" style={{ width: '100%' }}>
          <Space wrap>
            <Button type="primary" onClick={loadCategories} loading={loading}>
              Load Categories
            </Button>
            <Button onClick={runAPITest} loading={loading}>
              Test Categories API
            </Button>
            <Button onClick={runAllTests} loading={loading}>
              Test All APIs
            </Button>
          </Space>
          
          {testResults && (
            <Alert
              message="API Test Results"
              description={
                <div>
                  <Text strong>Categories API:</Text>
                  <ul>
                    <li>GET: {testResults.categories?.getAll?.success ? '✅' : '❌'} {testResults.categories?.getAll?.count || 0} items</li>
                    <li>POST: {testResults.categories?.create?.success ? '✅' : '❌'}</li>
                    <li>UPDATE: {testResults.categories?.update?.success ? '✅' : '❌'} {testResults.categories?.update?.method || ''}</li>
                    <li>DELETE: {testResults.categories?.delete?.success ? '✅' : '❌'}</li>
                  </ul>
                  
                  <Text strong style={{ marginTop: '16px', display: 'block' }}>Products API:</Text>
                  <ul>
                    <li>GET: {testResults.products?.getAll?.success ? '✅' : '❌'} {testResults.products?.getAll?.count || 0} items</li>
                    <li>POST: {testResults.products?.create?.success ? '✅' : '❌'}</li>
                    <li>UPDATE: {testResults.products?.update?.success ? '✅' : '❌'} {testResults.products?.update?.method || ''}</li>
                    <li>DELETE: {testResults.products?.delete?.success ? '✅' : '❌'}</li>
                  </ul>
                </div>
              }
              type={testResults.categories?.getAll?.success && testResults.products?.getAll?.success ? 'success' : 'error'}
              showIcon
            />
          )}
        </Space>
      </Card>
      
      <Card title="Manual Test Categories API" style={{ marginBottom: '24px' }}>
        <Space direction="vertical" style={{ width: '100%' }}>
          
          <div>
            <Text strong>Current Categories ({categories.length}):</Text>
            <div style={{ marginTop: '8px' }}>
              {categories.map(cat => (
                <Card key={cat.id} size="small" style={{ marginBottom: '8px' }}>
                  <Space>
                    <Text>ID: {cat.id}</Text>
                    <Text strong>{cat.name}</Text>
                    <Text type="secondary">{cat.description}</Text>
                    <Button 
                      size="small" 
                      onClick={() => handleUpdate(cat.id, { 
                        name: cat.name + ' (Updated)', 
                        description: cat.description + ' - Updated' 
                      })}
                    >
                      Test Update
                    </Button>
                    <Button 
                      size="small" 
                      danger 
                      onClick={() => handleDelete(cat.id)}
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

      <Card title="Create New Category">
        <Form
          form={form}
          layout="vertical"
          onFinish={handleCreate}
          initialValues={{
            name: '',
            description: ''
          }}
        >
          <Form.Item
            name="name"
            label="Category Name"
            rules={[{ required: true, message: 'Please enter category name!' }]}
          >
            <Input placeholder="Enter category name..." />
          </Form.Item>
          
          <Form.Item
            name="description"
            label="Description"
          >
            <Input.TextArea placeholder="Enter description..." />
          </Form.Item>
          
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading}>
              Create Category
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}

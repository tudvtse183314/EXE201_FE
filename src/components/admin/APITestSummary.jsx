// src/components/admin/APITestSummary.jsx - Summary of all API tests
import React, { useState } from 'react';
import { Card, Button, Space, Typography, Alert, Row, Col, Statistic, Divider } from 'antd';
import { runAllAPITests } from '../../utils/apiDebug';

const { Title, Text } = Typography;

export default function APITestSummary() {
  const [loading, setLoading] = useState(false);
  const [testResults, setTestResults] = useState(null);

  const runAllTests = async () => {
    try {
      setLoading(true);
      const results = await runAllAPITests();
      setTestResults(results);
    } catch (error) {
      console.error('API tests failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const getOverallStatus = () => {
    if (!testResults) return 'unknown';
    
    const categoriesOK = testResults.categories?.getAll?.success;
    const productsOK = testResults.products?.getAll?.success;
    
    if (categoriesOK && productsOK) return 'success';
    if (categoriesOK || productsOK) return 'warning';
    return 'error';
  };

  const getStatusIcon = (success) => success ? '✅' : '❌';
  const getStatusColor = (success) => success ? '#52c41a' : '#ff4d4f';

  return (
    <div style={{ padding: '24px' }}>
      <Title level={2}>📊 API Test Summary</Title>
      
      <Card style={{ marginBottom: '24px' }}>
        <Row justify="space-between" align="middle">
          <Col>
            <Title level={3} style={{ margin: 0 }}>API Health Check</Title>
            <Text type="secondary">Test all API endpoints and show overall status</Text>
          </Col>
          <Col>
            <Button 
              type="primary" 
              size="large"
              onClick={runAllTests} 
              loading={loading}
              style={{
                background: 'var(--pv-primary, #eda274)',
                borderColor: 'var(--pv-primary, #eda274)'
              }}
            >
              Run All API Tests
            </Button>
          </Col>
        </Row>
      </Card>

      {testResults && (
        <>
          {/* Overall Status */}
          <Card style={{ marginBottom: '24px' }}>
            <Row gutter={[24, 24]}>
              <Col xs={24} sm={8}>
                <Statistic
                  title="Overall Status"
                  value={getOverallStatus() === 'success' ? 'Healthy' : getOverallStatus() === 'warning' ? 'Partial' : 'Unhealthy'}
                  valueStyle={{ 
                    color: getStatusColor(getOverallStatus() === 'success'),
                    fontSize: '24px',
                    fontWeight: 'bold'
                  }}
                />
              </Col>
              <Col xs={24} sm={8}>
                <Statistic
                  title="Categories API"
                  value={testResults.categories?.getAll?.success ? 'Working' : 'Failed'}
                  valueStyle={{ 
                    color: getStatusColor(testResults.categories?.getAll?.success),
                    fontSize: '18px'
                  }}
                />
              </Col>
              <Col xs={24} sm={8}>
                <Statistic
                  title="Products API"
                  value={testResults.products?.getAll?.success ? 'Working' : 'Failed'}
                  valueStyle={{ 
                    color: getStatusColor(testResults.products?.getAll?.success),
                    fontSize: '18px'
                  }}
                />
              </Col>
              <Col xs={24} sm={8}>
                <Statistic
                  title="Orders API"
                  value={testResults.orders?.getAll?.success ? 'Working' : 'Failed'}
                  valueStyle={{ 
                    color: getStatusColor(testResults.orders?.getAll?.success),
                    fontSize: '18px'
                  }}
                />
              </Col>
            </Row>
          </Card>

          {/* Detailed Results */}
          <Row gutter={[24, 24]}>
            <Col xs={24} lg={8}>
              <Card title="📂 Categories API Details" size="small">
                <Space direction="vertical" style={{ width: '100%' }}>
                  <div>
                    <Text strong>GET /categories/getAll: </Text>
                    <Text style={{ color: getStatusColor(testResults.categories?.getAll?.success) }}>
                      {getStatusIcon(testResults.categories?.getAll?.success)} 
                      {testResults.categories?.getAll?.count || 0} items
                    </Text>
                  </div>
                  <div>
                    <Text strong>POST /categories: </Text>
                    <Text style={{ color: getStatusColor(testResults.categories?.create?.success) }}>
                      {getStatusIcon(testResults.categories?.create?.success)}
                    </Text>
                  </div>
                  <div>
                    <Text strong>UPDATE /categories/&#123;id&#125;: </Text>
                    <Text style={{ color: getStatusColor(testResults.categories?.update?.success) }}>
                      {getStatusIcon(testResults.categories?.update?.success)} 
                      {testResults.categories?.update?.method || 'Failed'}
                    </Text>
                  </div>
                  <div>
                    <Text strong>DELETE /categories/&#123;id&#125;: </Text>
                    <Text style={{ color: getStatusColor(testResults.categories?.delete?.success) }}>
                      {getStatusIcon(testResults.categories?.delete?.success)}
                    </Text>
                  </div>
                </Space>
              </Card>
            </Col>

            <Col xs={24} lg={8}>
              <Card title="📦 Products API Details" size="small">
                <Space direction="vertical" style={{ width: '100%' }}>
                  <div>
                    <Text strong>GET /products/getAll: </Text>
                    <Text style={{ color: getStatusColor(testResults.products?.getAll?.success) }}>
                      {getStatusIcon(testResults.products?.getAll?.success)} 
                      {testResults.products?.getAll?.count || 0} items
                    </Text>
                  </div>
                  <div>
                    <Text strong>POST /products: </Text>
                    <Text style={{ color: getStatusColor(testResults.products?.create?.success) }}>
                      {getStatusIcon(testResults.products?.create?.success)}
                    </Text>
                  </div>
                  <div>
                    <Text strong>PUT /products/&#123;id&#125;: </Text>
                    <Text style={{ color: getStatusColor(testResults.products?.update?.success) }}>
                      {getStatusIcon(testResults.products?.update?.success)} 
                      {testResults.products?.update?.method || 'Failed'}
                    </Text>
                  </div>
                  <div>
                    <Text strong>DELETE /products/&#123;id&#125;: </Text>
                    <Text style={{ color: getStatusColor(testResults.products?.delete?.success) }}>
                      {getStatusIcon(testResults.products?.delete?.success)}
                    </Text>
                  </div>
                </Space>
              </Card>
            </Col>

            <Col xs={24} lg={8}>
              <Card title="📋 Orders API Details" size="small">
                <Space direction="vertical" style={{ width: '100%' }}>
                  <div>
                    <Text strong>GET /orders/all: </Text>
                    <Text style={{ color: getStatusColor(testResults.orders?.getAll?.success) }}>
                      {getStatusIcon(testResults.orders?.getAll?.success)} 
                      {testResults.orders?.getAll?.count || 0} items
                    </Text>
                  </div>
                  <div>
                    <Text strong>POST /orders: </Text>
                    <Text style={{ color: getStatusColor(testResults.orders?.create?.success) }}>
                      {getStatusIcon(testResults.orders?.create?.success)}
                    </Text>
                  </div>
                  <div>
                    <Text strong>GET /orders/&#123;id&#125;: </Text>
                    <Text style={{ color: getStatusColor(testResults.orders?.getById?.success) }}>
                      {getStatusIcon(testResults.orders?.getById?.success)}
                    </Text>
                  </div>
                  <div>
                    <Text strong>GET /orders/account/&#123;id&#125;: </Text>
                    <Text style={{ color: getStatusColor(testResults.orders?.getByAccount?.success) }}>
                      {getStatusIcon(testResults.orders?.getByAccount?.success)}
                    </Text>
                  </div>
                  <div>
                    <Text strong>GET /orders/status/&#123;status&#125;: </Text>
                    <Text style={{ color: getStatusColor(testResults.orders?.getByStatus?.success) }}>
                      {getStatusIcon(testResults.orders?.getByStatus?.success)}
                    </Text>
                  </div>
                  <div>
                    <Text strong>GET /orders/&#123;id&#125;/payment-qr: </Text>
                    <Text style={{ color: getStatusColor(testResults.orders?.getPaymentQR?.success) }}>
                      {getStatusIcon(testResults.orders?.getPaymentQR?.success)}
                    </Text>
                  </div>
                  <div>
                    <Text strong>PATCH /orders/&#123;id&#125;/cancel: </Text>
                    <Text style={{ color: getStatusColor(testResults.orders?.cancel?.success) }}>
                      {getStatusIcon(testResults.orders?.cancel?.success)}
                    </Text>
                  </div>
                  <div>
                    <Text strong>PATCH /orders/&#123;id&#125;/status: </Text>
                    <Text style={{ color: getStatusColor(testResults.orders?.updateStatus?.success) }}>
                      {getStatusIcon(testResults.orders?.updateStatus?.success)}
                    </Text>
                  </div>
                </Space>
              </Card>
            </Col>
          </Row>

          {/* Recommendations */}
          <Card title="💡 Recommendations" style={{ marginTop: '24px' }}>
            <Space direction="vertical" style={{ width: '100%' }}>
              {!testResults.categories?.update?.success && (
                <Alert
                  message="Categories Update Issue"
                  description="Categories API doesn't support PUT/PATCH. Consider asking backend team to add update endpoint or use workaround (DELETE + CREATE)."
                  type="warning"
                  showIcon
                />
              )}
              
              {testResults.categories?.getAll?.success && testResults.products?.getAll?.success && testResults.orders?.getAll?.success && (
                <Alert
                  message="All APIs Working Well"
                  description="Categories, Products, and Orders APIs are functioning correctly. You can proceed with CRUD operations."
                  type="success"
                  showIcon
                />
              )}

              {(!testResults.categories?.getAll?.success || !testResults.products?.getAll?.success || !testResults.orders?.getAll?.success) && (
                <Alert
                  message="API Issues Detected"
                  description="Some APIs are not working properly. Check console logs for detailed error messages and contact backend team if needed."
                  type="error"
                  showIcon
                />
              )}
            </Space>
          </Card>

          <Divider />
          <Text type="secondary" style={{ fontSize: '12px' }}>
            Test completed at: {new Date(testResults.timestamp).toLocaleString('vi-VN')}
          </Text>
        </>
      )}
    </div>
  );
}

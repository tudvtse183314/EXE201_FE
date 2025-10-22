// src/components/admin/OrdersTest.jsx - Test component for Orders API
import React, { useState } from 'react';
import { 
  Button, 
  Card, 
  Form, 
  Input, 
  InputNumber, 
  Space, 
  message, 
  Typography, 
  Alert, 
  Table,
  Tag,
  Modal,
  Select
} from 'antd';
import { 
  createOrder, 
  getOrderById, 
  getOrdersByAccount, 
  getOrdersByStatus,
  getPaymentQR,
  cancelOrder, 
  updateOrderStatus,
  getAllOrders,
  validateOrderData,
  formatOrderForDisplay,
  getStatusColor,
  getStatusText
} from '../../services/orders';
import { getAllProducts } from '../../services/products';
import { testOrdersAPI } from '../../utils/apiDebug';

const { Title, Text } = Typography;
const { Option } = Select;

export default function OrdersTest() {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [testResults, setTestResults] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orderDetailModal, setOrderDetailModal] = useState(false);

  const loadData = async () => {
    try {
      setLoading(true);
      const [ordersData, productsData] = await Promise.all([
        getAllOrders(),
        getAllProducts()
      ]);
      setOrders(Array.isArray(ordersData) ? ordersData : []);
      setProducts(productsData);
      message.success(`Loaded ${ordersData?.length || 0} orders and ${productsData?.length || 0} products`);
    } catch (error) {
      message.error('Failed to load data: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (values) => {
    try {
      setLoading(true);
      
      // Validate order data
      const validation = validateOrderData(values);
      if (!validation.isValid) {
        message.error('Validation failed: ' + validation.errors.join(', '));
        return;
      }
      
      const result = await createOrder(values);
      message.success('Order created successfully!');
      form.resetFields();
      loadData(); // Reload list
    } catch (error) {
      message.error('Failed to create order: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelOrder = async (orderId) => {
    try {
      setLoading(true);
      const result = await cancelOrder(orderId);
      message.success('Order cancelled successfully!');
      loadData(); // Reload list
    } catch (error) {
      message.error('Failed to cancel order: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      setLoading(true);
      const result = await updateOrderStatus(orderId, newStatus);
      message.success(`Order status updated to ${getStatusText(newStatus)}!`);
      loadData(); // Reload list
    } catch (error) {
      message.error('Failed to update order status: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const runAPITest = async () => {
    try {
      setLoading(true);
      const results = await testOrdersAPI();
      setTestResults(results);
      message.success('Orders API test completed! Check console for details.');
    } catch (error) {
      message.error('Orders API test failed: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const showOrderDetail = async (orderId) => {
    try {
      setLoading(true);
      const order = await getOrderById(orderId);
      setSelectedOrder(formatOrderForDisplay(order));
      setOrderDetailModal(true);
    } catch (error) {
      message.error('Failed to load order details: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const testPaymentQR = async (orderId) => {
    try {
      setLoading(true);
      const qrData = await getPaymentQR(orderId);
      message.success('Payment QR loaded successfully!');
      console.log('Payment QR data:', qrData);
    } catch (error) {
      message.error('Failed to load payment QR: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const testOrdersByStatus = async (status) => {
    try {
      setLoading(true);
      const orders = await getOrdersByStatus(status);
      message.success(`Found ${orders?.length || 0} orders with status ${status}`);
      console.log(`Orders with status ${status}:`, orders);
    } catch (error) {
      message.error('Failed to load orders by status: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      title: 'Order ID',
      dataIndex: 'orderId',
      key: 'orderId',
      width: 100,
    },
    {
      title: 'Account ID',
      dataIndex: 'accountId',
      key: 'accountId',
      width: 100,
    },
    {
      title: 'Total Amount',
      dataIndex: 'totalAmount',
      key: 'totalAmount',
      width: 150,
      render: (amount) => (
        <Text strong style={{ color: 'var(--pv-primary, #eda274)' }}>
          {amount?.toLocaleString('vi-VN')} VNĐ
        </Text>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 120,
      render: (status) => (
        <Tag color={getStatusColor(status)}>
          {getStatusText(status)}
        </Tag>
      ),
    },
    {
      title: 'Created At',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 150,
      render: (date) => new Date(date).toLocaleString('vi-VN'),
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 200,
      render: (_, record) => (
        <Space size="small" wrap>
          <Button 
            size="small" 
            onClick={() => showOrderDetail(record.orderId)}
          >
            View
          </Button>
          <Button 
            size="small" 
            onClick={() => testPaymentQR(record.orderId)}
          >
            QR
          </Button>
          {record.status === 'PENDING' && (
            <Button 
              size="small" 
              danger 
              onClick={() => handleCancelOrder(record.orderId)}
            >
              Cancel
            </Button>
          )}
          <Select
            size="small"
            style={{ width: 100 }}
            placeholder="Status"
            value={record.status}
            onChange={(value) => handleUpdateStatus(record.orderId, value)}
          >
            <Option value="PENDING">PENDING</Option>
            <Option value="PAID">PAID</Option>
            <Option value="PROCESSING">PROCESSING</Option>
            <Option value="COMPLETED">COMPLETED</Option>
            <Option value="CANCELLED">CANCELLED</Option>
          </Select>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: '24px' }}>
      <Title level={2}>🧪 Orders API Test</Title>
      
      <Card title="API Debug Tools" style={{ marginBottom: '24px' }}>
        <Space direction="vertical" style={{ width: '100%' }}>
          <Space wrap>
            <Button type="primary" onClick={loadData} loading={loading}>
              Load Orders & Products
            </Button>
            <Button onClick={runAPITest} loading={loading}>
              Test Orders API
            </Button>
            <Button onClick={() => testOrdersByStatus('PENDING')} loading={loading}>
              Test PENDING Orders
            </Button>
            <Button onClick={() => testOrdersByStatus('PAID')} loading={loading}>
              Test PAID Orders
            </Button>
          </Space>
          
          {testResults && (
            <Alert
              message="Orders API Test Results"
              description={
                <div>
                  <Text strong>Orders API:</Text>
                  <ul>
                    <li>GET All: {testResults.getAll?.success ? '✅' : '❌'} {testResults.getAll?.count || 0} items</li>
                    <li>POST Create: {testResults.create?.success ? '✅' : '❌'}</li>
                    <li>GET By ID: {testResults.getById?.success ? '✅' : '❌'}</li>
                    <li>GET By Account: {testResults.getByAccount?.success ? '✅' : '❌'}</li>
                    <li>GET By Status: {testResults.getByStatus?.success ? '✅' : '❌'}</li>
                    <li>GET Payment QR: {testResults.getPaymentQR?.success ? '✅' : '❌'}</li>
                    <li>PATCH Cancel: {testResults.cancel?.success ? '✅' : '❌'}</li>
                    <li>PATCH Status: {testResults.updateStatus?.success ? '✅' : '❌'}</li>
                  </ul>
                </div>
              }
              type={testResults.getAll?.success ? 'success' : 'error'}
              showIcon
            />
          )}
        </Space>
      </Card>
      
      <Card title="Orders List" style={{ marginBottom: '24px' }}>
        <Table
          columns={columns}
          dataSource={orders}
          rowKey="orderId"
          loading={loading}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => 
              `${range[0]}-${range[1]} của ${total} đơn hàng`,
          }}
          scroll={{ x: 'max-content' }}
        />
      </Card>

      <Card title="Create New Order">
        <Form
          form={form}
          layout="vertical"
          onFinish={handleCreate}
          initialValues={{
            accountId: 1,
            shippingAddress: '',
            phoneContact: '',
            note: '',
            items: [{ productId: undefined, quantity: 1 }]
          }}
        >
          <Form.Item
            name="accountId"
            label="Account ID"
            rules={[{ required: true, message: 'Please enter account ID!' }]}
          >
            <InputNumber 
              placeholder="1"
              style={{ width: '100%' }}
              min={1}
            />
          </Form.Item>
          
          <Form.Item
            name="shippingAddress"
            label="Shipping Address"
            rules={[{ required: true, message: 'Please enter shipping address!' }]}
          >
            <Input.TextArea 
              placeholder="Enter shipping address..." 
              rows={3}
            />
          </Form.Item>

          <Form.Item
            name="phoneContact"
            label="Phone Contact"
            rules={[
              { required: true, message: 'Please enter phone number!' },
              { pattern: /^(\+84|84|0)[1-9][0-9]{8,9}$/, message: 'Invalid Vietnamese phone number!' }
            ]}
          >
            <Input placeholder="0123456789" />
          </Form.Item>

          <Form.Item
            name="note"
            label="Note"
          >
            <Input.TextArea 
              placeholder="Enter order note..." 
              rows={2}
            />
          </Form.Item>

          <Form.Item
            name="items"
            label="Order Items"
            rules={[{ required: true, message: 'Please add at least one item!' }]}
          >
            <Form.List name="items">
              {(fields, { add, remove }) => (
                <>
                  {fields.map(({ key, name, ...restField }) => (
                    <Space key={key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                      <Form.Item
                        {...restField}
                        name={[name, 'productId']}
                        rules={[{ required: true, message: 'Missing product ID' }]}
                      >
                        <Select placeholder="Select product" style={{ width: 200 }}>
                          {products.map(product => (
                            <Option key={product.id} value={product.id}>
                              {product.name} - {product.price?.toLocaleString('vi-VN')} VNĐ
                            </Option>
                          ))}
                        </Select>
                      </Form.Item>
                      <Form.Item
                        {...restField}
                        name={[name, 'quantity']}
                        rules={[{ required: true, message: 'Missing quantity' }]}
                      >
                        <InputNumber placeholder="Quantity" min={1} />
                      </Form.Item>
                      <Button onClick={() => remove(name)}>Remove</Button>
                    </Space>
                  ))}
                  <Form.Item>
                    <Button type="dashed" onClick={() => add()} block>
                      Add Item
                    </Button>
                  </Form.Item>
                </>
              )}
            </Form.List>
          </Form.Item>
          
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading}>
              Create Order
            </Button>
          </Form.Item>
        </Form>
      </Card>

      {/* Order Detail Modal */}
      <Modal
        title="Order Details"
        open={orderDetailModal}
        onCancel={() => setOrderDetailModal(false)}
        footer={null}
        width={800}
      >
        {selectedOrder && (
          <div>
            <Space direction="vertical" style={{ width: '100%' }}>
              <div>
                <Text strong>Order ID: </Text>
                <Text>{selectedOrder.orderId}</Text>
              </div>
              <div>
                <Text strong>Status: </Text>
                <Tag color={selectedOrder.statusColor}>
                  {selectedOrder.statusText}
                </Tag>
              </div>
              <div>
                <Text strong>Total Amount: </Text>
                <Text style={{ color: 'var(--pv-primary, #eda274)' }}>
                  {selectedOrder.formattedTotalAmount}
                </Text>
              </div>
              <div>
                <Text strong>Shipping Address: </Text>
                <Text>{selectedOrder.shippingAddress}</Text>
              </div>
              <div>
                <Text strong>Phone Contact: </Text>
                <Text>{selectedOrder.phoneContact}</Text>
              </div>
              {selectedOrder.note && (
                <div>
                  <Text strong>Note: </Text>
                  <Text>{selectedOrder.note}</Text>
                </div>
              )}
              <div>
                <Text strong>Items: </Text>
                <ul>
                  {selectedOrder.items?.map((item, index) => (
                    <li key={index}>
                      {item.productName} x {item.quantity} = {item.price?.toLocaleString('vi-VN')} VNĐ
                    </li>
                  ))}
                </ul>
              </div>
              {selectedOrder.paymentInfo && (
                <div>
                  <Text strong>Payment Info: </Text>
                  <div style={{ marginLeft: '16px' }}>
                    <div>QR Code: {selectedOrder.paymentInfo.qrCodeUrl}</div>
                    <div>Bank: {selectedOrder.paymentInfo.bankId}</div>
                    <div>Account: {selectedOrder.paymentInfo.accountNo}</div>
                    <div>Amount: {selectedOrder.paymentInfo.amount?.toLocaleString('vi-VN')} VNĐ</div>
                  </div>
                </div>
              )}
              <div>
                <Text strong>Created: </Text>
                <Text>{selectedOrder.formattedCreatedAt}</Text>
              </div>
              <div>
                <Text strong>Updated: </Text>
                <Text>{selectedOrder.formattedUpdatedAt}</Text>
              </div>
            </Space>
          </div>
        )}
      </Modal>
    </div>
  );
}

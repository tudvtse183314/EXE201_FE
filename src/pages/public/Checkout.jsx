// src/pages/public/Checkout.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Card, 
  Row, 
  Col, 
  Button, 
  Form, 
  Input, 
  Typography, 
  Divider,
  Space,
  Alert,
  QRCode
} from 'antd';
import { 
  ArrowLeftOutlined,
  CheckCircleOutlined
} from '@ant-design/icons';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';

const { Title, Text } = Typography;
const { TextArea } = Input;

export default function Checkout() {
  const navigate = useNavigate();
  const { cartItems, getTotalPrice, clearCart } = useCart();
  const { user } = useAuth();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [qrCode, setQrCode] = useState(null);

  const handleSubmit = async (values) => {
    try {
      setLoading(true);
      console.log('💳 Checkout: Submitting order (DEMO MODE)', { values, cartItems });
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock QR code data for demo
      const mockQrData = {
        orderId: `ORD-${Date.now()}`,
        totalAmount: getTotalPrice(),
        qrCodeUrl: `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=PAYMENT-${Date.now()}`,
        bankInfo: {
          bankId: 'VCB',
          accountNo: '1234567890',
          accountName: 'PETVIBE STORE',
          amount: getTotalPrice(),
          description: `Thanh toan don hang ORD-${Date.now()}`
        },
        status: 'PENDING',
        createdAt: new Date().toISOString()
      };
      
      setQrCode(mockQrData);
      setOrderSuccess(true);
      
      // Save order to localStorage
      const savedOrders = localStorage.getItem('orders');
      let orders = [];
      if (savedOrders) {
        try {
          orders = JSON.parse(savedOrders);
        } catch (error) {
          console.error('Error parsing orders from localStorage:', error);
          orders = [];
        }
      }
      
      const newOrder = {
        id: Date.now(),
        orderId: mockQrData.orderId,
        status: 'PENDING',
        totalAmount: mockQrData.totalAmount,
        items: cartItems.map(item => ({
          productId: item.productId,
          name: item.product?.name || 'Sản phẩm',
          quantity: item.quantity,
          price: item.product?.price || 0,
          total: item.total
        })),
        shippingInfo: values,
        paymentInfo: mockQrData.bankInfo,
        createdAt: mockQrData.createdAt,
        qrCodeUrl: mockQrData.qrCodeUrl
      };
      
      orders.unshift(newOrder); // Add to beginning
      localStorage.setItem('orders', JSON.stringify(orders));
      
      // Clear cart after successful order
      await clearCart();
      
      console.log('💳 Checkout: Order created successfully (DEMO)', newOrder);
      
    } catch (error) {
      console.error('💳 Checkout: Error creating order', error);
    } finally {
      setLoading(false);
    }
  };

  if (cartItems.length === 0 && !orderSuccess) {
    return (
      <div style={{ padding: '20px' }}>
        <Alert
          message="Giỏ hàng trống"
          description="Bạn cần có sản phẩm trong giỏ hàng để thanh toán."
          type="warning"
          showIcon
          style={{ marginBottom: 20 }}
        />
        <Button onClick={() => navigate('/shop')}>
          Tiếp tục mua sắm
        </Button>
      </div>
    );
  }

  if (orderSuccess) {
    return (
      <div style={{ padding: '20px' }}>
        <Card>
          <div style={{ textAlign: 'center', padding: '40px 0' }}>
            <CheckCircleOutlined style={{ fontSize: 64, color: '#52c41a', marginBottom: 16 }} />
            <Title level={2} style={{ color: '#52c41a' }}>
              Đặt hàng thành công!
            </Title>
            <Text style={{ fontSize: 16, color: '#666' }}>
              Cảm ơn bạn đã đặt hàng. Vui lòng quét mã QR để thanh toán.
            </Text>
            
            {qrCode && (
              <div style={{ marginTop: 32 }}>
                <Title level={4}>Mã QR thanh toán</Title>
                <div style={{ 
                  background: '#f9f9f9', 
                  padding: '20px', 
                  borderRadius: '12px',
                  margin: '16px 0'
                }}>
                  <QRCode
                    value={qrCode.qrCodeUrl}
                    size={200}
                    style={{ margin: '0 auto', display: 'block' }}
                  />
                  <div style={{ marginTop: '16px', textAlign: 'center' }}>
                    <Text strong style={{ display: 'block', marginBottom: '8px' }}>
                      Mã đơn hàng: {qrCode.orderId}
                    </Text>
                    <Text strong style={{ display: 'block', marginBottom: '8px', color: '#eda274' }}>
                      Số tiền: {qrCode.totalAmount.toLocaleString()}đ
                    </Text>
                    <Text type="secondary" style={{ fontSize: '12px' }}>
                      Quét mã QR bằng ứng dụng ngân hàng để thanh toán
                    </Text>
                  </div>
                </div>
                
                {/* Bank Info */}
                <div style={{ 
                  background: '#fff7e6', 
                  padding: '16px', 
                  borderRadius: '8px',
                  marginTop: '16px',
                  border: '1px solid #ffd591'
                }}>
                  <Title level={5} style={{ margin: '0 0 12px 0' }}>Thông tin chuyển khoản</Title>
                  <div style={{ fontSize: '14px' }}>
                    <div><Text strong>Ngân hàng:</Text> {qrCode.bankInfo.bankId}</div>
                    <div><Text strong>Số tài khoản:</Text> {qrCode.bankInfo.accountNo}</div>
                    <div><Text strong>Tên tài khoản:</Text> {qrCode.bankInfo.accountName}</div>
                    <div><Text strong>Số tiền:</Text> {qrCode.bankInfo.amount.toLocaleString()}đ</div>
                    <div><Text strong>Nội dung:</Text> {qrCode.bankInfo.description}</div>
                  </div>
                </div>
              </div>
            )}
            
            <div style={{ marginTop: 32 }}>
              <Space>
                <Button type="primary" onClick={() => navigate('/orders')}>
                  Xem đơn hàng
                </Button>
                <Button onClick={() => navigate('/shop')}>
                  Tiếp tục mua sắm
                </Button>
              </Space>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px' }}>
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <Button 
          icon={<ArrowLeftOutlined />} 
          onClick={() => navigate('/cart')}
          style={{ marginBottom: 16 }}
        >
          Quay lại giỏ hàng
        </Button>
        <Title level={2} style={{ margin: 0 }}>
          💳 Thanh toán
        </Title>
      </div>

      <Row gutter={[24, 24]}>
        {/* Order Form */}
        <Col xs={24} lg={16}>
          <Card title="Thông tin giao hàng">
            <Form
              form={form}
              layout="vertical"
              onFinish={handleSubmit}
              initialValues={{
                name: user?.name || '',
                phone: user?.phone || '',
                email: user?.email || ''
              }}
            >
              <Row gutter={16}>
                <Col xs={24} sm={12}>
                  <Form.Item
                    label="Họ và tên"
                    name="name"
                    rules={[{ required: true, message: 'Vui lòng nhập họ tên' }]}
                  >
                    <Input placeholder="Nhập họ và tên" />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12}>
                  <Form.Item
                    label="Số điện thoại"
                    name="phone"
                    rules={[
                      { required: true, message: 'Vui lòng nhập số điện thoại' },
                      { pattern: /^[0-9]{10,11}$/, message: 'Số điện thoại không hợp lệ' }
                    ]}
                  >
                    <Input placeholder="Nhập số điện thoại" />
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item
                label="Email"
                name="email"
                rules={[
                  { type: 'email', message: 'Email không hợp lệ' }
                ]}
              >
                <Input placeholder="Nhập email (tùy chọn)" />
              </Form.Item>

              <Form.Item
                label="Địa chỉ giao hàng"
                name="address"
                rules={[{ required: true, message: 'Vui lòng nhập địa chỉ' }]}
              >
                <TextArea 
                  placeholder="Nhập địa chỉ chi tiết" 
                  rows={3}
                />
              </Form.Item>

              <Form.Item
                label="Ghi chú"
                name="note"
              >
                <TextArea 
                  placeholder="Ghi chú cho đơn hàng (tùy chọn)" 
                  rows={2}
                />
              </Form.Item>
            </Form>
          </Card>
        </Col>

        {/* Order Summary */}
        <Col xs={24} lg={8}>
          <Card title="Tóm tắt đơn hàng">
            <Space direction="vertical" size="middle" style={{ width: '100%' }}>
              {cartItems.map((item) => (
                <div key={item.id}>
                  <Row justify="space-between" align="middle">
                    <Col>
                      <Text>{item.product?.name || 'Sản phẩm'}</Text>
                      <br />
                      <Text type="secondary">x{item.quantity}</Text>
                    </Col>
                    <Col>
                      <Text strong>
                        {item.total ? item.total.toLocaleString() : ((item.product?.price || 0) * item.quantity).toLocaleString()}đ
                      </Text>
                    </Col>
                  </Row>
                </div>
              ))}
              
              <Divider />
              
              <Row justify="space-between">
                <Text>Tạm tính:</Text>
                <Text>{getTotalPrice().toLocaleString()}đ</Text>
              </Row>
              <Row justify="space-between">
                <Text>Phí vận chuyển:</Text>
                <Text>Miễn phí</Text>
              </Row>
              <Divider />
              <Row justify="space-between">
                <Text strong>Tổng cộng:</Text>
                <Text strong style={{ fontSize: 18, color: '#1890ff' }}>
                  {getTotalPrice().toLocaleString()}đ
                </Text>
              </Row>
              
              <Button
                type="primary"
                size="large"
                block
                loading={loading}
                onClick={() => form.submit()}
              >
                Đặt hàng
              </Button>
            </Space>
          </Card>
        </Col>
      </Row>
    </div>
  );
}

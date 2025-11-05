// src/pages/public/Checkout.jsx
import React, { useMemo, useState } from 'react';
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
  QRCode,
  Tag,
  Spin
} from 'antd';
import {
  ArrowLeftOutlined,
  CheckCircleOutlined,
  ReloadOutlined
} from '@ant-design/icons';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import {
  createOrder,
  confirmPayment as confirmPaymentApi,
  getPaymentQR,
  getStatusColor,
  getStatusText,
  getPaymentStatusColor,
  getPaymentStatusText
} from '../../services/orders';

const { Title, Text } = Typography;
const { TextArea } = Input;

const formatCurrency = (value) => {
  if (typeof value !== 'number') return '--';
  return `${value.toLocaleString('vi-VN')}đ`;
};

export default function Checkout() {
  const navigate = useNavigate();
  const { cartItems, getTotalPrice, clearCart } = useCart();
  const { user } = useAuth();
  const { showSuccess, showError, showWarning } = useToast();
  const [form] = Form.useForm();

  const [submitting, setSubmitting] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [refreshingQR, setRefreshingQR] = useState(false);
  const [order, setOrder] = useState(null);

  const totalPrice = useMemo(() => getTotalPrice(), [cartItems, getTotalPrice]);

  const buildOrderPayload = (values) => {
    const items = cartItems
      .map((item) => {
        const productId = item.productId || item.product?.id || item.id;
        if (!productId) return null;
        return {
          productId,
          quantity: item.quantity,
          price: item.price || item.product?.price || 0
        };
      })
      .filter(Boolean);

    return {
      accountId: user?.id,
      shippingAddress: values.address?.trim(),
      phoneContact: values.phone?.trim(),
      note: values.note?.trim(),
      items
    };
  };

  const handleSubmit = async (values) => {
    if (!user?.id) {
      showWarning('Vui lòng đăng nhập trước khi đặt hàng.');
      navigate('/login');
      return;
    }

    if (!cartItems.length) {
      showWarning('Giỏ hàng của bạn đang trống.');
      return;
    }

    const payload = buildOrderPayload(values);
    if (!payload.items.length) {
      showError('Không thể xác định sản phẩm trong giỏ hàng.');
      return;
    }

    try {
      setSubmitting(true);
      console.log('💳 Checkout: Creating order', payload);
      const response = await createOrder(payload);
      const createdOrder = response?.order || response;

      if (!createdOrder?.orderId) {
        throw new Error('Dữ liệu đơn hàng trả về không hợp lệ.');
      }

      setOrder(createdOrder);
      showSuccess('Đặt hàng thành công. Vui lòng hoàn tất thanh toán.');

      try {
        await clearCart();
      } catch (clearError) {
        console.warn('💳 Checkout: Không thể làm trống giỏ hàng sau khi tạo đơn', clearError);
      }
    } catch (error) {
      console.error('💳 Checkout: Error creating order', error);
      const message = error?.response?.data?.message || error?.message || 'Không thể tạo đơn hàng.';
      showError(message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleConfirmPayment = async () => {
    if (!order?.orderId) return;

    try {
      setConfirming(true);
      const response = await confirmPaymentApi(order.orderId);
      setOrder((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          ...response,
          status: response?.status || prev.status,
          paymentInfo: {
            ...(prev.paymentInfo || {}),
            ...(response?.paymentInfo || {})
          }
        };
      });
      showSuccess('Thanh toán thành công (DEMO).');
    } catch (error) {
      console.error('💳 Checkout: Error confirming payment', error);
      const message = error?.response?.data?.message || error?.message || 'Không thể xác nhận thanh toán.';
      showError(message);
    } finally {
      setConfirming(false);
    }
  };

  const handleRefreshQR = async () => {
    if (!order?.orderId) return;
    try {
      setRefreshingQR(true);
      const response = await getPaymentQR(order.orderId);
      const qrPayload = response?.paymentInfo || response;
      if (!qrPayload?.qrCodeUrl) {
        throw new Error('Không lấy được mã QR mới.');
      }
      setOrder((prev) => ({
        ...(prev || {}),
        paymentInfo: {
          ...(prev?.paymentInfo || {}),
          ...qrPayload
        }
      }));
      showSuccess('Đã làm mới mã QR thành công.');
    } catch (error) {
      console.error('💳 Checkout: Error refreshing QR', error);
      const message = error?.response?.data?.message || error?.message || 'Không thể lấy lại mã QR.';
      showError(message);
    } finally {
      setRefreshingQR(false);
    }
  };

  const renderOrderSuccess = () => {
    const paymentInfo = order?.paymentInfo || {};
    const qrUrl = paymentInfo.qrCodeUrl || order?.qrCodeUrl || '';

    return (
      <div style={{ padding: '20px' }}>
        <Card>
          <div style={{ textAlign: 'center', padding: '40px 0' }}>
            <CheckCircleOutlined style={{ fontSize: 64, color: '#52c41a', marginBottom: 16 }} />
            <Title level={2} style={{ color: '#52c41a' }}>
              Đặt hàng thành công!
            </Title>
            <Text style={{ fontSize: 16, color: '#666' }}>
              Vui lòng quét mã QR bên dưới và chuyển khoản đúng số tiền, nội dung.
            </Text>

            <div style={{ marginTop: 24 }}>
              <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                <div>
                  <Text strong>Mã đơn hàng:</Text> <Text code>{order.orderId}</Text>
                </div>
                <div>
                  <Text strong>Trạng thái đơn:</Text>{' '}
                  <Tag color={getStatusColor(order.status)}>{getStatusText(order.status)}</Tag>
                </div>
                <div>
                  <Text strong>Trạng thái thanh toán:</Text>{' '}
                  <Tag color={getPaymentStatusColor(paymentInfo.status)}>
                    {getPaymentStatusText(paymentInfo.status)}
                  </Tag>
                </div>
              </Space>
            </div>

            <div style={{ marginTop: 32 }}>
              <Title level={4}>Mã QR thanh toán</Title>
              <div
                style={{
                  background: '#f9f9f9',
                  padding: '20px',
                  borderRadius: '12px',
                  margin: '16px auto',
                  maxWidth: 320
                }}
              >
                {qrUrl ? (
                  <QRCode
                    value={qrUrl}
                    size={220}
                    style={{ margin: '0 auto', display: 'block' }}
                  />
                ) : (
                  <div style={{ padding: '40px 0' }}>
                    <Spin />
                  </div>
                )}
                <div style={{ marginTop: '16px', textAlign: 'center' }}>
                  <Text strong style={{ display: 'block', marginBottom: '8px', color: '#eda274' }}>
                    Số tiền: {formatCurrency(paymentInfo.amount ?? order.totalAmount)}
                  </Text>
                  <Text type="secondary" style={{ fontSize: '12px' }}>
                    Quét bằng ứng dụng ngân hàng để thanh toán tự động chính xác.
                  </Text>
                </div>
              </div>

              <div
                style={{
                  background: '#fff7e6',
                  padding: '16px',
                  borderRadius: '8px',
                  marginTop: '16px',
                  border: '1px solid #ffd591',
                  textAlign: 'left'
                }}
              >
                <Title level={5} style={{ margin: '0 0 12px 0' }}>Thông tin chuyển khoản</Title>
                <div style={{ fontSize: '14px' }}>
                  <div><Text strong>Ngân hàng:</Text> {paymentInfo.bankId || '---'}</div>
                  <div><Text strong>Số tài khoản:</Text> {paymentInfo.accountNo || '---'}</div>
                  <div><Text strong>Tên tài khoản:</Text> {paymentInfo.accountName || '---'}</div>
                  <div><Text strong>Số tiền:</Text> {formatCurrency(paymentInfo.amount ?? order.totalAmount)}</div>
                  <div><Text strong>Nội dung:</Text> {paymentInfo.description || `Thanh toan don hang ${order.orderId}`}</div>
                  {paymentInfo.message && (
                    <div style={{ marginTop: 8 }}>
                      <Text type="secondary">{paymentInfo.message}</Text>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div style={{ marginTop: 32 }}>
              <Space wrap size="middle" align="center" style={{ justifyContent: 'center' }}>
                {paymentInfo.status !== 'PAID' && (
                  <Button
                    type="primary"
                    loading={confirming}
                    onClick={handleConfirmPayment}
                  >
                    Tôi đã chuyển khoản
                  </Button>
                )}
                <Button
                  icon={<ReloadOutlined />}
                  loading={refreshingQR}
                  onClick={handleRefreshQR}
                >
                  Lấy lại mã QR
                </Button>
                <Button type="default" onClick={() => navigate(`/customer/orders/${order.orderId}`)}>
                  Xem chi tiết đơn hàng
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
  };

  if (order) {
    return renderOrderSuccess();
  }

  if (cartItems.length === 0) {
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

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ marginBottom: 24 }}>
        <Button
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate('/customer/cart')}
          style={{ marginBottom: 16 }}
        >
          Quay lại giỏ hàng
        </Button>
        <Title level={2} style={{ margin: 0 }}>
          💳 Thanh toán
        </Title>
      </div>

      <Row gutter={[24, 24]} align="stretch">
        <Col xs={24} lg={16}>
          <Card title="Thông tin giao hàng">
            <Form
              form={form}
              layout="vertical"
              onFinish={handleSubmit}
              initialValues={{
                name: user?.name || '',
                phone: user?.phone || '',
                email: user?.email || '',
                address: user?.address || ''
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
                      {
                        pattern: /^(\+84|84|0)[1-9][0-9]{8,9}$/,
                        message: 'Số điện thoại không hợp lệ'
                      }
                    ]}
                  >
                    <Input placeholder="Nhập số điện thoại" />
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item
                label="Email"
                name="email"
                rules={[{ type: 'email', message: 'Email không hợp lệ' }]}
              >
                <Input placeholder="Nhập email (tùy chọn)" />
              </Form.Item>

              <Form.Item
                label="Địa chỉ giao hàng"
                name="address"
                rules={[{ required: true, message: 'Vui lòng nhập địa chỉ' }]}
              >
                <TextArea rows={3} placeholder="Nhập địa chỉ chi tiết" />
              </Form.Item>

              <Form.Item label="Ghi chú" name="note">
                <TextArea rows={2} placeholder="Ghi chú cho đơn hàng (tùy chọn)" />
              </Form.Item>

              <Form.Item>
                <Button
                  type="primary"
                  size="large"
                  onClick={() => form.submit()}
                  loading={submitting}
                >
                  Đặt hàng
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </Col>

        <Col xs={24} lg={8}>
          <Card title="Tóm tắt đơn hàng">
            <Space direction="vertical" size="middle" style={{ width: '100%' }}>
              {cartItems.map((item) => {
                const productName = item.product?.name || item.name || 'Sản phẩm';
                const quantity = item.quantity || 0;
                const lineTotal = item.total || (item.price || item.product?.price || 0) * quantity;
                return (
                  <div key={item.id || item.itemId || `${productName}-${quantity}`}>
                    <Row justify="space-between" align="middle">
                      <Col>
                        <Text>{productName}</Text>
                        <br />
                        <Text type="secondary">x{quantity}</Text>
                      </Col>
                      <Col>
                        <Text strong>{formatCurrency(lineTotal)}</Text>
                      </Col>
                    </Row>
                  </div>
                );
              })}

              <Divider />

              <Row justify="space-between">
                <Text>Tạm tính:</Text>
                <Text>{formatCurrency(totalPrice)}</Text>
              </Row>
              <Row justify="space-between">
                <Text>Phí vận chuyển:</Text>
                <Text>Miễn phí</Text>
              </Row>
              <Divider />
              <Row justify="space-between">
                <Text strong>Tổng cộng:</Text>
                <Text strong style={{ fontSize: 18, color: '#1890ff' }}>
                  {formatCurrency(totalPrice)}
                </Text>
              </Row>
            </Space>
          </Card>
        </Col>
      </Row>
    </div>
  );
}

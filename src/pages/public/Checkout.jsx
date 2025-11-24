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
  Spin,
  List,
  Image
} from 'antd';
import {
  ArrowLeftOutlined,
  CheckCircleOutlined,
  ReloadOutlined,
  ShoppingCartOutlined
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
import { getFallbackImageByIndex } from '../../utils/imageUtils';
import { THEME } from '../../constants/theme';
import AddressSelector from '../../components/AddressSelector';

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
  const [addressData, setAddressData] = useState({});

  const totalPrice = useMemo(() => getTotalPrice(), [cartItems, getTotalPrice]);

  const buildOrderPayload = (values) => {
    // Backend chỉ nhận productId và quantity, không nhận price
    // Backend sẽ tự tính price từ product.getPrice() * quantity
    const items = cartItems
      .map((item) => {
        const productId = item.productId || item.product?.id || item.id;
        if (!productId) return null;
        return {
          productId: Number(productId),
          quantity: Number(item.quantity || 1)
        };
      })
      .filter(Boolean);

    // Format địa chỉ theo format: "Tỉnh/ Huyện/ Xã/ địa chỉ chi tiết/ Ghi chú"
    const addressParts = [];
    
    // Thêm Tỉnh
    if (addressData.provinceName) {
      addressParts.push(addressData.provinceName);
    }
    
    // Thêm Huyện
    if (addressData.districtName) {
      addressParts.push(addressData.districtName);
    }
    
    // Thêm Xã
    if (addressData.wardName) {
      addressParts.push(addressData.wardName);
    }
    
    // Thêm địa chỉ chi tiết (số nhà, tên đường)
    if (values.addressDetail?.trim()) {
      addressParts.push(values.addressDetail.trim());
    }
    
    // Thêm ghi chú (nếu có)
    if (values.note?.trim()) {
      addressParts.push(values.note.trim());
    }
    
    // Kết hợp tất cả bằng dấu "/"
    const fullShippingAddress = addressParts.length > 0 
      ? addressParts.join('/ ') 
      : (values.address?.trim() || ''); // Fallback về địa chỉ cũ nếu không có AddressSelector

    return {
      accountId: Number(user?.id),
      shippingAddress: fullShippingAddress,
      phoneContact: values.phone?.trim(),
      note: values.note?.trim() || '',
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
      // Backend returns OrderResponse directly with paymentInfo
      const createdOrder = response?.order || response;

      if (!createdOrder?.orderId) {
        throw new Error('Dữ liệu đơn hàng trả về không hợp lệ.');
      }

      // Đảm bảo paymentInfo có trong order
      if (!createdOrder.paymentInfo && response?.paymentInfo) {
        createdOrder.paymentInfo = response.paymentInfo;
      }

      console.log('💳 Checkout: Order created with paymentInfo', {
        orderId: createdOrder.orderId,
        hasPaymentInfo: !!createdOrder.paymentInfo,
        hasQRCode: !!createdOrder.paymentInfo?.qrCodeUrl
      });

      setOrder(createdOrder);
      showSuccess('Đặt hàng thành công. Vui lòng quét mã QR để thanh toán.');
      
      // Redirect đến PaymentPage với order data
      navigate(`/customer/payment/${createdOrder.orderId}`, {
        state: { order: createdOrder }
      });
      
      // KHÔNG xóa cart ngay - chỉ xóa sau khi thanh toán thành công
      // Cart sẽ được xóa trong handleConfirmPayment khi payment status = PAID
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
      const updatedOrder = {
        ...order,
        ...response,
        status: response?.status || order.status,
        paymentInfo: {
          ...(order.paymentInfo || {}),
          ...(response?.paymentInfo || {})
        }
      };
      
      setOrder(updatedOrder);
      
      // Kiểm tra nếu thanh toán thành công (PAID hoặc COMPLETED)
      const paymentStatus = updatedOrder.paymentInfo?.status?.toUpperCase();
      const orderStatus = updatedOrder.status?.toUpperCase();
      
      if (paymentStatus === 'PAID' || paymentStatus === 'COMPLETED' || orderStatus === 'PAID') {
        // Xóa cart sau khi thanh toán thành công
        try {
          await clearCart();
          console.log('💳 Checkout: Cart cleared after successful payment');
        } catch (clearError) {
          console.warn('💳 Checkout: Không thể làm trống giỏ hàng sau khi thanh toán', clearError);
        }
        showSuccess('Thanh toán thành công! Đơn hàng của bạn đã được xác nhận.');
      } else {
        showSuccess('Đã gửi yêu cầu xác nhận thanh toán. Vui lòng đợi xử lý.');
      }
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

            {/* Order Summary */}
            <Card
              type="inner"
              title="Chi tiết đơn hàng"
              style={{ 
                marginTop: 32,
                textAlign: 'left',
                maxWidth: 800,
                margin: '32px auto 0'
              }}
            >
              <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                <Row justify="space-between">
                  <Text strong>Mã đơn hàng:</Text>
                  <Text code style={{ fontSize: 16 }}>{order.orderId}</Text>
                </Row>
                <Row justify="space-between">
                  <Text strong>Trạng thái đơn:</Text>
                  <Tag color={getStatusColor(order.status)}>{getStatusText(order.status)}</Tag>
                </Row>
                <Row justify="space-between">
                  <Text strong>Trạng thái thanh toán:</Text>
                  <Tag color={getPaymentStatusColor(paymentInfo.status)}>
                    {getPaymentStatusText(paymentInfo.status)}
                  </Tag>
                </Row>
                <Divider />
                
                {/* Order Items */}
                <div>
                  <Text strong style={{ fontSize: 16, display: 'block', marginBottom: 12 }}>
                    Sản phẩm đã đặt ({order.items?.length || 0})
                  </Text>
                  <List
                    dataSource={order.items || []}
                    renderItem={(item) => {
                      const itemTotal = (item.price || 0) * (item.quantity || 0);
                      return (
                        <List.Item style={{ padding: '12px 0' }}>
                          <List.Item.Meta
                            title={
                              <Space>
                                <Text strong>{item.productName || `Sản phẩm #${item.productId}`}</Text>
                                <Tag>x{item.quantity}</Tag>
                              </Space>
                            }
                            description={
                              <Text type="secondary">
                                Đơn giá: {formatCurrency(item.price || 0)}
                              </Text>
                            }
                          />
                          <Text strong style={{ color: THEME.colors.primary }}>
                            {formatCurrency(itemTotal)}
                          </Text>
                        </List.Item>
                      );
                    }}
                  />
                </div>

                <Divider />
                
                <Row justify="space-between" style={{ 
                  padding: '12px',
                  background: THEME.colors.backgroundLight,
                  borderRadius: THEME.borderRadius.medium
                }}>
                  <Text strong style={{ fontSize: 18 }}>Tổng tiền:</Text>
                  <Text strong style={{ fontSize: 20, color: THEME.colors.primary }}>
                    {formatCurrency(order.totalAmount || totalPrice)}
                  </Text>
                </Row>
              </Space>
            </Card>

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

              {/* Địa chỉ giao hàng - Tỉnh/Huyện/Xã */}
              <AddressSelector
                value={addressData}
                onChange={(newAddress) => {
                  setAddressData(newAddress);
                  // Cập nhật form field để validation
                  form.setFieldsValue({
                    province: newAddress.province,
                    district: newAddress.district,
                    ward: newAddress.ward
                  });
                }}
                required={true}
              />

              {/* Địa chỉ chi tiết (số nhà, tên đường) */}
              <Form.Item
                label="Địa chỉ chi tiết (Số nhà, tên đường)"
                name="addressDetail"
                rules={[{ required: true, message: 'Vui lòng nhập địa chỉ chi tiết' }]}
              >
                <TextArea 
                  rows={2} 
                  placeholder="Ví dụ: Số 123, Đường ABC" 
                />
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
          <Card 
            title={
              <Space>
                <ShoppingCartOutlined />
                <span>Tổng kết đơn hàng</span>
              </Space>
            }
            style={{
              position: 'sticky',
              top: 20
            }}
          >
            <div style={{ marginBottom: 16 }}>
              <Text strong style={{ fontSize: 16 }}>Sản phẩm trong đơn ({cartItems.length})</Text>
            </div>
            
            <List
              dataSource={cartItems}
              renderItem={(item) => {
                const itemId = item.id || item.itemId;
                const productId = item.productId || item.product?.id || item.id;
                const product = item.product || {};
                const productName = product.name || item.name || 'Sản phẩm';
                const quantity = item.quantity || 0;
                const price = item.price || product.price || 0;
                const lineTotal = item.total || price * quantity;
                const imageUrl = product.imageUrl || product.image || item.imageUrl || getFallbackImageByIndex(productId);
                
                return (
                  <List.Item
                    key={itemId}
                    style={{ 
                      padding: '12px 0',
                      borderBottom: `1px solid ${THEME.colors.border}`
                    }}
                  >
                    <List.Item.Meta
                      avatar={
                        <Image
                          src={imageUrl}
                          alt={productName}
                          fallback={getFallbackImageByIndex(productId)}
                          style={{
                            width: 60,
                            height: 60,
                            objectFit: 'cover',
                            borderRadius: THEME.borderRadius.medium
                          }}
                          preview={false}
                        />
                      }
                      title={
                        <Text strong style={{ fontSize: 14 }}>
                          {productName}
                        </Text>
                      }
                      description={
                        <Space direction="vertical" size={4}>
                          <Text type="secondary" style={{ fontSize: 12 }}>
                            Số lượng: {quantity}
                          </Text>
                          <Text type="secondary" style={{ fontSize: 12 }}>
                            Đơn giá: {formatCurrency(price)}
                          </Text>
                        </Space>
                      }
                    />
                    <div style={{ textAlign: 'right' }}>
                      <Text strong style={{ fontSize: 14, color: THEME.colors.primary }}>
                        {formatCurrency(lineTotal)}
                      </Text>
                    </div>
                  </List.Item>
                );
              }}
            />

            <Divider style={{ margin: '16px 0' }} />

            <Space direction="vertical" size="small" style={{ width: '100%' }}>
              <Row justify="space-between">
                <Text>Tạm tính:</Text>
                <Text>{formatCurrency(totalPrice)}</Text>
              </Row>
              <Row justify="space-between">
                <Text>Phí vận chuyển:</Text>
                <Text type="success">Miễn phí</Text>
              </Row>
              <Divider style={{ margin: '12px 0' }} />
              <Row justify="space-between" style={{ 
                padding: '12px',
                background: THEME.colors.backgroundLight,
                borderRadius: THEME.borderRadius.medium,
                marginTop: 8
              }}>
                <Text strong style={{ fontSize: 16 }}>Tổng cộng:</Text>
                <Text strong style={{ fontSize: 20, color: THEME.colors.primary }}>
                  {formatCurrency(totalPrice)}
                </Text>
              </Row>
            </Space>

            <Alert
              message="Vui lòng kiểm tra lại thông tin đơn hàng"
              type="info"
              showIcon
              style={{ marginTop: 16 }}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
}

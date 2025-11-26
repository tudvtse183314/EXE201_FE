// src/pages/customer/PaymentPage.jsx
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import {
  Card,
  Row,
  Col,
  Typography,
  Tag,
  Button,
  Table,
  Space,
  Divider,
  Spin,
  Alert,
  Image,
  QRCode,
  App
} from 'antd';
import {
  ArrowLeftOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  ReloadOutlined,
  ShoppingOutlined
} from '@ant-design/icons';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { useCart } from '../../context/CartContext';
import {
  getOrderById,
  cancelOrder,
  getStatusColor,
  getStatusText,
  getPaymentStatusColor,
  getPaymentStatusText
} from '../../services/orders';
import { getFallbackImageByIndex } from '../../utils/imageUtils';

const { Title, Text } = Typography;

const formatCurrency = (value) => {
  if (typeof value !== 'number') return '--';
  return `${value.toLocaleString('vi-VN')}đ`;
};

export default function PaymentPage() {
  const { modal } = App.useApp();
  const { orderId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const { showSuccess, showError } = useToast();
  const { clearCart } = useCart();

  const [order, setOrder] = useState(location.state?.order || null);
  const [loading, setLoading] = useState(!order);
  const [error, setError] = useState(null);
  const [cancelling, setCancelling] = useState(false);

  // Load order từ API
  const loadOrder = useCallback(async () => {
    if (!orderId) {
      setError('Không tìm thấy mã đơn hàng.');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      console.log('💳 Payment: Loading order', { orderId });
      const response = await getOrderById(orderId);
      
      // Đảm bảo order thuộc về user hiện tại
      if (user && response.accountId && Number(response.accountId) !== Number(user.id)) {
        setError('Bạn không có quyền xem đơn hàng này.');
        setLoading(false);
        return;
      }

      setOrder(response);
      console.log('💳 Payment: Order loaded', {
        orderId: response.orderId,
        status: response.status,
        paymentStatus: response.paymentInfo?.status
      });
    } catch (err) {
      console.error('💳 Payment: Error loading order', err);
      const message = err?.response?.data?.message || err?.message || 'Không thể tải thông tin đơn hàng.';
      setError(message);
      
      if (err?.response?.status === 403) {
        showError('Bạn không có quyền xem đơn hàng này.');
      } else if (err?.response?.status === 404) {
        showError('Không tìm thấy đơn hàng.');
      }
    } finally {
      setLoading(false);
    }
  }, [orderId, user, showError]);

  // Load order khi mount hoặc orderId thay đổi
  useEffect(() => {
    // Nếu có order từ location.state, dùng luôn (không cần load lại)
    if (location.state?.order) {
      setOrder(location.state.order);
      setLoading(false);
    } else {
      // Nếu F5 hoặc vào từ lịch sử, load lại từ API
      loadOrder();
    }
  }, [orderId, loadOrder, location.state]);

  // Polling tự động để kiểm tra khi admin xác nhận thanh toán
  const pollingIntervalRef = useRef(null);

  // Tự động bắt đầu polling khi order status = PENDING
  useEffect(() => {
    if (!order?.orderId) return;
    
    const status = order.status?.toUpperCase();
    const paymentStatus = order.paymentInfo?.status?.toUpperCase();
    
    // Chỉ polling khi order đang PENDING và chưa được thanh toán
    if (status === 'PENDING' && paymentStatus !== 'COMPLETED' && paymentStatus !== 'PAID') {
      console.log('💳 Payment: Starting automatic polling for payment confirmation', { orderId: order.orderId });
      
      pollingIntervalRef.current = setInterval(async () => {
        try {
          const updatedOrder = await getOrderById(order.orderId);
          const updatedStatus = updatedOrder.status?.toUpperCase();
          
          // Kiểm tra nếu admin đã xác nhận (status = PAID)
          if (updatedStatus === 'PAID') {
            console.log('💳 Payment: Payment confirmed by admin!');
            setOrder(prev => ({
              ...updatedOrder,
              paymentInfo: {
                ...prev?.paymentInfo,
                status: 'COMPLETED'
              }
            }));
            
            // Xóa cart sau khi admin xác nhận
            try {
              await clearCart();
              console.log('💳 Payment: Cart cleared after admin confirmation');
            } catch (err) {
              console.error('💳 Payment: Error clearing cart', err);
            }
            
            showSuccess('Thanh toán đã được xác nhận! Đơn hàng đang được xử lý.');
            
            // Dừng polling
            if (pollingIntervalRef.current) {
              clearInterval(pollingIntervalRef.current);
              pollingIntervalRef.current = null;
            }
          }
        } catch (err) {
          console.error('💳 Payment: Error polling for payment confirmation', err);
        }
      }, 3000); // Poll mỗi 3 giây
    }
    
    // Cleanup khi component unmount hoặc order đã được thanh toán
    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
        pollingIntervalRef.current = null;
      }
    };
  }, [order?.orderId, order?.status, order?.paymentInfo?.status, clearCart, showSuccess]);

  // Hủy đơn hàng
  const handleCancelOrder = async () => {
    if (!order?.orderId) return;

    modal.confirm({
      title: 'Hủy đơn hàng',
      content: 'Bạn có chắc chắn muốn hủy đơn hàng này?',
      okText: 'Hủy đơn',
      cancelText: 'Không',
      okType: 'danger',
      onOk: async () => {
        try {
          setCancelling(true);
          console.log('💳 Payment: Cancelling order', { orderId: order.orderId });
          await cancelOrder(order.orderId);
          
          showSuccess('Đơn hàng đã được hủy.');
          navigate('/customer/orders');
        } catch (err) {
          console.error('💳 Payment: Error cancelling order', err);
          const message = err?.response?.data?.message || err?.message || 'Không thể hủy đơn hàng.';
          showError(message);
        } finally {
          setCancelling(false);
        }
      }
    });
  };

  // Columns cho bảng sản phẩm
  const columns = [
    {
      title: 'Sản phẩm',
      key: 'product',
      render: (_, record) => {
        const productName = record.productName || 'Unknown Product';
        const productId = record.productId;
        return (
          <Space>
            <Image
              width={60}
              height={60}
              src={getFallbackImageByIndex(productId)}
              alt={productName}
              style={{ borderRadius: 8, objectFit: 'cover' }}
              fallback={getFallbackImageByIndex(productId)}
            />
            <Text strong>{productName}</Text>
          </Space>
        );
      }
    },
    {
      title: 'Số lượng',
      dataIndex: 'quantity',
      key: 'quantity',
      align: 'center',
      width: 100
    },
    {
      title: 'Đơn giá',
      key: 'price',
      align: 'right',
      render: (_, record) => formatCurrency(record.price || 0)
    },
    {
      title: 'Thành tiền',
      key: 'total',
      align: 'right',
      render: (_, record) => {
        const total = (record.price || 0) * (record.quantity || 0);
        return <Text strong>{formatCurrency(total)}</Text>;
      }
    }
  ];

  if (loading) {
    return (
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <Spin size="large" />
        <div style={{ marginTop: 16 }}>
          <Text>Đang tải thông tin đơn hàng...</Text>
        </div>
      </div>
    );
  }

  if (error && !order) {
    return (
      <div style={{ padding: '40px' }}>
        <Alert
          message="Lỗi"
          description={error}
          type="error"
          showIcon
          action={
            <Button size="small" onClick={loadOrder}>
              Thử lại
            </Button>
          }
        />
      </div>
    );
  }

  if (!order) {
    return (
      <div style={{ padding: '40px' }}>
        <Alert
          message="Không tìm thấy đơn hàng"
          description="Vui lòng kiểm tra lại mã đơn hàng."
          type="warning"
          showIcon
        />
      </div>
    );
  }

  const paymentInfo = order.paymentInfo || {};
  const status = order.status?.toUpperCase();
  const paymentStatus = paymentInfo.status?.toUpperCase();
  // Backend: order.status = "PAID" và paymentInfo.status = "COMPLETED" khi đã thanh toán
  const isPending = status === 'PENDING' && (paymentStatus !== 'COMPLETED' && paymentStatus !== 'PAID');
  const isPaid = status === 'PAID' || paymentStatus === 'COMPLETED';

  return (
    <div style={{ padding: '20px', minHeight: '100vh', background: '#f5f5f5' }}>
      <div style={{ marginBottom: 24 }}>
        <Button
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate('/customer/orders')}
          style={{ marginBottom: 16 }}
        >
          Về danh sách đơn hàng
        </Button>
        <Title level={2} style={{ margin: 0 }}>
          💳 Thanh toán đơn hàng
        </Title>
      </div>

      <Row gutter={[24, 24]}>
        {/* Thông tin hóa đơn - Bên trái */}
        <Col xs={24} lg={14}>
          <Card title="Thông tin đơn hàng" style={{ marginBottom: 24 }}>
            <Space direction="vertical" size="middle" style={{ width: '100%' }}>
              <Row justify="space-between">
                <Text strong>Mã đơn hàng:</Text>
                <Text strong style={{ fontSize: 16, color: '#1890ff' }}>
                  ORD-{order.orderId}
                </Text>
              </Row>
              
              <Row justify="space-between">
                <Text>Trạng thái:</Text>
                <Tag color={getStatusColor(order.status)} style={{ fontSize: 14, padding: '4px 12px' }}>
                  {getStatusText(order.status)}
                </Tag>
              </Row>

              <Divider />

              <div>
                <Text strong style={{ display: 'block', marginBottom: 8 }}>
                  Thông tin giao hàng:
                </Text>
                <Text style={{ display: 'block' }}>📞 {order.phoneContact || '--'}</Text>
                <Text style={{ display: 'block', marginTop: 4 }}>
                  📍 {order.shippingAddress || '--'}
                </Text>
                {order.note && (
                  <Text type="secondary" style={{ display: 'block', marginTop: 8, fontStyle: 'italic' }}>
                    💬 Ghi chú: {order.note}
                  </Text>
                )}
              </div>

              <Divider />

              <div>
                <Text strong style={{ display: 'block', marginBottom: 12 }}>
                  Sản phẩm:
                </Text>
                <Table
                  columns={columns}
                  dataSource={order.items || []}
                  rowKey={(record, index) => record.productId || index}
                  pagination={false}
                  size="small"
                />
              </div>

              <Divider />

              <Row justify="space-between" align="middle">
                <Text strong style={{ fontSize: 18 }}>Tổng cộng:</Text>
                <Text strong style={{ fontSize: 24, color: '#1890ff' }}>
                  {formatCurrency(order.totalAmount || 0)}
                </Text>
              </Row>
            </Space>
          </Card>
        </Col>

        {/* QR Payment - Bên phải */}
        <Col xs={24} lg={10}>
          <Card
            title={
              <Space>
                <span>Thanh toán QR Code</span>
                {isPaid && <CheckCircleOutlined style={{ color: '#52c41a' }} />}
              </Space>
            }
            style={{ position: 'sticky', top: 20 }}
          >
            <Space direction="vertical" size="large" style={{ width: '100%' }}>
              {isPending && (
                <Alert
                  message="Chờ thanh toán"
                  description="Vui lòng quét mã QR và chuyển khoản theo thông tin bên dưới. Sau khi chuyển khoản, quản trị viên sẽ xác nhận thanh toán."
                  type="warning"
                  showIcon
                />
              )}

              {isPaid && (
                <Alert
                  message="Đã thanh toán thành công"
                  description="Thanh toán đã được xác nhận! Đơn hàng đang được xử lý."
                  type="success"
                  showIcon
                />
              )}

              {/* QR Code */}
              {paymentInfo.qrCodeUrl ? (
                <div style={{ textAlign: 'center' }}>
                  <Image
                    src={paymentInfo.qrCodeUrl}
                    alt="QR Code"
                    width={280}
                    height={280}
                    style={{ borderRadius: 8, border: '1px solid #d9d9d9' }}
                    preview={false}
                  />
                </div>
              ) : paymentInfo.qrData ? (
                <div style={{ textAlign: 'center' }}>
                  <QRCode
                    value={paymentInfo.qrData}
                    size={280}
                    errorLevel="M"
                  />
                </div>
              ) : (
                <div style={{ textAlign: 'center', padding: '40px' }}>
                  <Text type="secondary">Đang tạo mã QR...</Text>
                </div>
              )}

              {/* Thông tin chuyển khoản */}
              {paymentInfo.bankId && (
                <div>
                  <Text strong style={{ display: 'block', marginBottom: 8 }}>
                    Thông tin chuyển khoản:
                  </Text>
                  <Text style={{ display: 'block' }}>
                    <strong>Ngân hàng:</strong> {paymentInfo.bankId}
                  </Text>
                  {paymentInfo.accountNo && (
                    <Text style={{ display: 'block', marginTop: 4 }}>
                      <strong>Số tài khoản:</strong> {paymentInfo.accountNo}
                    </Text>
                  )}
                  {paymentInfo.accountName && (
                    <Text style={{ display: 'block', marginTop: 4 }}>
                      <strong>Chủ tài khoản:</strong> {paymentInfo.accountName}
                    </Text>
                  )}
                </div>
              )}

              <Divider />

              <Row justify="space-between" align="middle">
                <Text strong>Số tiền:</Text>
                <Text strong style={{ fontSize: 20, color: '#1890ff' }}>
                  {formatCurrency(paymentInfo.amount || order.totalAmount || 0)}
                </Text>
              </Row>

              {paymentInfo.description && (
                <div>
                  <Text strong style={{ display: 'block', marginBottom: 4 }}>
                    Nội dung chuyển khoản:
                  </Text>
                  <Text code style={{ fontSize: 14, wordBreak: 'break-all' }}>
                    {paymentInfo.description}
                  </Text>
                </div>
              )}

              <Divider />

              <Tag
                color={getPaymentStatusColor(paymentInfo.status)}
                style={{ fontSize: 14, padding: '6px 16px', width: '100%', textAlign: 'center' }}
              >
                {getPaymentStatusText(paymentInfo.status) || 'Chờ thanh toán'}
              </Tag>

              {/* Actions */}
              <Space direction="vertical" style={{ width: '100%' }} size="middle">
                {isPending && (
                  <Button
                    danger
                    size="large"
                    icon={<CloseCircleOutlined />}
                    onClick={handleCancelOrder}
                    loading={cancelling}
                    block
                  >
                    Hủy đơn
                  </Button>
                )}

                {isPaid && (
                  <Button
                    type="primary"
                    size="large"
                    icon={<ShoppingOutlined />}
                    onClick={() => navigate(`/customer/orders/${order.orderId}`)}
                    block
                  >
                    Xem chi tiết đơn hàng
                  </Button>
                )}

                <Button
                  icon={<ReloadOutlined />}
                  onClick={loadOrder}
                  block
                >
                  Làm mới
                </Button>
              </Space>
            </Space>
          </Card>
        </Col>
      </Row>
    </div>
  );
}

